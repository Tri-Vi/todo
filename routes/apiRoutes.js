const express = require('express');
const router = express.Router()
const mysql = require('mysql');
const connection = require('../db/connection');

var tasks = require('../db/tasks.js');
var users = require('../db/users.js');

router.get('/getUser', function(req, res){
  connection.connect(function(err) {
    if (err) throw err;
    console.log('connected');
    connection.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
      connection.end();
    });
  });
});

router.get('/getTask', function(req, res){
  var query = parseInt(req.query.assignedUserId);
  var filterTasks = tasks.tasks.filter(function(item){
    return item.assignedUserId == query;
  });
  console.log(filterTasks);
  res.json(filterTasks);
});

router.post('/postTask', function(req, res){
  // add new task to tasklist
  tasks.tasks.push(req.body);
  //filter tasks assigned to current user
  var filterTasks = tasks.tasks.filter(function(task){
    return task.assignedUserId == req.body.assignedUserId;
  });
  //send the json filter task list
  res.json(filterTasks);
})

router.post('/editTask', function(req, res){
  var assignedUserId = req.body.assignedUserId;
  var taskId = req.body.id;
  var newStatus = req.body.status;
  var index = tasks.tasks.findIndex(function(task){
    return task.id == parseInt(taskId);
  });
  tasks.tasks[index].status = newStatus;
  var filterTasks = tasks.tasks.filter(function(task){
    return task.assignedUserId == req.body.assignedUserId;
  });
  res.json(filterTasks);
});

router.post('/removeTask', function(req, res){
  var index = tasks.tasks.findIndex(function(task){
    return task.id == parseInt(req.body.id);
  });
  tasks.tasks.splice(index, 1);
  var filterTasks = tasks.tasks.filter(function(task){
    return task.assignedUserId == req.body.assignedUserId;
  });
  res.json(filterTasks);
});


module.exports = router;
