'use strict';
import async from 'async';
import fetch from 'node-fetch';
import { isNullOrUndefined, log as utilLog } from 'util/util.js';
import Product from '../models/product.model.js';
import { Controllerlogger as Logger } from '../comm/logger.js';
import { logErr as LogErr } from '../comm/logger.js';
import { join } from 'path';
import { stat as _stat, writeFileSync } from 'fs';

// test code.
// utilLog("TTTTTTTAAAAAA %s  %s",'YYYYY' ,'UUUUUU');

let Flds_table = 'products';
// Create and Save a new Product
export const create = async function(req, res) {
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

  const product = new Product({
    product_no : req.body.product_no,
    product_name : req.body.product_name,
    classift : req.body.classift,
    specification : req.body.specification,
    unit : req.body.unit,
    remake : req.body.remake,

    attribute1 : req.body.attribute1,
    attribute2 : req.body.attribute2,
    attribute3 : req.body.attribute3,
    attribute4 : req.body.attribute4,
    reserve : req.body.reserve,
  });
  // console.log('product = %s', product);
  try {

    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
    console.log('product = %s', product);

    const result2 = await Product.create(product, TABLE_NAME);
    console.log('result2');
    console.log(result2);

    let msgret = {
      code: 200,
      msg: `product creat successfully  product_no: ${product.product_no}`
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
    Logger.info('msgret = %s', JSON.stringify(msgret));

    let logerfunc = `export const findOne()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);
  }

}

// 同步功能實現 async/await/Promise .
export const findAll = async function(req, res) {
  console.log('findAll query = %s', req.query);
  console.log('findAll body = %s', req.body);
  console.log('findAll params = %s', req.params);
  // let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;

  const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
  console.log('TABLE_NAME: %s', TABLE_NAME);
  try {
    const result = await Product.getAll(TABLE_NAME);
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

  try {
    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;

    console.log('TABLE_NAME: %s', TABLE_NAME);
    const result = await Product.findSearch(TABLE_NAME, req.query);
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
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';

    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
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
        msg: `Not found product_no: ${req.params.id}`
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

// Update a Product identified by the id in the request
export const update = async function(req, res) {
  console.log('update query = %s', req.query);
  console.log('update body = %s', req.body);
  console.log('update params = %s', req.params);
  const product = new Product({
    product_no : req.body.product_no,
    product_name : req.body.product_name,
    classift : req.body.classift,
    specification : req.body.specification,
    unit : req.body.unit,
    remake : req.body.remake,

    attribute1 : req.body.attribute1,
    attribute2 : req.body.attribute2,
    attribute3 : req.body.attribute3,
    attribute4 : req.body.attribute4,
    reserve : req.body.reserve,
  });

  try {
    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    const result = await Product.updateById((req.params.id), product, TABLE_NAME);
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
        msg: `Product updateById product_no: ${product.product_no} successfully.`,
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

// Delete a Product with the specified id in the request
export const deleteID = async function(req, res) {
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);
  try {
    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
    // let Flds_comp = global.userConfig.flds_comp;
    // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
    const result1 = await Product.remove(req.params.id, TABLE_NAME);
    // const result = await Product.findByPn(req.params.id);
    // console.log('result1:');
    console.log(result1);

    if( isNullOrUndefined(result1[0]) )
    {
      let msgret = {
        code: 400,
        msg: `Not found product_no: ${req.params.id}`
        // data: data
      };

      res.status(400);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
    }
    else{
      let msgret = {
        code: 200,
        msg: `deleteOne successfully product_no: ${req.params.id}`,
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
