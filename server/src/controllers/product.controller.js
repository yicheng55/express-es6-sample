'use strict';
import async from 'async';
import fetch from 'node-fetch';
import { isNullOrUndefined, log as utilLog } from 'util/util.js';
import Product from '../models/product.model.js';
import { Controllerlogger as Logger } from '../comm/logger.js';
import { logErr as LogErr } from '../comm/logger.js';
import formatDate from '../util/utilFunction.js';
import {service}  from '../config/user.def.js';

// test code.
// utilLog("TTTTTTTAAAAAA %s  %s",'YYYYY' ,'UUUUUU');

// let Flds_table = 'flds_dept';
let Flds_table = 'products';
// Create and Save a new Product
export const create = async function(req, res) {
  console.log('create query = %s', req.query);
  console.log('create body = %s', req.body);
  console.log('create params = %s', req.params);

  if (!req.body) {
    let msgret = {
      service: service.web,
      code: 400,
      msg: "Content can not be empty!",
      data: []
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
    // console.log('result2');
    // console.log(result2);

    let msgret = {
      service: service.web,
      code: 200,
      msg: `product creat successfully  product_no: ${product.product_no}`,
      data: []
    };
    res.json(msgret);

  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      service: service.db,
      code: error.errno,
      msg: error.code,
      data:[{msg: error.sqlMessage}]
    };
    res.json(msgret);
    Logger.info('msgret = %s', JSON.stringify(msgret));

    let logerfunc = `export const create()`;
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
    const result1 = await Product.getAll(TABLE_NAME);
    // console.log('result');
    console.log(result1);
    if(isNullOrUndefined(result1[0])){
      let msgret = {
        service: service.db,
        code: 404,
        msg: `Flds_user Not find list.`,
        data: []
      };
      // 請求已成功處理，但未返回任何內容
      res.status(200);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
      return ;
    }

    const result = result1.map(function(row){
      return Object.assign({}, row, { createtime: formatDate(row.createtime),  updatetime: formatDate(row.updatetime) });
    });

    res.status(200);
    let msgret = {
      service: service.web,
      code: 200,
      msg: `product findAll lists.`,
      data: result
    };
    res.json(msgret);

  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      service: service.db,
      code: error.errno,
      msg: error.code,
      data:[{msg: error.sqlMessage}]
    };

    res.json(msgret);
    Logger.info('msgret = %s', msgret);

    let logerfunc = `export const findAll()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }
}

export const findSearch = async function(req, res) {
  console.log('findSearch query = %s', req.query);
  console.log('findSearch body = %s', req.body);
  console.log('findSearch params = %s', req.params);

  try {
    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;

    console.log('TABLE_NAME: %s', TABLE_NAME);
    const result1 = await Product.findSearch(TABLE_NAME, req.query);
    // console.log('result1');
    console.log(result1);
    // res.json(promise2);

    if(isNullOrUndefined(result1[0])){
      let msgret = {
        service: service.db,
        code: 404,
        msg: `Products Not find list.`,
        data: []
      };
      res.status(200);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);
      return ;
    }

    const result = result1.map(function(row){
      return Object.assign({}, row, { createtime: formatDate(row.createtime),  updatetime: formatDate(row.updatetime) });
    });

    res.status(200);
    let msgret = {
      service: service.web,
      code: 200,
      msg: `Products findSearch successfully.`,
      data: result
    };
    res.json(msgret);

  } catch (error) {
    res.status(500);
    let msgret = {
      service: service.db,
      code: error.errno,
      msg: error.code,
      data:[{msg: error.sqlMessage}]
    };

    res.json(msgret);
    Logger.info('msgret = %s', msgret);

    let logerfunc = `export const findSearch()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }

}

// Find a single Product by Id
export const findOne = async function(req, res) {
  console.log('findOne query = %s', req.query);
  console.log('findOne body = %s', req.body);
  console.log('findOne params = %s', req.params);

  try {
      // let Flds_comp = global.userConfig.flds_comp;
      // const TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';

      const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
      const result1 = await Product.findById(req.params.id, TABLE_NAME);
      console.log(result1);
      if( isNullOrUndefined(result1[0]) )
      {
        let msgret = {
          service: service.db,
          code: 404,
          msg: `Not found product_no: ${req.params.id}`,
          data: []
        };
        // 請求已成功處理，但未返回任何內容
        res.status(200);
        res.json(msgret);
        Logger.info('msgret = %s', msgret);
        return ;
      }

      const result = result1.map(function(row){
        return Object.assign({}, row, { createtime: formatDate(row.createtime),  updatetime: formatDate(row.updatetime) });
      });
      res.status(200);
      let msgret = {
        service: service.web,
        code: 200,
        msg: `find  product successfully`,
        data: result
      };
      res.json(msgret);

  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      service: service.db,
      code: error.errno,
      msg: error.code,
      data:[{msg: error.sqlMessage}]
    };

    res.json(msgret);
    Logger.info('msgret = %s', msgret);

    let logerfunc = `export const findOne()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }

}

// Update a Product identified by the id in the request
export const update = async function(req, res) {
  console.log('update query = %s', req.query);
  console.log('update body = %s', req.body);
  console.log('update params = %s', req.params);
  const product = new Product({
    product_no : req.params.id,
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
    // console.log(result[0]);
    console.log(result);
    // if(result.result === 'not_found')
    if( isNullOrUndefined(result[0]) )
    {
      let msgret = {
        service: service.db,
        code: 404,
        msg: `Not find product_no: ${product.product_no}.`,
        data: []
      };

      res.status(200);
      res.json(msgret);
      Logger.info('msgret = %s', msgret);

      let logerfunc = `export const update()`;
      let logermsg = `${JSON.stringify(msgret)}`;
      LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);
      return ;
    }

    let msgret = {
      service: service.web,
      code: 200,
      msg: `Product updateById product_no: ${product.product_no} successfully.`,
      data: []
    };
    res.json(msgret);


  } catch (error) {
    // console.log(error.code);
    res.status(500);
    let msgret = {
      service: service.db,
      code: error.errno,
      msg: error.code,
      data:[{msg: error.sqlMessage}]
    };
    res.json(msgret);
    Logger.info('msgret = %s', msgret);

    let logerfunc = `export const update()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }

}

// Delete a Product with the specified id in the request
export const deleteID = async function(req, res) {
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);
  try {
    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
    const result1 = await Product.remove(req.params.id, TABLE_NAME);
    console.log(result1);

    if( isNullOrUndefined(result1[0]) )
    {
      let msgret = {
        service: service.db,
        code: 404,
        msg: `Delete not found product_no: ${req.params.id}`,
        data: []
      };

      res.status(200);
      res.json(msgret);
      Logger.info('msgret = %s', JSON.stringify(msgret));

      let logerfunc = `export const deleteID()`;
      let logermsg = `${JSON.stringify(msgret)}`;
      LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

    }
    else{
      let msgret = {
        service: service.web,
        code: 200,
        msg: `deleteOne successfully product_no: ${req.params.id}`,
        data: []
      };
      res.json(msgret);
    }

  } catch (error) {
    res.status(500);
    let msgret = {
      service: service.db,
      code: error.errno,
      msg: error.code,
      data:[{msg: error.sqlMessage}]
    };

    res.json(msgret);
    Logger.info('msgret = %s', JSON.stringify(msgret));

    let logerfunc = `export const create()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }

}


export const bind_update = async(req, res) => {
  console.log('bind_update query = %s', req.query);
  console.log('bind_update body = %s', req.body);
  console.log('bind_update params = %s', req.params);

  try {
    const params = {
      order_no : req.query.order_no,
      uid : req.params.id,
    };

    let Flds_comp = global.userConfig.flds_comp;
    // console.log(req.query.stock);
    let stockType = req.query.stock;
    let TABLE_NAME ='';
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
          TABLE_NAME = Flds_comp+'.rfid_adjin_flds_abc';
          break;
      case 'pkout':
          TABLE_NAME = Flds_comp+'.rfid_adjout_flds_abc';
          break;
      default:
          TABLE_NAME = Flds_comp+'.rfid_ui_flds_a';
          break;
    }

    const result3 = await Product.updateByParams(params,  req.body, TABLE_NAME);
    console.log('result3');
    console.log(result3[0]);
    let msgret = {
      code: 200,
      msg: `Product bind_update uid:${params.uid}, order_no:${params.order_no} successfully.`,
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
