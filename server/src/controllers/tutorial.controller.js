'use strict';
import { Controllerlogger as Logger } from '../comm/logger.js';
import { logErr as LogErr } from '../comm/logger.js';
import Tutorial from "../models/tutorial.model.js";

// Create and Save a new Tutorial
export function create(req, res) {
  // Validate request
  console.log('tutorial.controller create query = %s', req.query);
  console.log('create body = %s', req.body);
  console.log('create params = %s', req.params);

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // // Create a Tutorial
  // const tutorial = new Tutorial({
  //   title: req.body.title,
  //   description: req.body.description,
  //   published: req.body.published || false
  // });

  // // Save Tutorial in the database
  // Tutorial.create(tutorial, (err, data) => {
  //   if (err)
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while creating the Tutorial."
  //     });
  //   else res.send(data);
  // });

  // res.send(req);
  let msg = {
    message: req.query
  };
  res.json(msg);
}

// Retrieve all Tutorials from the database (with condition).
export async function findAll(req, res) {
  const title = req.query.title;
  console.log('tutorial.controller findAll query = %s', req.query);
  console.log('findAll body = %s', req.body);
  console.log('findAll params = %s', req.params);

  let table = `${global.userConfig.flds_comp}.rfid_ui_flds_a`;
  // 跨不同資料庫+table, #RFID.資料庫代號=公司代號
  console.log('table: %s', table);
  try {
    const result = Tutorial.getAll(table);
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
    // Logger.info('msgret = %s', msgret);
  }

  // // Tutorial.getAll(title, (err, data) => {
  // //   if (err)
  // //     res.status(500).send({
  // //       message:
  // //         err.message || "Some error occurred while retrieving tutorials."
  // //     });
  // //   else res.send(data);
  // // });
  // // res.send(req);
  // let msg = {
  //   message: req.query
  // };
  // res.json(msg);
}

// Find a single Tutorial by Id
export function findOne(req, res) {
  console.log('tutorial.controller findOne query = %s', req.query);
  console.log('findOne body = %s', req.body);
  console.log('findOne params = %s', req.params);

  // Tutorial.findById(req.params.id, (err, data) => {
  //   if (err) {
  //     if (err.kind === "not_found") {
  //       res.status(404).send({
  //         message: `Not found Tutorial with id ${req.params.id}.`
  //       });
  //     } else {
  //       res.status(500).send({
  //         message: "Error retrieving Tutorial with id " + req.params.id
  //       });
  //     }
  //   } else res.send(data);
  // });
  let msgret = {
    code: 500,
    msg: `Not found product_no: ${req.params.id}`
    // data: data
  };

  res.status(500);
  res.json(msgret);
  Logger.info('msgret = %s', JSON.stringify(msgret));
}

// find all published Tutorials
export function findAllPublished(req, res) {
  console.log('tutorial.controller findAllPublished = %s', req.query);
  // Tutorial.getAllPublished((err, data) => {
  //   if (err)
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving tutorials."
  //     });
  //   else res.send(data);
  // });
  // res.send(req);
  let msg = {
    message: req.query
  };
  res.json(msg);
}

// Update a Tutorial identified by the id in the request
export function update(req, res) {
  console.log('tutorial.controller update query = %s', req.query);
  console.log('update body = %s', req.body);
  console.log('update params = %s', req.params);
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let msgret = {
    code: 500,
    msg: `Not found product_no: ${req.params.id}`
    // data: data
  };

  res.status(500);
  res.json(msgret);
  Logger.info('msgret = %s', JSON.stringify(msgret));

  let logerfunc = `export function update(req, res) `;
  let logermsg = `${JSON.stringify(msgret)}`;
  LogErr.info('user=%s, func=%s, msg=%s', global.userConfig.flds_user, logerfunc, logermsg);
}

// Delete a Tutorial with the specified id in the request
const _delete = (req, res) => {
  console.log('delete query = %s', req.query);
  console.log('delete body = %s', req.body);
  console.log('delete params = %s', req.params);
  // Tutorial.remove(req.params.id, (err, data) => {
  //   if (err) {
  //     if (err.kind === "not_found") {
  //       res.status(404).send({
  //         message: `Not found Tutorial with id ${req.params.id}.`
  //       });
  //     } else {
  //       res.status(500).send({
  //         message: "Could not delete Tutorial with id " + req.params.id
  //       });
  //     }
  //   } else res.send({ message: `Tutorial was deleted successfully!` });
  // });
  let msg = {
    message: req.query
  };
  res.json(msg);
};
export { _delete as delete };

// Delete all Tutorials from the database.
export function deleteAll(req, res) {
  console.log('deleteAll = %s', req.query);
  console.log(req.body);
  // Tutorial.removeAll((err, data) => {
  //   if (err)
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while removing all tutorials."
  //     });
  //   else res.send({ message: `All Tutorials were deleted successfully!` });
  // });
  // res.send(req);
  let msg = {
    message: req.query
  };
  res.json(msg);
}
