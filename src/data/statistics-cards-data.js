import {
  BanknotesIcon,
  UserPlusIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "blue",
    icon: BanknotesIcon,
    title: "Balanace",
    value: "$53k",
    footer: {
      color: "gray",
      size:"small",
      label: "Total Balance In Your Account",
    },
  },
  {
    color: "green",
    icon: ChevronDoubleUpIcon,
    title: "Earnings",
    value: "2,300",
    footer: {
      color: "gray",
      size:"small",
      label: "Earnings  Of Previous 12 Months",
    },
  },
  {
    color: "red",
    icon: ChevronDoubleDownIcon,
    title: "Expenses",
    value: "3,462",
    footer: {
      color: "gray",
      size:"small",
      label: "Expenses Of Previous 12 Months",
    },
  },
 
];

export default statisticsCardsData;
