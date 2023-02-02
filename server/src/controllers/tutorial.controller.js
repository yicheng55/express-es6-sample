'use strict';
// import Tutorial from "../models/tutorial.model.js";

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
export function findAll(req, res) {
  const title = req.query.title;
  console.log('tutorial.controller findAll query = %s', req.query);
  console.log('findAll body = %s', req.body);
  console.log('findAll params = %s', req.params);
  // Tutorial.getAll(title, (err, data) => {
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
  let msg = {
    message: req.query
  };
  res.json(msg);
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



  let msg = {
    message: req.query
  };
  res.json(msg);

  // Tutorial.updateById(
  //   req.params.id,
  //   new Tutorial(req.body),
  //   (err, data) => {
  //     if (err) {
  //       if (err.kind === "not_found") {
  //         res.status(404).send({
  //           message: `Not found Tutorial with id ${req.params.id}.`
  //         });
  //       } else {
  //         res.status(500).send({
  //           message: "Error updating Tutorial with id " + req.params.id
  //         });
  //       }
  //     } else res.send(data);
  //   }
  // );
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
