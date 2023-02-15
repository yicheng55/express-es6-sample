'use strict';
// import { query as _query } from "./db.js";
import sql  from "./db.js";
// import { isNullOrUndefined } from 'url/util.js';
// const TABLE_NAME = 'Flds_user';
// constructor
class Flds_user {
  constructor(user) {
    this.user_id = user.user_id;
    this.name = user.name;
    this.deptid = user.deptid;
    this.state = user.state;
    this.password = user.password;
  }
  static create(newFlds_user, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // sql.query("INSERT INTO Flds_user SET ?", newFlds_user, (err, res) => {
      let query = `INSERT INTO ${TABLE_NAME} SET ?`;
      console.log("query:", query);
      sql.query(query, newFlds_user, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        console.log(res);
        console.log("created Flds_user: ", { ...newFlds_user });
        return resolve({ ...newFlds_user });
      });
    });
  }
  static findById(id, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let query = ("SELECT * FROM Flds_users WHERE user_id = " + id);
      let query = `SELECT * FROM ${TABLE_NAME} WHERE user_id = '${id}'`;
      console.log("query:", query);

      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.length) {

          // console.log("found product: ", res[0]);
          return resolve(res);
        }
        return resolve(res);
        // return resolve({ result: "not_found" }, null);
      });
    });
  }
  static getAll(TABLE_NAME, result) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM " + TABLE_NAME;
      console.log("query:", query);
      sql.query(query, (err, res) => {
        if (err) {
          // console.log("error: ", err);
          return reject(err);
        }
        return resolve(res);
      });
    });
  };

  static findSearch(TABLE_NAME, params) {
    return new Promise((resolve, reject) => {
      console.log("params:", params);
      // let query = `SELECT * FROM ${TABLE_NAME}  WHERE 1 `;
      let query = `SELECT * FROM ${TABLE_NAME} WHERE 1 `;

      // 檢查參數長度Object.keys(params).length
      // console.log("query:", query, params, Object.keys(params).length);
      if (params.user_id) {
        query = query + `AND user_id LIKE '${params.user_id}%' `;
        console.log("params.user_id:", params.user_id);
      };

      if (params.deptid) {
        query = query + `AND deptid LIKE '${params.deptid}%' `;
        console.log("params.deptid:", params.deptid);
      };

      if (params.limit) {
        query = query + `LIMIT ${params.limit} `;
        console.log("params.limit:", params.limit);
      };

      if (params.offset) {
        query = query + `OFFSET ${params.offset} `;
        console.log("params.offset:", params.offset);
      };

      // query = query + `ORDER BY ${TABLE_NAME}.user_id LIMIT 100 OFFSET 0 `;
      console.log("query: %s", query);
      sql.query(query, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
      // return resolve(query);
    });
  };

  static updateById(id, Flds_user, TABLE_NAME) {
    return new Promise((resolve, reject) => {

      let query = `UPDATE ${TABLE_NAME} SET ?  WHERE user_id = '${id}'`;
      console.log("query:", query);
      sql.query(query, Flds_user, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found product with the id
          console.log("error: res.affectedRows == 0");
          return resolve([]);
        }

        return resolve([Flds_user]);
      }
      );

    });
  }
  static remove(id, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      let query = `DELETE FROM ${TABLE_NAME} WHERE user_id = '${id}'`;
      console.log("query:", query);
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
          // result(null, err);
          // return;
        }

        if (res.affectedRows == 0) {
          console.log("error: res.affectedRows == 0");
          return resolve([]);
        }
        return resolve([res]);
      });
    });

  }
  static removeAll(TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      let query = `DELETE FROM ${TABLE_NAME} `;
      console.log("query:", query);
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }
        console.log(`deleted ${res.affectedRows}  ${TABLE_NAME}`);
        return resolve(res);
      });
    });
  }
  static truncate(table, result) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      let query = `TRUNCATE TABLE  ${table} `;
      console.log("query:", query);
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject({ result: 'error: ' + err });
          // result(null, err);
          // return;
        }

        console.log(`Truncate ${res.affectedRows}  ${table}`);
        return resolve(res);
        // result(null, res);
      });
    });
  }
}

export default Flds_user;
