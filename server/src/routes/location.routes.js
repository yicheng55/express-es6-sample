'use strict';
const express = require('express');
const router = express.Router();

const locations = require("../controllers/location.controller.js");

// 在每一個請求被處理之前都會執行的 middleware
router.use(function(req, res, next) {

  // 輸出記錄訊息至終端機
  console.log('location.router.use =', req.method + req.url);

  // 繼續路由處理
  next();
});

// http://192.168.248.34:3000/catalog/ test --------------------------------------------------------------

// Retrieve all locations
router.get("/", locations.findAll);
router.post("/", locations.findAll);

router.get("/findsearch", locations.findSearch);

// Retrieve all locations
router.get("/create", locations.findAll);
// Create a new Location
router.post("/create", locations.create);

// 儲位綁定 EPC
router.put("/bind", locations.bind);
// 儲位解綁 EPC
router.get("/unbind", locations.unbind);

// Retrieve a single Location with id
router.get("/:id", locations.findOne);
router.post("/:id", locations.create);

// Update a Location with id
router.put("/:id", locations.update);

// Delete a Location with id
router.delete("/:id", locations.delete);

// Delete all Location
router.delete("/", locations.deleteAll);

module.exports = router;
