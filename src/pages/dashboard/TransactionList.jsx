
import React, { useEffect, useState } from 'react'
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Select,
  Option,
} from "@material-tailwind/react";
import {TrashIcon} from "@heroicons/react/24/solid";

import { useGlobalContext } from '@/context/GlobalContext';


function TransactionList() {
  const {
    deleteTransaction,
    fetchTransactionList
  } = useGlobalContext();

  const [timeOption, setTimeOption] = useState("All");
  const [incomecategoryOption, setInomeCategoryOption] = useState("All");
  const [expensecategoryOption, setExpenseCategoryOption] = useState("All");
  const [isType, setisType] = useState("All")

  const [transactionList, setTransactionList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTransactionList(isType,timeOption,incomecategoryOption,expensecategoryOption);
        setTransactionList(data);
      } catch (error) {
        console.error("Error fetching income data: ", error);
      }
    };

    fetchData();
   
  }, [timeOption,incomecategoryOption,expensecategoryOption,isType])
  

  const handleTimeOptionChange = (e) => {
    setTimeOption(e);
  };

 
  const handleIncomeCategoryOptionChange = (e) => {
    setInomeCategoryOption(e);
  };
  const handleExpenseCategoryOptionChange = (e) => {
    setExpenseCategoryOption(e);
  };

  const handleTypeOptionChange=(e)=>{
    setisType(e)
    setExpenseCategoryOption("All");
    setInomeCategoryOption("All");
    setTimeOption("All");
  }

  const filterInt = (a, b,c,d) => {
    return (a !== "All") + (b !== "All")+(c!=="All")+(d !== "All");
  };

  const deletion = (index) => {
    deleteTransaction(transactionList[index]);
  };
 


  return (
    <>
    <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-3 min-h-[500px]">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6 "
          >
             <div>
              <Typography variant="h4" color="blue-gray" className="mb-1">
               All Transactions
              </Typography>
              <Typography
                variant="small"
                className="flex items-center pt-2 gap-1 font-normal text-blue-gray-600"
              >
                All of Your Transactions Till date
              </Typography>
            </div>
           
          </CardHeader>
          <CardBody className=" px-0 pt-0 pb-2 h-full">
          
          <div className=' grid grid-cols-5'>
            <div className='col-span-5 xl:flex xl:flex-row xl:justify-center flex flex-col justify-center items-center'>
           <div className='pt-2.5 px-3 pb-6'> <Typography variant="h6" color="gray" className="mb-1">Filters Applied({filterInt(isType,incomecategoryOption,expensecategoryOption,timeOption)})</Typography></div>
           <div className='px-2 pb-6'>
                <Select required size="md" value={isType} name="tableOption" id="tableOption" onChange={handleTypeOptionChange} >
                    <Option value="Earnings">Earnings</Option>
                    <Option value="Expenses">Expenses</Option>
              
                    <Option value="All">All Transactions</Option>   
                </Select>
                </div>
                <div className='px-2 pb-6'>
                <Select required size="md" value={timeOption} name="tableOption" id="tableOption" onChange={handleTimeOptionChange} >
                    <Option value="Current Month">Current Month</Option>
                    <Option value="Previous Month">Previous Month</Option>
                    <Option value="Current Year">Current Year</Option>
                    <Option value="Previous Year">Previous Year</Option>
                    <Option value="All">All Time</Option>   
                </Select>
                </div>
                <div className='px-2 pb-6'>
                <Select required size="md" value={incomecategoryOption} name="categoryOption" id="categoryOption" onChange={handleIncomeCategoryOptionChange}  className={isType==="Expenses" ? "opacity-50 pointer-events-none" : ""} >
        
                    <Option value="Salary">Salary</Option>
                    <Option value="Freelancing">Freelancing</Option>
                    <Option value="Investments">Investments</Option>
                    <Option value="Cryptocurrency">Cryptocurrency</Option>
                    <Option value="Trading">Trading</Option>
                    <Option value="Bank Transfer">Bank Transfer</Option>  
                    <Option value="Other">Other</Option>
                   <Option value="All">All Categories</Option>  
                    <Option value="Other">Other</Option>
                   <Option value="All">All Categories</Option>

                 </Select>
                </div>
                <div className='px-2 pb-6'>
                <Select required size="md" value={expensecategoryOption} name="categoryOption" id="categoryOption" onChange={handleExpenseCategoryOptionChange}  className={isType==="Earnings" ? "opacity-50 pointer-events-none" : ""} >
        
                <Option value="Groceries">Groceries</Option>
                <Option value="Education">Education</Option>
                <Option value="Groceries">Groceries</Option>
                <Option value="Subscriptions">Subscriptions</Option>
                <Option value="Takeaways">Takeaways</Option>
                <Option value="Clothing">Clothing</Option>
                <Option value="Travelling">Travelling</Option>  
                <Option value="Other">Other</Option>
                   <Option value="All">All Categories</Option>

                 </Select>
                </div>
                
            </ div>





  
          
            </div> 
          


       
         <div className='max-h-[600px] overflow-y-auto'>
         {transactionList.length === 0 ? <div className='w-full flex flex-col justify-center items-center p-20'><Typography variant="h5" color="gray" className="mb-1"> Try Adding Some Transactions or Change Filters Applied </Typography></div>:
            <table className="w-full min-w-[640px] table-auto ">
          <thead>
            <tr>
              <th  className="border-b border-blue-gray-50 py-3 px-6 text-left"> <Typography variant="medium" className=" font-medium uppercase text-blue-gray-400" > Date </Typography></th>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left"> <Typography variant="medium" className=" font-medium uppercase text-blue-gray-400" > Title </Typography></th>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left"> <Typography variant="medium" className=" font-medium uppercase text-blue-gray-400" > Category </Typography></th>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left"> <Typography variant="medium" className=" font-medium uppercase text-blue-gray-400" > Amount </Typography></th>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left"> <Typography variant="medium" className=" font-medium uppercase text-blue-gray-400" > Delete </Typography></th>
                 
            </tr>
          </thead>
          <tbody>
           {
              transactionList.map((data,key)=>(
              <tr key={key}>
                  <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="medium" color="blue-gray"className="font-bold">{data.date}</Typography></td>
                  <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="medium" color="blue-gray"className="font-bold">{data.title}</Typography></td>
                  <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="medium" color="blue-gray"className="font-bold">{data.category}</Typography></td>
                  {data.isIncome? <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="medium" color="green"className="font-bold">+ ₹{data.amount}</Typography></td>:<td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="medium" color="red"className="font-bold">- ₹{data.amount}</Typography></td>}
                  <td className='py-3 px-5 border-b border-blue-gray-50'> <div className='items-center' onClick={()=>deletion(key)}> <TrashIcon   className="w-8 h-8 text-red-500" /></div></td>
              </tr>
             )) 
             }
          </tbody>
            </table>
          }
         </div>
          
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default TransactionList