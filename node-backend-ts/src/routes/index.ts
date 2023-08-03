import { Router } from "express";

import users from "./users";
import programs from "./programs";
import clients from "./clients";
import products from "./products";
import price from "./price";
import orders from "./orders";
import questionnaire from "./questionnaire";
import booking from "./booking";
import kanban from "./kanban";
import logs from "./logs";
import tasks from "./tasks";
import notes from "./notes";
import chats from "./chats";
import assets from "./assets";
import helper from "./helper";
import schedule from "./schedule";
import dashboard from "./dashboard";

export default (router: Router) => {

  users(router);
  programs(router);
  clients(router);
  products(router);
  orders(router);
  questionnaire(router);
  booking(router);
  kanban(router);
  logs(router);
  tasks(router);
  notes(router);
  price(router);
  chats(router);
  assets(router);
  helper(router);
  schedule(router);
  dashboard(router);

};
