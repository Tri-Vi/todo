const express = require('express');
const router = express.Router()
const mysql = require('mysql');
const connection = require('../db/connection');

connection.connect(function(err){
  if (err){
    throw err;
    connection.end();
  }
})

router.get('/getUser', function(req, res){
  connection.query("SELECT * FROM users", function (err, result, fields) {
    if (err){
      throw err;
      connection.end();
    }
    res.json(result);
  });
});

router.get('/getTask', function(req, res){
  var assignedUserId = req.query.assignedUserId;
  console.log(assignedUserId);
  var sqlQuery = "SELECT * FROM tasks WHERE assignedUserId = " + mysql.escape(req.query.assignedUserId);
  connection.query(sqlQuery, function(err, result, fields){
    if(err){
      throw err;
      connection.end();
    }
    res.json(result);
  })
});

router.post('/postTask', function(req,res){
  var sqlQuery = "INSERT INTO tasks(id, name, status, assignedUserId) VALUES ?";
  var values = [[req.body.id, req.body.name, req.body.status, req.body.assignedUserId]];
  connection.query(sqlQuery, [values], function(err, result){
    if(err){
      throw err;
      connection.end();
    }
    sqlQuery = "SELECT * FROM tasks WHERE assignedUserId = " + req.body.assignedUserId;
    connection.query(sqlQuery, function(err, result2){
      if(err){
        throw err;
        connection.end();
      }
      res.json(result2);
    })
  })
});

router.post('/editTask', function(req, res){
  var sqlQuery = "UPDATE tasks SET status = ? WHERE id = ?";
  connection.query(sqlQuery, [req.body.status, req.body.id], function(err, result){
    if(err){
      throw err;
      connection.end();
    }
    sqlQuery = "SELECT * FROM tasks WHERE assignedUserId = ?";
    connection.query(sqlQuery, [req.body.assignedUserId], function(err, result2){
      if(err){
        throw err;
        connection.end();
      }
      res.json(result2);
    })
  })
});

router.post('/removeTask', function(req, res){
  var sqlQuery = "DELETE FROM tasks WHERE id = ?";
  connection.query(sqlQuery, [req.body.id], function(err, result){
    if(err){
      throw err;
      connection.end();
    }
      sqlQuery = "SELECT * FROM tasks WHERE assignedUserId = ?";
      connection.query(sqlQuery, [req.body.assignedUserId], function(err, result2){
        if(err) {
          throw err;
          connection.end();
        }
        res.json(result2);
      })
  })
})

module.exports = router;
