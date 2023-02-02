'use strict';
const sql = require("./db.js");
const TABLE_NAME = 'rfid_in_flds_b';

// constructor
const Flds_bind = function(flds_bind) {
  this.uid = flds_bind.uid;
  this.users_id = flds_bind.users_id;
  this.location_id = flds_bind.location_id;
};

Flds_bind.create = (newflds_bind, result) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO ${TABLE_NAME} SET ?`, newflds_bind, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log(res)
      console.log("created ${TABLE_NAME}: ", { ...newflds_bind });
      return resolve({ ...newflds_bind });
    });
  });
};


Flds_bind.replace = (newflds_bind, result) => {
  return new Promise((resolve, reject) => {
    // let query = `REPLACE INTO ${TABLE_NAME}  SET '${newflds_bind}' WHERE uid = '${newflds_bind.uid}' AND location_id = '${newflds_bind.location_id}'`;
    // let query = `REPLACE INTO ${TABLE_NAME} SET uid = '${newflds_bind.uid}', users_id = '${newflds_bind.users_id}', location_id = '${newflds_bind.location_id}' WHERE uid = '${newflds_bind.uid}' AND location_id = '${newflds_bind.location_id}'`;

    // console.log("query:", query);

    // sql.query("REPLACE INTO ${TABLE_NAME} SET ?", newflds_bind, (err, res) => {
    // sql.query(query, (err, res) => {
    sql.query(`REPLACE INTO ${TABLE_NAME} SET ?`, newflds_bind, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      // console.log(res)
      // console.log(`created ${TABLE_NAME}: `, { ...newflds_bind });
      // return resolve({ ...newflds_bind });
      return resolve( res );
    });
  });
};

Flds_bind.findById = (params, result) => {
  return new Promise((resolve, reject) => {
    // let query = ("SELECT * FROM ${TABLE_NAME} WHERE uid = " + id);
    let query = `SELECT * FROM ${TABLE_NAME} WHERE uid = '${params.uid}' AND location_id = '${params.location_id}'`;
    console.log("query:", query);

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        // console.log("found flds_bind: ", res[0]);
        return resolve(res);
      }

      return resolve([{ result: "not_found" }], null);
    });
  });
};



Flds_bind.findByuId = (data, result) => {
  return new Promise((resolve, reject) => {
    // let query = ("SELECT * FROM ${TABLE_NAME} WHERE uid = " + id);
    let query = `SELECT * FROM ${TABLE_NAME} WHERE uid = '${data.uid}'`;
    console.log("query:", query);

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        // console.log("found flds_bind: ", res[0]);
        return resolve(res);
      }

      return resolve({ result: "not_found" }, null);
    });
  });
};


Flds_bind.findByLocationId = (data, result) => {
  return new Promise((resolve, reject) => {
    // let query = ("SELECT * FROM ${TABLE_NAME} WHERE uid = " + id);
    let query = `SELECT * FROM ${TABLE_NAME} WHERE location_id = '${data.location_id}'`;
    console.log("query:", query);

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        // console.log("found flds_bind: ", res[0]);
        return resolve(res);
      }

      return resolve([{ result: "not_found" }], null);
    });
  });
};


// 合併列表名細
// SELECT * FROM `flds_binds`
// JOIN location_tables ON  flds_binds.location_id = location_tables.luid
// JOIN products ON  flds_binds.uid = products.uid;

Flds_bind.getAll = (table, result) => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM " + table;
    console.log("query:", query);

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        // result(null, err);
        return reject(err);
      }
      // console.log("locations: ", res);
      // result(null, res);
      return resolve(res);
    });
  });
};

// location.getAll = (table, result) => {
//   // let query = "SELECT * FROM locations";

//   // if (title) {
//   //   query += ` WHERE title LIKE '%${title}%'`;
//   // }

//   let query = "SELECT * FROM " + table;
//   console.log("query:", query);

//   sql.query(query, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("Flds_binds: ", res);
//     result(null, res);
//   });
// };

Flds_bind.getAllPublished = result => {
  sql.query("SELECT * FROM flds_binds WHERE published=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("flds_binds: ", res);
    result(null, res);
  });
};

Flds_bind.updateById = (id, flds_bind, result) => {
  return new Promise((resolve, reject) => {
    let query = `UPDATE ${TABLE_NAME} SET uid = '${flds_bind.uid}', users_id = '${flds_bind.users_id}', location_id = '${flds_bind.location_id}'
    WHERE uid = '${flds_bind.uid}' AND location_id = '${flds_bind.location_id}'`;
    // let query = `UPDATE ${TABLE_NAME} SET uid = '${flds_bind.uid}', users_id = '${flds_bind.users_id}' WHERE uid = '${id}' `;
    console.log("query:", query);
    sql.query(query,(err, res) => {
        if (err) {
            console.log("error: ", err);
            return reject(err);
            // result(null, err);
            // return;
        }

        if (res.affectedRows == 0) {
            // not found flds_bind with the id
            console.log("error: res.affectedRows == 0");
            return resolve([{ result: "not_found" }], null);
            // result({ result: "not_found" }, null);
            // return;
        }

        console.log(`updated ${TABLE_NAME}: `, { ...flds_bind });
        return resolve({ ...flds_bind });
        // result(null, { ...flds_bind });
        });
  });
};

Flds_bind.remove = (params, result) => {
  return new Promise((resolve, reject) => {
    // console.log("flds_bind.remove uid: ", id);
    // sql.query("DELETE FROM flds_binds WHERE uid = ?", id , (err, res) => {
    // let query = `DELETE FROM flds_binds WHERE uid = '${id}'`;
    // console.log("query:", query);

    console.log("params:", params);
    let query = `DELETE FROM ${TABLE_NAME} WHERE uid = '${params.uid}' AND location_id = '${params.location_id}'`;
    console.log("query:", query);

    sql.query(query,(err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found flds_bind with the id
        return resolve([{ result: "not_found" }], null);
      }
      return resolve([{ result: "deleted ${TABLE_NAME} with uid: " + params.uid +" & location_id: " + params.location_id  }], null);
      // console.log("deleted flds_binds with id: ", id);
      // result(null, res);
    });
  });
};

Flds_bind.removeAll = result => {
  sql.query("DELETE FROM ${TABLE_NAME}", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} ${TABLE_NAME}`);
    result(null, res);
  });
};



Flds_bind.truncate = (params, result) => {
  return new Promise((resolve, reject) => {
    // console.log("flds_bind.remove uid: ", id);
    // sql.query("DELETE FROM flds_binds WHERE uid = ?", id , (err, res) => {
    // let query = `DELETE FROM flds_binds WHERE uid = '${id}'`;
    // console.log("query:", query);

    console.log("params:", params);
    // let query = `DELETE FROM flds_binds WHERE uid = '${params.uid}' AND location_id = '${params.location_id}'`;
    let query = `TRUNCATE TABLE ${TABLE_NAME} `;
    console.log("query:", query);

    sql.query(query,(err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      // if (res.affectedRows == 0) {
      //   // not found flds_bind with the id
      //   return resolve([{ result: "not_found" }], null);
      // }
      console.log(res);
      let msgret = {
        code: 200,
        msg: `TRUNCATE TABLE ${TABLE_NAME} successfully..`
        // data: data
      };
      // res.json(msgret);

      return resolve(msgret, null);
      // console.log("deleted flds_binds with id: ", id);
      // result(null, res);
    });
  });
};

module.exports = Flds_bind;
