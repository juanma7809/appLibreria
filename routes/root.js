var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var con = require('../conn/conn');

router.post('/registarAdmin', function(req, res, next){

    var usuario = req.body.usuario;
    var nombre = req.body.nombre;
    var contrasena = req.body.contrasena;
    var cpassword = req.body.ccontrasena;
    var role = 'admin'
  
    if(cpassword == password){
  
      var sql = 'select * from Administrador where usuario = ?;';
  
      con.query(sql,[usuario], function(err, result, fields){
        if(err) throw err;
  
        if(result.length > 0){
          req.session.flag = 1;
          res.redirect('/');
        }else{
  
          var hashpassword = bcrypt.hashSync(password, 10);
          var sql = 'insert into Administrador(usuario,nombre,contrasena,role) values(?,?,?,?);';
  
          con.query(sql,[usuario,nombre,hashpassword,role], function(err, result, fields){
            if(err) throw err;
            req.session.flag = 2;
            res.redirect('/');
          });
        }
      });
    }else{
      req.session.flag = 3;
      res.redirect('/root');
    }
  });

  module.exports = router;