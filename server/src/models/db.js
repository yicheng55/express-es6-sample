'use strict';
import { createPool } from "mysql";
// import { dbconfig as dbConfig  } from "../config/db.config.js";
import { dbconfig1 as dbConfig  } from "../config/db.config.js";
// import { dbconfig2 as dbConfig  } from "../config/db.config.js";
// import { dbconfig3 as dbConfig  } from "../config/db.config.js";

console.log(dbConfig);
var connection = createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT
});

export default connection;
