'use strict';
const express = require('express');
const router = express.Router();

const locations = require("../controllers/flds_bind.controller.js");

// 在每一個請求被處理之前都會執行的 middleware
router.use(function(req, res, next) {

  // 輸出記錄訊息至終端機
  console.log('flds_bind.router.use =', req.method + req.url);

  // 繼續路由處理
  next();
});

// http://192.168.248.34:3000/catalog/ test --------------------------------------------------------------

// Retrieve all locations
router.get("/", locations.findAll);
router.post("/", locations.findAll);
// Retrieve all products
router.get("/create", locations.findAll);
// Create a new Tutorial
router.post("/create", locations.create);

// Retrieve a single Tutorial with id
router.get("/:id", locations.findOne);
router.post("/:id", locations.create);

// Update a Tutorial with id
router.put("/:id", locations.update);

// Delete a Tutorial with id
router.delete("/:id", locations.delete);

// Delete all products
router.delete("/", locations.truncate);
// router.delete("/", locations.deleteAll);
// // Retrieve all published products
// router.get("/published", products.findAllPublished);

module.exports = router;
