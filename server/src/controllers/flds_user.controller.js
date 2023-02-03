'use strict';
import async from 'async';
import { isNullOrUndefined } from 'util/util.js';
import Flds_user from '../models/flds_user.model.js';
// import { Controllerlogger as Logger } from '../comm/logger.js';
import { Controllerlogger as Logger } from '../comm/logger.js';
import { logErr as LogErr } from '../comm/logger';

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
      users_id : req.body.users_id,
      name : req.body.name,
      compid: req.body.compid,
      deptid : req.body.deptid,
      password : req.body.password,
    });
    console.log('Flds_user = %s', flds_user);

    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.flds_user';

      // 第二種方式同步語法
      const result2 = await Flds_user.create(flds_user, TABLE_NAME);
      console.log('result2');
      console.log(result2);
      // res.json(result2);
      let msgret = {
        code: 200,
        msg: `Flds_user creat successfully  users_id: ${result2.users_id}`,
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

  // table = 'Flds_user_tables';
  let table = `${global.userConfig.flds_comp}.flds_user`;
  // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
  console.log('table: %s', table);
  const promise2 = await Flds_user.getAll(table);
  console.log('promise2');
  console.log(promise2);
  // res.json(promise2);

  let msgret = {
    code: 200,
    msg: `flds_user findAll successfully....`,
    data: promise2
  };
  res.json(msgret);
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
    let table = `${global.userConfig.flds_comp}.flds_user`;
    // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
    console.log('table: %s', table);
    const result = await Flds_user.findSearch(table, req.query);
    console.log('result');
    console.log(result);
    // res.json(promise2);

    if(isNullOrUndefined(result[0])){
      let msgret = {
        code: 200,
        msg: `Flds_user Not find list.`,
        // data: result
      };
      res.json(msgret);
      return ;
    }

    let msgret = {
      code: 200,
      msg: `Flds_user findSearch successfully.`,
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
    // Logger.info('msgret = %s', msgret);
  }

}

// Find a single Flds_user by Id
// export asyncfunction findOne(req, res) {
  export const findOne = async function(req, res){
  console.log('Flds_user findOne query = %s', req.query);
  console.log('Flds_user findOne body = %s', req.body);
  console.log('Flds_user findOne params = %s', req.params);
  // JSON.stringify(shelfrecord)
  let Flds_comp = global.userConfig.flds_comp;
  const TABLE_NAME = Flds_comp+'.flds_user';

  try {
      let result;
      result = await Flds_user.findById(req.params.id, TABLE_NAME);
      console.log('result');
      console.log(result);

      let msgret = {
        code: 200,
        msg: `Flds_user findOne:  ${req.params.id} successfully.`,
        data: result
      };
      res.json(msgret);
      // Logger.info('msgret = %s', JSON.stringify(msgret));
      // Logger.info('msgret = %s', msgret);

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
        users_id : req.params.id,
        name : req.body.name,
        compid: req.body.compid,
        deptid : req.body.deptid,
        password : req.body.password,
      });

      // console.log('flds_user = %s', flds_user);
      // Logger.info('flds_user = %s', flds_user);

      // console.log(this);
      let Flds_comp = global.userConfig.flds_comp;
      const TABLE_NAME = Flds_comp+'.flds_user';
      const result = await Flds_user.updateById((req.params.id), flds_user, TABLE_NAME);
      console.log(result);

      // // if(result.result === 'not_found')
      if( isNullOrUndefined(result[0]) )
      {
        let msgret = {
          code: 500,
          msg: `Not found uid: ${req.params.id}`
          // data: data
        };

        res.status(500);
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
          code: 200,
          msg: `Flds_user updateById successfully.`,
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
    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.flds_user';
    const result1 = await Flds_user.remove(req.params.id, TABLE_NAME);
    // const result = await Product.findByPn(req.params.id);
    // console.log('result1:');
    console.log(result1);

    // if(result1.result === 'not_found'){
    if( isNullOrUndefined(result1[0]) ) {
      let msgret = {
        code: 400,
        msg: `Not found users_id: ${req.params.id}`
        // data: data
      };

      res.status(500);
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
        code: 200,
        msg: `deleteOne successfully users_id: ${req.params.id}`,
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

    let Flds_comp = global.userConfig.flds_comp;
    const TABLE_NAME = Flds_comp+'.flds_user';
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
      code: 200,
      msg: `Deleted ${result1.affectedRows} successfully `,
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
    Logger.info('msgret = %s', JSON.stringify(msgret));
    // Logger.info('msgret = %s', msgret);

    let logerfunc = `export const deleteAll()`;
    let logermsg = `${JSON.stringify(msgret)}`;
    LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);

  }

}
