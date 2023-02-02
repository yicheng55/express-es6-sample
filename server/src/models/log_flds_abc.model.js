'use strict';
const sql = require("./db.js");
// const TABLE_NAME = 'products';
const TABLE_NAME = 'log_flds_abc';

// constructor
const Product = function(product) {
  this.uid = product.uid;
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


Product.findById = (id, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
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
        return resolve(res);
      }

      return resolve({ result: "not_found" }, null);
    });
  });
};


Product.findByOrders = (id, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let query = ("SELECT * FROM products WHERE uid = " + id);
    let query = `SELECT * FROM ${TABLE_NAME} WHERE order_no = '${id}'`;
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
      // return resolve([{ result: "not_found" }], null);
    });
  });
};

Product.findByLocation_id = (id, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let query = ("SELECT * FROM products WHERE uid = " + id);
    // let query = `SELECT warehouse_type, storage_location FROM products WHERE uid = '${id}'`;
    // let query = `SELECT warehouse_type, storage_location FROM products WHERE uid = '${id}' `;
    // let query = `SELECT * FROM products WHERE uid = '${id}' `;
    // let query = `SELECT warehouse_type, storage_location FROM products LEFT JOIN location_tables ON location_tables.warehouse_type = products.warehouse_type WHERE uid = '${id}' `;
    // let query = `SELECT DISTINCT products.warehouse_type, products.storage_location, location_tables.luid,location_tables.warehouse_type, location_tables.storage_location,
    // location_tables.epc FROM products JOIN  location_tables ON products.warehouse_type = location_tables.warehouse_type AND products.storage_location = location_tables.storage_location; `;
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



Product.getAll = (table, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let query = "SELECT * FROM " + table;
    let query = `SELECT * FROM ${TABLE_NAME}`;
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


Product.unbound = (table, TABLE_NAME) => {
  return new Promise((resolve, reject) => {
    // let query = `SELECT products.uid, flds_binds.uid, flds_binds.location_id FROM products
    // LEFT JOIN flds_binds
    // ON products.uid = flds_binds.uid`;
    let query = `SELECT ${TABLE_NAME}.*, rfid_in_flds_b.location_id FROM ${TABLE_NAME}
    LEFT JOIN rfid_in_flds_b
    ON ${TABLE_NAME}.uid = rfid_in_flds_b.uid`;
    console.log("query:", query);

    // let query = "SELECT * FROM " + table;
    // console.log("query:", query);

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

Product.updateById = (id, product, result) => {
  let query = `UPDATE ${TABLE_NAME} SET flds_comp = '${product.flds_comp}', order_no = '${product.order_no}', serial_no = '${product.serial_no}',
  warehouse_type = '${product.warehouse_type}', storage_location = '${product.storage_location}', lot_no = '${product.lot_no}',
  product_no = '${product.product_no}', product_name = '${product.product_name}', specification = '${product.specification}' ,
  quantity = '${product.quantity}', unit = '${product.unit}', packing_quantity = '${product.packing_quantity}' ,
  packing_unit = '${product.packing_unit}', attribute1 = '${product.attribute1}', attribute2 = '${product.attribute2}' ,
  attribute3 = '${product.attribute3}', attribute4 = '${product.attribute4}', attribute5 = '${product.attribute5}'
  WHERE uid = '${id}'`;
  console.log("query:", query);
  sql.query(query,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found product with the id
        console.log("error: res.affectedRows == 0");
        result({ result: "not_found" }, null);
        return;
      }

      console.log("updated product: ", { uid: id, ...product });
      result(null, {...product });
      // result(null, { id: id, ...product });

    }
  );
};

Product.remove = (id, result) => {
  // console.log("Product.remove uid: ", id);
  // sql.query("DELETE FROM products WHERE uid = ?", id , (err, res) => {
  let query = `DELETE FROM ${TABLE_NAME} WHERE uid = '${id}'`;
  console.log("query:", query);
  sql.query(query,(err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found product with the id
      result({ result: "not_found" }, null);
      return;
    }

    console.log("deleted product with id: ", id);
    result(null, res);
  });
};

Product.removeAll = result => {
  // sql.query("DELETE FROM products", (err, res) => {
  let query = `DELETE FROM ${TABLE_NAME} `;
  console.log("query:", query);
  sql.query(query,(err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} products`);
    result(null, res);
  });
};

module.exports = Product;
