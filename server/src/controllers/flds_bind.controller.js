'use strict';
const async = require('async');
const Product = require('../models/product.model.js');
const Location = require('../models/location_table.model.js');
const Flds_bind = require('../models/flds_bind.model.js');
const Logger = require('../comm/logger').Controllerlogger;

// Logger.info('//*********************** location_table.controller.js start..... *******************// ');

// Create and Save a new location_table
exports.create = async(req, res) => {
  // Validate request
  console.log('create query = %s', req.query);
  console.log('create body = %s', req.body);
  console.log('create params = %s', req.params);

  if (!req.body) {
    let msg = {
      message: "Content can not be empty!"
    };
    res.status(400);
    res.json(msg);
    return ;
  }


  let resultProduct = await Product.findByLocation_id(req.body.uid);
  // resultProduct = JSON.parse(JSON.stringify(resultProduct));
  // console.log('resultProduct');
  // console.log(resultProduct);
  // console.log(resultProduct[0].warehouse_type + ':' + resultProduct[0].storage_location);
  Logger.debug('resultProduct = %s', resultProduct);

  console.log('resultProduct[0]');
  console.log(resultProduct[0]);

  if(resultProduct[0] === undefined ){

    // console.log('儲位綁定錯誤...');
    Logger.info('Error = %s', 'Products uid undefined error...');

    // let str = "Bind warehouse_type or storage_location error... ";
    // res.json('PRIMARY KEY DUPLICATE.');
    let msg = {
      result: "Products uid undefined error... "
    };
    res.status(500);
    res.json(msg);
    return;
  }

  let resultLocation = await Location.findById(req.body.location_id);
  resultLocation = JSON.parse(JSON.stringify(resultLocation));
  // console.log('resultLocation');
  // console.log(resultLocation);
  // console.log(resultLocation[0].warehouse_type + ':' + resultLocation[0].storage_location);
  Logger.debug('resultLocation = %s', resultLocation[0]);
  if(resultProduct[0].luid !== resultLocation[0].luid){

    // console.log('儲位綁定錯誤...');
    Logger.info('Error = %s', '儲位綁定錯誤...');

    // let str = "Bind warehouse_type or storage_location error... ";
    // res.json('PRIMARY KEY DUPLICATE.');
    let msg = {
      result: "Bind warehouse_type or storage_location error... "
    };
    res.status(500);
    res.json(msg);
    return;

  }
  // res.json(resultProduct[0]);
  // return ;

  // // 檢查 Products 和 location_tables 的 庫別和櫃位 若不相同則返回錯誤.
  // if( (resultProduct[0].warehouse_type !== resultLocation[0].warehouse_type) || (resultProduct[0].storage_location !== resultLocation[0].storage_location) ){

  //   // console.log('儲位綁定錯誤...');
  //   Logger.info('Error = %s', '儲位綁定錯誤...');

  //   // let str = "Bind warehouse_type or storage_location error... ";
  //   // res.json('PRIMARY KEY DUPLICATE.');
  //   let msg = {
  //     result: "Bind warehouse_type or storage_location error... "
  //   };
  //   res.status(500);
  //   res.json(msg);
  //   return;
  // }


  const flds_bind = new Flds_bind({
    uid : req.body.uid,
    users_id : req.body.users_id,
    location_id : req.body.location_id,
  });

//   // uid = (品號,批號,庫別,儲位)組合成
//   // let uidstr = req.body.product_no + ((req.body.lot_no === null) ? '' : req.body.lot_no)  + req.body.warehouse_type + req.body.storage_location;
//   let location_type = '1100'
//   let uidstr = location_type + req.body.warehouse_type + req.body.storage_location;
//   location_table.luid = uidstr;
  // console.log('flds_bind = %s', flds_bind);

  const result1 = await Flds_bind.findById(req.body);
  // let str = `Flds_bind: '${flds_bind.uid}' && location_id:'${flds_bind.location_id}' for key 'PRIMARY' `;

  // console.log('result1:');
  // console.log(result1);
  Logger.debug('Flds_bind: %s', JSON.stringify(result1));

  // let str = `Duplicate entry uid:'${flds_bind.uid}' && location_id:'${flds_bind.location_id}' for key 'PRIMARY' `;
  // Logger.info('Flds_bind: %s', Flds_bind);
//   res.json(result1);

  // 新增1筆資料
  // 第一種方式同步語法
  // await Location.create(Location)
  //   .then(results => {
  //     console.log('results');
  //     console.log(results);
  //   })
  //   .catch(err => {
  //     // console.log('Location.create.catch' + err);
  //     res.status(400);
  //     res.json('Location.create.catch err');
  //     // return;
  //   });

  // 檢查 PRIMARY KEY 是否存在?? 不存在則建立.
  if(result1.result === 'not_found')
  {
    // 第二種方式同步語法
    const result2 = await Flds_bind.create(flds_bind);
    console.log('result2');
    console.log(result2);
    res.json(result2);
  }
  else{
    // let str = "Duplicate entry '" + flds_bind + "' for key 'PRIMARY'";
    // res.json('PRIMARY KEY DUPLICATE.');
    let str = `Duplicate entry uid:'${flds_bind.uid}' && location_id:'${flds_bind.location_id}' for key 'PRIMARY' `;
    Logger.info(str);
    let msg = {
      result: str
    };
    res.status(500);
    res.json(msg);
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
};

// async function sequentialQueries() {
//   let table = 'products';
//   const promise1 = await Product.getAll(table);
//   console.log('promise1');
//   console.log(promise1);
//   // res.json(promise1);

//   table = 'activereaders';
//   const promise2 = await Product.getAll(table);
//   console.log('promise2');
//   console.log(promise2);
//   // res.json(promise2);

//   table = 'activetagids';
//   const promise3 = await Product.getAll(table);
//   console.log('promise3');
//   console.log(promise3);
//   return promise3

// }

// 同步功能實現 async/await/Promise .
exports.findAll = async(req, res) => {
  console.log('findAll query = %s', req.query);
  console.log('findAll body = %s', req.body);
  console.log('findAll params = %s', req.params);

  let table = 'flds_binds';
  const promise1 = await Flds_bind.getAll(table);
  console.log('promise1');
  console.log(promise1);
  res.json(promise1);

//   table = 'location_tables';
//   const promise2 = await Flds_bind.getAll(table);
//   console.log('promise2');
//   console.log(promise2);
//   res.json(promise2);

//   table = 'activetagids';
//   const promise3 = await Flds_bind.getAll(table);
//   console.log('promise3');
//   console.log(promise3);
//   res.json(promise1);
};

// Find a single Location by Id
exports.findOne = async(req, res) => {
  console.log('findOne query = %s', req.query);
  console.log('findOne body = %s', req.body);
  console.log('findOne params = %s', req.params);
  // JSON.stringify(shelfrecord)
  let result;
  if(req.params.id === 'uid')
  {
    // 品號uid找所有儲位
    result = await Flds_bind.findByuId(req.query);
  }
  else if(req.params.id === 'location'){
    // 儲位ID找所有品號
    result = await Flds_bind.findByLocationId(req.query);
  }
  else {
    // 品號uid + 儲位ID找單筆記錄
    result = await Flds_bind.findById(req.query);
  }

  console.log('result');
  console.log(result);
  res.json(result);
};

// Update a Location identified by the id in the request
exports.update = async(req, res) => {
  console.log('update query = %s', req.query);
  console.log('update body = %s', req.body);
  console.log('update params = %s', req.params);
  const flds_bind = new Flds_bind({
    uid : req.body.uid,
    users_id : req.body.users_id,
    location_id : req.body.location_id,
  });

//   location_table.luid = req.params.id;
  // console.log('Location = %s', Location);
  Logger.info('flds_bind = %s', flds_bind);
  const result1 = await Flds_bind.updateById(req.params.id, flds_bind);
  console.log('result1:');
  console.log(result1);
  res.json(result1);

  // Product.updateById( JSON.stringify(req.params.id), product,(err, data) => {
//   Flds_bind.updateById((req.params.id), flds_bind,(err, data) => {
//       if (err) {
//         if (err.result === "not_found") {
//           let msg = {
//             result: `Not found flds_bind with id ${req.params.id}.`
//           };
//           res.status(404);
//           res.json(msg);
//         } else {
//           let msg = {
//             result: "Error updating flds_bind with id " + req.params.id
//           };
//           res.status(500);
//           res.json(msg);
//         }
//       } else {
//         res.json(data);
//       }
//     });
};

// Delete a Location with the specified id in the request
exports.delete = async(req, res) => {
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);

//   Logger.info('flds_bind = %s', flds_bind);
  const result1 = await Flds_bind.remove(req.query);
  console.log('result1:');
  console.log(result1);
  res.json(result1);

//   // JSON.stringify(req.params.id)
//   Flds_bind.remove(req.params.id, (err, data) => {
//   // Flds_bind.remove(JSON.stringify(req.params.id), (err, data) => {
//     if (err) {
//       if (err.result === "not_found") {
//         let msg = {
//           message: `Not found Flds_bind with id ${req.params.id}.`
//         };
//         res.status(404);
//         res.json(msg);
//         // res.status(404).send({
//         //   message: `Not found Flds_bind with id ${req.params.id}.`
//         // });
//       } else {

//         let msg = {
//           message: "Could not delete Flds_bind with id " + req.params.id
//         };
//         res.status(500);
//         res.json(msg);
//         // res.status(500).send({
//         //   message: "Could not delete Flds_bind with id " + req.params.id
//         // });
//       }
//     }
//       else{
//         let msg = {
//           message: `Flds_bind was deleted successfully!`
//         };
//         res.json(msg);
//       }
//   });
};

// Delete all Location from the database.
exports.deleteAll = (req, res) => {
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);
  // Flds_bind.removeAll((err, data) => {
  //   if (err)
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while removing all Flds_bind."
  //     });
  //   else res.send({ message: `All Flds_bind were deleted successfully!` });
  // });
  // res.send(req);
  let msg = {
    message: req.body
  };
  res.json(msg);
};


// truncate a table
exports.truncate = async(req, res) => {
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);

//   Logger.info('flds_bind = %s', flds_bind);
  const result1 = await Flds_bind.truncate(req.query);
  console.log('result1:');
  console.log(result1);
  res.json(result1);

};
