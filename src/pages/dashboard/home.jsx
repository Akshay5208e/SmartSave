import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  ClockIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import {
  BanknotesIcon,
  UserPlusIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { useGlobalContext } from "@/context/GlobalContext";
import { chartsConfig } from "../../configs/charts-config";
import GoalChart from "./Components/GoalChart";
import RecentTransactions from "./Components/RecentTransactions";

export function Home() {

  const { user,getBudget, calculateFinancialYearAmount,getCurrentFinancialYearMonths, calculateFinancialYearAmountMonthWise } = useGlobalContext();
  const [balance, setBalance] = useState(0)
  const [incomeFinancialYear, setIncomeFinancialYear] = useState(0)
  const [epxenseFinancialYear, setExpenseFinancialYear] = useState(0)
  const [monthsOfFinancialYear, setMonthsOfFinancialYear] = useState([]);
  const [monthwiseIncomeAmount, setMonthwiseIncomeAmount] = useState([])
  const [monthwiseExpenseAmount, setMonthwiseExpenseAmount] = useState([])
  
  

  const IncomeChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Income/ Earning",
       data: monthwiseIncomeAmount,
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#fff",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
    categories:monthsOfFinancialYear,
      },
    },
  };

  const expenseChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Expense",
        data: monthwiseExpenseAmount,
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#fff",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories:monthsOfFinancialYear,
      },
    },
  };


  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const budgetData = await getBudget();
        const { incomeTotal, expensesTotal } = budgetData;
        setBalance(incomeTotal - expensesTotal)
  
      
      } catch (error) {
        console.error("Error fetching budget data: ", error);
      }
    };
    
    const fetchIncomeinCurrentYear= async()=>{
      const sum=await calculateFinancialYearAmount(true)
      setIncomeFinancialYear(sum);
      
    }
    const fetchExpenseinCurrentYear= async()=>{
      const sum=await calculateFinancialYearAmount(false)
      setExpenseFinancialYear(sum);
      
    }

    const fetchDataAndFormatIncome = async () => {
      const data = await calculateFinancialYearAmountMonthWise(true);
      const monthYearArray = data.map(({ month, year }) => `${month} ${year}`);
      const monthlyAmount=data.map(({ amount }) => amount)
      setMonthsOfFinancialYear(monthYearArray)
      console.log("mt",monthlyAmount)
      setMonthwiseIncomeAmount(monthlyAmount)
    };
    const fetchDataAndFormatExpense = async () => {
      const data = await calculateFinancialYearAmountMonthWise(false);
      const monthYearArray = data.map(({ month, year }) => `${month} ${year}`);
      const monthlyAmount=data.map(({ amount }) => amount)
      setMonthsOfFinancialYear(monthYearArray)
      console.log("mt",monthlyAmount)
      setMonthwiseExpenseAmount(monthlyAmount)
    };
    fetchBudget();
    fetchIncomeinCurrentYear();
    fetchExpenseinCurrentYear();
    getCurrentFinancialYearMonths();
    fetchDataAndFormatIncome();
    fetchDataAndFormatExpense();
  

  }, []);


  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
   

      <StatisticsCard         
            title="Balance"
            color= "blue"
            value={balance}
            icon={React.createElement(BanknotesIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography variant="small" className="font-normal text-blue-gray-600">
                Balance In your Account
              </Typography>
            }
          />

        <StatisticsCard         
                    title="Income"
                    color= "green"
                    value={incomeFinancialYear}
                    icon={React.createElement(ChevronDoubleUpIcon, {
                      className: "w-6 h-6 text-white",
                    })}
                    footer={
                      <Typography variant="small" className="font-normal text-blue-gray-600">
                      Income In current Financial Year
                      </Typography>
                    }
          />

            <StatisticsCard         
                    title="Expenses"
                    color= "red"
                    value={-1*epxenseFinancialYear}
                    icon={React.createElement(ChevronDoubleDownIcon, {
                      className: "w-6 h-6 text-white",
                    })}
                    footer={
                      <Typography variant="small" className="font-normal text-blue-gray-600">
                      Expense In current Financial Year
                      </Typography>
                    }
          />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
        {/* {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
          
          />
        ))} */}

        <StatisticsChart
        color="green"
        chart={IncomeChart}
        title="Income/Earnings"
        description="Total Income In current Financial Year(Month Wise)" 
          />
          
        <StatisticsChart
        color="red"
        chart={expenseChart}
        title="Expenses"
        description="Total Expense In current Financial Year(Month Wise)" 
          />

        
      </div>
      
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <GoalChart/>
        <RecentTransactions/>
      </div>
    </div>
  );
}

export default Home;
