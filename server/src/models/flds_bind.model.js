'use strict';
const sql = require("./db.js");

// constructor
const Flds_bind = function(flds_bind) {
  this.uid = flds_bind.uid;
  this.users_id = flds_bind.users_id;
  this.location_id = flds_bind.location_id;
};

Flds_bind.create = (newflds_bind, result) => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO flds_binds SET ?", newflds_bind, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log(res)
      console.log("created flds_binds: ", { ...newflds_bind });
      return resolve({ ...newflds_bind });
    });
  });
};

Flds_bind.findById = (params, result) => {
  return new Promise((resolve, reject) => {
    // let query = ("SELECT * FROM flds_binds WHERE uid = " + id);
    let query = `SELECT * FROM flds_binds WHERE uid = '${params.uid}' AND location_id = '${params.location_id}'`;
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
    // let query = ("SELECT * FROM flds_binds WHERE uid = " + id);
    let query = `SELECT * FROM flds_binds WHERE uid = '${data.uid}'`;
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
    // let query = ("SELECT * FROM flds_binds WHERE uid = " + id);
    let query = `SELECT * FROM flds_binds WHERE location_id = '${data.location_id}'`;
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
    let query = `UPDATE flds_binds SET uid = '${flds_bind.uid}', users_id = '${flds_bind.users_id}', location_id = '${flds_bind.location_id}'
    WHERE uid = '${flds_bind.uid}' AND location_id = '${flds_bind.location_id}'`;
    // let query = `UPDATE flds_binds SET uid = '${flds_bind.uid}', users_id = '${flds_bind.users_id}' WHERE uid = '${id}' `;
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
            return resolve({ result: "not_found" }, null);
            // result({ result: "not_found" }, null);
            // return;
        }

        console.log("updated flds_binds: ", { ...flds_bind });
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
    let query = `DELETE FROM flds_binds WHERE uid = '${params.uid}' AND location_id = '${params.location_id}'`;
    console.log("query:", query);

    sql.query(query,(err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found flds_bind with the id
        return resolve({ result: "not_found" }, null);
      }
      return resolve({ result: "deleted flds_binds with uid: " + params.uid +" & location_id: " + params.location_id  }, null);
      // console.log("deleted flds_binds with id: ", id);
      // result(null, res);
    });
  });
};

Flds_bind.removeAll = result => {
  sql.query("DELETE FROM flds_binds", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} flds_binds`);
    result(null, res);
  });
};

module.exports = Flds_bind;
