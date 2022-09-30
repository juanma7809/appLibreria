var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var con = require('../conn/conn');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.flag == 1){
    req.session.destroy();
    res.render('index', { title: 'Libreria', message : 'Email Already Exists' , flag : 1});
  }
  else if(req.session.flag == 2){
    req.session.destroy();
    res.render('index', { title: 'Libreria', message : 'Registration Done. Please Login.', flag : 0});
  }
  else if(req.session.flag == 3){
    req.session.destroy();
    res.render('index', { title: 'Libreria', message : 'Confirm Password Does Not Match.', flag : 1});
  }
  else if(req.session.flag == 4){
    req.session.destroy();
    res.render('index', { title: 'Libreria', message : 'Incorrect Email or Password.', flag : 1 });
  }
  else{
    res.render('index', { title: 'Libreria' });
  }
   
});

//Handle POST request for User Registration
router.post('/auth_reg', function(req, res, next){

  var cedula = req.body.cedula;
  var nombre = req.body.nombre;
  var fecha_nacimiento = req.body.fecha_nacimiento;
  var lugar_nacimiento = req.body.lugar_nacimiento;
  var direccion = req.body.direccion;
  var genero = req.body.genero;
  var correo = req.body.correo;
  var temasPreferencia = req.body.temasPreferencia;
  var role = 'cliente'
  var password = req.body.contrasena;
  var cpassword = req.body.ccontrasena;

  if(cpassword == password){

    var sql = 'select * from cliente where correo = ?;';

    con.query(sql,[correo], function(err, result, fields){
      if(err) throw err;

      if(result.length > 0){
        req.session.flag = 1;
        res.redirect('/');
      }else{

        var hashpassword = bcrypt.hashSync(password, 10);
        var sql = 'insert into cliente(cedula,nombre,fecha_nacimiento,lugar_nacimiento,direccion,genero,correo,temasPreferencia,role,contrasena) values(?,?,?,?,?,?,?,?,?,?);';

        con.query(sql,[cedula,nombre,fecha_nacimiento,lugar_nacimiento,direccion,genero,correo,temasPreferencia,role,hashpassword], function(err, result, fields){
          if(err) throw err;
          req.session.flag = 2;
          res.redirect('/');
        });
      }
    });
  }else{
    req.session.flag = 3;
    res.redirect('/');
  }
});


//Handle POST request for User Login
router.post('/auth_login', function(req,res,next){

  var correo = req.body.correo;
  var password =req.body.contrasena;

  var sql = 'select * from cliente where correo = ?;';
  
  con.query(sql,[correo], function(err,result, fields){
    if(err) throw err;

    if(result.length && bcrypt.compareSync(password, result[0].contrasena)){
      req.session.correo = correo;
      res.redirect('/home');
    }else{
      req.session.flag = 4;
      res.redirect('/');
    }
  });
});


//Route For Home Page
router.get('/home', function(req, res, next){
  res.render('home', {message : 'Welcome, ' + req.session.correo});
});

router.get('/logout', function(req, res, next){
  if(req.session.correo){
    req.session.destroy();
    res.redirect('/');
  }
})

module.exports = router;
