import { Router } from 'express';
const router = Router();

import * as tutorials from "../controllers/tutorial.controller.js";

// const tutorials = require("../controllers/tutorial.controller.js");


// 在每一個請求被處理之前都會執行的 middleware
router.use(function(req, res, next) {

  // 輸出記錄訊息至終端機
  console.log('catalog router.use =', req.method + req.url);

  // 繼續路由處理
  next();
});

// http://192.168.248.34:3000/catalog/ test --------------------------------------------------------------
// Create a new Tutorial
router.post("/", tutorials.create);

// Retrieve all Tutorials
router.get("/", tutorials.findAll);

// // Retrieve all published Tutorials
// router.get("/published", tutorials.findAllPublished);

// // Retrieve a single Tutorial with id
router.get("/:id", tutorials.findOne);

// // Update a Tutorial with id
router.put("/:id", tutorials.update);

// // Delete a Tutorial with id
router.delete("/:id", tutorials.delete);

// // Delete all Tutorials
// router.delete("/", tutorials.deleteAll);

export default router;
