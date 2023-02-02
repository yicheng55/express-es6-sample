'use strict';
import async from 'async';
import fetch from 'node-fetch';
import { isNullOrUndefined } from 'util/util.js';
// import Product, { create, getAll, findSearch, QryPnStock, QryKuStock, unbound, unbound_flds_ab, updateById_flds_b, updateByParams, removeParams, findById, findByPn, findByOrdersName, updateById, remove, removeAll } from '../models/product.model.js';
import Product from '../models/product.model.js';
// const RFID_in_flds_ab = require('../models/rfid_in_flds_ab.model.js');
// const RFID_stock_flds_a = require('../models/rfid_stock_flds_a.model.js');
// import { findByLocation, findByEpc } from '../models/location_table.model.js';
// import Flds_bind, { replace, findByuId } from '../models/rfid_in_flds_b.model.js';
// import RFID_in_flds_c, { replace as _replace } from '../models/rfid_in_flds_c.model.js';
// import { findByOrders, create as _create } from '../models/log_flds_abc.model.js';
import { Controllerlogger as Logger } from '../comm/logger.js';
// import { rfidlogger as Rfidlogger } from '../comm/logger';
// import { logErr as LogErr } from '../comm/logger';
import { join } from 'path';
import { stat as _stat, writeFileSync } from 'fs';
// import { stock_input, stock_output, sysImport } from '../models/stock_action.model.js';

// import csvToJSON from 'csvtojson';
// import { json2csv } from 'json-2-csv';
// import deepClone from '../until/deepClone.js';

// Logger.info('//*********************** product.controller.js start..... *******************// ');

// Create and Save a new Product
export const create = async function(req, res) {
  // Validate request
  console.log('create query = %s', req.query);
  console.log('create body = %s', req.body);
  console.log('create params = %s', req.params);

  if (!req.body) {
    let msgret = {
      code: 400,
      msg: `Content can not be empty!`
      // data: data
    };
    res.status(400);
    res.json(msgret);
    return ;
  }

  // console.log('req.body.order_no = %s', req.body.order_no);
  // console.log('req.body.serial_no = %s', req.body.serial_no);

  const product = new Product({
    flds_comp : req.body.flds_comp,
    order_no : req.body.order_no,
    serial_no : req.body.serial_no,

    warehouse_type : req.body.warehouse_type,
    storage_location : req.body.storage_location,
    // lot_no : req.body.lot_no === undefined ?  lot_no : null ,
    lot_no : req.body.lot_no,
    product_no : req.body.product_no,
    product_name : req.body.product_name,
    specification : req.body.specification,

    quantity : req.body.quantity,
    unit : req.body.unit,
    packing_quantity : req.body.packing_quantity,

    packing_unit : req.body.packing_unit,
    attribute1 : req.body.attribute1,
    attribute2 : req.body.attribute2,

    attribute3 : req.body.attribute3,
    attribute4 : req.body.attribute4,
    attribute5 : req.body.attribute5,

    // rfid_ui_flds_a 不使用
    // users_id : '111',
    // location_id : '',
    // stamp1 : '',

    // c_order_no : '',
    // c_serial_no : '',
    // c_quantity : '',

    // c_packing_quantity : '',
    // c_users_id : '',
    // c_stamp : '',
  });
  // console.log('product = %s', product);
  try {
    // uid = (品號,批號,庫別,儲位)組合成
    // let uidstr = req.body.product_no + ((req.body.lot_no === null) ? '' : req.body.lot_no)  + req.body.warehouse_type + req.body.storage_location;
    let uidstr = req.body.product_no + ((req.body.lot_no === null) ? '' : req.body.lot_no)  + req.body.warehouse_type + req.body.storage_location;
    product.uid = uidstr;

    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    // // 如果 req.body.ui_quantity === undefined 則預設為 0
    // product.ui_quantity = req.body.ui_quantity === undefined ?  0 : req.body.ui_quantity;
    // if( !(isNullOrUndefined(req.body.ui_check_state)) ){
    //   product.ui_check_state = 0 ;
    // }
    // product.c_warehouse_type = isNullOrUndefined(req.body.c_warehouse_type) ?  '' : req.body.c_warehouse_type;
    // product.c_storage_location = isNullOrUndefined(req.body.c_storage_location) ?  '' : req.body.c_storage_location;

    console.log('product = %s', product);

    // 如果 req.body.flds_comp === undefined 則預設為 global.userConfig.flds_comp.
    if( (isNullOrUndefined(product.flds_comp)) ){
      product.flds_comp = Flds_comp;
    }
    const result2 = await Product.create(product, TABLE_NAME);
    console.log('result2');
    console.log(result2);

    let msgret = {
      code: 200,
      msg: `product creat successfully  uid: ${product.uid}`
      // data: data
    };
    res.json(msgret);

  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      code: error.errno,
      msg: error.code,
      sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }
  // // 第二種方式同步語法
  // const promise1 = await Product.create(product);
  // console.log('promise1');
  // console.log(promise1);

  // // 查詢所有資料(含新增)
  // const promise2 = await Product.getAll('products');
  // console.log('promise2');
  // // console.log(promise2);
  // res.json(promise2);
}


// Create and Save a new Product
export const createarr = async function(req, res) {
  // Validate request
  console.log('create query = %s', req.query);
  console.log('create body = %s', req.body);
  console.log('create params = %s', req.params);

  if (!req.body) {
    let msgret = {
      code: 400,
      msg: `Content can not be empty!`
      // data: data
    };

    res.status(500);
    res.json(msgret);
    return ;
  }
  // req.body.forEach(element => {
  //     console.log(element);
  // });

  console.log( JSON.parse(JSON.stringify( req.body)));

  let msgret = {
    code: 200,
    msg: `product creat array successfully.`
    // data: data
  };

  res.json(msgret);
}


async function sequentialQueries() {
  let table = 'products';
  const promise1 = await Product.getAll(table);
  console.log('promise1');
  console.log(promise1);
  // res.json(promise1);

  table = 'activereaders';
  const promise2 = await Product.getAll(table);
  console.log('promise2');
  console.log(promise2);
  // res.json(promise2);

  table = 'activetagids';
  const promise3 = await Product.getAll(table);
  console.log('promise3');
  console.log(promise3);
  return promise3
}

// 同步功能實現 async/await/Promise .
export const findAll = async function(req, res) {
  console.log('findAll query = %s', req.query);
  console.log('findAll body = %s', req.body);
  console.log('findAll params = %s', req.params);
  let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
  // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
  console.log('table: %s', table);
  try {
    const result = await Product.getAll(table);
    console.log('result');
    console.log(result);
    let msgret = {
      code: 200,
      msg: `product  find lists.`,
      data: result
    };
    res.json(msgret);
  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      code: error.errno,
      msg: error.code
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }
}

export const findSearch = async function(req, res) {
  console.log('findSearch query = %s', req.query);
  console.log('findSearch body = %s', req.body);
  console.log('findSearch params = %s', req.params);

  // let table = 'products';
  // const promise1 = await Location.getAll(table);
  // console.log('promise1');
  // console.log(promise1);
  // // res.json(promise1);
  try {
    // table = 'location_tables';
    // let table = `${global.userConfig.flds_comp}.rfid_stock_flds_ab`;
    let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
    // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
    console.log('table: %s', table);
    const result = await Product.findSearch(table, req.query);
    console.log('result');
    console.log(result);
    // res.json(promise2);

    if(isNullOrUndefined(result[0])){
      let msgret = {
        code: 200,
        msg: `Products Not find list.`,
        // data: result
      };
      res.json(msgret);
      return ;
    }

    let msgret = {
      code: 200,
      msg: `Products findSearch successfully.`,
      data: result
    };
    res.json(msgret);

  } catch (error) {
    console.log(error);
    // console.log(result_LocationID);
    res.status(500);
    let msgret = {
      code: 500,
      msg: 'Products findSearch error.',
      // sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }

}


export const QryStock = async function(req, res) {
  console.log('findSearch/QryStock query = %s', req.query);
  console.log('findSearch/QryStock body = %s', req.body);
  console.log('findSearch/QryStock params = %s', req.params);

  // let table = 'products';
  // const promise1 = await Location.getAll(table);
  // console.log('promise1');
  // console.log(promise1);
  // // res.json(promise1);
  try {
    // table = 'location_tables';
    let table = `${global.userConfig.flds_comp}.rfid_stock_flds_ab`;
    // let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
    // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
    console.log('table: %s', table);
    const result = await Product.findSearch(table, req.query);
    console.log('result');
    console.log(result);
    // res.json(promise2);

    if(isNullOrUndefined(result[0])){
      let msgret = {
        code: 200,
        msg: `Products Not find list.`,
        // data: result
      };
      res.json(msgret);
      return ;
    }

    let msgret = {
      code: 200,
      msg: `Products findSearch/QryStock successfully.`,
      data: result
    };
    res.json(msgret);

  } catch (error) {
    console.log(error);
    // console.log(result_LocationID);
    res.status(500);
    let msgret = {
      code: 500,
      msg: 'Products findSearch/QryStock error.',
      // sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }

}

export const QryPnStock = async function(req, res) {
  console.log('findSearch query = %s', req.query);
  console.log('findSearch body = %s', req.body);
  console.log('findSearch params = %s', req.params);

  // let table = 'products';
  // const promise1 = await Location.getAll(table);
  // console.log('promise1');
  // console.log(promise1);
  // // res.json(promise1);
  try {
    // table = 'location_tables';
    let table = `${global.userConfig.flds_comp}.rfid_stock_flds_ab`;
    // let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
    // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
    console.log('table: %s', table);
    const result = await Product.QryPnStock(table, req.query);
    console.log('result');
    console.log(result);
    // res.json(promise2);

    if(isNullOrUndefined(result[0])){
      let msgret = {
        code: 200,
        msg: `Products Not find QryPnStock.`,
        // data: result
      };
      res.json(msgret);
      return ;
    }

    let msgret = {
      code: 200,
      msg: `Products QryPnStock successfully.`,
      data: result
    };
    res.json(msgret);

  } catch (error) {
    console.log(error);
    // console.log(result_LocationID);
    res.status(500);
    let msgret = {
      code: 500,
      msg: 'Products QryPnStock error.',
      // sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }

}



export const QryKuStock = async function(req, res) {
  console.log('findSearch query = %s', req.query);
  console.log('findSearch body = %s', req.body);
  console.log('findSearch params = %s', req.params);

  // let table = 'products';
  // const promise1 = await Location.getAll(table);
  // console.log('promise1');
  // console.log(promise1);
  // // res.json(promise1);
  try {
    // table = 'location_tables';
    let table = `${global.userConfig.flds_comp}.rfid_stock_flds_ab`;
    // let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
    // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
    console.log('table: %s', table);
    const result = await Product.QryKuStock(table, req.query);
    console.log('result');
    console.log(result);
    // res.json(promise2);

    if(isNullOrUndefined(result[0])){
      let msgret = {
        code: 200,
        msg: `Products Not find QryKuStock.`,
        // data: result
      };
      res.json(msgret);
      return ;
    }

    let msgret = {
      code: 200,
      msg: `Products QryKuStock successfully.`,
      data: result
    };
    res.json(msgret);

  } catch (error) {
    console.log(error);
    // console.log(result_LocationID);
    res.status(500);
    let msgret = {
      code: 500,
      msg: 'Products QryKuStock error.',
      // sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }

}



// // 同步功能實現 async/await/Promise .
// export asyncfunction find_flds_ab(req, res) {
//   console.log('findAll query = %s', req.query);
//   console.log('findAll body = %s', req.body);
//   console.log('findAll params = %s', req.params);
//   let table = `${global.userConfig.flds_comp}.rfid_in_flds_ab`;
//   // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//   console.log('table: %s', table);
//   try {
//     const result = await getAll(table);
//     console.log('result');
//     console.log(result);
//     let msgret = {
//       code: 200,
//       msg: `product  find lists.`,
//       data: result
//     };
//     res.json(msgret);
//   } catch (error) {
//     // console.log(error.code);
//     res.status(500);
//     let msgret = {
//       code: error.errno,
//       msg: error.code
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }

// }


// // 同步功能實現 async/await/Promise .
// // http://192.168.248.34:3000/catalog/product/exp2rfid?orders=5101-20221017002
// // http://192.168.248.34:3000/catalog/product/exp2rfid?comp=1204&stock=in&orders=5101-20221017002
// // http://192.168.248.34:3000/catalog/product/exp2rfid?comp=1204&stock=out&orders=5101-20221017002
// export asyncfunction exp2Rfid(req, res) {
//   console.log('exp2Rfid query = %s', req.query);
//   console.log('exp2Rfid body = %s', req.body);
//   console.log('exp2Rfid params = %s', req.params);
//   const stocktype = req.query.stock;
//   // console.log('userConfig:');
//   // console.log( global.userConfig);

//   const exp2RfidImportCSV = join(__dirname, '../dbdata/' + req.query.orders + '.csv');

//   // const exp2RfidImportJson = path.join(__dirname, '../dbdata/' + 'products-j01.json');
//   // const exp2RfidImportJson = path.join(__dirname, '../dbdata/' + req.query.orders + '.json');
//   let resultAll = [];
//   // fs.stat(exp2RfidImportJson, async function(err, stat) {

//   // try {
//   // 檢查檔案是否存在??
//     _stat(exp2RfidImportCSV, async function(err, stat) {
//       if (err === null) {
//         console.log('File exists:' + exp2RfidImportCSV);
//         // let rawdata = fs.readFileSync(exp2RfidImportJson);
//         // let result = JSON.parse(rawdata);
//         // console.log('result.length=', result.length );
//         csvToJSON().fromFile(exp2RfidImportCSV)
//           .then(async products => {
//             console.log('Stock_action: ' + req.query.stock);

//             console.log('products.csv.length= %s', products.length);

//             if( req.query.stock === 'input'){
//               stock_input(products, res);
//             } else  if( req.query.stock === 'output'){
//               stock_output(products, res);
//             }
//             else  if( req.query.stock === 'sysimport'){
//               sysImport(products, req.query.orders, res);
//             } else  if( req.query.stock === 'adjin'){
//               stock_input(products, res);
//             }
//             else  if( req.query.stock === 'adjout'){
//               stock_output(products, req.query.orders, res);
//             } else  if( req.query.stock === 'pkin'){
//               stock_input(products, res);
//             }
//             else  if( req.query.stock === 'pkout'){
//               stock_output(products, req.query.orders, res);
//             }
//             else{
//               console.log('req.query.stock not exist: ' + req.query.stock);
//               res.status(500);
//               // res.json('file does not exist: ' + exp2RfidImportCSV);
//               let msgret = {
//                 code: 500,
//                 msg: `req.query.stock not exist: ` + req.query.stock
//                 // data: data
//               };
//               res.json(msgret);
//             }

//           }).catch(err => {
//             // log error if any
//             console.log(err);
//             res.status(500);
//             // res.json('Some other error: ' + err.code);
//             let msgret = {
//               code: 500,
//               msg: `Some other error: ` + err.code
//               // data: data
//             };
//             res.json(msgret);
//         });

//       }
//       else if (err.code === 'ENOENT') {
//         // file does not exist
//         console.log('file does not exist: ' + exp2RfidImportCSV);
//         res.status(500);
//         // res.json('file does not exist: ' + exp2RfidImportCSV);
//         let msgret = {
//           code: 500,
//           msg: `file does not exist: ` + exp2RfidImportCSV
//           // data: data
//         };
//         res.json(msgret);

//         return;
//       } else {
//         console.log('Some other error: ', err.code);
//         res.status(500);
//         // res.json('Some other error: ' + err.code);
//         let msgret = {
//           code: 500,
//           msg: `Some other error: ` + err.code
//           // data: data
//         };
//         res.json(msgret);
//       }
//     });


//   // } catch (error) {
//   //   console.log(error);
//   //   res.status(500);
//   //   let msgret = {
//   //     code: error.errno,
//   //     msg: error.code,
//   //     sqlMessage: error.sqlMessage
//   //     // data: error
//   //   };
//   //   res.json(msgret);
//   //   Logger.info('msgret = %s', msgret);
//   // }

// }

// // 參考範例 GET
// // const url = `https://course-ec-api.hexschool.io/api/${uuid}/admin/ec/products`
// // let headers = {
// //     "Content-Type": "application/json",
// //     "Accept": "application/json",
// //     "Authorization": `Bearer ${token}`,
// // }
// // fetch(url, {
// //     method: "GET",
// //     headers: headers,
// // })
// //     .then( (response) => response.json())
// //     .then( (json) => console.log(json));

// // 參考範例 POST
// // const uuid = xxxxx
// // const token = xxxxx
// // const url = `https://course-ec-api.hexschool.io/api/${uuid}/admin/ec/product`

// // let headers = {
// //     "Content-Type": "application/json",
// //     "Accept": "application/json",
// //     "Authorization": `Bearer ${token}`,
// // }

// // //以下是API文件中提及必寫的主體参數。而以下這個產品資料是六角學院提供的。
// // let body = {
// //     "title": "Abysswalker",
// //     "category": "T-Shirts",
// //     "content": "Its wearer, like Artorias himself, can traverse the Abyss.",
// //     "description": "This official Dark Souls shirt was designed by Nina Matsumoto and printed on soft 100% cotton shirts by Forward. Each one comes with a bonus sticker.",
// //     "imageUrl": ["https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1349&q=80"]
// // }

// // fetch(url, {
// //     method: "POST",
// //     headers: headers,
// //     //別忘了把主體参數轉成字串，否則資料會變成[object Object]，它無法被成功儲存在後台
// //     body: JSON.stringify(body)
// // })
// //     .then(response => response.json())
// //     .then(json => console.log(json));

// export asyncfunction exp2RfidAPI(req, res) {
//   console.log('findAll query = %s', req.query);
//   console.log('findAll body = %s', req.body);
//   console.log('findAll params = %s', req.params);

//   (async () => {
//     try {
//       const url = `http://192.168.248.34:3000/catalog/product/exp2rfid?comp=${req.query.comp}&stock=${req.query.stock}&orders=${req.query.orders}`;
//       // const url = `http://127.0.0.1:3000/catalog/product/createarr`;
//       // const url = 'http://192.168.248.34:3000/catalog/product/exp2rfid?comp=abba&stock=in&orders=1221-20221017001';
//       const response = await fetch(url)
//       // const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
//       const json = await response.json()
//       console.log(json);
//       res.json(json);

//       // console.log(json.code);
//       // console.log(json.url);
//       // console.log(json.explanation);
//       // console.log('await fetch() end.');

//     } catch (error) {
//       console.log(error.response.body);
//     }
//   })();
// }


// export asyncfunction sync2ERP(req, res) {
//   console.log('findAll query = %s', req.query);
//   console.log('findAll body = %s', req.body);
//   console.log('findAll params = %s', req.params);
//   const sync2ERPexportCSV = join(__dirname, '../dbdata/' + req.query.orders + 'erp.csv');

//   let table = `${global.userConfig.flds_comp}.log_flds_abc`;
//   // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//   console.log('table: %s', table);
//   const result3 = await findByOrders(req.query.orders, table);

//   if( isNullOrUndefined(result3[0]) )
//   {
//     let msgret = {
//       code: 500,
//       msg: `Not found orders: ${req.query.orders}`
//       // data: data
//     };

//     res.status(500);
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//     return ;
//   }

//   // 刪除不需要輸出的欄位
//   for(let elem of result3)
//   {
//     delete elem.id;
//     delete elem.uid;
//     delete elem.flds_comp;
//     delete elem.timestamp;
//   }
//   console.log('result3');
//   console.log(result3);
//   json2csv(result3, (err, csv) => {
//   if (err) {
//     throw err
//   }
//   // print CSV string
//   console.log(csv)
//   // write CSV to a file
//   writeFileSync(sync2ERPexportCSV, csv)
// })


//   let msgret = {
//     code: 200,
//     msg: `sync2ERP number: ${result3.length} successfully!`
//     // data: data
//   };
//   res.json(msgret);

// }


// export asyncfunction unbound(req, res) {
//   console.log('unbound query = %s', req.query);
//   console.log('unbound body = %s', req.body);
//   console.log('unbound params = %s', req.params);
//   let unbound_result = [];
//   // let table = 'products';
//   try {
//     let Flds_comp = global.userConfig.flds_comp;
//     const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
//     const result = await unbound(TABLE_NAME,Flds_comp);
//     let result1 =JSON.parse(JSON.stringify(result));

//     // 顯示有品號uid未綁定儲位location_id的列表
//     result1.forEach(function(item, i) {
//       // console.log(i, item)
//       if( isNullOrUndefined(item.location_id) ){
//         unbound_result.push(item);
//       }
//     });

//     let msgret = {
//       code: 200,
//       msg: `product unbound successfully.`,
//       data: unbound_result
//     };
//     res.json(msgret);
//     console.log(unbound_result);

//   } catch (error) {
//     // console.log(error.code);
//     res.status(500);
//     let msgret = {
//       code: error.errno,
//       msg: error.code,
//       sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }
// }


// export asyncfunction unbind_abc_list(req, res) {
//   console.log('unbound_flds_ab query = %s', req.query);
//   console.log('unbound_flds_ab body = %s', req.body);
//   console.log('unbound_flds_ab params = %s', req.params);
//   let unbound_result = [];

//   try {
//     const params = {
//       order_no : req.query.order_no,
//       // location_id : req.query.luid,
//     };

//     if( (isNullOrUndefined(req.query.stock)))  {
//       let msgret = {
//         code: 500,
//         msg: `stock is NullOrUndefined!`
//         // data: data
//       };
//       res.json(msgret);
//       return ;
//     }

//     let Flds_comp = global.userConfig.flds_comp;
//     // console.log(req.query.stock);
//     let stockType = req.query.stock;
//     let TABLE_NAME ='';
//     switch (stockType) {
//       case 'input':
//           TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
//           break;
//       case 'output':
//           TABLE_NAME = Flds_comp+'.rfid_out_flds_abc';
//           break;
//       case 'adjin':
//           TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//           break;
//       case 'adjout':
//           TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//           break;
//       case 'pkin':
//           TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//           break;
//       case 'pkout':
//           TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//           break;
//       default:
//         // console.log(req.query.stock);
//         let msgret = {
//           code: 500,
//           msg: `case: stock: ${req.query.stock} Undefined!`
//           // data: data
//         };
//         res.status(500);
//         res.json(msgret);
//         return ;
//     }

//     const result = await unbound_flds_ab(TABLE_NAME,params);
//     let result1 =JSON.parse(JSON.stringify(result));

//     let msgret = {
//       code: 200,
//       msg: `Products stock=${stockType} unbind list successfully.`,
//       data: result1
//     };
//     res.json(msgret);
//     console.log(result1);

//   } catch (error) {
//     // console.log(error.code);
//     res.status(500);
//     let msgret = {
//       code: error.errno,
//       msg: error.code,
//       sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }
// }


// export asyncfunction bind_ab(req, res) {
//   console.log('bind_ab query = %s', req.query);
//   console.log('bind_ab body = %s', req.body);
//   console.log('bind_ab params = %s', req.params);
//   let  count = 0, errcnt = 0 ;
//   try {
//     if( isNullOrUndefined(req.query.userid))  {
//       let msgret = {
//         code: 500,
//         msg: `userid is NullOrUndefined!`
//         // data: data
//       };
//       res.json(msgret);
//       return ;
//     }

//     // const table = 'rfid_ui_flds_a';
//     let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
//     // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//     console.log('table: %s', table);
//     const product_lists = await getAll(table);
//     // console.log('result');
//     // console.log(product_lists);
//     // result.forEach(function(item, i) {
//       // ui_check_state =1 , 已確認則綁定 儲位ID

//     for(let item of product_lists) {
//       if( item.ui_check_state === 1 ){
//         count++;
//         // 更新 product 加入儲位綁定 Flds_bind
//         const Locationobj = {
//           warehouse_type : item.warehouse_type,
//           storage_location : item.storage_location
//         };
//         console.log(Locationobj);

//         let Flds_comp = global.userConfig.flds_comp;
//         let TABLE_NAME =  Flds_comp +'.location_tables';

//         // // 取得儲位ID以庫別+儲位
//         let result_LocationID = await findByLocation(Locationobj, TABLE_NAME);
//         console.log('result_LocationID');
//         console.log(result_LocationID);

//         if(isNullOrUndefined(result_LocationID)){
//           errcnt++;
//           console.log('Not found :%s', Locationobj);
//           Logger.info('Not found :%s', Locationobj);
//           continue ;
//         }
//         const flds_bind = new Flds_bind({
//           uid : item.uid,
//           // users_id 需要有來源
//           users_id : req.query.userid,
//           location_id : result_LocationID[0].luid,
//           // location_id : '',
//         });
//         flds_bind.stamp1 =  new Date().toISOString().slice(0, 19).replace('T', ' ');
//         console.log(flds_bind);

//         console.log(item);

//         Flds_comp = global.userConfig.flds_comp;
//         TABLE_NAME = Flds_comp+'.rfid_in_flds_ab';
//         const result = await updateById_flds_b(flds_bind.uid, flds_bind, TABLE_NAME);
//         console.log(result);

//         // // const result2 = await Flds_bind.replace(flds_bind);
//         // const result2 = await Product.updateById_flds_b(flds_bind);
//         // console.log('result2');
//         // console.log(result2);


//         // rfid_in_flds_c
//         // LOG庫存.異動單號=line.來源單號,異動序號=line.序號
//         //     ,異動數量=line.數量,異動包裝數量=line.包裝數量
//         //     ,修改者=登入者.工號,Stamp2=TM
//         const Rfid_in_flds_c = new RFID_in_flds_c({
//           uid : item.uid,
//           c_order_no : item.order_no,
//           c_serial_no : item.serial_no,
//           c_quantity : item.quantity,
//           c_packing_quantity : item.packing_quantity,
//           c_users_id : req.query.userid,
//         });
//         Rfid_in_flds_c.c_stamp =  new Date().toISOString().slice(0, 19).replace('T', ' ');
//         console.log(Rfid_in_flds_c);
//         const result3 = await _replace(Rfid_in_flds_c);
//         console.log('result3');
//         console.log(result3);

//       }
//       // else 移除已經綁定資料 Rfid_in_flds_b + Rfid_in_flds_c 後續處理
//     }
//     // });
//     if( count === 0)  {
//       let msgret = {
//         code: 200,
//         msg: `Product not bind!`
//         // data: data
//       };
//       res.json(msgret);
//     }
//     else {
//       let msgret = {
//         code: 200,
//         msg: `Product bind successfully!`,
//       };
//       if( errcnt ){
//         msgret.errcnt = errcnt;
//       }
//       res.json(msgret);
//     }

//   } catch (error) {
//     console.log(error);
//     // console.log(result_LocationID);
//     res.status(500);
//     let msgret = {
//       code: 500,
//       msg: 'bind error.',
//       // sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }

// }



// export asyncfunction bind_abc_list(req, res) {
//   console.log('bind_abc_list query = %s', req.query);
//   console.log('bind_abc_list body = %s', req.body);
//   console.log('bind_abc_list params = %s', req.params);
//   let unbind_result = [];

//   try {
//     const params = {
//       order_no : req.query.order_no,
//       // location_id : req.query.luid,
//     };

//     // if( (isNullOrUndefined(req.query.stock)))  {
//     //   let msgret = {
//     //     code: 500,
//     //     msg: `stock is NullOrUndefined!`
//     //     // data: data
//     //   };
//     //   res.json(msgret);
//     //   return ;
//     // }

//     let Flds_comp = global.userConfig.flds_comp;
//     // console.log(req.query.stock);
//     let stockType = req.query.stock;
//     let TABLE_NAME ='';
//     switch (stockType) {
//       case 'input':
//           TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
//           break;
//       case 'output':
//           TABLE_NAME = Flds_comp+'.rfid_out_flds_abc';
//           break;
//       case 'adjin':
//           TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//           break;
//       case 'adjout':
//           TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//           break;
//       case 'pkin':
//           TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//           break;
//       case 'pkout':
//           TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//           break;
//       default:
//         TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
//         break;
//         // // console.log(req.query.stock);
//         // let msgret = {
//         //   code: 500,
//         //   msg: `case: stock: ${req.query.stock} Undefined!`
//         //   // data: data
//         // };
//         // res.status(500);
//         // res.json(msgret);
//         // return ;
//     }

//     // const result = await Product.bind_flds_abc(TABLE_NAME,params);
//     const result_flds_abc = await findSearch(TABLE_NAME, params);
//     // console.log(req.query.luid.length);
//     // console.log(req.query.luid);
//     let newArr = result_flds_abc.filter(function (element) {

//       // if( !(isNullOrUndefined(req.query.luid)))  {
//       //   // return 未綁定location_id
//       //   return (element.location_id === "");
//       // }
//       // else{
//       //   // return 已綁定列表
//       //   return (element.location_id != "");
//       //   // return 全部列表
//       //   // return element;
//       // }

//       // if( req.query.luid.length == 0){
//       //   // return 未綁定location_id
//       //   return (element.location_id === "");
//       // }
//       // else{
//         // return 全部列表
//         return element;
//       // }

//     });

//     console.log(newArr);
//     let result1 =JSON.parse(JSON.stringify(newArr));
//     let msgret = {
//       code: 200,
//       msg: `Products bind list successfully.`,
//       data: result1
//     };
//     res.json(msgret);
//     // console.log(result1);

//   } catch (error) {
//     // console.log(error.code);
//     res.status(500);
//     let msgret = {
//       code: error.errno,
//       msg: error.code,
//       sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }
// }



// export asyncfunction bind_update(req, res) {
//   console.log('bind_update query = %s', req.query);
//   console.log('bind_update body = %s', req.body);
//   console.log('bind_update params = %s', req.params);

//   try {
//     const params = {
//       order_no : req.query.order_no,
//       uid : req.params.id,
//     };

//     let Flds_comp = global.userConfig.flds_comp;
//     // console.log(req.query.stock);
//     let stockType = req.query.stock;
//     let TABLE_NAME ='';
//     switch (stockType) {
//       case 'input':
//           TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
//           break;
//       case 'output':
//           TABLE_NAME = Flds_comp+'.rfid_out_flds_abc';
//           break;
//       case 'adjin':
//           TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//           break;
//       case 'adjout':
//           TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//           break;
//       case 'pkin':
//           TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//           break;
//       case 'pkout':
//           TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//           break;
//       default:
//           TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
//           break;
//     }

//     const result3 = await updateByParams(params,  req.body, TABLE_NAME);
//     console.log('result3');
//     console.log(result3[0]);
//     let msgret = {
//       code: 200,
//       msg: `Product bind_update uid:${params.uid}, order_no:${params.order_no} successfully.`,
//       // data: result1
//     };
//     res.json(msgret);

//     // // const result = await Product.bind_flds_abc(TABLE_NAME,params);
//     // const result_flds_abc = await Product.findSearch(TABLE_NAME, params);
//     // // console.log(req.query.luid.length);
//     // // console.log(req.query.luid);
//     // let newArr = result_flds_abc.filter(function (element) {

//     //   // if( !(isNullOrUndefined(req.query.luid)))  {
//     //   //   // return 未綁定location_id
//     //   //   return (element.location_id === "");
//     //   // }
//     //   // else{
//     //   //   // return 已綁定列表
//     //   //   return (element.location_id != "");
//     //   //   // return 全部列表
//     //   //   // return element;
//     //   // }

//     //   // if( req.query.luid.length == 0){
//     //   //   // return 未綁定location_id
//     //   //   return (element.location_id === "");
//     //   // }
//     //   // else{
//     //     // return 全部列表
//     //     return element;
//     //   // }

//     // });

//     // console.log(newArr);
//     // let result1 =JSON.parse(JSON.stringify(newArr));
//     // let msgret = {
//     //   code: 200,
//     //   msg: `Products bind_update successfully.`,
//     //   data: result1
//     // };
//     // res.json(msgret);
//     // // console.log(result1);

//   } catch (error) {
//     // console.log(error.code);
//     res.status(500);
//     let msgret = {
//       code: error.errno,
//       msg: error.code,
//       sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }
// }


// export asyncfunction bind_delete(req, res) {
//   console.log('bind_delete query = %s', req.query);
//   console.log('bind_delete body = %s', req.body);
//   console.log('bind_delete params = %s', req.params);

//   try {
//     const params = {
//       order_no : req.query.order_no,
//       uid : req.params.id,
//     };

//     let Flds_comp = global.userConfig.flds_comp;
//     // console.log(req.query.stock);
//     let stockType = req.query.stock;
//     let TABLE_NAME ='';
//     switch (stockType) {
//       case 'input':
//           TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
//           break;
//       case 'output':
//           TABLE_NAME = Flds_comp+'.rfid_out_flds_abc';
//           break;
//       case 'adjin':
//           TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//           break;
//       case 'adjout':
//           TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//           break;
//       case 'pkin':
//           TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//           break;
//       case 'pkout':
//           TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//           break;
//       default:
//           TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
//           break;
//     }

//     let result1 = await removeParams(req.body, TABLE_NAME);
//     console.log(result1);

//     if( isNullOrUndefined(result1[0]) )
//     {
//       let msgret = {
//         code: 500,
//         msg: `Not found uid:${isNullOrUndefined(req.body.uid) ? 'ALL' : req.body.uid } & order_no:${isNullOrUndefined(req.body.order_no) ? 'ALL' : req.body.order_no}`
//         // data: data
//       };

//       res.status(500);
//       res.json(msgret);
//       Logger.info('msgret = %s', msgret);
//     }
//     else{

//       let msgret = {
//         code: 200,
//         msg: `delete product uid:${isNullOrUndefined(req.body.uid) ? 'ALL' : req.body.uid } & order_no:${isNullOrUndefined(req.body.order_no) ? 'ALL' : req.body.order_no} successfully.`,
//         // data: result1
//       };
//       res.json(msgret);
//     }

//     // const result3 = await Product.updateByParams(params,  req.body, TABLE_NAME);
//     // console.log('result3');
//     // console.log(result3[0]);
//     // let msgret = {
//     //   code: 200,
//     //   msg: `Product bind_update uid:${params.uid}, order_no:${params.order_no} successfully.`,
//     //   // data: result1
//     // };
//     // res.json(msgret);

//   } catch (error) {
//     // console.log(error.code);
//     res.status(500);
//     let msgret = {
//       code: error.errno,
//       msg: error.code,
//       sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }
// }



// export asyncfunction unbind_abc(req, res) {
//   console.log('unbind_abc query = %s', req.query);
//   console.log('unbind_abc body = %s', req.body);
//   console.log('unbind_abc params = %s', req.params);
//   let  count = 0, unbindcnt = 0, errcnt = 0 ;
//   try {
//     if( isNullOrUndefined(req.query.userid))  {
//       let msgret = {
//         code: 500,
//         msg: `userid is NullOrUndefined!`
//         // data: data
//       };
//       res.json(msgret);
//       return ;
//     }

//     if( (isNullOrUndefined(req.query.stock)))  {
//       let msgret = {
//         code: 500,
//         msg: `stock is NullOrUndefined!`
//         // data: data
//       };
//       res.json(msgret);
//       return ;
//     }

//     const params = {
//       order_no : req.query.order_no
//     };

//     // const table = 'rfid_ui_flds_a';
//     // 依據 ui_check_state = 1 綁定 Rfid_in_flds_c
//     let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
//     // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//     console.log('table: %s', table);
//     // 以 order_no 為查詢條件列表，若無輸入 order_no 則列表全部
//     const product_lists = await findSearch(table,params);

//     console.log('result');
//     console.log(product_lists);
//     if( isNullOrUndefined(product_lists[0]) )
//     {
//       let msgret = {
//         code: 500,
//         msg: `Not found .rfid_ui_flds_a order_no: ${params.order_no}`
//         // data: data
//       };

//       res.status(500);
//       res.json(msgret);
//       Logger.info('msgret = %s', msgret);
//       // break ;
//       // continue ;
//       // 錯誤就停止
//       return ;
//     }

//     for(let item of product_lists) {
//       if( item.ui_check_state != 1 ){

//         // 更新 product 加入儲位綁定 Flds_bind
//         const Locationobj = {
//           warehouse_type : item.warehouse_type,
//           storage_location : item.storage_location
//         };
//         console.log(Locationobj);

//         let Flds_comp = global.userConfig.flds_comp;
//         let TABLE_NAME =  Flds_comp +'.location_tables';

//         // // 取得儲位ID以庫別+儲位
//         let result_LocationID = await findByLocation(Locationobj, TABLE_NAME);
//         console.log('result_LocationID');
//         console.log(result_LocationID);

//         if(isNullOrUndefined(result_LocationID[0])){
//           errcnt++;
//           console.log('Not found :%s', Locationobj);
//           let logerrfunc = 'exports.unbind_abc()';
//           let logerrmsg = `Not find LocationID, ${JSON.stringify(Locationobj)}`;
//           LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
//           // Logger.info('Not found :%s', Locationobj);
//           continue ;
//         }

//         // rfid_in_flds_c
//         // LOG庫存.異動單號=line.來源單號,異動序號=line.序號
//         //     ,異動數量=line.數量,異動包裝數量=line.包裝數量
//         //     ,修改者=登入者.工號,Stamp2=TM
//         const Rfid_in_flds_c = new RFID_in_flds_c({
//           // uid : item.uid,
//           c_order_no : '',
//           c_serial_no : '',
//           c_quantity : 0,
//           c_packing_quantity : 0,
//           c_users_id : '',
//         });

//         Rfid_in_flds_c.c_stamp =  new Date().toISOString().slice(0, 19).replace('T', ' ');
//         // Rfid_in_flds_c.order_no =  item.order_no;
//         console.log(Rfid_in_flds_c);
//         // Rfid_in_flds_c.uid =  item.uid;


//         let stockType = req.query.stock;
//         switch (stockType) {
//           case 'input':
//               TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
//               break;
//           case 'output':
//               TABLE_NAME = Flds_comp+'.rfid_out_flds_abc';
//               break;
//           case 'adjin':
//               TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//               break;
//           case 'adjout':
//               TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//               break;
//           case 'pkin':
//               TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//               break;
//           case 'pkout':
//               TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//               break;
//           default:
//             // console.log(req.query.stock);
//             let msgret = {
//               code: 500,
//               msg: `case: stock: ${req.query.stock} Undefined!`
//               // data: data
//             };
//             res.status(500);
//             res.json(msgret);
//             return ;
//         }

//         const params = {
//           uid : item.uid,
//           order_no : item.order_no,
//         };

//         const result3 = await updateByParams(params, Rfid_in_flds_c, TABLE_NAME);
//         console.log('result3');
//         console.log(result3[0]);

//         if(isNullOrUndefined(result3[0])){
//           errcnt++;
//           // console.log(errcnt);
//           let logerrfunc = `exports.unbind_abc()`;
//           let logerrmsg = `Not find uid: ${JSON.stringify(item.uid)}`;
//           LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
//         }
//         else{
//           count++;
//         }
//       }
//       else {
//         unbindcnt++;
//       }

//     }
//     // });
//     if( count === 0)  {
//       let msgret = {
//         code: 500,
//         msg: `Product not bind!`
//         // data: data
//       };
//       res.json(msgret);
//     }
//     else {
//       let msgret = {
//         code: 200,
//         msg: `Product unbind count= ${count} successfully!`,
//         unbind: unbindcnt,
//       };
//       if( errcnt ){
//         msgret.errcnt = errcnt;
//       }
//       res.json(msgret);
//     }

//   } catch (error) {
//     console.log(error);
//     // console.log(result_LocationID);
//     res.status(500);
//     let msgret = {
//       code: 500,
//       msg: 'bind error.',
//       // sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }

// }


// export asyncfunction bind_abc(req, res) {
//   console.log('bind_abc query = %s', req.query);
//   console.log('bind_abc body = %s', req.body);
//   console.log('bind_abc params = %s', req.params);
//   let  count = 0, unbindcnt = 0, errcnt = 0 ;
//   try {
//     if( isNullOrUndefined(req.query.userid))  {
//       let msgret = {
//         code: 500,
//         msg: `userid is NullOrUndefined!`
//         // data: data
//       };
//       res.json(msgret);
//       return ;
//     }

//     if( (isNullOrUndefined(req.query.stock)))  {
//       let msgret = {
//         code: 500,
//         msg: `stock is NullOrUndefined!`
//         // data: data
//       };
//       res.json(msgret);
//       return ;
//     }

//     const params = {
//       order_no : req.query.order_no
//     };

//     // const table = 'rfid_ui_flds_a';
//     // 依據 ui_check_state = 1 綁定 Rfid_in_flds_c
//     let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
//     // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//     console.log('table: %s', table);
//     // 以 order_no 為查詢條件列表，若無輸入 order_no 則列表全部
//     const product_lists = await findSearch(table,params);

//     console.log('result');
//     console.log(product_lists);
//     if( isNullOrUndefined(product_lists[0]) )
//     {
//       let msgret = {
//         code: 500,
//         msg: `Not found .rfid_ui_flds_a order_no: ${params.order_no}`
//         // data: data
//       };

//       res.status(500);
//       res.json(msgret);
//       Logger.info('msgret = %s', msgret);
//       // break ;
//       // continue ;
//       // 錯誤就停止
//       return ;
//     }

//     for(let item of product_lists) {
//       if( item.ui_check_state === 1 ){

//         // 更新 product 加入儲位綁定 Flds_bind
//         const Locationobj = {
//           warehouse_type : item.warehouse_type,
//           storage_location : item.storage_location
//         };
//         console.log(Locationobj);

//         let Flds_comp = global.userConfig.flds_comp;
//         let TABLE_NAME =  Flds_comp +'.location_tables';

//         // // 取得儲位ID以庫別+儲位
//         let result_LocationID = await findByLocation(Locationobj, TABLE_NAME);
//         console.log('result_LocationID');
//         console.log(result_LocationID);

//         if(isNullOrUndefined(result_LocationID[0])){
//           errcnt++;
//           console.log('Not found :%s', Locationobj);
//           let logerrfunc = 'exports.bind_abc()';
//           let logerrmsg = `Not find LocationID, ${JSON.stringify(Locationobj)}`;
//           LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
//           // Logger.info('Not found :%s', Locationobj);
//           continue ;
//         }

//         // flds_bind 在此不更新處理.
//         // const flds_bind = new Flds_bind({
//         //   uid : item.uid,
//         //   // users_id 需要有來源
//         //   users_id : req.query.userid,
//         //   location_id : result_LocationID[0].luid,
//         //   // location_id : '',
//         // });
//         // flds_bind.stamp1 =  new Date().toISOString().slice(0, 19).replace('T', ' ');
//         // console.log(flds_bind);

//         // // console.log('item:');
//         // // console.log(item.uid);
//         // // console.log(item.order_no);
//         // flds_bind.uid =  item.uid;
//         // flds_bind.order_no =  item.order_no;

//         // // 不更新 flds_bind.users_id,保留原值.
//         // delete flds_bind.users_id;

//         // // 品號綁定儲位ID
//         // Flds_comp = global.userConfig.flds_comp;
//         // // TABLE_NAME = Flds_comp+'.rfid_in_flds_ab';
//         // // const result = await Product.updateById_flds_b(flds_bind.uid, flds_bind, TABLE_NAME);
//         // TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
//         // const result = await Product.updateByParams(item.uid, flds_bind, TABLE_NAME);
//         // // let result = await Product.updateById(item.uid, flds_bind, TABLE_NAME);
//         // console.log(result[0]);

//         // if( isNullOrUndefined(result[0]) )
//         // {
//         //   let msgret = {
//         //     code: 500,
//         //     msg: `Not found .rfid_in_flds_abc uid: ${item.uid}`
//         //     // data: data
//         //   };

//         //   res.status(500);
//         //   res.json(msgret);
//         //   Logger.info('msgret = %s', msgret);
//         //   // break ;
//         //   // continue ;
//         //   // 錯誤就停止
//         //   return ;
//         // }

//         // // const result2 = await Flds_bind.replace(flds_bind);
//         // const result2 = await Product.updateById_flds_b(flds_bind);
//         // console.log('result2');
//         // console.log(result2);


//         // rfid_in_flds_c
//         // LOG庫存.異動單號=line.來源單號,異動序號=line.序號
//         //     ,異動數量=line.數量,異動包裝數量=line.包裝數量
//         //     ,修改者=登入者.工號,Stamp2=TM
//         const Rfid_in_flds_c = new RFID_in_flds_c({
//           // uid : item.uid,
//           c_order_no : item.order_no,
//           c_serial_no : item.serial_no,
//           c_quantity : item.quantity,
//           c_packing_quantity : item.packing_quantity,
//           c_users_id : req.query.userid,
//         });

//         Rfid_in_flds_c.c_stamp =  new Date().toISOString().slice(0, 19).replace('T', ' ');
//         console.log(Rfid_in_flds_c);
//         // Rfid_in_flds_c.uid =  item.uid;
//         // Rfid_in_flds_c.order_no =  item.order_no;

//         let stockType = req.query.stock;
//         switch (stockType) {
//           case 'input':
//               TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
//               break;
//           case 'output':
//               TABLE_NAME = Flds_comp+'.rfid_out_flds_abc';
//               break;
//           case 'adjin':
//               TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//               break;
//           case 'adjout':
//               TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//               break;
//           case 'pkin':
//               TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//               break;
//           case 'pkout':
//               TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//               break;
//           default:
//             // console.log(req.query.stock);
//             let msgret = {
//               code: 500,
//               msg: `case: stock: ${req.query.stock} Undefined!`
//               // data: data
//             };
//             res.status(500);
//             res.json(msgret);
//             return ;
//         }

//         const params = {
//           uid : item.uid,
//           order_no : item.order_no,
//         };

//         const result3 = await updateByParams( params, Rfid_in_flds_c, TABLE_NAME );
//         console.log('result3');
//         console.log(result3[0]);

//         if(isNullOrUndefined(result3[0])){
//           errcnt++;
//           // console.log(errcnt);
//           let logerrfunc = `exports.bind_abc()`;
//           let logerrmsg = `Not find uid: ${JSON.stringify(item.uid)}`;
//           LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
//         }
//         else{
//           count++;
//         }
//       }
//       else {
//         unbindcnt++;
//       }

//     }
//     // });
//     if( count === 0)  {
//       let msgret = {
//         code: 500,
//         msg: `Product not bind!`
//         // data: data
//       };
//       res.json(msgret);
//     }
//     else {
//       let msgret = {
//         code: 200,
//         msg: `Product bind count= ${count} successfully!`,
//         unbind: unbindcnt,
//       };
//       if( errcnt ){
//         msgret.errcnt = errcnt;
//       }
//       res.json(msgret);
//     }

//   } catch (error) {
//     console.log(error);
//     // console.log(result_LocationID);
//     res.status(500);
//     let msgret = {
//       code: 500,
//       msg: 'bind error.',
//       // sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }

// }


// export asyncfunction bind_b(req, res) {
//   console.log('bind_b query = %s', req.query);
//   console.log('bind_b body = %s', req.body);
//   console.log('bind_b params = %s', req.params);
//   let  count = 0, errcnt = 0 ;
//   try {
//     if( isNullOrUndefined(req.query.userid))  {
//       let msgret = {
//         code: 500,
//         msg: `userid is NullOrUndefined!`
//         // data: data
//       };
//       res.json(msgret);
//       return ;
//     }

//     // const table = 'rfid_ui_flds_a';
//     let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
//     // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//     console.log('table: %s', table);
//     const product_lists = await getAll(table);
//     // console.log('result');
//     // console.log(product_lists);
//     // result.forEach(function(item, i) {
//     // ui_check_state =1 , 已確認則綁定 儲位ID

//     for(let item of product_lists) {
//       if( item.ui_check_state === 1 ){
//         count++;
//         // 更新 product 加入儲位綁定 Flds_bind
//         const Locationobj = {
//           warehouse_type : item.warehouse_type,
//           storage_location : item.storage_location
//         };
//         console.log(Locationobj);

//         let Flds_comp = global.userConfig.flds_comp;
//         let TABLE_NAME =  Flds_comp +'.location_tables';

//         // // 取得儲位ID以庫別+儲位
//         let result_LocationID = await findByLocation(Locationobj, TABLE_NAME);
//         console.log('result_LocationID');
//         console.log(result_LocationID);

//         if(isNullOrUndefined(result_LocationID.data)){
//           console.log('Not found :%s', Locationobj);
//           Logger.info('Not found :%s', Locationobj);
//           continue ;
//         }

//         const flds_bind = new Flds_bind({
//           uid : item.uid,
//           // users_id 需要有來源
//           users_id : req.query.userid,
//           location_id : result_LocationID.data.luid,
//         });
//         console.log(flds_bind);

//         console.log(item);
//         const result2 = await replace(flds_bind);
//         console.log('result2');
//         console.log(result2);


//         // rfid_in_flds_c
//         // LOG庫存.異動單號=line.來源單號,異動序號=line.序號
//         //     ,異動數量=line.數量,異動包裝數量=line.包裝數量
//         //     ,修改者=登入者.工號,Stamp2=TM
//         const Rfid_in_flds_c = new RFID_in_flds_c({
//           uid : item.uid,
//           c_order_no : item.order_no,
//           c_serial_no : item.serial_no,
//           c_quantity : item.quantity,
//           c_packing_quantity : item.packing_quantity,
//           c_users_id : req.query.userid,
//         });
//         console.log(Rfid_in_flds_c);
//         const result3 = await _replace(Rfid_in_flds_c);
//         console.log('result3');
//         console.log(result3);

//       }
//       // else 移除已經綁定資料 Rfid_in_flds_b + Rfid_in_flds_c 後續處理
//     }
//     // });
//     if( count === 0)  {
//       let msgret = {
//         code: 200,
//         msg: `Product not bind!`
//         // data: data
//       };
//       res.json(msgret);
//     }
//     else {
//       let msgret = {
//         code: 200,
//         msg: `Product bind successfully!`,
//       };
//       if( errcnt ){
//         msgret.errcnt = errcnt;
//       }
//       res.json(msgret);
//     }

//   } catch (error) {
//     console.log(error);
//     // console.log(result_LocationID);
//     res.status(500);
//     let msgret = {
//       code: 500,
//       msg: 'bind error.',
//       // sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }

// }


// export asyncfunction updatestock(req, res) {
//   console.log('updatestock query = %s', req.query);
//   console.log('updatestock body = %s', req.body);
//   console.log('updatestock params = %s', req.params);

//   try {
//     let stockType = req.query.stock;
//     // 測試使用 'rfid_ui_flds_a', 若有系統匯入則使用 'rfid_stock_flds_a'
//     // 原單庫存=QryStock(line.品號,line.庫別,line.儲位,line.批號))    #(flds_a+b)
//     // const table = 'rfid_ui_flds_a';
//     // const table = 'rfid_in_flds_c';
//     let Flds_comp = global.userConfig.flds_comp;
//     let TABLE_NAME ='';
//     switch (stockType) {
//       case 'input':
//         TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
//         // TABLE_NAME = `${global.userConfig.flds_comp}.rfid_in_flds_abc`;
//         break;
//       case 'output':
//         TABLE_NAME = Flds_comp+'.rfid_out_flds_abc';
//         // TABLE_NAME = `${global.userConfig.flds_comp}.rfid_out_flds_abc`;
//         break;
//       case 'adjin':
//         TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
//         break;
//       case 'adjout':
//         TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
//         break;
//       case 'pkin':
//         TABLE_NAME = Flds_comp+'.rfid_pkin_flds_abc';
//         break;
//       case 'pkout':
//         TABLE_NAME = Flds_comp+'.rfid_pkout_flds_abc';
//         break;
//       default:
//         // console.log(req.query.stock);
//         let msgret = {
//           code: 500,
//           msg: `case: stock: ${req.query.stock} Undefined!`
//           // data: data
//         };
//         res.status(500);
//         res.json(msgret);
//         return ;
//     }

//     // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//     console.log('TABLE_NAME: %s', TABLE_NAME);
//     let params = {
//       // location_id: req.query.location_id,
//       order_no: isNullOrUndefined(req.query.order_no) ? '' : req.query.order_no,
//     };
//     console.log(params);
//     const result_flds_abc = await findSearch(TABLE_NAME, params);
//     // const result_flds_abc = await Product.getAll(table);
//     // console.log('result rfid_in_flds_c:');
//     // console.log(result);  RFID_stock_flds_a
//     let count = 0, errcnt = 0 ;
//     for(let elem of result_flds_abc) {
//       if( elem.c_order_no === '')
//       {
//         // 未綁定確認
//         console.log('elem.c_order_no is NULL');
//         errcnt++;
//         continue ;
//       }
//       console.log('result rfid_in_flds_abc:');
//       console.log(elem);

//       // 讀取 RFID elem.uid 庫存表
//       let Flds_comp = global.userConfig.flds_comp;
//       let TABLE_NAME = Flds_comp+'.rfid_stock_flds_ab';
//       const result_flds_ab = await findById(elem.uid, TABLE_NAME);
//       console.log('result rfid_stock_flds_ab:');
//       console.log(result_flds_ab);

//       const log_flds_abc = JSON.parse(JSON.stringify(result_flds_ab[0]));

//       if( stockType === 'input'){
//       // #for 更新RFID庫存
//       // 原單庫存.來源單號=line.來源單號,序號=line.序號
//       //     ,數量+=line.數量,包裝數量+=line.包裝數量
//       //     ,建立者=登入者.工號,Stamp1=TM
//       // 更新庫存(原單庫存)    #(flds_a+b)
//       result_flds_ab[0].order_no = elem.c_order_no;
//       result_flds_ab[0].serial_no = elem.c_serial_no;
//       result_flds_ab[0].quantity += elem.c_quantity;
//       result_flds_ab[0].packing_quantity += elem.c_packing_quantity;
//       result_flds_ab[0].users_id = elem.c_users_id;
//       result_flds_ab[0].stamp1 = elem.c_stamp;
//       console.log('Update rfid_stock_flds_ab:');
//       console.log(result_flds_ab);
//       } else if( stockType === 'output'){
//         // #for 更新RFID庫存
//         // 原單庫存.來源單號=line.來源單號,序號=line.序號
//         //     ,數量+=line.數量,包裝數量+=line.包裝數量
//         //     ,建立者=登入者.工號,Stamp1=TM
//         // 更新庫存(原單庫存)    #(flds_a+b)
//         result_flds_ab[0].order_no = elem.c_order_no;
//         result_flds_ab[0].serial_no = elem.c_serial_no;
//         result_flds_ab[0].quantity -= elem.c_quantity;
//         if( result_flds_ab[0].quantity < elem.c_quantity)
//         {
//           let logerrfunc = 'exports.updatestock()';
//           let logerrmsg = `Quantity err: , ${JSON.stringify(elem)}`;
//           LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
//           continue ;
//         }
//         result_flds_ab[0].packing_quantity -= elem.c_packing_quantity;
//         result_flds_ab[0].users_id = elem.c_users_id;
//         result_flds_ab[0].stamp1 = elem.c_stamp;
//         console.log('Update rfid_stock_flds_ab:');
//         console.log(result_flds_ab);
//       }

//       const params = {
//         uid : elem.uid,
//         // order_no : item.order_no,
//       };
//       const result3 = await updateByParams(params, result_flds_ab[0], TABLE_NAME);
//       // console.log('result3');
//       // console.log(result3[0]);

//       // // 移轉庫存--儲位不同另行處理.
//       // delete elem.c_warehouse_type;
//       // delete elem.c_storage_location;

//       // LOG庫存(log_flds_abc)=原單庫存.astype(flds_a+b+c)
//       log_flds_abc.c_order_no =  elem.c_order_no;
//       log_flds_abc.c_serial_no =  elem.c_serial_no;
//       log_flds_abc.c_quantity =  elem.c_quantity;
//       log_flds_abc.c_packing_quantity =  elem.c_packing_quantity;
//       log_flds_abc.c_users_id =  elem.c_users_id;
//       log_flds_abc.c_stamp =  elem.c_stamp;

//       TABLE_NAME = `${global.userConfig.flds_comp}.log_flds_abc`;
//       // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//       const result4 = await _create(log_flds_abc, TABLE_NAME);
//       // console.log('LOG_flds_abc result4');
//       // console.log(result4);
//       count++;
//     }

//     let msgret = {
//       code: 200,
//       msg: `rfid_stock_flds_ab count =  ${count}, order: ${req.query.order_no} Update finish!!!`
//       // data: data
//     };
//     if( errcnt ){
//       msgret.errcnt = errcnt;
//     }
//     res.json(msgret);
//     console.log('result end.');
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//     let msgret = {
//       code: 500,
//       msg: error
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }
// }


// export asyncfunction finish(req, res) {
//   console.log('finish query = %s', req.query);
//   console.log('finish body = %s', req.body);
//   console.log('finish params = %s', req.params);

//   try {
//     // 測試使用 'rfid_ui_flds_a', 若有系統匯入則使用 'rfid_stock_flds_a'
//     // 原單庫存=QryStock(line.品號,line.庫別,line.儲位,line.批號))    #(flds_a+b)
//     // const table = 'rfid_ui_flds_a';
//     // const table = 'rfid_in_flds_c';
//     let table = `${global.userConfig.flds_comp}.rfid_in_flds_abc`;
//     // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//     console.log('table: %s', table);
//     let params = {
//       // location_id: req.query.location_id,
//       order_no: isNullOrUndefined(req.query.order_no) ? '' : req.query.order_no,
//     };
//     console.log(params);
//     const result_flds_abc = await findSearch(table, params);
//     // const result_flds_abc = await Product.getAll(table);
//     // console.log('result rfid_in_flds_c:');
//     // console.log(result);  RFID_stock_flds_a
//     let count = 0, errcnt = 0 ;
//     for(let elem of result_flds_abc) {
//       if( elem.c_order_no === '')
//       {
//         // 未綁定確認
//         console.log('elem.c_order_no is NULL');
//         errcnt++;
//         continue ;
//       }
//       console.log('result rfid_in_flds_abc:');
//       console.log(elem);

//       let Flds_comp = global.userConfig.flds_comp;
//       let TABLE_NAME = Flds_comp+'.rfid_stock_flds_ab';
//       const result_flds_ab = await findById(elem.uid, TABLE_NAME);
//       console.log('result rfid_stock_flds_ab:');
//       console.log(result_flds_ab);

//       const log_flds_abc = JSON.parse(JSON.stringify(result_flds_ab[0]));

//       // #for 更新RFID庫存
//       // 原單庫存.來源單號=line.來源單號,序號=line.序號
//       //     ,數量+=line.數量,包裝數量+=line.包裝數量
//       //     ,建立者=登入者.工號,Stamp1=TM
//       // 更新庫存(原單庫存)    #(flds_a+b)
//       result_flds_ab[0].order_no = elem.c_order_no;
//       result_flds_ab[0].serial_no = elem.c_serial_no;
//       result_flds_ab[0].quantity += elem.c_quantity;
//       result_flds_ab[0].packing_quantity += elem.c_packing_quantity;
//       result_flds_ab[0].users_id = elem.c_users_id;
//       result_flds_ab[0].stamp1 = elem.c_stamp;
//       console.log('Update rfid_stock_flds_ab:');
//       console.log(result_flds_ab);

//       const params = {
//         uid : elem.uid,
//         // order_no : item.order_no,
//       };
//       const result3 = await updateByParams(params, result_flds_ab[0], TABLE_NAME);
//       // console.log('result3');
//       // console.log(result3[0]);

//       // // 移轉庫存--儲位不同另行處理.
//       // delete elem.c_warehouse_type;
//       // delete elem.c_storage_location;

//       // LOG庫存(log_flds_abc)=原單庫存.astype(flds_a+b+c)
//       log_flds_abc.c_order_no =  elem.c_order_no;
//       log_flds_abc.c_serial_no =  elem.c_serial_no;
//       log_flds_abc.c_quantity =  elem.c_quantity;
//       log_flds_abc.c_packing_quantity =  elem.c_packing_quantity;
//       log_flds_abc.c_users_id =  elem.c_users_id;
//       log_flds_abc.c_stamp =  elem.c_stamp;

//       TABLE_NAME = `${global.userConfig.flds_comp}.log_flds_abc`;
//       // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//       const result4 = await _create(log_flds_abc, TABLE_NAME);
//       console.log('LOG_flds_abc result4');
//       console.log(result4);
//       count++;
//     }

//     // result.forEach(function(item, i) {
//     //   console.log(item);
//     // });

//     // const result = await Product.unbound(table);
//     // let result1 =JSON.parse(JSON.stringify(result));

//     // // 顯示有品號uid未綁定儲位location_id的列表
//     // result1.forEach(function(item, i) {
//     //   // console.log(i, item)
//     //   if( isNullOrUndefined(item.location_id) ){
//     //     unbound_result.push(item);
//     //   }
//     // });
//     // console.log('unbound_result:');
//     // console.log(unbound_result);
//     // res.json(unbound_result);
//     // Logger.info('product = %s', product);
//     let msgret = {
//       code: 200,
//       msg: `rfid_stock_flds_ab count =  ${count} Update finish!!!`
//       // data: data
//     };
//     if( errcnt ){
//       msgret.errcnt = errcnt;
//     }
//     res.json(msgret);
//     console.log('result end.');
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//     let msgret = {
//       code: 500,
//       msg: error
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }
// }


// export asyncfunction finish_bak(req, res) {
//   console.log('finish query = %s', req.query);
//   console.log('finish body = %s', req.body);
//   console.log('finish params = %s', req.params);

//   try {
//     // 測試使用 'rfid_ui_flds_a', 若有系統匯入則使用 'rfid_stock_flds_a'
//     // 原單庫存=QryStock(line.品號,line.庫別,line.儲位,line.批號))    #(flds_a+b)
//     // const table = 'rfid_ui_flds_a';
//     // const table = 'rfid_in_flds_c';
//     let table = `${global.userConfig.flds_comp}.rfid_in_flds_c`;
//     // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
//     console.log('table: %s', table);
//     const result_flds_c = await getAll(table);
//     // console.log('result rfid_in_flds_c:');
//     // console.log(result);  RFID_stock_flds_a

//     // #for 更新RFID庫存
//     // 原單庫存.來源單號=line.來源單號,序號=line.序號
//     //     ,數量+=line.數量,包裝數量+=line.包裝數量
//     //     ,建立者=登入者.工號,Stamp1=TM
//     // 更新庫存(原單庫存)    #(flds_a+b)
//     for(let elem of result_flds_c) {
//       console.log('result rfid_in_flds_c:');
//       console.log(elem);
//       // const result_flds_a = await RFID_stock_flds_a.findById(elem.uid);

//       let Flds_comp = global.userConfig.flds_comp;
//       const TABLE_NAME = Flds_comp+'.rfid_stock_flds_ab';
//       const result_flds_a = await findById(elem.uid, TABLE_NAME);

//       console.log('result rfid_stock_flds_ab:');
//       console.log(result_flds_a);

//       // const result3 = await RFID_in_flds_c.findById(Rfid_in_flds_c);
//       // console.log('result3');
//       // console.log(result3);

//       // const flds_bind = new Flds_bind({
//       //   uid : result_flds_a.uid,
//       //   // users_id 需要有來源
//       //   users_id : req.query.userid,
//       //   location_id : result_LocationID[0].luid,
//       // });

//       const result_Flds_bind = await findByuId(elem);
//       console.log('result_Flds_bind:');
//       console.log(result_Flds_bind);

//       // const Log_flds_abc ={data: JSON.stringify(result_flds_a) + JSON.stringify(elem)};
//       // console.log(JSON.parse(Log_flds_abc));
//       const Log_flds_abc = {
//         uid : result_flds_a.uid,
//         flds_comp : result_flds_a.flds_comp,
//         order_no : result_flds_a.order_no,
//         serial_no : result_flds_a.serial_no,
//         warehouse_type : result_flds_a.warehouse_type,
//         storage_location : result_flds_a.storage_location,
//         lot_no : result_flds_a.lot_no,
//         product_no : result_flds_a.product_no,
//         product_name : result_flds_a.product_name,
//         specification : result_flds_a.specification,
//         quantity : result_flds_a.quantity,
//         unit : result_flds_a.unit,
//         packing_quantity : result_flds_a.packing_quantity,
//         packing_unit : result_flds_a.packing_unit,
//         attribute1 : result_flds_a.attribute1,
//         attribute2 : result_flds_a.attribute2,
//         attribute3 : result_flds_a.attribute3,
//         attribute4 : result_flds_a.attribute4,
//         attribute5 : result_flds_a.attribute5,
//         // 填入異動資料 rfid_in_flds_c
//         users_id : result_Flds_bind.users_id,
//         location_id :result_Flds_bind.location_id,
//         stamp1 :result_Flds_bind.stamp1,
//         c_order_no :elem.c_order_no,
//         c_serial_no :elem.c_serial_no,
//         c_quantity : elem.c_quantity,
//         c_packing_quantity : elem.c_packing_quantity,
//         c_users_id :elem.c_users_id,
//         c_stamp :elem.c_stamp,
//       };
//       console.log((Log_flds_abc));

//       const result3 = await _create(Log_flds_abc);
//       console.log('result3');
//       console.log(result3);

//       // delete 刪除特定欄位
//       // delete Log_flds_abc.uid;
//       // delete Log_flds_abc.flds_comp;
//       // console.log((Log_flds_abc));

//     }

//     // result.forEach(function(item, i) {
//     //   console.log(item);
//     // });

//     // const result = await Product.unbound(table);
//     // let result1 =JSON.parse(JSON.stringify(result));

//     // // 顯示有品號uid未綁定儲位location_id的列表
//     // result1.forEach(function(item, i) {
//     //   // console.log(i, item)
//     //   if( isNullOrUndefined(item.location_id) ){
//     //     unbound_result.push(item);
//     //   }
//     // });
//     // console.log('unbound_result:');
//     // console.log(unbound_result);
//     // res.json(unbound_result);
//     // Logger.info('product = %s', product);
//     let msgret = {
//       code: 200,
//       msg: `Update finish!!!`
//       // data: data
//     };
//     res.json(msgret);
//     console.log('result end.');
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//     let msgret = {
//       code: 500,
//       msg: error
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }
// }



// Find a single Product by Id
export const findOne = async function(req, res) {
  console.log('findOne query = %s', req.query);
  console.log('findOne body = %s', req.body);
  console.log('findOne params = %s', req.params);
  // JSON.stringify(shelfrecord)

  // global.userConfig.reserve1 = req.params.id;
  // console.log('userConfig:');
  // console.log( global.userConfig);
  // var me = arguments.callee.name;
  // console.log( me );
  // console.log( JSON.stringify(me));

  // LogErr function test.
  // let logerrfunc = 'product.controller.findOne()';
  // let logerrmsg = 'testmsg....';
  // LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);

  try {
    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    const result = await Product.findById(req.params.id, TABLE_NAME);
    // const result = await Product.findByPn(req.params.id);
    // console.log('result:');
    // console.log(result);
    // res.json(result[0]);

    // Test code.
    // let orderData1=deepClone(result)
    // console.log('orderData1:');
    // console.log(orderData1[0]);

    // if(result.result === 'not_found')
    if( isNullOrUndefined(result[0]) )
    {
      let msgret = {
        code: 500,
        msg: `Not found uid: ${req.params.id}`
        // data: data
      };

      res.status(500);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
    }
    else{

      let msgret = {
        code: 200,
        msg: `find  product successfully`,
        data: result
      };
      res.json(msgret);
    }


  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      code: error.errno,
      msg: error.code,
      sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }

}


// Find a single Product by Id
export const findByPn = async function(req, res) {
  console.log('findOne query = %s', req.query);
  console.log('findOne body = %s', req.body);
  console.log('findOne params = %s', req.params);
  // JSON.stringify(shelfrecord)

  // global.userConfig.reserve1 = req.params.id;
  console.log('userConfig:');
  console.log( global.userConfig);
  try {
    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    const result = await Product.findByPn(req.params.id, TABLE_NAME);
    console.log('result:');
    console.log(result);
    // res.json(result[0]);

    // if(result.result === 'not_found')
    if( isNullOrUndefined(result[0]) )
    {
      let msgret = {
        code: 500,
        msg: `Not found uid: ${req.params.id}`
        // data: data
      };

      res.status(500);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
    }
    else{

      let msgret = {
        code: 200,
        msg: `findOne successfully`,
        data: result
      };
      res.json(msgret);
    }

  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      code: error.errno,
      msg: error.code,
      sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }
}



// // Find all Product by EPC
// export asyncfunction QryEpcStock(req, res) {
//   console.log('findOne query = %s', req.query);
//   console.log('findOne body = %s', req.body);
//   console.log('findOne params = %s', req.params);
//   // JSON.stringify(shelfrecord)

//   // global.userConfig.reserve1 = req.params.id;
//   console.log('userConfig:');
//   console.log( global.userConfig);
//   try {

//     let Flds_comp = global.userConfig.flds_comp;
//     let  TABLE_NAME = Flds_comp+'.location_tables';
//     let paramsEPC = {epc: req.params.id};
//     console.log(paramsEPC);

//     // console.log(Object.keys(req.query).length);
//     // // 物件取得 key值與物件內的 value
//     // Object.keys(req.query).forEach((key) => {
//     //   console.log(key);
//     //   console.log(req.query[key]);
//     // });
//     // 由 EPC編號反查 儲儲位ID(luid)
//     let result = await findByEpc(paramsEPC, TABLE_NAME);
//     console.log('result');
//     console.log(result);

//     if( isNullOrUndefined(result[0]) )
//     {
//       let msgret = {
//         code: 500,
//         msg: `Not found EPC: ${req.params.id}`
//         // data: data
//       };

//       res.status(500);
//       res.json(msgret);
//       Logger.info('msgret = %s', msgret);
//       return ;
//     }

//     let params_location_id = {
//       location_id: result[0].luid,
//       order_no: isNullOrUndefined(req.query.order_no) ? '' : req.query.order_no,
//     };

//     console.log(params_location_id);

//     Flds_comp = global.userConfig.flds_comp;
//     // TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
//     TABLE_NAME = Flds_comp+'.rfid_stock_flds_ab';
//     // 以 luid 查品號明細
//     let result1 = await findSearch(TABLE_NAME, params_location_id);
//     // let result1 = await Product.findByLocationID(result[0], TABLE_NAME);

//     // console.log('result1:');
//     console.log(result1);
//     // res.json(result[0]);

//     // if(result.result === 'not_found')
//     if( isNullOrUndefined(result1[0]) )
//     {
//       let msgret = {
//         code: 500,
//         msg: `Products Not found luid: ${result[0].luid}`
//         // data: data
//       };

//       res.status(500);
//       res.json(msgret);
//       Logger.info('msgret = %s', msgret);
//     }
//     else{

//       let msgret = {
//         code: 200,
//         msg: `Find products successfully`,
//         data: result1
//       };
//       res.json(msgret);
//     }

//   } catch (error) {
//     // console.log(error.code);
//     res.status(500);
//     let msgret = {
//       code: error.errno,
//       msg: error.code,
//       sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }
// }

// Update Product by Params
export const findUpdate = async function(req, res) {
    console.log('findUpdate query = %s', req.query);
    console.log('findUpdate body = %s', req.body);
    console.log('findUpdate params = %s', req.params);
    const product = new Product({
      uid : req.body.uid,
      flds_comp : req.body.flds_comp,
      order_no : req.body.order_no,
      serial_no : req.body.serial_no,

      warehouse_type : req.body.warehouse_type,
      storage_location : req.body.storage_location,
      lot_no : req.body.lot_no,
      product_no : req.body.product_no,
      product_name : req.body.product_name,
      specification : req.body.specification,

      quantity : req.body.quantity,
      unit : req.body.unit,
      packing_quantity : req.body.packing_quantity,

      packing_unit : req.body.packing_unit,
      attribute1 : req.body.attribute1,
      attribute2 : req.body.attribute2,

      attribute3 : req.body.attribute3,
      attribute4 : req.body.attribute4,
      attribute5 : req.body.attribute5,
    });

    // product.uid = req.params.id;
    // 如果 req.body.ui_quantity === undefined 則預設為 0
    // product.ui_quantity = req.body.ui_quantity === undefined ?  0 : req.body.ui_quantity;
    product.ui_quantity = isNullOrUndefined(req.body.ui_quantity) ?  0 : req.body.ui_quantity;
    if( !(isNullOrUndefined(req.body.ui_check_state)) ){
      product.ui_check_state = req.body.ui_check_state;
    }
    product.c_warehouse_type = isNullOrUndefined(req.body.c_warehouse_type) ?  '' : req.body.c_warehouse_type;
    product.c_storage_location = isNullOrUndefined(req.body.c_storage_location) ?  '' : req.body.c_storage_location;

    try {
      let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_stock_flds_ab';
      // const TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
      const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      const params = {
        uid : product.uid,
        order_no : product.order_no,
      };

      // const result = await Product.updateById((product.uid), product, TABLE_NAME);
      const result = await Product.updateByParams(params, product, TABLE_NAME);
      console.log(result[0]);

      // if(result.result === 'not_found')
      if( isNullOrUndefined(result[0]) )
      {
        let msgret = {
          code: 500,
          msg: `Not found uid:${req.body.uid}, order_no:${req.body.order_no}`
          // data: data
        };

        res.status(500);
        res.json(msgret);
        Logger.info('msgret = %s', msgret);
      }
      else{
        let msgret = {
          code: 200,
          msg: `Product updateByParams uid:${params.uid}, order_no:${params.order_no} successfully.`,
          // data: result[0]
        };
        res.json(msgret);
      }

    } catch (error) {
      // console.log(error.code);
      res.status(500);
      let msgret = {
        code: error.errno,
        msg: error.code,
        sqlMessage: error.sqlMessage
        // data: error
      };
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
    }

}


// Find來源單號名稱列表
export const findByOrdersName = async function(req, res) {
    console.log('findByOrdersName query = %s', req.query);
    console.log('findByOrdersName body = %s', req.body);
    console.log('findByOrdersName params = %s', req.params);

    // global.userConfig.reserve1 = req.params.id;
    console.log('userConfig:');
    console.log( global.userConfig);
    try {
      let Flds_comp = global.userConfig.flds_comp;
      const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
      const result = await Product.findByOrdersName(req.params.id, TABLE_NAME);
      console.log('result:');
      console.log(result);
      // res.json(result[0]);

      // if(result.result === 'not_found')
      if( isNullOrUndefined(result[0]) )
      {
        let msgret = {
          code: 500,
          msg: `Not found orders name.`
          // data: data
        };

        res.status(500);
        res.json(msgret);
        Logger.info('msgret = %s', msgret);
      }
      else{

        let msgret = {
          code: 200,
          msg: `findOne successfully`,
          data: result
        };
        res.json(msgret);
      }

    } catch (error) {
      // console.log(error.code);
      res.status(500);
      let msgret = {
        code: error.errno,
        msg: error.code,
        sqlMessage: error.sqlMessage
        // data: error
      };
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
    }

  }

// // find all published Product
// exports.findAllPublished = (req, res) => {
//   console.log('findAllPublished = %s', req.query);
//   // Product.getAllPublished((err, data) => {
//   //   if (err)
//   //     res.status(500).send({
//   //       message:
//   //         err.message || "Some error occurred while retrieving Products."
//   //     });
//   //   else res.send(data);
//   // });
//   // res.send(req);
//   let msg = {
//     message: req.query
//   };
//   res.json(msg);
// };

// Update a Product identified by the id in the request
export const update = async function(req, res) {
  console.log('update query = %s', req.query);
  console.log('update body = %s', req.body);
  console.log('update params = %s', req.params);
  const product = new Product({
    uid : req.body.uid,
    flds_comp : req.body.flds_comp,
    order_no : req.body.order_no,
    serial_no : req.body.serial_no,

    warehouse_type : req.body.warehouse_type,
    storage_location : req.body.storage_location,
    lot_no : req.body.lot_no,
    product_no : req.body.product_no,
    product_name : req.body.product_name,
    specification : req.body.specification,

    quantity : req.body.quantity,
    unit : req.body.unit,
    packing_quantity : req.body.packing_quantity,

    packing_unit : req.body.packing_unit,
    attribute1 : req.body.attribute1,
    attribute2 : req.body.attribute2,

    attribute3 : req.body.attribute3,
    attribute4 : req.body.attribute4,
    attribute5 : req.body.attribute5,
  });

  // product.uid = req.params.id;
  // 如果 req.body.ui_quantity === undefined 則預設為 0
  // product.ui_quantity = req.body.ui_quantity === undefined ?  0 : req.body.ui_quantity;
  product.ui_quantity = isNullOrUndefined(req.body.ui_quantity) ?  0 : req.body.ui_quantity;
  if( !(isNullOrUndefined(req.body.ui_check_state)) ){
    product.ui_check_state = req.body.ui_check_state;
  }
  product.c_warehouse_type = isNullOrUndefined(req.body.c_warehouse_type) ?  '' : req.body.c_warehouse_type;
  product.c_storage_location = isNullOrUndefined(req.body.c_storage_location) ?  '' : req.body.c_storage_location;

  try {
    // console.log('product = %s', product);
    // Logger.info('product = %s', product);
    // console.log(product);

    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    const result = await Product.updateById((req.params.id), product, TABLE_NAME);
    // const result = await Product.updateById((product.uid), product, TABLE_NAME);
    // const result = await Product.updateByParams((product.uid), product, TABLE_NAME);
    console.log(result[0]);

    // if(result.result === 'not_found')
    if( isNullOrUndefined(result[0]) )
    {
      let msgret = {
        code: 500,
        msg: `Not found uid: ${req.params.id}`
        // data: data
      };

      res.status(500);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
    }
    else{
      let msgret = {
        code: 200,
        msg: `Product updateById uid: ${product.uid} successfully.`,
        // data: result[0]
      };
      res.json(msgret);
    }

  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      code: error.errno,
      msg: error.code,
      sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }

}


// Find delete Product uid with order_no in the request
export const findDelete = async function(req, res) {
  console.log('findDelete query = %s', req.query);
  console.log('findDelete body = %s', req.body);
  console.log('findDelete params = %s', req.params);
  try {
    let Flds_comp = global.userConfig.flds_comp;
    let TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    let result1 = await removeParams(req.body, TABLE_NAME);
    console.log(result1);

    if( isNullOrUndefined(result1[0]) )
    {
      let msgret = {
        code: 500,
        msg: `Not found uid:${isNullOrUndefined(req.body.uid) ? 'ALL' : req.body.uid } & order_no:${isNullOrUndefined(req.body.order_no) ? 'ALL' : req.body.order_no}`
        // data: data
      };

      res.status(500);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
    }
    else{

      let msgret = {
        code: 200,
        msg: `delete product uid:${isNullOrUndefined(req.body.uid) ? 'ALL' : req.body.uid } & order_no:${isNullOrUndefined(req.body.order_no) ? 'ALL' : req.body.order_no} successfully.`,
        // data: result1
      };
      res.json(msgret);
    }

    let stockType = req.query.stock;
    switch (stockType) {
      case 'input':
        TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
        break;
      case 'output':
        TABLE_NAME = Flds_comp+'.rfid_out_flds_abc';
        break;
      case 'adjin':
        TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
        break;
      case 'adjout':
        TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
        break;
      case 'pkin':
        TABLE_NAME = Flds_comp+'.rfid_pkin_flds_abc';
        break;
      case 'pkout':
        TABLE_NAME = Flds_comp+'.rfid_pkout_flds_abc';
        break;
      default:
        // console.log(req.query.stock);
        let msgret = {
          code: 500,
          msg: `case: stock: ${req.query.stock} Undefined!`
          // data: data
        };
        res.status(500);
        res.json(msgret);
        return ;
    }
    result1 = await Product.removeParams(req.body, TABLE_NAME);
    console.log(result1);

    // // 依據 req.query.stock 刪除資料表與 rfid_ui_flds_a同步
    // if(  req.query.stock === 'input') {
    //   const TABLE_NAME = Flds_comp+'.rfid_in_flds_abc';
    //   const result1 = await Product.removeParams(req.body, TABLE_NAME);
    //   console.log(result1);
    // }
    // if(  req.query.stock === 'output') {
    //   const TABLE_NAME = Flds_comp+'.rfid_out_flds_abc';
    //   const result1 = await Product.removeParams(req.body, TABLE_NAME);
    //   console.log(result1);
    // }


  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      code: error.errno,
      msg: error.code,
      sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }

}

// Delete a Product with the specified id in the request
export const deleteID = async function(req, res) {
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);
  try {
    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    const result1 = await Product.remove(req.params.id, TABLE_NAME);
    // const result = await Product.findByPn(req.params.id);
    // console.log('result1:');
    console.log(result1);

    if( isNullOrUndefined(result1[0]) )
    {
      let msgret = {
        code: 400,
        msg: `Not found uid: ${req.params.id}`
        // data: data
      };

      res.status(400);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
    }
    else{
      let msgret = {
        code: 200,
        msg: `deleteOne successfully uid: ${req.params.id}`,
        // data: result1
      };
      res.json(msgret);
    }

  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      code: error.errno,
      msg: error.code,
      sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }

}

// // Delete all Product from the database.
// export asyncfunction deleteAll(req, res) {
//   console.log('delete query = %s', req.query);
//   console.log('delete body = %s', req.body);
//   console.log('delete params = %s', req.params);
//   try {

//     let Flds_comp = global.userConfig.flds_comp;
//     const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
//     const result1 = await removeAll(TABLE_NAME);
//     console.log(result1);

//     // Product.removeAll((err, data) => {
//     //   if (err)
//     //     res.status(500).send({
//     //       message:
//     //         err.message || "Some error occurred while removing all Products."
//     //     });
//     //   else res.send({ message: `All Products were deleted successfully!` });
//     // });
//     // res.send(req);
//     let msgret = {
//       code: 200,
//       msg: `deleted ${result1.affectedRows} successfully `,
//       // data: result1
//     };
//     res.json(msgret);

//   } catch (error) {
//     // console.log(error.code);
//     res.status(500);
//     let msgret = {
//       code: error.errno,
//       msg: error.code,
//       sqlMessage: error.sqlMessage
//       // data: error
//     };
//     res.json(msgret);
//     Logger.info('msgret = %s', msgret);
//   }

// }
