'use strict';
import { createPool } from "mysql";
import { HOST, USER, PASSWORD, DB, PORT } from "../config/db.config.js";
console.log(HOST);
var connection = createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DB,
  port:PORT
});

export default connection;
