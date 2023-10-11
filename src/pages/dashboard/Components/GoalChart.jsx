import { useGlobalContext } from '@/context/GlobalContext';
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

function GoalChart() {

    const {addGoal, fetchAllGoals, deleteGoal, getBudget } = useGlobalContext();
    const [goals, setGoals] = useState([])
    const [budget, setBudget] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await fetchAllGoals();
            setGoals(data);
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
    <Card className="overflow-hidden h-full  lg:col-span-2 h-full w-full">
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
         {goals.length === 0 ? <div className='w-full flex flex-col justify-center items-center p-20'><Typography variant="h4" color="gray" className="mb-1"> Add The Things You Want To Purchase </Typography></div>:
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
                  {goal.imgUrl===""? <div className='h-full w-full flex flex-col justify-center items-center'><ShoppingBagIcon className='h-10 w-10' /></div>:   <Avatar src={goal.imgUrl} variant='small'/>}
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
        </Card>
  )
}

export default GoalChart