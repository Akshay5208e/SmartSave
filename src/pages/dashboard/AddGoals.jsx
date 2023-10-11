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
  Avatar,
  Progress,
} from "@material-tailwind/react";
import {ShoppingBagIcon, TrashIcon} from "@heroicons/react/24/solid";

import { useGlobalContext } from '@/context/GlobalContext';

import Chart from "react-apexcharts";
import GoalChart from './Components/GoalChart';



function Goals() {
  const {addGoal, fetchAllGoals, deleteGoal, getBudget } = useGlobalContext();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setimgUrl] = useState("")
  const [budget, setBudget] = useState(0)
  const [goals, setGoals] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeData = await fetchAllGoals();
        setGoals(incomeData);
      } catch (error) {
        console.error("Error fetching income data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const budgetData = await getBudget();
        const { incomeTotal, expensesTotal } = budgetData;
  
        // Calculate the difference between income and expenses
        setBudget(incomeTotal - expensesTotal)
  
        // Now you can use budgetDifference as the difference between income and expenses
        // console.log("Income Total:", incomeTotal);
        // console.log("Expense Total:", expensesTotal);
        // console.log("Budget Difference:", budgetDifference);
  
        // You can set it to a state variable or use it as needed in your component
        // setStateVariable(budgetDifference);
      } catch (error) {
        console.error("Error fetching budget data: ", error);
      }
    };
  
    fetchBudget();
  }, []);
  



const handleAdding=()=>{
  const newGoal = {
    
    title,
    description,
    imgUrl,
    amount: parseFloat(amount),
  };

  addGoal(newGoal);
}

 
  const deletion = (index) => {
    deleteGoal(goals[index]);
  };
  const completion=(money)=>{
    const complete=parseInt((budget/money)*100);
    if(complete>100)
    {return 100;}
    

    if(complete<0)
    {return 0;}

    return complete;
    
  }


  return (
    <div className="mt-12">
    <div className="mb-4 grid grid-cols-1 gap-6  lg:grid-cols-3">
        <Card className="overflow-hidden h-full  lg:col-span-1 h-full w-full">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between px-6 pt-6 pb-2"
          >
             <div>
              <Typography variant="h4" color="blue-gray" className="mb-1">
                Add Goals
              </Typography>
              <Typography
                variant="small"
                className="flex items-center pt-2 gap-1 font-normal text-blue-gray-600"
              >
                Enter What You Want To Purchase
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div>  <Typography variant="h6" color="blue-gray" className="mb-1">Title: </Typography><span><Input label="Title" type="text" value={title} size="lg" onChange={(e)=>setTitle(e.target.value)}/></span></div>
            <div>  <Typography variant="h6" color="blue-gray" className="mb-1">Amount: </Typography><span><Input label="Amount" type='number' value={amount} size="lg" onChange={(e)=>setAmount(e.target.value)}/></span></div>
            <div>  <Typography variant="h6" color="blue-gray" className="mb-1">Image Url: </Typography><span><Input label="Image Url" type='text' value={imgUrl} size="lg" onChange={(e)=>setimgUrl(e.target.value)}/></span></div>
            <div>  <Typography variant="h6" color="blue-gray" className="mb-1">Description: </Typography><span><Input label="Description" type="text" value={description} size="lg" onChange={(e)=>setDescription(e.target.value)}/></span></div>
            <div className='flex flex-col justify-center items-center'>  <Typography variant="h6" color="blue-gray" className="mb-1">Image: </Typography>
            {imgUrl!=="" ? <img src={imgUrl}  className='h-[150px] w-[150px]'/>:<div className=''><ShoppingBagIcon className='h-[150px] w-[150px]'/></div> }
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={handleAdding}  >
              Add Goal
            </Button>
          </CardFooter>
        </Card>

        {/* <Card className="overflow-hidden h-full  lg:col-span-2 h-full w-full">
        <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between px-6 pt-6 pb-2"
          >
             <div>
              <Typography variant="h4" color="blue-gray" className="mb-1">
                Goals
              </Typography>
              <Typography
                variant="small"
                className="flex items-center pt-2 gap-1 font-normal text-blue-gray-600"
              >
                All of The Things You Want To Purchase
              </Typography>
            </div>
           
          </CardHeader>
          <CardBody>
          <div className='max-h-[450px] overflow-y-auto'>
         {goals.length === 0 ? <div className='w-full flex flex-col justify-center items-center p-20'><Typography variant="h4" color="gray" className="mb-1"> No Data To Show </Typography></div>:
            <table className="w-full min-w-[640px] table-auto ">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-center">
                  <Typography variant="medium" className="font-medium uppercase text-blue-gray-400">Image</Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-center">
                  <Typography variant="medium" className="font-medium uppercase text-blue-gray-400">Title</Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-center">
                  <Typography variant="medium" className="font-medium uppercase text-blue-gray-400">Amount</Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-center">
                  <Typography variant="medium" className="font-medium uppercase text-blue-gray-400">% Done</Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-center">
                  <Typography variant="medium" className="font-medium uppercase text-blue-gray-400">Delete</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal, key) => (
                <tr key={key}>
                  <td className='py-3 px-5 border-b border-blue-gray-50 text-center'>
                    <Avatar src={goal.imgUrl} size="sm" />
                  </td>
                  <td className='py-3 px-5 border-b border-blue-gray-50 text-center'>
                    <Typography variant="medium" color="blue-gray" className="font-bold">{goal.title}</Typography>
                  </td>
                  <td className='py-3 px-5 border-b border-blue-gray-50 text-center'>
                    <Typography variant="medium" color="blue-gray" className="font-bold">₹{goal.amount}</Typography>
                  </td>
                  <td className="py-3 border-b border-blue-gray-50 text-center">
                    <Typography variant="small" className="mb-1 block text-xs font-medium text-blue-gray-600">
                      {completion(goal.amount)}%
                    </Typography>
                    <Progress
                      value={completion(goal.amount)}
                      variant="gradient"
                      color={completion(goal.amount) === 100 ? "green" : "blue"}
                      className="h-1 mx-auto"
                    />
                  </td>
                  <td className='py-3 px-5 border-b border-blue-gray-50 text-center'>
  <div className='flex items-center justify-center' onClick={() => deletion(key)}>
    <TrashIcon className="w-8 h-8 text-red-500" />
  </div>
</td>

                </tr>
              ))}
            </tbody>
          </table>
          
          }
         </div>
          </CardBody>
        </Card> */}

        <GoalChart/>
        
        
      </div>


      
    </div>
  )
}

export default Goals