'use strict';
import async from 'async';
import moment from 'moment';
import { isNullOrUndefined } from 'util/util.js';
import Flds_user from '../models/flds_user.model.js';
// import { Controllerlogger as Logger } from '../comm/logger.js';
import { Controllerlogger as Logger } from '../comm/logger.js';
import { logErr as LogErr } from '../comm/logger.js';
import formatDate from '../util/utilFunction.js';
import {service, config02}  from '../config/user.def.js';
// console.log(service);


let Flds_table = 'flds_user';
// Create and Save a new Flds_user
export const create = async function(req, res){
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
    const flds_user = new Flds_user({
      user_id : req.body.user_id,
      name : req.body.name,
      state: req.body.state,
      deptid : req.body.deptid,
      password : req.body.password,
    });
    console.log('Flds_user = %s', flds_user);

    // let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;

      // 第二種方式同步語法
      const result2 = await Flds_user.create(flds_user, TABLE_NAME);
      console.log('result2');
      console.log(result2);
      // res.json(result2);
      let msgret = {
        service: service.web,
        code: 200,
        msg: `Flds_user creat successfully  user_id: ${result2.user_id}`,
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
    // LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);

  }

}

// 同步功能實現 async/await/Promise .
// 此(函式表達式)完全可以被箭頭函式取代
// export const findAll = async function(req, res){
// (函式表達式)完全可以被箭頭函式取代(req, res) =>
export const findAll = async (req, res) => {
// export async function findAll(req, res){
  console.log('findAll query = %s', req.query);
  console.log('findAll body = %s', req.body);
  console.log('findAll params = %s', req.params);
  // let table = 'products';
  // const promise1 = await Flds_user.getAll(table);
  // console.log('promise1');
  // console.log(promise1);
  // // res.json(promise1);

  // let table1 = `${global.userConfig.flds_comp}.${Flds_table}`;
  // // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
  // console.log('table1: %s', table1);

  // table = 'Flds_user_tables';
  // let table = `${global.userConfig.flds_comp}.flds_user`;
  // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
  let table = `${global.userConfig.flds_comp}.${Flds_table}`;
  console.log('table: %s', table);

  try {
    const promise2 = await Flds_user.getAll(table);
    // console.log('promise2');
    // console.log(promise2);
    // res.json(promise2);
    if(isNullOrUndefined(promise2[0])){
      res.status(200);
      let msgret = {
        service: service.db,
        code: 404,
        msg: `Flds_user Not find list.`,
        data: []
      };
      res.json(msgret);
      return ;
    }

    const result = promise2.map(function(row){
      // return Object.assign({}, row, { createstamp: moment(row.createstamp).format('YYYY-MM-DD HH:mm:ss'),  updatetime: moment(row.updatetime).format('YYYY-MM-DD HH:mm:ss') });
      return Object.assign({}, row, { createtime: formatDate(row.createtime),  updatetime: formatDate(row.updatetime) });
    });

    res.status(200);
    let msgret = {
      service: service.web,
      code: 200,
      msg: `flds_user findAll successfully....`,
      data: result
    };
    res.json(msgret);
    console.log(msgret);

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

    let logerfunc = `export const findAll()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);
    // LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
  }
}


// 同步功能實現 async/await/Promise .
// export asyncfunction findSearch(req, res) {
export const findSearch = async function(req, res){
  console.log('findSearch query = %s', req.query);
  console.log('findSearch body = %s', req.body);
  console.log('findSearch params = %s', req.params);

  // let table = 'products';
  // const promise1 = await Flds_user.getAll(table);
  // console.log('promise1');
  // console.log(promise1);
  // // res.json(promise1);
  try {
    // table = 'Flds_user_tables';
    // let table = `${global.userConfig.flds_comp}.flds_user`;
    // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
    let table = `${global.userConfig.flds_comp}.${Flds_table}`;
    console.log('table: %s', table);
    const result1 = await Flds_user.findSearch(table, req.query);
    // const result1 = await Flds_user.getAll(table);
    console.log('result1');
    console.log(result1);
    // res.json(promise2);

    if(isNullOrUndefined(result1[0])){
      res.status(200);
      let msgret = {
        service: service.db,
        code: 404,
        msg: `Flds_user Not find list.`,
        data: []
      };
      res.json(msgret);
      return ;
    }

    const result = result1.map(function(row){
      // return Object.assign({}, row, { createstamp: moment(row.createstamp).format('YYYY-MM-DD HH:mm:ss'),  updatetime: moment(row.updatetime).format('YYYY-MM-DD HH:mm:ss') });
      return Object.assign({}, row, { createtime: formatDate(row.createtime),  updatetime: formatDate(row.updatetime) });
    });
    res.status(200);
    let msgret = {
      service: service.web,
      code: 200,
      msg: `Flds_user findSearch successfully.`,
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
    Logger.info('msgret = %s', JSON.stringify(msgret));
    // Logger.info('msgret = %s', msgret);

    let logerfunc = `export const findSearch()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }

}

// Find a single Flds_user by Id
// export asyncfunction findOne(req, res) {
export const findOne = async function(req, res){
  console.log('Flds_user findOne query = %s', req.query);
  console.log('Flds_user findOne body = %s', req.body);
  console.log('Flds_user findOne params = %s', req.params);
  // JSON.stringify(shelfrecord)
  // let Flds_comp = global.userConfig.flds_comp;
  const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;

  try {
      let result1 = await Flds_user.findById(req.params.id, TABLE_NAME);
      // console.log('result');
      // console.log(result);

      if( isNullOrUndefined(result1[0]) )
      {
        let msgret = {
          service: service.db,
          code: 404,
          msg: `Not found user_id: ${req.params.id}`,
          data: []
        };

        // 請求已成功處理，但未返回任何內容
        res.status(200);
        res.json(msgret);
        Logger.info('msgret = %s', msgret);
        return ;
      }

      const result = result1.map(function(row){
        // return Object.assign({}, row, { createstamp: moment(row.createstamp).format('YYYY-MM-DD HH:mm:ss'),  updatetime: moment(row.updatetime).format('YYYY-MM-DD HH:mm:ss') });
        return Object.assign({}, row, { createtime: formatDate(row.createtime),  updatetime: formatDate(row.updatetime) });
      });

      let msgret = {
        service: service.web,
        code: 200,
        msg: `Flds_user findOne:  ${req.params.id} successfully.`,
        data: result
      };
      res.json(msgret);
      console.log(msgret);
      // Logger.info('msgret = %s', JSON.stringify(msgret));
      // Logger.info('msgret = %s', msgret);

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
    // Logger.info('msgret = %s', msgret);

    let logerfunc = `export const findOne()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }
}

// Update a flds_user identified by the id in the request
// export asyncfunction update(req, res) {
// export const update = async function(req, res){
export const update = async (req, res) => {
  console.log('update query = %s', req.query);
  console.log('update body = %s', req.body);
  console.log('update params = %s', req.params);

  try {
      const flds_user = new Flds_user({
        user_id : req.params.id,
        name : req.body.name,
        state: req.body.state,
        deptid : req.body.deptid,
        password : req.body.password,
      });

      // let Flds_comp = global.userConfig.flds_comp;
      const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
      const result = await Flds_user.updateById((req.params.id), flds_user, TABLE_NAME);
      // console.log(result);

      // // if(result.result === 'not_found')
      if( isNullOrUndefined(result[0]) )
      {
        let msgret = {
          service: service.db,
          code: 404,
          msg: `Not found id: ${req.params.id}`,
          data: []
        };

        res.status(200);
        res.json(msgret);
        Logger.info('msgret = %s', JSON.stringify(msgret));
        // Logger.info('msgret = %s', msgret);

        let logerfunc = `export const update()`;
        let logermsg = `${JSON.stringify(msgret)}`;
        LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

      }
      else
      {
        let msgret = {
          service: service.web,
          code: 200,
          msg: `Flds_user updateById user_id: ${flds_user.user_id} successfully.`,
          data: []
        };
        res.json(msgret);
      }

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
    // Logger.info('msgret = %s', msgret);

    let logerfunc = `export const create()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }
}

// Delete a Flds_user with the specified id in the request
// export asyncfunction deleteID(req, res) {
export const deleteID = async function(req, res){
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);
  // JSON.stringify(req.params.id)

  try {
    // let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
    const result1 = await Flds_user.remove(req.params.id, TABLE_NAME);
    // const result = await Product.findByPn(req.params.id);
    // console.log('result1:');
    // console.log(result1);

    // if(result1.result === 'not_found'){
    if( isNullOrUndefined(result1[0]) ) {
      let msgret = {
        service: service.db,
        code: 404,
        msg: `Delete not found id: ${req.params.id}`,
        data: []
      };

      res.status(200);
      res.json(msgret);
      Logger.info('msgret = %s', JSON.stringify(msgret));
      // Logger.info('msgret = %s', msgret);

      let logerfunc = `export const deleteID()`;
      let logermsg = `${JSON.stringify(msgret)}`;
      LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

    }
    else
    {
      let msgret = {
        service: service.web,
        code: 200,
        msg: `deleteOne successfully user_id: ${req.params.id}`,
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
    // Logger.info('msgret = %s', msgret);

    let logerfunc = `export const create()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }

}

// Delete all Flds_user from the database.
// export asyncfunction deleteAll(req, res) {
export const deleteAll = async function(req, res){
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);

  try {

    // let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = `${global.userConfig.flds_comp}.${Flds_table}`;
    const result1 = await Flds_user.removeAll(TABLE_NAME);
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
      service: service.web,
      code: 200,
      msg: `Deleted ${result1.affectedRows} successfully `,
      data: []
    };
    res.status(200);
    res.json(msgret);

  } catch (error) {
    // console.log(error.code);
    res.status(200);
    let msgret = {
      service: service.db,
      code: error.errno,
      msg: error.code,
      data:[{msg: error.sqlMessage}]
    };
    res.json(msgret);
    Logger.info('msgret = %s', JSON.stringify(msgret));
    // Logger.info('msgret = %s', msgret);

    let logerfunc = `export const deleteAll()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }

}
