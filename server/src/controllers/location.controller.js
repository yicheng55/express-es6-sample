'use strict';
const async = require('async');
const { isNullOrUndefined } = require('url/util.js');
const Location = require('../models/location_table.model.js');
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

  try {
    const location_table = new Location({
      luid : '',
      warehouse_type : req.body.warehouse_type,
      storage_location : req.body.storage_location,
      epc : req.body.epc,
      name : req.body.name,
      check_state: req.body.check_state,
      description : req.body.description,
    });
    console.log('Location = %s', location_table);
    // uid = (品號,批號,庫別,儲位)組合成
    // let uidstr = req.body.product_no + ((req.body.lot_no === null) ? '' : req.body.lot_no)  + req.body.warehouse_type + req.body.storage_location;
    let location_type = global.userConfig.location_type;
    let uidstr = location_type + req.body.warehouse_type + req.body.storage_location;
    location_table.luid = uidstr;
    console.log('Location = %s', location_table);

    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.location_tables';

      // 第二種方式同步語法
      const result2 = await Location.create(location_table, TABLE_NAME);
      console.log('result2');
      console.log(result2);
      // res.json(result2);
      let msgret = {
        code: 200,
        msg: `Location creat successfully  luid: ${result2.luid}`,
        data: result2
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

  // let table = 'products';
  // const promise1 = await Location.getAll(table);
  // console.log('promise1');
  // console.log(promise1);
  // // res.json(promise1);

  // table = 'location_tables';
  let table = `${global.userConfig.flds_comp}.location_tables`;
  // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
  console.log('table: %s', table);
  const promise2 = await Location.getAll(table);
  console.log('promise2');
  console.log(promise2);
  // res.json(promise2);

  let msgret = {
    code: 200,
    msg: `Location findAll successfully.`,
    data: promise2
  };
  res.json(msgret);
};



// 同步功能實現 async/await/Promise .
exports.findSearch = async(req, res) => {
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
    let table = `${global.userConfig.flds_comp}.location_tables`;
    // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
    console.log('table: %s', table);
    const result = await Location.findSearch(table, req.query);
    console.log('result');
    console.log(result);
    // res.json(promise2);

    if(isNullOrUndefined(result[0])){
      let msgret = {
        code: 200,
        msg: `Location Not find list.`,
        // data: result
      };
      res.json(msgret);
      return ;
    }

    let msgret = {
      code: 200,
      msg: `Location findSearch successfully.`,
      data: result
    };
    res.json(msgret);

  } catch (error) {
    console.log(error);
    // console.log(result_LocationID);
    res.status(500);
    let msgret = {
      code: 500,
      msg: 'findSearch error.',
      // sqlMessage: error.sqlMessage
      // data: error
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);
  }

};


// Find a single Location by Id
exports.findOne = async(req, res) => {
  console.log('location findOne query = %s', req.query);
  console.log('findOne body = %s', req.body);
  console.log('findOne params = %s', req.params);
  // JSON.stringify(shelfrecord)
  let Flds_comp = global.userConfig.flds_comp;
  const TABLE_NAME = Flds_comp+'.location_tables';

  try {
    let result;
    if(req.params.id === 'epc')
    {
      result = await Location.findByEpc(req.query, TABLE_NAME);
      // 檢查aTag所屬區域正確?
      // if(chklocations){}

      let msgret = {
        code: 200,
        msg: `Find EPC successfully!`,
        data: JSON.parse(JSON.stringify(result)),
      };
      res.json(msgret);

      console.log('result');
      // console.log(result);
      // res.status(result.code);
      // res.json(result);
      // return ;
    }
    else if(req.params.id === 'location_id')
    {
      result = await Location.findByLocation(req.query, TABLE_NAME);
      if( isNullOrUndefined(result[0]) )
      {
        let msgret = {
          code: 500,
          msg: `location_id Not found...`
          // data: data
        };

        res.status(500);
        res.json(msgret);
        Logger.info('msgret = %s', msgret);
      }
      else{
        let msgret = {
          code: 200,
          msg: `Find location_id successfully!`,
          data: result
        };
        res.json(msgret);
      }
    }
    else {
      result = await Location.findById(req.params.id, TABLE_NAME);
      console.log('result');
      console.log(result);

      // if( isNullOrUndefined(result) )
      // {
      //   let msgret = {
      //     code: 500,
      //     msg: `Not found uid: ${req.params.id}`
      //     // data: data
      //   };

      //   res.status(500);
      //   res.json(msgret);
      //   Logger.info('msgret = %s', msgret);
      // }
      // else{

      //   let msgret = {
      //     code: 200,
      //     msg: `Location findOne successfully.`,
      //     data: result
      //   };
      //   res.json(msgret);
      //   // res.json(result[0]);
      // }

      let msgret = {
        code: 200,
        msg: `Location findOne successfully.`,
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
};

// Update a Location identified by the id in the request
exports.update = async(req, res) => {
  console.log('update query = %s', req.query);
  console.log('update body = %s', req.body);
  console.log('update params = %s', req.params);
  try {

    if(req.params.id === 'epc')
    {
      const location_table = new Location({
        luid :  req.body.luid,
        warehouse_type : req.body.warehouse_type,
        storage_location : req.body.storage_location,
        epc : req.body.epc,
        name : req.body.name,
        description : req.body.description,
        check_state: req.body.check_state,
      });

      const Flds_comp = global.userConfig.flds_comp;
      const TABLE_NAME = Flds_comp+'.location_tables';
      let result = await Location.findByEpc(req.query, TABLE_NAME);
      console.log(result);
      if( isNullOrUndefined(result[0]) )
      {
        let msgret = {
          code: 200,
          msg: `Not Find epc= ${req.query.epc}`,
          // data: result,
        };
        res.json(msgret);
        return ;
      }
      // location_table.luid = result[0].luid;
      // delete  location_table.luid;
      // let Flds_comp = global.userConfig.flds_comp;
      // let TABLE_NAME = Flds_comp+'.location_tables';
      let result1 = await Location.updateById((result[0].luid), location_table, TABLE_NAME);
      console.log('result1');
      console.log(result1);

      // if(result.result === 'not_found')
      if( isNullOrUndefined(result1[0]) )
      {
        let msgret = {
          code: 200,
          msg: `Location Not find epc= ${req.query.epc}`,
          data: result1,
        };
        res.json(msgret);
      }
      else{
        let msgret = {
          code: 200,
          // msg: `Location unbind successfully.`,
          msg: `Location update epc= ${req.query.epc}`,
          data: result1,
        };
        res.json(msgret);
      }

      // let msgret = {
      //   code: 200,
      //   msg: `Location update By Epc successfully.`,
      //   // data: result
      // };
      // res.json(msgret);
      // console.log(req.body);
      return;
    }
    else if(req.params.id === 'location_id')
    {
      const location_table = new Location({
        luid :  req.body.luid,
        warehouse_type : req.body.warehouse_type,
        storage_location : req.body.storage_location,
        epc : req.body.epc,
        name : req.body.name,
        description : req.body.description,
        check_state: req.body.check_state,
      });
      console.log('location_table:');
      console.log(location_table);

      let Flds_comp = global.userConfig.flds_comp;
      let TABLE_NAME = Flds_comp+'.location_tables';
      let result1 = await Location.updateById(req.query.luid, location_table, TABLE_NAME);
      console.log('result1');
      console.log(result1);

      // if(result.result === 'not_found')
      if( isNullOrUndefined(result1[0]) )
      {
        let msgret = {
          code: 200,
          msg: `Location Not find epc= ${req.query.luid}`,
          data: result1,
        };
        res.json(msgret);
      }
      else{
        let msgret = {
          code: 200,
          // msg: `Location unbind successfully.`,
          msg: `Location update location_id= ${req.query.luid}`,
          data: result1,
        };
        res.json(msgret);
      }

      // // result = await Location.findByLocation(req.query, TABLE_NAME);
      // let msgret = {
      //   code: 200,
      //   msg: `Update location_id successfully!`,
      //   // data: result
      // };
      // res.json(msgret);
      return;
    }
    else {
      const location_table = new Location({
        // luid : '',
        warehouse_type : req.body.warehouse_type,
        storage_location : req.body.storage_location,
        epc : req.body.epc,
        name : req.body.name,
        description : req.body.description,
        check_state: req.body.check_state,
      });

      location_table.luid = req.params.id;
      // console.log('Location = %s', Location);
      Logger.info('location_tables = %s', location_table);


      let Flds_comp = global.userConfig.flds_comp;
      const TABLE_NAME = Flds_comp+'.location_tables';
      const result = await Location.updateById((req.params.id), location_table, TABLE_NAME);
      console.log(result);

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
          msg: `Location updateById successfully.`,
          data: result
        };
        res.json(msgret);
      }

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
};

// Delete a Location with the specified id in the request
exports.delete = async(req, res) => {
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);
  // JSON.stringify(req.params.id)

  try {
    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.location_tables';
    const result1 = await Location.remove(req.params.id, TABLE_NAME);
    // const result = await Product.findByPn(req.params.id);
    // console.log('result1:');
    console.log(result1);

    if(result1.result === 'not_found'){
      let msgret = {
        code: 500,
        msg: `Not found luid: ${req.params.id}`
        // data: data
      };

      res.status(500);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
    }
    else{
      let msgret = {
        code: 200,
        msg: `deleteOne successfully luid: ${req.params.id}`,
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


  // Location.remove(req.params.id, (err, data) => {
  // // Location.remove(JSON.stringify(req.params.id), (err, data) => {
  //   if (err) {
  //     if (err.result === "not_found") {
  //       let msg = {
  //         message: `Not found Location with id ${req.params.id}.`
  //       };
  //       res.status(404);
  //       res.json(msg);
  //       // res.status(404).send({
  //       //   message: `Not found Location with id ${req.params.id}.`
  //       // });
  //     } else {

  //       let msg = {
  //         message: "Could not delete Location with id " + req.params.id
  //       };
  //       res.status(500);
  //       res.json(msg);
  //       // res.status(500).send({
  //       //   message: "Could not delete Location with id " + req.params.id
  //       // });
  //     }
  //   }
  //     else{
  //       let msg = {
  //         message: `Location was deleted successfully!`
  //       };
  //       res.json(msg);
  //     }
  // });
};

// Delete all Location from the database.
exports.deleteAll = async(req, res) => {
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);

  try {

    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.location_tables';
    const result1 = await Location.removeAll(TABLE_NAME);
    console.log(result1);

    // Product.removeAll((err, data) => {
    //   if (err)
    //     res.status(500).send({
    //       message:
    //         err.message || "Some error occurred while removing all Products."
    //     });
    //   else res.send({ message: `All Products were deleted successfully!` });
    // });
    // res.send(req);
    let msgret = {
      code: 200,
      msg: `deleted ${result1.affectedRows} successfully `,
      // data: result1
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

};

// 儲位綁定 EPC
exports.bind = async(req, res) => {
  console.log('bind query = %s', req.query);
  console.log('bind body = %s', req.body);
  console.log('bind params = %s', req.params);
  // let table = 'products';
  try {
    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.location_tables';
    let result = await Location.findByEpc(req.query, TABLE_NAME);
    console.log(result);
    if( !(isNullOrUndefined(result[0])) )
    {
      let msgret = {
        code: 200,
        msg: `Already bind epc= ${req.query.epc}`,
        data: result,
      };
      res.json(msgret);
      return ;
    }

    req.body.epc = req.query.epc;
    // result[0].epc = '';
    // result[0].timestamp =  new Date().toISOString().slice(0, 19).replace('T', ' ');

    // let Flds_comp = global.userConfig.flds_comp;
    // let TABLE_NAME = Flds_comp+'.location_tables';
    let result1 = await Location.updateById((req.body.luid), req.body, TABLE_NAME);
    console.log('result1');
    console.log(result1);

    let msgret = {
      code: 200,
      msg: `product bind successfully.`,
      data: result1
    };
    res.json(msgret);
    console.log(result1);

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
};

// 儲位解綁 EPC
exports.unbind = async(req, res) => {
  console.log('unbind query = %s', req.query);
  console.log('unbind body = %s', req.body);
  console.log('unbind params = %s', req.params);
  let unbind_result = [];
  // let table = 'products';
  try {

      // const location_table = new Location({
      //   luid : req.body.luid,
      //   warehouse_type : req.body.warehouse_type,
      //   storage_location : req.body.storage_location,
      //   // 解綁 EPC為''
      //   epc : '',
      //   name : req.body.name,
      //   description : req.body.description,
      //   check_state: req.body.check_state,
      // });
      // console.log('Location = %s', Location);

      // Logger.info('location_tables = %s', location_table);
      const Flds_comp = global.userConfig.flds_comp;
      const TABLE_NAME = Flds_comp+'.location_tables';
      let result = await Location.findByEpc(req.query, TABLE_NAME);
      // 檢查aTag所屬區域正確?
      // if(chklocations){}

      console.log('result');
      console.log(result);
      if( isNullOrUndefined(result[0]) )
      {
        let msgret = {
          code: 200,
          msg: `Not Find epc= ${req.query.epc}`,
          // data: result,
        };
        res.json(msgret);
        return ;
      }
      // let msgret = {
      //   code: 200,
      //   msg: `Find EPC successfully!`,
      //   data: result,
      // };
      // res.json(msgret);
      result[0].epc = '';
      result[0].timestamp =  new Date().toISOString().slice(0, 19).replace('T', ' ');

      // let Flds_comp = global.userConfig.flds_comp;
      // let TABLE_NAME = Flds_comp+'.location_tables';
      let result1 = await Location.updateById((result[0].luid), result, TABLE_NAME);
      console.log('result1');
      console.log(result1);

      // if(result.result === 'not_found')
      if( isNullOrUndefined(result1[0]) )
      {
        let msgret = {
          code: 200,
          msg: `Location Not find epc= ${req.query.epc}`,
          data: result,
        };
        res.json(msgret);
      }
      else{
        let msgret = {
          code: 200,
          // msg: `Location unbind successfully.`,
          msg: `Location unbind epc= ${req.query.epc}`,
          data: result,
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
};
