import React, { useEffect, useState } from 'react'
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,
  CardFooter,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import {TrashIcon} from "@heroicons/react/24/solid";

import { useGlobalContext } from '@/context/GlobalContext';

import Chart from "react-apexcharts";



function Earnings() {
  const {
    user,
    addTransaction,
    getIncomeData,
    deleteTransaction,
    calculateTotalIncomeByCategory,
  } = useGlobalContext();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [timestamp, setTimestamp] = useState(null);
  const [timeOption, setTimeOption] = useState("All");
  const [categoryOption, setCategoryOption] = useState("All");
  const [categoryOptionPC, setCategoryOptionPC] = useState("All");
  const [timeOptionPC, setTimeOptionPC] = useState("All");
  const [incomeArray, setIncomeArray] = useState([]);
  const [incomeArrayPC, setIncomeArrayPC] = useState([]);
  const categories = ["Salary", "Freelancing", "Investments", "Cryptocurrency", "Trading", "Bank Transfer", "Other"];

  const chartOptions = {
    labels: categories,
    plotOptions: {
      pie: {
        donut: {
          expandOnClick: false,
          labels: {
            show: true,
            total: {
              show: true,
              color: '',
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    const currentDate = new Date();
    setTimestamp(currentDate);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeData = await getIncomeData(timeOption, categoryOption);
        setIncomeArray(incomeData);
      } catch (error) {
        console.error("Error fetching income data: ", error);
      }
    };

    fetchData();
  }, [timeOption, categoryOption]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeData = await getIncomeData(timeOptionPC, categoryOptionPC);
        const totalIncomeByCategory = calculateTotalIncomeByCategory(incomeData, categories);
        setIncomeArrayPC(totalIncomeByCategory);
        console.log("Total income by category: ", incomeArrayPC);
      } catch (error) {
        console.error("Error fetching income data: ", error);
      }
    };

    fetchData();
  }, [timeOptionPC, categoryOptionPC]);

  const handleAdding = () => {
    const newTransaction = {
      createdAt: timestamp,
      title,
      description,
      category,
      isIncome: true,
      date,
      amount: parseFloat(amount),
    };

    addTransaction(newTransaction);
  };

  const handleCategoryChange = (e) => {
    setCategory(e);
  };

  const handleTimeOptionChange = (e) => {
    setTimeOption(e);
  };

  const handleTimeOptionChangePC = (e) => {
    setTimeOptionPC(e);
  };

  const handleCategoryOptionChange = (e) => {
    setCategoryOption(e);
  };

  const deletion = (index) => {
    deleteTransaction(incomeArray[index]);
  };

  const filterInt = (a, b) => {
    return (a !== "All") + (b !== "All");
  };
  return (
    <div className="mt-12">
    <div className="mb-4 grid grid-cols-1 gap-6  lg:grid-cols-2">
        <Card className="overflow-hidden h-full  lg:col-span-1 h-full w-full">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
             <div>
              <Typography variant="h4" color="blue-gray" className="mb-1">
                Add Recieving
              </Typography>
              <Typography
                variant="small"
                className="flex items-center pt-2 gap-1 font-normal text-blue-gray-600"
              >
                Enter Your Recieving
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div>  <Typography variant="h6" color="blue-gray" className="mb-1">Title: </Typography><span><Input label="Title" type="text" value={title} size="lg" onChange={(e)=>setTitle(e.target.value)}/></span></div>
            
            <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">Category: </Typography><span>
            
      <Select
        required
        label="Select Category"
        name="category"
        id="category"
        onChange={handleCategoryChange}
      >
        <Option value="" disabled>
          Select Option
        </Option>
        <Option value="Salary">Salary</Option>
        <Option value="Freelancing">Freelancing</Option>
        <Option value="Investments">Investments</Option>
        <Option value="Cryptocurrency">Cryptocurrency</Option>
        <Option value="Trading">Trading</Option>
        <Option value="Bank Transfer">Bank Transfer</Option>  
        <Option value="Other">Other</Option>
      </Select>

    
                </span>
            </div>

            <div>  <Typography variant="h6" color="blue-gray" className="mb-1">Date: </Typography><span><Input label="Select Date" type='date' value={date} size="lg" onChange={(e)=>setDate(e.target.value)}/></span></div>
            <div>  <Typography variant="h6" color="blue-gray" className="mb-1">Amount: </Typography><span><Input label="Amount" type='number' value={amount} size="lg" onChange={(e)=>setAmount(e.target.value)}/></span></div>
            <div>  <Typography variant="h6" color="blue-gray" className="mb-1">Description: </Typography><span><Input label="Description" type="text" value={description} size="lg" onChange={(e)=>setDescription(e.target.value)}/></span></div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={handleAdding}  >
              Add Recieving
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden h-full  lg:col-span-1 h-full w-full gap-30">
          <CardHeader
            floated={true}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between px-6  pt-4 pb-2 z-20"
          >
            <div>
              <Typography variant="h4" color="blue-gray" className="mb-1">
                Earnings Chart
              </Typography>
              <Typography
                variant="small"
                className="flex items-center pt-2 gap-1 font-normal text-blue-gray-600"
              >
                Chart Representaion of Your Earnings
              </Typography>
            </div>

    
            
          </CardHeader>
          <CardBody className="flex flex-col gap-4 pt-0 px-6 pb-6 z-0">
          
               <div className='grid grid-cols-3 pt-5 z-50'>
                  <div className='px-2 pt-1.5 pb-1 col-span-1'>
                    <Typography variant="h6" color="gray" className="mb-1">Filters Applied({filterInt(categoryOptionPC,timeOptionPC)})</Typography>
                  </div>
                  <div className='col-span-1'></div>
                  <div className='flex justify-end col-span-1'>

                  <div className='px-2 pt-1.5 pb-1 '>
                    <Typography variant="h6" color="gray" className="mb-1">Filter</Typography>
                  </div>
                    <Select required size="md" value={timeOptionPC} name="tableOption" id="tableOption" onChange={handleTimeOptionChangePC}>
                      <Option value="Current Month">Current Month</Option>
                      <Option value="Previous Month">Previous Month</Option>
                      <Option value="Current Year">Current Year</Option>
                      <Option value="Previous Year">Previous Year</Option>
                      <Option value="All">All Earnings</Option>
                    </Select>
                  </div>
                </div>
   



            <div className='flex flex-col jusify-center items-center overflow-x-auto h-full w-full p-10'>
            {/* <Chart type="bar" options={chartOptions} series={[{data:incomeArrayPC}]}  height={400} /> */}
   
            {
              incomeArrayPC.reduce((accumulator, currentValue) => accumulator + currentValue, 0) === 0 ? <div className='w-full flex flex-col justify-center items-center p-20'><Typography variant="h5" color="gray" className="mb-1 text-center"> Try Adding Some Transactions or Change Filters Applied </Typography></div>:
              <Chart
              type='donut'
              width={520}
              height={520}
              series={incomeArrayPC}
              options={chartOptions}/>
            }
            
            </div>
             
          </CardBody>
        </Card>
        
      </div>


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
                Earnings
              </Typography>
              <Typography
                variant="small"
                className="flex items-center pt-2 gap-1 font-normal text-blue-gray-600"
              >
                All of Your Earnings
              </Typography>
            </div>
           
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 h-full">
          
          <div className=' grid grid-cols-5'>
            <div className='col-span-1 flex  justify-between px-7 pt-2.5'>   <Typography variant="h6" color="gray" className="mb-1">Filters Applied ({filterInt(timeOption,categoryOption)})</Typography></div>
            <div className='col-span-2 flex flex-col'></div>
            <div className='col-span-2 xl:flex xl:flex-row justify-between flex flex-col justify-between'>
           <div className='pt-2.5 px-3'><Typography variant="h6" color="gray" className="mb-1">Filter </Typography></div>
                <div className='px-2 pb-6'>
                <Select required size="md" value={timeOption} name="tableOption" id="tableOption" onChange={handleTimeOptionChange} >
                    <Option value="Current Month">Current Month</Option>
                    <Option value="Previous Month">Previous Month</Option>
                    <Option value="Current Year">Current Year</Option>
                    <Option value="Previous Year">Previous Year</Option>
                    <Option value="All">All Earnings</Option>   
                </Select>
                </div>
                <div className='px-2 pb-6'>
                <Select required size="md" value={categoryOption} name="categoryOption" id="categoryOption" onChange={handleCategoryOptionChange} >
        
                    <Option value="Salary">Salary</Option>
                    <Option value="Freelancing">Freelancing</Option>
                    <Option value="Investments">Investments</Option>
                    <Option value="Cryptocurrency">Cryptocurrency</Option>
                    <Option value="Trading">Trading</Option>
                    <Option value="Bank Transfer">Bank Transfer</Option>  
                    <Option value="Other">Other</Option>
                   <Option value="All">All Categories</Option>

                 </Select>
                </div>
                
            </ div>





  
          
            </div> 
          


       
         <div className='max-h-[450px] overflow-y-auto'>
         {incomeArray.length === 0 ? <div className='w-full flex flex-col justify-center items-center p-20'><Typography variant="h4" color="gray" className="mb-1"> Try Adding Some Transactions or Change Filters Applied </Typography></div>:
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
              incomeArray.map((income,key)=>(
              <tr key={key}>
                  <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="medium" color="blue-gray"className="font-bold">{income.date}</Typography></td>
                  <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="medium" color="blue-gray"className="font-bold">{income.title}</Typography></td>
                  <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="medium" color="blue-gray"className="font-bold">{income.category}</Typography></td>
                  <td className='py-3 px-5 border-b border-blue-gray-50'>  <Typography variant="medium" color="green"className="font-bold">+ ₹{income.amount}</Typography></td>
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
    </div>
  )
}

export default Earnings