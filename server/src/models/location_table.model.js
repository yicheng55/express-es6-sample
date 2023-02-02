'use strict';
const sql = require("./db.js");
const { isNullOrUndefined } = require('url/util.js');
// const TABLE_NAME = 'location_tables';
// constructor
const Location = function(location) {
  this.luid = location.luid;
  this.warehouse_type = location.warehouse_type;
  this.storage_location = location.storage_location;
  this.epc = location.epc;
  this.name = location.name;
  this.check_state = location.check_state;
  this.description = location.description;
};

Location.create = (newlocation, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // sql.query("INSERT INTO location_tables SET ?", newlocation, (err, res) => {
    let query = `INSERT INTO ${TABLE_NAME} SET ?`;
    console.log("query:", query);
    sql.query(query, newlocation, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log(res)
      console.log("created location_tables: ", { ...newlocation });
      return resolve({ ...newlocation });
    });
  });
};

Location.findById = (id, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let query = ("SELECT * FROM locations WHERE uid = " + id);
    let query = `SELECT * FROM ${TABLE_NAME} WHERE luid = '${id}'`;
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
};


// 庫別+儲位 搜尋明細
Location.findByLocation = (params, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // console.log("table:", table);
    // let query = ("SELECT * FROM locations WHERE uid = " + id);
    let query = `SELECT * FROM ${TABLE_NAME} WHERE warehouse_type = '${params.warehouse_type}' AND storage_location = '${params.storage_location}'`;
    console.log("query:", query);

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        // console.log("found location: ", res[0]);
        return resolve(res);
        // let msgret = {
        //   code: 200,
        //   msg: `Find warehouse_type&storage_location successfully!`,
        //   data: res[0]
        // };
        // return resolve(msgret);
      }
      return resolve(res);

      // return resolve({ result: "not_found" }, null);
      // let msgret = {
      //   code: 500,
      //   msg: `Not found warehouse_type&storage_location: ${params.storage_location}`,
      //   // data: null
      // };
      // return resolve(msgret);
    });
  });
};

Location.findByEpc = (params, TABLE_NAME) => {
  return new Promise((resolve, reject) => {


    // let query = ("SELECT * FROM locations WHERE uid = " + id);
    let query = `SELECT * FROM ${TABLE_NAME} WHERE epc = '${params.epc}'`;
    console.log("query:", query);

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        // console.log("found location: ", res[0]);
        return resolve(res);
        // let msgret = {
        //   code: 200,
        //   msg: `Find EPC successfully!`,
        //   data: res[0]
        // };
        // return resolve(msgret);
      }
      // console.log(res, { result: "not_found" });
      return resolve(res);
      // return resolve({ result: "not_found" }, null);
      // let msgret = {
      //   code: 500,
      //   msg: `Not found epc: ${params.epc}`
      //   // data: data
      // };
      // return resolve(msgret, null);
    });
  });
};

Location.getAll = (TABLE_NAME, result) => {
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

Location.findSearch = (TABLE_NAME, params) => {
  return new Promise((resolve, reject) => {
    console.log("params:", params);
    // let query = `SELECT * FROM ${TABLE_NAME}  WHERE 1 `;
    let query = `SELECT * FROM ${TABLE_NAME} WHERE 1 `;

    // 檢查參數長度Object.keys(params).length
    // console.log("query:", query, params, Object.keys(params).length);

    if(params.warehouse_type)
    {
      query = query + `AND warehouse_type LIKE '${params.warehouse_type}%' `;
      console.log("params.warehouse_type:", params.warehouse_type);
    };

    if(params.storage_location)
    {
      query = query + `AND storage_location LIKE '${params.storage_location}%' `;
      console.log("params.storage_location:", params.storage_location);
    };

    query = query + `ORDER BY ${TABLE_NAME}.luid LIMIT 100 OFFSET 0 `;
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


Location.updateById = (id, location, TABLE_NAME) => {
  return new Promise((resolve, reject) => {

    let query = `UPDATE ${TABLE_NAME} SET ?  WHERE luid = '${id}'`;
    console.log("query:", query);
    sql.query(query, location, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found product with the id
          console.log("error: res.affectedRows == 0");
          return resolve([]);
        }

        return resolve([location]);
      }
    );

  // let query = `UPDATE ${TABLE_NAME} SET warehouse_type = '${location.warehouse_type}', storage_location = '${location.storage_location}', epc = '${location.epc}',
  // name = '${location.name}', description = '${location.description}'
  // WHERE luid = '${id}'`;
  // console.log("query:", query);
  // sql.query(query,(err, res) => {
  //     if (err) {
  //       console.log("error: ", err);
  //       result(null, err);
  //       return;
  //     }

  //     if (res.affectedRows == 0) {
  //       // not found location with the id
  //       console.log("error: res.affectedRows == 0");
  //       result({ result: "not_found" }, null);
  //       return;
  //     }

  //     console.log("updated location_tables: ", { ...location });
  //     result(null, { ...location });
  //   }
  // );
  });
};



Location.remove = (id, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    let query = `DELETE FROM ${TABLE_NAME} WHERE luid = '${id}'`;
    console.log("query:", query);
    sql.query(query,(err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
        // result(null, err);
        // return;
      }

      if (res.affectedRows == 0) {
          console.log("error: res.affectedRows == 0");
          return resolve([]);
          // return resolve({ result: "not_found" });
        // not found product with the id
        // result({ result: "not_found" }, null);
        // return;
      }
      return resolve(res);
      // console.log("deleted product with id: ", id);
      // result(null, res);
    });
  });

};

Location.removeAll = (TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    let query = `DELETE FROM ${TABLE_NAME} `;
    console.log("query:", query);
    sql.query(query,(err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
      console.log(`deleted ${res.affectedRows} products`);
      return resolve(res);
    });
  });
};

Location.truncate = (table, result) => {
  return new Promise((resolve, reject) => {
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    let query = `TRUNCATE TABLE  ${table} `;
    console.log("query:", query);
    sql.query(query,(err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject({result: 'error: ' + err});
        // result(null, err);
        // return;
      }

      console.log(`Truncate ${res.affectedRows} products`);
      return resolve(res);
      // result(null, res);
    });
  });
};


// Location.remove = (id, result) => {
//   // console.log("location.remove uid: ", id);
//   // sql.query("DELETE FROM locations WHERE uid = ?", id , (err, res) => {
//   let query = `DELETE FROM ${TABLE_NAME} WHERE luid = '${id}'`;
//   console.log("query:", query);
//   sql.query(query,(err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found location with the id
//       result({ result: "not_found" }, null);
//       return;
//     }

//     console.log("deleted location_tables with id: ", id);
//     result(null, res);
//   });
// };

// Location.removeAll = result => {
//   // sql.query("DELETE FROM location_tables", (err, res) => {
//   let query = `DELETE FROM ${TABLE_NAME} `;
//   console.log("query:", query);
//   sql.query(query,(err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log(`deleted ${res.affectedRows} ${TABLE_NAME}`);
//     result(null, res);
//   });
// };

module.exports = Location;
