const sql = require("./db.js");
const { isNullOrUndefined } = require('url/util.js');
const Product = require('../models/product.model.js');
const Location = require('../models/location_table.model.js');
const Logger = require('../comm/logger').Controllerlogger;
const LogErr = require('../comm/logger').logErr;

// constructor
const Stock_action = function(params) {
//   this.title = tutorial.title;
//   this.description = tutorial.description;
//   this.published = tutorial.published;
};


// For database abba_dev03.
Stock_action.stock_input = async(products, res) => {
  // let table = 'rfid_ui_flds_a';
  // console.log(products);
  let  count = 0, errcnt = 0 ;
  try {

    // let Flds_comp = global.userConfig.flds_comp;
    // let TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';
    // // 清空資料表,測試用
    // let result3 = await Product.truncate(TABLE_NAME);
    // console.log('result3:');
    // console.log(result3);

    // TABLE_NAME =  Flds_comp +'.rfid_in_flds_ab';
    // // 清空資料表,測試用
    // result3 = await Product.truncate(TABLE_NAME);
    // console.log('result3:');
    // console.log(result3);

    // TABLE_NAME =  Flds_comp +'.rfid_in_flds_abc';
    // // 清空資料表,測試用
    // result3 = await Product.truncate(TABLE_NAME);
    // console.log('result3:');
    // console.log(result3);

    // Flds_comp = global.userConfig.flds_comp;
    // TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';
    // // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
    // console.log('table: %s', TABLE_NAME);
    // let result2 = await Product.getAll(TABLE_NAME);
    // console.log('result2:');
    // console.log(result2);
    // if(result2.length > 0)
    // {
    //   console.log('rfid_ui_flds_a Not empty!');

    //   // let msg = {
    //   //   result: 'rfid_ui_flds_a Not empty!'
    //   // };

    //   msgret.code = 500;
    //   msgret.msg = 'rfid_ui_flds_a Not empty!';
    //   res.status(500);
    //   // resultAll.push(msg);
    //   res.json(msgret);
    //   return;
    // }

    // // 使用 for loop 才有同步效果. result.forEach 為非同步效果.
    // for(let elem of products)
    // {
    //     console.log(elem);
    //     let uidstr = elem.product_no + ( isNullOrUndefined(elem.lot_no) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
    //     // 新增 uid欄位
    //     elem.uid = uidstr;
    //     console.log(elem);
    //     //Copy to rfid_ui_flds_a table.
    //     let Flds_comp = global.userConfig.flds_comp;
    //     let TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';

    //     elem.flds_comp =  Flds_comp;

    //     const result2 = await Product.create(elem, TABLE_NAME);
    //     console.log('result2');
    //     console.log(result2);

    //     // resultAll.push(result2);
    //     // msgret.msg = 'exp2RfidImportCSV finish!';
    // }

    let Flds_comp = global.userConfig.flds_comp;
    let TABLE_NAME =  Flds_comp +'.rfid_in_flds_abc';
    let result = await Product.findByOrders(products[0].order_no, TABLE_NAME);
    console.log('result:');
    console.log(result[0]);
    // 檢查 來源單號 已存在則不處理,避免重複匯入.
    if( !(isNullOrUndefined(result[0])) )
    {
      let logerrfunc = 'Stock_action.stock_input()';
      let logerrmsg = `Find already order_no, ${JSON.stringify(products[0].order_no)}`;
      LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);

      let str =  `Find already order_no, ${JSON.stringify(products[0].order_no)}`;
      let msgret = {
      code: 500,
      msg: str,
      // data: resultAll
      };
      res.status(500);
      res.json(msgret);
      return ;
      // continue ;
    }

  // 建立入庫資料表
    // console.log(global.userConfig);
    // 使用 for loop 才有同步效果. result.forEach 為非同步效果.
    for(let elem of products) {
      // console.log(elem);
      // let uidstr = elem.product_no + ((elem.lot_no === null) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
      let uidstr = elem.product_no + ( isNullOrUndefined(elem.lot_no) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
      // 新增 uid欄位
      elem.uid = uidstr;

      // 檢查RFID庫存資料表是否有此品號uid?
      Flds_comp = global.userConfig.flds_comp;
      TABLE_NAME = Flds_comp+'.rfid_stock_flds_ab';
      result = await Product.findById(elem.uid, TABLE_NAME);
      if( isNullOrUndefined(result[0]) )
      {
        errcnt++;
        let logerrfunc = 'Stock_action.stock_input()';
        let logerrmsg = `Not find rfid_stock_flds_ab, ${JSON.stringify(elem.uid)}`;
        LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
        continue ;
      }


      // let Flds_comp = global.userConfig.flds_comp;
      // let TABLE_NAME =  Flds_comp +'.rfid_in_flds_abc';
      // const result3 = await Product.findByOrders(elem.order_no, TABLE_NAME);
      // console.log('result3:');
      // console.log(result3[0]);

      // // // 檢查 PRIMARY KEY 是否存在?? 不存在則建立.
      // // // if(result3.result === 'not_found')
      // // // if( isNullOrUndefined(result3[0]) )
      // if( isNullOrUndefined(result3[0]) )
      if( 1 )
      {
        // 更新 product 加入儲位綁定 Flds_bind
        const Locationobj = {
          warehouse_type : elem.warehouse_type,
          storage_location : elem.storage_location
        };
        console.log(Locationobj);
        let Flds_comp = global.userConfig.flds_comp;
        let TABLE_NAME =  Flds_comp +'.location_tables';
        // // 取得儲位ID以庫別+儲位
        let result_LocationID = await Location.findByLocation(Locationobj, TABLE_NAME);
        console.log('result_LocationID');
        console.log(result_LocationID);

        if( isNullOrUndefined(result_LocationID[0]))
        {
          errcnt++;
          // LogErr function logfile.
          let logerrfunc = 'Stock_action.stock_input()';
          let logerrmsg = `Not find location, ${JSON.stringify(Locationobj)}`;
          LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
          continue ;
        }

        // console.log(result_LocationID[0].epc.length);
        if( result_LocationID[0].epc === '')
        {
          errcnt++;
          // LogErr function logfile.
          let logerrfunc = 'Stock_action.stock_input()';
          let logerrmsg = `Not find epc, ${JSON.stringify(Locationobj)}`;
          LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
          continue ;
        }

        Flds_comp = global.userConfig.flds_comp;
        TABLE_NAME =  Flds_comp +'.rfid_in_flds_abc';

        elem.flds_comp =  Flds_comp;
        elem.stamp1 =  new Date().toISOString().slice(0, 19).replace('T', ' ');

        elem.users_id =  global.userConfig.flds_user;
        // // // 儲位ID綁定
        elem.location_id = isNullOrUndefined(result_LocationID[0]) ? '' : result_LocationID[0].luid;    //result_LocationID.data.luid;
        console.log(elem);
        const result2 = await Product.create(elem, TABLE_NAME);
        count++;
        // // console.log('result2');
        // // console.log(result2);

      }
      else{
        let str = "Duplicate entry '" + elem.uid + "' for key 'PRIMARY'";
        let msgret = {
          code: 500,
          msg: str,
          // data: resultAll
        };
        res.status(500);
        res.json(msgret);
        return;
      }
    }


    // 複製到 UI Table 前先清除，
    Flds_comp = global.userConfig.flds_comp;
    TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';
    // 清空資料表,測試用
    let result3 = await Product.truncate(TABLE_NAME);
    console.log('result3:');
    console.log(result3);

    // 複製到 UI Table 使用
    let table = `${global.userConfig.flds_comp}.rfid_in_flds_abc`;
    // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
    console.log('table: %s', table);
    result = await Product.getAll(table);
    // console.log('result');
    // console.log(result);

    // 刪除rfid_ui_flds_a多餘的欄位
    for(let elem of result)
    {
      delete elem.users_id;
      delete elem.location_id;
      delete elem.stamp1;
      delete elem.c_order_no;
      delete elem.c_serial_no;
      delete elem.c_quantity;
      delete elem.c_packing_quantity;
      delete elem.c_users_id;
      delete elem.c_stamp;
    }

    // 使用 for loop 才有同步效果. result.forEach 為非同步效果.
    for(let elem of result)
    {
        // console.log(elem);
        // let uidstr = elem.product_no + ( isNullOrUndefined(elem.lot_no) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
        // // 新增 uid欄位
        // elem.uid = uidstr;
        // console.log(elem);
        //Copy to rfid_ui_flds_a table.
        let Flds_comp = global.userConfig.flds_comp;
        let TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';

        // elem.flds_comp =  Flds_comp;

        const result2 = await Product.create(elem, TABLE_NAME);
        console.log('result2');
        console.log(result2);

        // resultAll.push(result2);
        // msgret.msg = 'exp2RfidImportCSV finish!';
    }

    console.log('result All end:');

    let msgret = {
      code: 200,
      msg: `exp2RfidImportCSV finish!`,
      count: count,
      // data: resultAll
    };
    if( errcnt ){
      msgret.errcnt = errcnt;
    }
    res.json(msgret);

  } catch (error) {
    console.log(error);
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

Stock_action.stock_output = async(products, res) => {
  // let table = 'rfid_ui_flds_a';
  // console.log(products);
  let  count = 0, errcnt = 0 ;
  try {
      // let Flds_comp = global.userConfig.flds_comp;
      // let TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';
      // // 清空資料表,測試用
      // let result3 = await Product.truncate(TABLE_NAME);
      // console.log('result3:');
      // console.log(result3);

      // // // TABLE_NAME =  Flds_comp +'.rfid_in_flds_ab';
      // // // // 清空資料表,測試用
      // // // result3 = await Product.truncate(TABLE_NAME);
      // // // console.log('result3:');
      // // // console.log(result3);

      // TABLE_NAME =  Flds_comp +'.rfid_out_flds_abc';
      // // 清空資料表,測試用
      // result3 = await Product.truncate(TABLE_NAME);
      // console.log('result3:');
      // console.log(result3);

      // Flds_comp = global.userConfig.flds_comp;
      // TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';
      // // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
      // console.log('table: %s', TABLE_NAME);
      // let result2 = await Product.getAll(TABLE_NAME);
      // console.log('result2:');
      // console.log(result2);
      // if(result2.length > 0)
      // {
      // console.log('rfid_ui_flds_a Not empty!');

      // // let msg = {
      // //   result: 'rfid_ui_flds_a Not empty!'
      // // };

      // msgret.code = 500;
      // msgret.msg = 'rfid_ui_flds_a Not empty!';
      // res.status(500);
      // // resultAll.push(msg);
      // res.json(msgret);
      // return;
      // }

      // // 使用 for loop 才有同步效果. result.forEach 為非同步效果.
      // for(let elem of products)
      // {
      //     console.log(elem);
      //     let uidstr = elem.product_no + ( isNullOrUndefined(elem.lot_no) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
      //     // 新增 uid欄位
      //     elem.uid = uidstr;
      //     console.log(elem);
      //     //Copy to rfid_ui_flds_a table.
      //     let Flds_comp = global.userConfig.flds_comp;
      //     let TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';

      //     elem.flds_comp =  Flds_comp;

      //     const result2 = await Product.create(elem, TABLE_NAME);
      //     console.log('result2');
      //     console.log(result2);

      //     // resultAll.push(result2);
      //     // msgret.msg = 'exp2RfidImportCSV finish!';
      // }

      let Flds_comp = global.userConfig.flds_comp;
      let TABLE_NAME =  Flds_comp +'.rfid_out_flds_abc';
      let result = await Product.findByOrders(products[0].order_no, TABLE_NAME);
      console.log('result:');
      console.log(result[0]);
      // 檢查 來源單號 已存在則不處理,避免重複匯入.
      if( !(isNullOrUndefined(result[0])) )
      {
        let logerrfunc = 'Stock_action.stock_output()';
        let logerrmsg = `Find already order_no, ${JSON.stringify(products[0].order_no)}`;
        LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);

        let str =  `Find already order_no, ${JSON.stringify(products[0].order_no)}`;
        let msgret = {
        code: 500,
        msg: str,
        // data: resultAll
        };
        res.status(500);
        res.json(msgret);
        return ;
        // continue ;
      }

      // console.log(global.userConfig);
      // 使用 for loop 才有同步效果. result.forEach 為非同步效果.
      for(let elem of products) {
        // console.log(elem);
        // let uidstr = elem.product_no + ((elem.lot_no === null) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
        let uidstr = elem.product_no + ( isNullOrUndefined(elem.lot_no) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
        // 新增 uid欄位
        elem.uid = uidstr;

        Flds_comp = global.userConfig.flds_comp;
        TABLE_NAME = Flds_comp+'.rfid_stock_flds_ab';
        result = await Product.findById(elem.uid, TABLE_NAME);

        if( isNullOrUndefined(result[0]) )
        {
          errcnt++;
          let logerrfunc = 'Stock_action.stock_output()';
          let logerrmsg = `Not find rfid_stock_flds_ab, ${JSON.stringify(elem.uid)}`;
          LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
          continue ;
        }

        // let Flds_comp = global.userConfig.flds_comp;
        // let TABLE_NAME =  Flds_comp +'.rfid_out_flds_abc';
        // const result3 = await Product.findById(elem.uid, TABLE_NAME);
        // // console.log('result3:');
        // // console.log(result3);

        // // 檢查 PRIMARY KEY 是否存在?? 不存在則建立.
        // // if(result3.result === 'not_found')
        // // if( isNullOrUndefined(result3[0]) )
        // if( isNullOrUndefined(result3[0]) )
        if( 1 )
        {
            // 更新 product 加入儲位綁定 Flds_bind
            const Locationobj = {
            warehouse_type : elem.warehouse_type,
            storage_location : elem.storage_location
            };
            console.log(Locationobj);
            let Flds_comp = global.userConfig.flds_comp;
            let TABLE_NAME =  Flds_comp +'.location_tables';
            // // 取得儲位ID以庫別+儲位
            let result_LocationID = await Location.findByLocation(Locationobj, TABLE_NAME);
            console.log('result_LocationID');
            console.log(result_LocationID);

            if( isNullOrUndefined(result_LocationID[0]))
            {
              errcnt++;
              // LogErr function logfile.
              let logerrfunc = 'Stock_action.stock_output()';
              let logerrmsg = `Not find location, ${JSON.stringify(Locationobj)}`;
              LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
              continue ;
            }

            // console.log(result_LocationID[0].epc.length);
            if( result_LocationID[0].epc === '')
            {
              errcnt++;
              // LogErr function logfile.
              let logerrfunc = 'Stock_action.stock_output()';
              let logerrmsg = `Not find epc, ${JSON.stringify(Locationobj)}`;
              LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
              continue ;
            }

            Flds_comp = global.userConfig.flds_comp;
            // Flds_comp = 'abba_dev01';     // test table
            TABLE_NAME =  Flds_comp +'.rfid_out_flds_abc';

            // console.log('users_id: ' + global.userConfig.flds_user);
            // elem.users_id =  '' + global.userConfig.flds_user;
            // console.log('elem.users_id: ' +  elem.users_id);
            elem.flds_comp =  Flds_comp;
            elem.stamp1 =  new Date().toISOString().slice(0, 19).replace('T', ' ');
            // elem.c_stamp =  new Date().toISOString().slice(0, 19).replace('T', ' ');

            elem.users_id =  global.userConfig.flds_user;
            // // // 儲位ID綁定
            elem.location_id = isNullOrUndefined(result_LocationID[0]) ? '' : result_LocationID[0].luid;    //result_LocationID.data.luid;
            // delete elem.ui_check_state;
            // delete elem.flds_comp;
            console.log(elem);
            const result2 = await Product.create(elem, TABLE_NAME);
            // // console.log('result2');
            // // console.log(result2);
            count++;

        }
        else{
            let str = "Duplicate entry '" + elem.uid + "' for key 'PRIMARY'";
            let msgret = {
            code: 500,
            msg: str,
            // data: resultAll
            };
            res.status(500);
            res.json(msgret);
            return;
        }
      }

      // 複製到 UI Table 前先清除，測試時使用
      Flds_comp = global.userConfig.flds_comp;
      TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';
      // 清空資料表,測試用
      let result3 = await Product.truncate(TABLE_NAME);
      console.log('result3:');
      console.log(result3);

      // 複製到 UI Table 使用
      let table = `${global.userConfig.flds_comp}.rfid_out_flds_abc`;
      // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
      console.log('table: %s', table);
      result = await Product.getAll(table);
      console.log('result');
      console.log(result);

      // 刪除rfid_ui_flds_a多餘的欄位
      for(let elem of result)
      {
        delete elem.users_id;
        delete elem.location_id;
        delete elem.stamp1;
        delete elem.c_order_no;
        delete elem.c_serial_no;
        delete elem.c_quantity;
        delete elem.c_packing_quantity;
        delete elem.c_users_id;
        delete elem.c_stamp;
      }

      // 使用 for loop 才有同步效果. result.forEach 為非同步效果.
      for(let elem of result)
      {
          console.log(elem);
          // let uidstr = elem.product_no + ( isNullOrUndefined(elem.lot_no) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
          // // 新增 uid欄位
          // elem.uid = uidstr;
          // console.log(elem);
          //Copy to rfid_ui_flds_a table.
          let Flds_comp = global.userConfig.flds_comp;
          let TABLE_NAME =  Flds_comp +'.rfid_ui_flds_a';

          // elem.flds_comp =  Flds_comp;

          const result2 = await Product.create(elem, TABLE_NAME);
          console.log('result2');
          console.log(result2);

          // resultAll.push(result2);
          // msgret.msg = 'exp2RfidImportCSV finish!';
      }

      console.log('result All end:');

      let msgret = {
      code: 200,
      msg: `exp2RfidImportCSV finish!`,
      count: count,
      // data: resultAll
      };
      if( errcnt ){
        msgret.errcnt = errcnt;
      }
      res.json(msgret);

  } catch (error) {
      console.log(error);
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



Stock_action.sysImport = async(products, order_no, res) => {
    // console.log(products);
    let  count = 0, errcnt = 0 ;
    try {
        // let Flds_comp = global.userConfig.flds_comp;
        // let TABLE_NAME =  Flds_comp +'.rfid_stock_flds_ab';
        // let result = await Product.findByOrders(products[0].order_no, TABLE_NAME);
        // console.log('result:');
        // console.log(result[0]);
        // // 檢查 來源單號 已存在則不處理,避免重複匯入.
        // if( !(isNullOrUndefined(result[0])) )
        // {
        //   let logerrfunc = 'Stock_action.stock_output()';
        //   let logerrmsg = `Find already order_no, ${JSON.stringify(products[0].order_no)}`;
        //   LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);

        //   let str =  `Find already order_no, ${JSON.stringify(products[0].order_no)}`;
        //   let msgret = {
        //   code: 500,
        //   msg: str,
        //   // data: resultAll
        //   };
        //   res.status(500);
        //   res.json(msgret);
        //   return ;
        //   // continue ;
        // }

        // console.log(global.userConfig);
        // 使用 for loop 才有同步效果. result.forEach 為非同步效果.
        for(let elem of products) {
          // console.log(elem);
          // let uidstr = elem.product_no + ((elem.lot_no === null) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
          let uidstr = elem.product_no + ( isNullOrUndefined(elem.lot_no) ? '' : elem.lot_no)  + elem.warehouse_type + elem.storage_location;
          // 新增 uid欄位
          elem.uid = uidstr;
          // 系統導入-order_no為使用filename
          elem.order_no = order_no;

          // Flds_comp = global.userConfig.flds_comp;
          // TABLE_NAME = Flds_comp+'.rfid_stock_flds_ab';
          // result = await Product.findById(elem.uid, TABLE_NAME);

          // if( isNullOrUndefined(result[0]) )
          // {
          //   errcnt++;
          //   let logerrfunc = 'Stock_action.stock_output()';
          //   let logerrmsg = `Not find rfid_stock_flds_ab, ${JSON.stringify(elem.uid)}`;
          //   LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
          //   continue ;
          // }

          // // let Flds_comp = global.userConfig.flds_comp;
          // // let TABLE_NAME =  Flds_comp +'.rfid_out_flds_abc';
          // // const result3 = await Product.findById(elem.uid, TABLE_NAME);
          // // // console.log('result3:');
          // // // console.log(result3);

          // // // 檢查 PRIMARY KEY 是否存在?? 不存在則建立.
          // // // if(result3.result === 'not_found')
          // // // if( isNullOrUndefined(result3[0]) )
          // // if( isNullOrUndefined(result3[0]) )
          if( 1 )
          {
              // 更新 product 加入儲位綁定 Flds_bind
              const Locationobj = {
              warehouse_type : elem.warehouse_type,
              storage_location : elem.storage_location
              };
              console.log(Locationobj);
              let Flds_comp = global.userConfig.flds_comp;
              let TABLE_NAME =  Flds_comp +'.location_tables';
              // // 取得儲位ID以庫別+儲位
              let result_LocationID = await Location.findByLocation(Locationobj, TABLE_NAME);
              console.log('result_LocationID');
              console.log(result_LocationID);

              if( isNullOrUndefined(result_LocationID[0]))
              {
                errcnt++;
                // LogErr function logfile.
                let logerrfunc = 'Stock_action.sysImport()';
                let logerrmsg = `Not find location, ${JSON.stringify(Locationobj)}`;
                LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
                continue ;
              }

              // console.log(result_LocationID[0].epc.length);
              if( result_LocationID[0].epc === '')
              {
                errcnt++;
                // LogErr function logfile.
                let logerrfunc = 'Stock_action.sysImport()';
                let logerrmsg = `Not find epc, ${JSON.stringify(Locationobj)}`;
                LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerrfunc, logerrmsg);
                continue ;
              }

              Flds_comp = global.userConfig.flds_comp;
              TABLE_NAME =  Flds_comp +'.rfid_stock_flds_ab';

              elem.flds_comp =  Flds_comp;
              elem.stamp1 =  new Date().toISOString().slice(0, 19).replace('T', ' ');
              // elem.c_stamp =  new Date().toISOString().slice(0, 19).replace('T', ' ');

              elem.users_id =  global.userConfig.flds_user;
              // // // 儲位ID綁定
              elem.location_id = isNullOrUndefined(result_LocationID[0]) ? '' : result_LocationID[0].luid;    //result_LocationID.data.luid;
              // delete elem.ui_check_state;
              // delete elem.flds_comp;
              console.log(elem);
              const result2 = await Product.create(elem, TABLE_NAME);
              // // console.log('result2');
              // // console.log(result2);
              count++;

          }
          else{
              let str = "Duplicate entry '" + elem.uid + "' for key 'PRIMARY'";
              let msgret = {
              code: 500,
              msg: str,
              // data: resultAll
              };
              res.status(500);
              res.json(msgret);
              return;
          }
        }

        console.log('result All end:');

        let msgret = {
        code: 200,
        msg: `sysImport finish!`,
        count: count,
        // data: resultAll
        };
        if( errcnt ){
          msgret.errcnt = errcnt;
        }
        res.json(msgret);

    } catch (error) {
        console.log(error);
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

module.exports = Stock_action;
