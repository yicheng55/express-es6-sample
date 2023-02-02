'use strict';
const sql = require("./db.js");
// const TABLE_NAME = 'products';
// constructor
const Product = function(product) {
  this.flds_comp = product.flds_comp;
  this.order_no = product.order_no;
  this.serial_no = product.serial_no;

  this.warehouse_type = product.warehouse_type;
  this.storage_location = product.storage_location;
  this.lot_no = product.lot_no;

  this.product_no = product.product_no;
  this.product_name = product.product_name;
  this.specification = product.specification;

  this.quantity = product.quantity;
  this.unit = product.unit;
  this.packing_quantity = product.packing_quantity;

  this.packing_unit = product.packing_unit;
  this.attribute1 = product.attribute1;
  this.attribute2 = product.attribute2;

  this.attribute3 = product.attribute3;
  this.attribute4 = product.attribute4;
  this.attribute5 = product.attribute5;
};

Product.create = (newproduct, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    // sql.query("INSERT INTO products SET ?", newproduct, (err, res) => {
    let query = `INSERT INTO ${TABLE_NAME} SET ?`;
    console.log("query:", query);
    sql.query(query, newproduct, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      // console.log(res)
      // console.log("created product: ", { ...newproduct });
      return resolve({ newproduct });
      // result(null, { id: res.insertId, ...newproduct });
    });
  });
};

Product.findById = (id, TABLE_NAME, result) => {
  return new Promise((resolve, reject) => {
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    // let query = ("SELECT * FROM products WHERE uid = " + id);
    let query = `SELECT * FROM ${TABLE_NAME} WHERE uid = '${id}'`;
    console.log("query:", query);

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        // console.log("found product: ", res[0]);
        return resolve(res[0]);
      }

      return resolve({ result: "not_found" }, null);
    });
  });
};

Product.findByPn = (id, TABLE_NAME, result) => {
  return new Promise((resolve, reject) => {
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';

    let query = `SELECT * FROM ${TABLE_NAME} WHERE product_no LIKE '%${id}%'`;
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

      return resolve({ result: "not_found" }, null);
    });
  });
};


Product.findByLocation_id = (id, result) => {
  return new Promise((resolve, reject) => {
    // let query = ("SELECT * FROM products WHERE uid = " + id);
    // let query = `SELECT warehouse_type, storage_location FROM products WHERE uid = '${id}'`;
    // let query = `SELECT warehouse_type, storage_location FROM products WHERE uid = '${id}' `;
    // let query = `SELECT * FROM products WHERE uid = '${id}' `;
    // let query = `SELECT warehouse_type, storage_location FROM products LEFT JOIN location_tables ON location_tables.warehouse_type = products.warehouse_type WHERE uid = '${id}' `;
    // let query = `SELECT DISTINCT products.warehouse_type, products.storage_location, location_tables.luid,location_tables.warehouse_type, location_tables.storage_location,
    // location_tables.epc FROM products JOIN  location_tables ON products.warehouse_type = location_tables.warehouse_type AND products.storage_location = location_tables.storage_location; `;

    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    let query = `SELECT ${TABLE_NAME}.warehouse_type, ${TABLE_NAME}.storage_location, location_tables.luid,location_tables.warehouse_type, location_tables.storage_location,
    location_tables.epc FROM ${TABLE_NAME} JOIN  location_tables ON ${TABLE_NAME}.warehouse_type = location_tables.warehouse_type AND ${TABLE_NAME}.storage_location = location_tables.storage_location
    WHERE uid = '${id}'`;

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

      return resolve({ result: "not_found" }, null);
    });
  });
};



Product.getAll = (table, result) => {
  return new Promise((resolve, reject) => {

    let query = "SELECT * FROM " + table;
    console.log("query:", query);

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        // result(null, err);
        return reject(err);
      }
      // console.log("products: ", res);
      // result(null, res);
      return resolve(res);
    });
  });
};


Product.unbound = (TABLE_NAME, Flds_comp) => {
  return new Promise((resolve, reject) => {
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    let query = `SELECT ${TABLE_NAME}.*, ${Flds_comp}.rfid_in_flds_b.location_id FROM ${TABLE_NAME}
    LEFT JOIN ${Flds_comp}.rfid_in_flds_b
    ON ${TABLE_NAME}.uid = ${Flds_comp}.rfid_in_flds_b.uid`;
    console.log("unbound  query:", query);
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
      return resolve(res);
    });
  });
};


// Product.getAll = (table, result) => {
//   // let query = "SELECT * FROM products";

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

//     console.log("products: ", res);
//     result(null, res);
//   });
// };

// Product.getAllPublished = result => {
//   sql.query("SELECT * FROM products WHERE published=true", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("products: ", res);
//     result(null, res);
//   });
// };

Product.updateById = (id, product, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';

    let query = `UPDATE ${TABLE_NAME} SET flds_comp = '${product.flds_comp}', order_no = '${product.order_no}', serial_no = '${product.serial_no}',
    warehouse_type = '${product.warehouse_type}', storage_location = '${product.storage_location}', lot_no = '${product.lot_no}',
    product_no = '${product.product_no}', product_name = '${product.product_name}', specification = '${product.specification}',
    quantity = '${product.quantity}',ui_quantity = '${product.ui_quantity}', unit = '${product.unit}', packing_quantity = '${product.packing_quantity}',
    packing_unit = '${product.packing_unit}', attribute1 = '${product.attribute1}', attribute2 = '${product.attribute2}',
    attribute3 = '${product.attribute3}', attribute4 = '${product.attribute4}', attribute5 = '${product.attribute5}', ui_check_state = '${product.ui_check_state}'
    WHERE uid = '${id}'`;
    console.log("query:", query);
    sql.query(query,(err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found product with the id
          console.log("error: res.affectedRows == 0");
          return resolve({ result: "not_found" });
          // result({ result: "not_found" }, null);
          // return;
        }

        // console.log("updated product: " + product );
        // console.log(res);
        return resolve(product);
        // result(null, {...product });
        // result(null, { id: id, ...product });

      }
    );
  });
};

Product.remove = (id, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    let query = `DELETE FROM ${TABLE_NAME} WHERE uid = '${id}'`;
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
          return resolve({ result: "not_found" });
        // not found product with the id
        // result({ result: "not_found" }, null);
        // return;
      }
      return resolve(res);
      // console.log("deleted product with id: ", id);
      // result(null, res);
    });
  });


  // // console.log("Product.remove uid: ", id);
  // // sql.query("DELETE FROM products WHERE uid = ?", id , (err, res) => {
  // let Flds_comp = global.userConfig.flds_comp;
  // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
  // let query = `DELETE FROM ${TABLE_NAME} WHERE uid = '${id}'`;
  // console.log("query:", query);
  // sql.query(query,(err, res) => {
  //   if (err) {
  //     console.log("error: ", err);
  //     result(null, err);
  //     return;
  //   }

  //   if (res.affectedRows == 0) {
  //     // not found product with the id
  //     result({ result: "not_found" }, null);
  //     return;
  //   }

  //   console.log("deleted product with id: ", id);
  //   result(null, res);
  // });
};

Product.removeAll = (TABLE_NAME) => {
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

Product.truncate = (table, result) => {
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

module.exports = Product;
