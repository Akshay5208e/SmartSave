
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


function RecentTransactions() {
  const {
    deleteTransaction,
    fetchTransactionList
  } = useGlobalContext();

 

  const [transactionList, setTransactionList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTransactionList();
        setTransactionList(data.splice(0, 15));
      } catch (error) {
        console.error("Error fetching income data: ", error);
      }
    };

    fetchData();
   
  }, [])
  
 


  return (
    <>
    <div className="mb-4 grid grid-cols-1 gap-6  xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-3 max-h-[550px]">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6 "
          >
             <div>
              <Typography variant="h4" color="blue-gray" className="mb-1">
               Recent Transactions
              </Typography>
              <Typography
                variant="small"
                className="flex items-center pt-2 gap-1 font-normal text-blue-gray-600"
              >
                Latest Tranactions
              </Typography>
            </div>
           
          </CardHeader>
          <CardBody className="overflow-y-auto px-0 pt-0 pb-2 h-full">
         
          


       
         <div className='max-h-[600px] '>
         {transactionList.length === 0 ? <div className='w-full flex flex-col justify-center items-center p-20'><Typography variant="h5" color="gray" className="mb-1 text-center">Try Adding Some Transactions</Typography></div>:
            <table className="w-full min-w-[300px] table-auto ">
          <thead>
            <tr>
              <th  className="border-b border-blue-gray-50 py-3 px-6 text-left"> <Typography variant="small" className=" font-medium uppercase text-blue-gray-400" > Date </Typography></th>
              <th  className="border-b border-blue-gray-50 py-3 px-6 text-left"> <Typography variant="small" className=" font-medium uppercase text-blue-gray-400" > Title </Typography></th>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left"> <Typography variant="small" className=" font-medium uppercase text-blue-gray-400" > Amount </Typography></th>
         
                 
            </tr>
          </thead>
          <tbody>
           {
              transactionList.map((data,key)=>(
              <tr key={key}>
                  <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="small" color="blue-gray"className="font-bold">{data.date}</Typography></td>
                  <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="small" color="blue-gray"className="font-bold">{data.title}</Typography></td>
                  {data.isIncome? <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="small" color="green"className="font-bold">+ ₹{data.amount}</Typography></td>:<td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="small" color="red"className="font-bold">- ₹{data.amount}</Typography></td>}
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

export default RecentTransactions