'use strict';
import sql  from "./db.js";
// const sql = require("./db.js");
// const TABLE_NAME = 'products';
// constructor
class Product {
  constructor(product) {
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
  }
  static create(newproduct, TABLE_NAME) {
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
  }
  static replace(newproduct, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // sql.query(`REPLACE INTO ${TABLE_NAME} SET ?`, newproduct, (err, res) => {
      let query = `REPLACE INTO ${TABLE_NAME} SET ?`;
      console.log("query:", query);
      sql.query(query, newproduct, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  static findById(id, TABLE_NAME, result) {
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
          return resolve(res);
        }
        return resolve(res);
        // return resolve({ result: "not_found" }, null);
      });
    });
  }
  static findByOrders(id, TABLE_NAME) {
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
  }
  // Find來源單號列表
  static findByOrdersName(id, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let query = ("SELECT * FROM products WHERE uid = " + id);
      // let query = `SELECT order_no FROM ${TABLE_NAME}  GROUP BY order_no`;
      let query = `SELECT order_no FROM ${TABLE_NAME}  GROUP BY order_no`;
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
        console.log({ result: "not_found" });
        return resolve(res);

        // return resolve([{ result: "not_found" }], null);
      });
    });
  }
  static findByPn(id, TABLE_NAME, result) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      // let query = `SELECT * FROM ${TABLE_NAME} WHERE product_no LIKE '%${id}%'`;
      let query = `SELECT * FROM ${TABLE_NAME} WHERE product_no LIKE '${id}%'`;
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
  static findByLocation_id(id, result) {
    return new Promise((resolve, reject) => {
      // let query = ("SELECT * FROM products WHERE uid = " + id);
      // let query = `SELECT warehouse_type, storage_location FROM products WHERE uid = '${id}'`;
      // let query = `SELECT warehouse_type, storage_location FROM products WHERE uid = '${id}' `;
      // let query = `SELECT * FROM products WHERE uid = '${id}' `;
      // let query = `SELECT warehouse_type, storage_location FROM products LEFT JOIN location_tables ON location_tables.warehouse_type = products.warehouse_type WHERE uid = '${id}' `;
      // let query = `SELECT DISTINCT products.warehouse_type, products.storage_location, location_tables.luid,location_tables.warehouse_type, location_tables.storage_location,
      // location_tables.epc FROM products JOIN  location_tables ON products.warehouse_type = location_tables.warehouse_type AND products.storage_location = location_tables.storage_location; `;
      let Flds_comp = global.userConfig.flds_comp;
      const TABLE_NAME = Flds_comp + '.rfid_ui_flds_a';
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
        return resolve(res);
        // return resolve({ result: "not_found" }, null);
      });
    });
  }
  static findByLocationID(params, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      // let query = `SELECT ${TABLE_NAME}.warehouse_type, ${TABLE_NAME}.storage_location, location_tables.luid,location_tables.warehouse_type, location_tables.storage_location,
      // location_tables.epc FROM ${TABLE_NAME} JOIN  location_tables ON ${TABLE_NAME}.warehouse_type = location_tables.warehouse_type AND ${TABLE_NAME}.storage_location = location_tables.storage_location
      // WHERE uid = '${id}'`;
      console.log("params:", params);

      let query = `SELECT * FROM  ${TABLE_NAME}  WHERE location_id = '${params.luid}'`;

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
  static getAll(table, result) {
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
  }
  static findSearch(TABLE_NAME, params) {
    return new Promise((resolve, reject) => {
      console.log("params:", params);
      // let query = `SELECT * FROM ${TABLE_NAME}  WHERE 1 `;
      let query = `SELECT * FROM ${TABLE_NAME} WHERE 1 `;

      // 檢查參數長度Object.keys(params).length
      // console.log("query:", query, params, Object.keys(params).length);
      if (params.uid) {
        query = query + `AND ${TABLE_NAME}.uid LIKE '${params.uid}%' `;
        console.log("params.uid:", params.uid);
      };

      if (params.warehouse_type) {
        query = query + `AND ${TABLE_NAME}.warehouse_type LIKE '${params.warehouse_type}%' `;
        console.log("params.warehouse_type:", params.warehouse_type);
      };

      if (params.storage_location) {
        query = query + `AND ${TABLE_NAME}.storage_location LIKE '${params.storage_location}%' `;
        console.log("params.storage_location:", params.storage_location);
      };

      if (params.product_no) {
        query = query + `AND ${TABLE_NAME}.product_no LIKE '${params.product_no}%' `;
        console.log("params.product_no:", params.product_no);
      };

      if (params.lot_no) {
        query = query + `AND ${TABLE_NAME}.lot_no LIKE '${params.lot_no}%' `;
        console.log("params.lot_no:", params.lot_no);
      };

      if (params.order_no) {
        query = query + `AND ${TABLE_NAME}.order_no LIKE '${params.order_no}%' `;
        console.log("params.order_no:", params.order_no);
      };

      if (params.location_id) {
        query = query + `AND ${TABLE_NAME}.location_id LIKE '${params.location_id}%' `;
        console.log("params.location_id:", params.location_id);
      };

      if (params.limit) {
        query = query + `LIMIT ${params.limit} `;
        console.log("params.limit:", params.limit);
      };

      if (params.offset) {
        query = query + `OFFSET ${params.offset} `;
        console.log("params.offset:", params.offset);
      };

      // 依據 uid 排序
      // query = query + `ORDER BY ${TABLE_NAME}.uid LIMIT 100 OFFSET 0 `;
      // query = query + `ORDER BY ${TABLE_NAME}.uid LIMIT 0, 100 `;
      // query = query + ` LIMIT 3, 2 `;
      // 依據 資料庫順序取 100筆
      // query = query + ` LIMIT 100 OFFSET 0 `;
      console.log("query: %s", query);
      sql.query(query, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
      // return resolve(query);
    });
  }
  static QryPnStock(TABLE_NAME, params) {
    return new Promise((resolve, reject) => {
      console.log("params:", params);
      // let query = `SELECT * FROM ${TABLE_NAME}  WHERE 1 `;
      let query = `SELECT * FROM ${TABLE_NAME} WHERE 1 `;

      // 檢查參數長度Object.keys(params).length
      // console.log("query:", query, params, Object.keys(params).length);
      if (params.pn) {
        query = query + `AND ${TABLE_NAME}.product_no LIKE '${params.pn}%' `;
        console.log("params.pn:", params.pn);
      };

      // if(params.lot_no)
      // {
      //   query = query + `AND ${TABLE_NAME}.lot_no LIKE '${params.lot_no}%' `;
      //   console.log("params.lot_no:", params.lot_no);
      // };
      if (params.ku1) {
        query = query + `AND ${TABLE_NAME}.warehouse_type >= '${params.ku1}' `;
        console.log("params.ku1:", params.ku1);
      };

      if (params.ku2) {
        query = query + `AND ${TABLE_NAME}.warehouse_type <= '${params.ku2}' `;
        console.log("params.ku2:", params.ku2);
      };

      // if(params.storage_location)
      // {
      //   query = query + `AND ${TABLE_NAME}.storage_location LIKE '${params.storage_location}%' `;
      //   console.log("params.storage_location:", params.storage_location);
      // };
      if (params.limit) {
        query = query + `LIMIT ${params.limit} `;
        console.log("params.limit:", params.limit);
      };

      if (params.offset) {
        query = query + `OFFSET ${params.offset} `;
        console.log("params.offset:", params.offset);
      };

      // 依據 uid 排序
      // query = query + `ORDER BY ${TABLE_NAME}.uid LIMIT 100 OFFSET 0 `;
      // query = query + `ORDER BY ${TABLE_NAME}.uid LIMIT 0, 100 `;
      // query = query + ` LIMIT 3, 2 `;
      // 依據 資料庫順序取 100筆
      // query = query + ` LIMIT 100 OFFSET 0 `;
      console.log("query: %s", query);
      sql.query(query, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
      // return resolve(query);
    });
  }
  static QryKuStock(TABLE_NAME, params) {
    return new Promise((resolve, reject) => {
      console.log("params:", params);
      // let query = `SELECT * FROM ${TABLE_NAME}  WHERE 1 `;
      let query = `SELECT * FROM ${TABLE_NAME} WHERE 1 `;

      // 檢查參數長度Object.keys(params).length
      // console.log("query:", query, params, Object.keys(params).length);
      if (params.ku) {
        query = query + `AND ${TABLE_NAME}.warehouse_type = '${params.ku}' `;
        console.log("params.ku:", params.ku);
      };

      if (params.tw1) {
        query = query + `AND ${TABLE_NAME}.storage_location >= '${params.tw1}' `;
        console.log("params.tw1:", params.tw1);
      };

      if (params.tw2) {
        query = query + `AND ${TABLE_NAME}.storage_location <= '${params.tw2}' `;
        console.log("params.tw2:", params.tw2);
      };

      if (params.limit) {
        query = query + `LIMIT ${params.limit} `;
        console.log("params.limit:", params.limit);
      };

      if (params.offset) {
        query = query + `OFFSET ${params.offset} `;
        console.log("params.offset:", params.offset);
      };

      // 依據 uid 排序
      // query = query + `ORDER BY ${TABLE_NAME}.uid LIMIT 100 OFFSET 0 `;
      // query = query + `ORDER BY ${TABLE_NAME}.uid LIMIT 0, 100 `;
      // query = query + ` LIMIT 3, 2 `;
      // 依據 資料庫順序取 100筆
      // query = query + ` LIMIT 100 OFFSET 0 `;
      console.log("query: %s", query);
      sql.query(query, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
      // return resolve(query);
    });
  }
  static unbound(TABLE_NAME, Flds_comp) {
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
  }
  static bind_flds_abc(TABLE_NAME, params) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      // let query = `SELECT ${TABLE_NAME}.*, ${Flds_comp}.rfid_in_flds_b.location_id FROM ${TABLE_NAME}
      // LEFT JOIN ${Flds_comp}.rfid_in_flds_b
      // ON ${TABLE_NAME}.uid = ${Flds_comp}.rfid_in_flds_b.uid`;
      // let query = `SELECT *  FROM ${TABLE_NAME}  WHERE location_id IS NOT NULL`;
      // let query = `SELECT *  FROM ${TABLE_NAME}  WHERE location_id = params.location_id`;
      let query = `SELECT * FROM ${TABLE_NAME} WHERE 1 `;
      if (params.order_no) {
        query = query + `AND ${TABLE_NAME}.order_no LIKE '${params.order_no}%' `;
        console.log("params.order_no:", params.order_no);
      };

      // query =  query + `AND ${TABLE_NAME}.order_no LIKE '${isNullOrUndefined(params.location_id) ? '' :params.location_id}%' `;
      // if(params.location_id)
      // {
      //   query = query + `AND ${TABLE_NAME}.location_id LIKE '${params.location_id}%' `;
      //   console.log("params.location_id:", params.location_id);
      // };
      console.log("bind_flds_abc  query:", query);
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  static bind_flds_ab(TABLE_NAME, Flds_comp) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      // let query = `SELECT ${TABLE_NAME}.*, ${Flds_comp}.rfid_in_flds_b.location_id FROM ${TABLE_NAME}
      // LEFT JOIN ${Flds_comp}.rfid_in_flds_b
      // ON ${TABLE_NAME}.uid = ${Flds_comp}.rfid_in_flds_b.uid`;
      // let query = `SELECT *  FROM ${TABLE_NAME}  WHERE location_id IS NOT NULL`;
      let query = `SELECT *  FROM ${TABLE_NAME}  WHERE location_id != ""`;
      console.log("bind_flds_ab  query:", query);
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  static unbound_flds_ab(TABLE_NAME, params) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      // let query = `SELECT ${TABLE_NAME}.*, ${Flds_comp}.rfid_in_flds_b.location_id FROM ${TABLE_NAME}
      // LEFT JOIN ${Flds_comp}.rfid_in_flds_b
      // ON ${TABLE_NAME}.uid = ${Flds_comp}.rfid_in_flds_b.uid`;
      // let query = `SELECT *  FROM ${TABLE_NAME}  WHERE location_id IS NOT NULL`;
      let query = `SELECT *  FROM ${TABLE_NAME}  WHERE location_id = "" `;
      if (params.order_no) {
        query = query + `AND ${TABLE_NAME}.order_no LIKE '${params.order_no}%' `;
        console.log("params.order_no:", params.order_no);
      };
      console.log("unbound_flds_ab  query:", query);
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
  static updateById(id, product, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      let query = `UPDATE ${TABLE_NAME} SET ?  WHERE uid = '${id}'`;
      console.log("query:", query);
      sql.query(query, product, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found product with the id
          console.log("error: res.affectedRows == 0");
          return resolve([]);
          // return resolve({ result: "not_found" });
        }
        // 統一格式 return array
        return resolve([[product]]);
      }
      );
    });
  }
  static updateByParams(params, product, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      // let query = `UPDATE ${TABLE_NAME} SET ?  WHERE uid = '${product.uid}'`;
      // let query = `UPDATE ${TABLE_NAME} SET ?  WHERE ${TABLE_NAME}.uid = '${product.uid}' AND  ${TABLE_NAME}.order_no = '${product.order_no}'`;
      // console.log("query:", query);
      let query = `UPDATE ${TABLE_NAME} SET ?  WHERE ${TABLE_NAME}.uid = '${params.uid}' `;
      if (params.order_no) {
        query = query + `AND ${TABLE_NAME}.order_no = '${params.order_no}' `;
        console.log("params.order_no:", params.order_no);
      };
      console.log("query:", query);
      // delete product.uid;
      // delete product.order_no;
      // console.log(product);
      sql.query(query, product, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found product with the id
          console.log("error: res.affectedRows == 0");
          return resolve([]);
          // return resolve({ result: "not_found" });
        }
        // console.log(res);
        // return resolve(res);
        // 統一格式 return array
        // console.log([[product]]);
        return resolve([[product]]);
      }
      );
    });
  }
  static updateById_old(id, product, TABLE_NAME) {
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
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found product with the id
          console.log("error: res.affectedRows == 0");
          return resolve({ result: "not_found" });
        }

        return resolve(product);
      }
      );
    });
  }
  static updateById_flds_b(id, product, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let query = `UPDATE ${TABLE_NAME} SET users_id = '${product.users_id}', location_id = '${product.location_id}',
      // stamp1 = '${product.stamp1}' WHERE uid = '${id}'`;
      // let query = `UPDATE ${TABLE_NAME} SET
      //             users_id = '${product.users_id}', location_id = '${product.location_id}',
      //             stamp1 = '${product.stamp1}' WHERE uid = '${id}'`;
      let query = `UPDATE ${TABLE_NAME} SET ?  WHERE uid = '${id}'`;
      console.log("query:", query);
      sql.query(query, product, (err, res) => {
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
  }
  static removeParams(params, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      // let query = `DELETE FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.uid = '${params.uid}' AND  ${TABLE_NAME}.order_no = '${params.order_no}'`;
      // let query = `DELETE FROM ${TABLE_NAME} WHERE 1 `;
      let query = `DELETE FROM ${TABLE_NAME} `;
      if (params.uid) {
        query = query + `WHERE ${TABLE_NAME}.uid = '${params.uid}' `;
        console.log("params.uid:", params.uid);
        if (params.order_no) {
          query = query + `AND ${TABLE_NAME}.order_no = '${params.order_no}' `;
          console.log("params.order_no:", params.order_no);
        };
      }

      else {
        if (params.order_no) {
          query = query + `WHERE ${TABLE_NAME}.order_no = '${params.order_no}' `;
          console.log("params.order_no:", params.order_no);
        };
      }

      // let query = `DELETE FROM ${TABLE_NAME} WHERE ${isNullOrUndefined(params.uid)} ? '' : ${TABLE_NAME}.uid = '${params.uid}' AND  ${TABLE_NAME}.order_no = '${params.order_no}'`;
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
          // return resolve({ result: "not_found" });
          // not found product with the id
          // result({ result: "not_found" }, null);
          // return;
        }
        console.log("deleted res: ", res);
        return resolve([params]);
        // console.log("deleted product with id: ", id);
        // result(null, res);
      });
    });
  }
  static remove(id, TABLE_NAME) {
    return new Promise((resolve, reject) => {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      let query = `DELETE FROM ${TABLE_NAME} WHERE uid = '${id}'`;
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
          // return resolve({ result: "not_found" });
          // not found product with the id
          // result({ result: "not_found" }, null);
          // return;
        }
        return resolve([res]);
        // console.log("deleted product with id: ", id);
        // result(null, res);
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
        console.log(`deleted ${res.affectedRows} products`);
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

        console.log(`Truncate ${res.affectedRows} products`);
        return resolve(res);
        // result(null, res);
      });
    });
  }
}

export default Product;
