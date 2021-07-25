const express = require('express')
const path=require('path')
const router = express.Router();
const bodyParser=require('body-parser')
const { error } = require('console')
const { endianness } = require('os');
const { join } = require('path');

const app = express()
app.set("view engine", "ejs");
app.set("views", __dirname);

app.use("/", router);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname,+'/public'))

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'index.html'))
})


app.post('/save',(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    const data={
        email:email,
        password:password
    }
    res.sendFile(path.join(__dirname,'login.html'))
    var mySql=require('mysql')
    var connection=mySql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'ic1_db'
    })
    connection.connect();
    connection.query('INSERT INTO users SET?',data,(error,results,fields)=>{
        if(error) throw error;
        console.log('succesful');
    })
    connection.end();
     
    console.log(data)
    console.log('Respose sign in')
})

app.use('/login',(req,res)=>{
    const Email=req.body.email
    const Password=req.body.password
    const data2={
        email:Email,
        password:Password
    }
    var mySql=require('mysql')
    var connection=mySql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'ic1_db'
    })
    connection.connect();
    connection.query('SELECT * FROM users WHERE Email=?',Email,(error,results,fields)=>{
        if(error)throw error;
        else if(results.length==0)
        {
            res.send('Email not found')
         console.log('Email not found')
        }
        else if(results[0].Password==Password)
          {
            res.send('Login Succesfull')
          }
        else
        {
            res.send('Invalid password or email')
          console.log('invalid email and password')
        }
    })
    connection.end();
    console.log(data2);
    console.log('login')
})

app.get("/admin",(req,res)=>{
    var mysql=require("mysql")
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'ic1_db'
    })
    connection.connect()
    console.log('connected')
    connection.query("SELECT * FROM applications", function (err, result) {
        if (err) throw err;
        res.render("home", { data: result });
      });
    })
  
//delete data
app.get("/users/delete/(:id)",(req,res)=>{
    var did=req.params.id;
    var mysql=require("mysql")
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'ic1_db'
    })
    connection.connect();
    connection.query("DELETE FROM list WHERE id=?",did,(err,result)=>{
    
    })
    connection.end();
    console.log('Deleted')
    res.redirect(req.get("referer"))
})

//accept
app.get("/user/edit/(:id)/(:s)",(req,res)=>{
    var id=req.params.id;
    var sel=req.params.s;
    if(sel==0)
    {
        sel=1;
    }
    else
    {
        sel=0;
    }
    var mysql=require("mysql")
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'ic1_db'
    })
    connection.connect();
    let udata=[sel,id];
    connection.query("UPDATE list SET status=? WHERE id=?",udata,(err,res)=>{
        if(err) throw err;
        console.log('updated')
    })
    connection.end();
    res.redirect(req.get("referer"))
    
})


//Details to be displated in more.ejs
app.get('/details/(:id)',(req,res)=>{
    var id=req.params.id;
    var mysql=require('mysql')
    var connerction=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'ic1_db'

    })
    connerction.connect()
    connerction.query("SELECT * FROM applications WHERE id=?",id, function (err, result) {
        if (err) throw err;
        res.render("more", { data: result });
        console.log(result);
      });
      connerction.end();
})

var apply=require('./public/js/apply')
app.use('/form',apply);

// app.get('/apply',(req,res)=>{
//     res.sendFile(path.join(__dirname,'application.html'))
// })





 console.log('running')
app.listen(3000)