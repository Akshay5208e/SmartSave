import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  TrophyIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";

import TransactionList from "./pages/dashboard/TransactionList";
import Earnings from "./pages/dashboard/AddIncome";
import Expenses from "./pages/dashboard/AddExpense";
import Goals from "./pages/dashboard/AddGoals";
import { SignIn, SignUp } from "./pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};



export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <ChevronDoubleUpIcon {...icon} />,
        name: "Earnings",
        path: "/earnings",
        element: <Earnings />,
      },
      {
        icon: <ChevronDoubleDownIcon {...icon} />,
        name: "Expenses",
        path: "/expenses",
        element: <Expenses />,
      },
      {
        icon: <TrophyIcon {...icon} />,
        name: "Financial Goals",
        path: "/Financial-Goals",
        element: <Goals />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "All Transactions",
        path: "/all-Transactions",
        element: <TransactionList/>,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
