import React, { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { loginUser, setLoading } from "../features/userSlice"
import { auth, db } from "@/firebase"
import { doc, updateDoc, arrayUnion, serverTimestamp, getFirestore, query, collection, where, onSnapshot, getDoc, addDoc, getDocs, arrayRemove, orderBy  } from "firebase/firestore"





const GlobalContext = React.createContext()


export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)
    const [id, setID] = useState("")

    // const [user, setuser] = useState(second)
    
    const dispatch = useDispatch();

    useEffect(() => {
      auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          dispatch(
            loginUser({
              uid: authUser.uid,
              username: authUser.displayName,
              email: authUser.email,
            })
          );
          dispatch(setLoading(false));
        } else {
          dispatch(setLoading(false));
          console.log("User is not logged in.");
        }
      });
   
    }, []);
  
    const user = useSelector((state) => state.data.user.user);
    const isLoading = useSelector((state) => state.data.user.isLoading);


 //---------------------------- Define mapping for time and category values to filtering conditions--------------------------------------
   // Define a mapping for time values to filtering conditions
   const timeMap = {
    'Current Month': (item) => {
      const date = new Date(item.date);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      return date.includes(`${currentYear}-${currentMonth}`);
    },
    'Previous Month': (item) => {
      const date = new Date(item.date);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const previousMonth = currentDate.getMonth(); // Get the current month index (0-based)
      return date.includes(`${currentYear}-${previousMonth}`);
    },
    'Current Year': (item) => {
      const date = new Date(item.date);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      return date.includes(`${currentYear}`);
    },
    'Previous Year': (item) => {
      const date = new Date(item.date);
      const currentDate = new Date();
      const previousYear = currentDate.getFullYear() - 1;
      return date.includes(`${previousYear}`);
    },
    'All': () => true, // Return all data for 'all' time
  };
  const incomeCategoryMap = {
    'Salary': (item) => item.category === 'Salary',
    'Freelancing': (item) => item.category === 'Freelancing',
    'Investments': (item) => item.category === 'Investments',
    'Cryptocurrency': (item) => item.category === 'Cryptocurrency',
    'Trading': (item) => item.category === 'Trading',
    'Bank Transfer': (item) => item.category === 'Bank Transfer',
    'Other': (item) => item.category === 'Other',
  };
  const expenseCategoryMap = {
    'Groceries': (item) => item.category === 'Groceries',
    'Education': (item) => item.category === 'Education',
    'Health': (item) => item.category === 'Health',
    'Subscriptions': (item) => item.category === 'Subscriptions',
    'Takeaways': (item) => item.category === 'Takeaways',
    'Clothing': (item) => item.category === 'Clothing',
    'Travelling': (item) => item.category === 'Travelling',
    'Other': (item) => item.category === 'Other',
  };
  const typeCategoryMap = {
    'Earnings': (item) => item.isIncome === true,
    'Expenses': (item) => item.isIncome === false,
    'All':()=>true
  };

  function filterObjectsByDate(arr, filterValue) {
    const currentDate = new Date();
  
    if (filterValue === 'All') {
      // If "All" is selected, return the entire array
      return arr;
    }
  
    const filteredData = arr.filter(item => {
      const dateObj = new Date(item.date);
  
      if (filterValue === 'Current Month') {
        return (
          dateObj.getFullYear() === currentDate.getFullYear() &&
          dateObj.getMonth() === currentDate.getMonth()
        );
      }
  
      if (filterValue === 'Previous Month') {
        const lastMonth = new Date(currentDate);
        lastMonth.setMonth(currentDate.getMonth() - 1);
        return (
          dateObj.getFullYear() === lastMonth.getFullYear() &&
          dateObj.getMonth() === lastMonth.getMonth()
        );
      }
  
      if (filterValue === 'Current Year') {
        return dateObj.getFullYear() === currentDate.getFullYear();
      }
      if (filterValue === 'Previous Year') {
        return dateObj.getFullYear() === (currentDate.getFullYear()-1);
      }
  
      // Add more filter conditions as needed
  
      return true; // Include all items if no filter condition matches
    });
  
    return filteredData;
  }
// --------------------------function to get data ranges------------------------------------------------------------------------------

function getDateRanges() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // January is 0, so add 1
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(currentDate.getMonth() - 1);
  const previousMonth = previousMonthDate.getMonth() + 1; // January is 0, so add 1
  const currentYear = currentDate.getFullYear();
  const previousYearDate = new Date();
  previousYearDate.setFullYear(currentDate.getFullYear() - 1);
  const previousYear = previousYearDate.getFullYear();

  return {
    currentMonth,
    previousMonth,
    currentYear,
    previousYear,
  };
}




//--------------------------- Function to get the user document ID by displayName------------------------------------------------
const getUserDocumentId = async (email) => {
  try {
    const q = query(collection(db, "EUsers"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming there is only one matching document, return its ID
      const document = querySnapshot.docs[0];
      return document.id;
    } else {
      // Handle the case when no matching document is found
      return null;
    }
  } catch (error) {
    // Handle any potential errors here
    console.error("Error fetching user document:", error);
    throw error;
  }
};



// --------------------------------Function to add income to the user's transactions---------------------------------------------------
const addTransaction = async (transaction) => {
  try {
    // Get the user document ID
    const docId = await getUserDocumentId(user.email);

    if (docId) {
      const docRef = doc(db, "EUsers", docId);
      // Update the "transactions" field by adding the new transaction
      await updateDoc(docRef, {
        transactions: arrayUnion(transaction),
      });

      console.log("Transaction added successfully.");
    } else {
      // Handle the case when no matching document is found
      console.log("No matching user document found.");
    }
  } catch (error) {
    // Handle any potential errors here
    console.error("Error adding transaction:", error);
    throw error;
  }

  window.location.reload();
};



//-------------------------------------fuunction to get all transactions------------------------------------------------------------------------------------------------
const fetchAllTransactions = async () => {
  const q = query(collection(db, 'EUsers'), where("displayName", "==", user.username));
  const querySnapshot = await getDocs(q);

  const userTransactions = [];

  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.transactions) {
      userTransactions.push(...userData.transactions);
    }
  });

 return userTransactions;
};

const fetchTransactionList = async (type,time,incomeCategory,expenseCategory) => {
  const allTransactions = await fetchAllTransactions();
  const transactions= filterObjectsByDate(allTransactions,time)

  
  const data = transactions.slice(1).filter((item) => {
   
    const incomeCategoryCondition = incomeCategoryMap[incomeCategory] || (() => true); // Default to true if category is not found
    const expenseCategoryCondition = expenseCategoryMap[expenseCategory] || (() => true); // Default to true if category is not found
    const typeCondition =  typeCategoryMap[type]|| (() => true); 
    return typeCondition(item)  && incomeCategoryCondition(item) && expenseCategoryCondition(item);
   
  });

  const filteredData=data.reverse();

  return filteredData;
};



//-----------------------------------function to get income data---------------------------------------------------------------

const getIncomeData = async (time, category) => {
  const allTransactions = await fetchAllTransactions();

 const transactions= filterObjectsByDate(allTransactions,time)

  // Filter the data based on the selected time and category
  const data = transactions.filter((item) => {
   
    const categoryCondition = incomeCategoryMap[category] || (() => true); // Default to true if category is not found

    return item.isIncome === true  && categoryCondition(item);
   
  });

  const filteredData=data.reverse();

  return filteredData;
};



//---------------------------------get expense data-----------------------------------------------//

const getExpenseData = async (time, category) => {
  const allTransactions = await fetchAllTransactions();

 const transactions= filterObjectsByDate(allTransactions,time)

  // Filter the data based on the selected time and category
  const data = transactions.filter((item) => {
   
    const categoryCondition = expenseCategoryMap[category] || (() => true); // Default to true if category is not found

    return item.isIncome === false  && categoryCondition(item);
   
  });

  const filteredData=data.reverse();

  return filteredData;
};



//---------------------------------deleting a transaction-------------------------------------------------------------------

const deleteTransaction = async ( selected) => {
  try {
    // Get the user document ID
    const docId = await getUserDocumentId(user.email);

    if (docId) {
      const docRef = doc(db, "EUsers", docId);
      // Update the "transactions" field by removing the selected transaction
      await updateDoc(docRef, {
        transactions: arrayRemove(selected),
      });

      console.log("Transaction deleted successfully.");
    } else {
      // Handle the case when no matching document is found
      console.log("No matching user document found.");
    }
  } catch (error) {
    console.error('Error deleting transaction: ', error);
  }

  window.location.reload();
};


//-----------------------------------------------total income by category-------------------------------------------------------
function calculateTotalIncomeByCategory(incomeArray, categories) {
  // Initialize an object to store total amounts for each category
  const categoryTotals = {};

  // Initialize category totals to zero
  categories.forEach(category => {
    categoryTotals[category] = 0;
  });

  // Calculate total amounts for each category
  incomeArray.forEach(income => {
    const { amount, category } = income;

    // Check if the category exists in the categories array
    if (categoryTotals.hasOwnProperty(category)) {
      categoryTotals[category] += amount;
    }
  });

  // Convert the object to an array with the same index as categories
  const totalIncomeByCategory = categories.map(category => categoryTotals[category]);

  return totalIncomeByCategory;
}

function calculateTotalExpenseByCategory(expenseArray, categories) {
  // Initialize an object to store total amounts for each category
  const categoryTotals = {};

  // Initialize category totals to zero
  categories.forEach(category => {
    categoryTotals[category] = 0;
  });

  // Calculate total amounts for each category
  expenseArray.forEach(income => {
    const { amount, category } = income;

    // Check if the category exists in the categories array
    if (categoryTotals.hasOwnProperty(category)) {
      categoryTotals[category] += amount;
    }
  });

  // Convert the object to an array with the same index as categories
  const totalExpenseByCategory = categories.map(category => categoryTotals[category]);

  return totalExpenseByCategory;
}


const addGoal=async(entry)=>{
  try {
    // Get the user document ID
    const docId = await getUserDocumentId(user.email);

    if (docId) {
      const docRef = doc(db, "EUsers", docId);
      // Update the "transactions" field by adding the new transaction
      await updateDoc(docRef, {
        goals: arrayUnion(entry),
      });

      console.log("Goal added successfully.");
    } else {
      // Handle the case when no matching document is found
      console.log("No matching user document found.");
    }
  } catch (error) {
    // Handle any potential errors here
    console.error("Error adding Goal:", error);
    throw error;
  }

  window.location.reload();
}

const fetchAllGoals=async()=>{
  const q = query(collection(db, 'EUsers'), where("displayName", "==", user.username));
  const querySnapshot = await getDocs(q);

  const userGoals = [];

  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.goals) {
      userGoals.push(...userData.goals);
    }
  });

 return userGoals.slice(1).reverse();
}
const deleteGoal = async ( selected) => {
  try {
    // Get the user document ID
    const docId = await getUserDocumentId(user.email);

    if (docId) {
      const docRef = doc(db, "EUsers", docId);
      await updateDoc(docRef, {
        goals: arrayRemove(selected),
      });

      console.log("Goal deleted successfully.");
    } else {
      console.log("No matching user document found.");
    }
  } catch (error) {
    console.error('Error deleting Goal: ', error);
  }

  window.location.reload();
};

const getBudget = async () => {
  const data = await fetchAllTransactions();
  let incomeTotal = 0;
  let expensesTotal = 0;

  data.forEach((item) => {
    if (item.isIncome === true) {
      incomeTotal += item.amount;
    } else if (item.isIncome === false) {
      expensesTotal += item.amount;
    }
  });

  // Create an object to store the totals
  const budget = {
    incomeTotal,
    expensesTotal,
  };

  // Now you have the incomeTotal and expensesTotal as properties of the budget object
  console.log("Budget:", budget);

  return budget;
};



const calculateFinancialYearAmount = async (bool) => {
  const data = await fetchAllTransactions();

  // Calculate the current date
  const currentDate = new Date();

// Calculate the start date for the current financial year (April 1st of the current year)
const startOfCurrentFinancialYear = new Date(currentDate.getFullYear(), 3, 1);

// Calculate the end date for the current financial year (March 31st of the next year)
const endOfCurrentFinancialYear = new Date(currentDate.getFullYear() + 1, 2, 31);

  // Filter the transactions based on the date and isIncome
  const filteredTransactions = data.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transaction.isIncome === bool &&
      transactionDate >= startOfCurrentFinancialYear &&
      transactionDate <= endOfCurrentFinancialYear
    );
  });

  // Calculate the sum of amounts in the filtered transactions
  const sum = filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);

  return sum;
};




const getCurrentFinancialYearMonths = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Start the financial year from April of the current year
  const startMonth = 3; // April is month 3 (0-based index)

  const months = [];
  for (let month = startMonth; month < startMonth + 12; month++) {
    const year = month >= 12 ? currentYear + 1 : currentYear;
    const monthName = new Date(year, month % 12, 1).toLocaleString('default', { month: 'long' });
    months.push(`${monthName} ${year}`);
  }

  

  
  return months;
};




const calculateFinancialYearAmountMonthWise = async (bool) => {
  const data = await fetchAllTransactions();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Start the financial year from April of the current year
  const startMonth = 3; // April is month 3 (0-based index)

  const months = [];
  for (let month = startMonth; month < startMonth + 12; month++) {
    const year = month >= 12 ? currentYear + 1 : currentYear;
    const monthStartDate = new Date(year, month % 12, 1);
    const monthEndDate = new Date(year, (month + 1) % 12, 0);

    // Filter the transactions based on the date and isIncome
    const filteredTransactions = data.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.isIncome === bool &&
        transactionDate >= monthStartDate &&
        transactionDate <= monthEndDate
      );
    });

    // Calculate the total amount for the current month
    let totalAmount = 0;

    for (const transaction of filteredTransactions) {
      totalAmount += transaction.amount;
    }

    const monthName = monthStartDate.toLocaleString('default', { month: 'long' });

    months.push({ month: monthName, year: year, amount: totalAmount });
  }
  return months;
};











    return (
        <GlobalContext.Provider value={{
            user,
            isLoading,
            addTransaction,
            getIncomeData,
            getExpenseData,
            calculateTotalIncomeByCategory,
            calculateTotalExpenseByCategory,
            deleteTransaction,
            fetchTransactionList,
            addGoal,
            fetchAllGoals,
            deleteGoal,
            getBudget,
            calculateFinancialYearAmount,
            getCurrentFinancialYearMonths,
            calculateFinancialYearAmountMonthWise
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}