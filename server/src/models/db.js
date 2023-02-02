'use strict';
import { createPool } from "mysql";
import { HOST, USER, PASSWORD, DB } from "../config/db.config.js";

var connection = createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DB
});

export default connection;
