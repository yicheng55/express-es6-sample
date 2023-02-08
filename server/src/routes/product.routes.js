'use strict';
import { Router } from 'express';
const router = Router();

// import { findAll, create, update, findSearch, QryStock, QryPnStock, QryKuStock, QryEpcStock, createarr, exp2Rfid, exp2RfidAPI, sync2ERP, unbind_abc_list, unbind_abc, bind_abc_list, bind_abc, bind_update, bind_delete, findByPn, findByOrdersName, updatestock, findOne, findUpdate, findDelete, deleteID } from "../controllers/product.controller.js";
import * as products from "../controllers/product.controller.js";
// const products = require("../controllers/rfid_ui_flds_a.controller.js");

// 在每一個請求被處理之前都會執行的 middleware
router.use(function(req, res, next) {

  // 輸出記錄訊息至終端機
  console.log('product router.use =', req.method + req.url);

  // 繼續路由處理
  next();
});

router.get("/", products.findAll);

router.post("/", products.create);
router.post("/:id", products.create);

// 以參數查詢
router.get("/findSearch", products.findSearch);

// Retrieve a single products with id
router.get("/:id", products.findOne);

// Update a products with id
router.put("/:id", products.update);

// Delete a products with id
router.delete("/:id", products.deleteID);

// 以下刪除
// // 以rfid_ui_flds_a 查詢
// router.get("/", products.findAll);
// router.post("/", products.create);
// // 以rfid_ui_flds_a 更新
// router.put("/", products.update);

// // 以rfid_ui_flds_a 查詢
// router.get("/findSearch", products.findSearch);

// // 以rfid_stock_flds_ab 查詢
// router.get("/findSearch/QryStock", products.QryStock);
// router.get("/findSearch/QryPnStock", products.QryPnStock);
// router.get("/findSearch/QryKuStock", products.QryKuStock);
// // 以EPC查詢品號明細列表
// // router.get("/findSearch/QryEpcStock/:id", products.QryEpcStock);

// // router.get("/find_flds_ab", products.find_flds_ab);
// // Retrieve all products
// router.get("/create", products.findAll);
// // Create a new products
// router.post("/create", products.create);
// router.post("/createarr", products.createarr);

// // router.get("/exp2rfid", products.exp2Rfid);
// // router.get("/exp2rfidapi", products.exp2RfidAPI);
// // router.get("/sync2erp", products.sync2ERP);

// // 查詢未綁定列表
// // Unbound all products
// // router.get("/unbound", products.unbound);
// // router.get("/unbind", products.unbind_abc_list);
// // router.put("/unbind", products.unbind_abc);

// // router.get("/unbound_flds_ab", products.unbound_flds_ab);
// // Bind rfid_ui_flds_a products
// // router.get("/bind", products.bind_b);

// // // rfid_in_flds_abc 資料表
// // router.get("/bind", products.bind_abc_list);
// // // rfid_ui_flds_a --> rfid_in_flds_abc 綁定
// // router.put("/bind", products.bind_abc);
// // // UI /bind/:id --> rfid_in_flds_abc 更新
// // router.put("/bind/:id", products.bind_update);
// // // 加入delete功能
// // router.delete("/bind", products.bind_delete);

// // 品號明細查詢列表
// router.get("/findbyPN/:id", products.findByPn);

// // 來源單號查詢列表
// router.get("/findByOrdersName", products.findByOrdersName);

// // // 單據完成作業，RFID庫存表更新(rfid_stock_flds_ab)
// // // router.get("/updatestock", products.finish);
// // router.get("/updatestock", products.updatestock);

// // Retrieve a single products with id
// router.get("/:id", products.findOne);
// router.post("/:id", products.create);
// // 以rfid_ui_flds_a 更新
// // Update a products with req.body.uid + req.body.order_no 參數更新
// router.put("/findUpdate", products.findUpdate);
// // Update a products with uid
// router.put("/:id", products.update);

// // Delete a products with find params.
// router.delete("/findDelete", products.findDelete);
// // Delete a products with id
// router.delete("/:id", products.deleteID);

// // Delete all products
// // router.delete("/", products.deleteAll);

// // // Retrieve all published products
// // router.get("/published", products.findAllPublished);

export default router;
