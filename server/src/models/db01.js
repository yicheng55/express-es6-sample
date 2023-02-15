'use strict';
import { createPool } from "mysql";
import { HOST, USER, PASSWORD, DB } from "../config/db.config.js";
// console.log(HOST);
var connection = createPool({
//   host: HOST,
//   host: "192.168.248.34",
  host: "192.168.249.118",
  user: USER,
  password: PASSWORD,
//   password: "q45101524Q",
//   port: 5080,
  database: DB
});
console.log(connection);
export default connection;
