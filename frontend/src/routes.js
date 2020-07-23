import Dashboard from "views/Dashboard.js";
import Keygen from "views/Keygen.js";
import Transaction from "views/Transaction";

import TableList from "views/Peerlist.js";
import Balance from "views/Balance";
import UserProfile from "views/UserProfile.js";
import GetBlock from "views/GetBlock";

var routes = [
  {
    path: "/transaction",
    name: "TRANSACTIONS",
    icon: "tim-icons icon-bank",
    component: Transaction,
    layout: "/admin",
  },
  {
    path: "/keys",
    name: "GENERATE KEYS",
    icon: "tim-icons icon-key-25",
    component: Keygen,
    layout: "/admin",
  },
  {
    path: "/blocks",
    name: "GET BLOCKS",
    icon: "tim-icons icon-link-72",
    component: GetBlock,
    layout: "/admin",
  },
  {
    path: "/addAlias",
    name: "ADD ALIAS",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/peers",
    name: "Peers List",
    icon: "tim-icons icon-notes",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/balance",
    name: "CHECK BALANCE",
    icon: "tim-icons icon-wallet-43",
    component: Balance,
    layout: "/admin",
  },
];
export default routes;
