
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser= require('body-parser'); //handles reading data from forms
const hbs = require('hbs'); //templating engine
var request = require('request');
var fs = require("fs");
const cors = require ('cors');
const MongoClient = require('mongodb').MongoClient; //database
const objectId = require('mongodb').ObjectID;
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var PORT = process.env.PORT || 3000;


const app = express();

// var url = "mongodb+srv://Jessie:Mongodb@bookd.hy23l.mongodb.net/test";

var url="mongodb+srv://Jessie:Portfolio@cluster0.lae3m.mongodb.net/test";

var db;


//connect to the MongoDB
MongoClient.connect(url, (err, client) => { //this is localhost connection string, for cloud drop the connection string, the localhost address: mongodb+srv://corawan:admin@cluster0.palg8.mongodb.net/test?authSource=admin&replicaSet=atlas-l4f3ow-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
  if (err) return console.log(err);
  db = client.db('portfolio'); //Sets the database to work with
//starts a server
app.listen(PORT, () => {
    console.log('listening on port 3000')
  })
})



// session-based authentication

app.use(session({
    key: "user_sid",
    secret: "secret",  //used to sign the session ID cookie
    resave: false,
    saveUninitialized: false,
    cookie: { //Object for the session ID cookie.
    expires: 600000,  //cookies on the browser for 6 days
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('viewEngine', 'hbs' );

const redirectLogin = (req, res, next)=>{
    if(!req.session.userId){
        res.redirect('/admin')
    }else{
        next()
    }
}

const redirectDash = (req, res, next)=>{
    if(req.session.userId){
        res.redirect('/add-work')
    }else{
        next()
    }
}

// for image upload

app.use(express.static(path.join(__dirname, 'public')))  //making this public folder accessable

//app.use(express.static('./public/uploads'));

app.use(fileUpload(

));


//routing the "landing page/sign in" form
app.get('/', (req, res) => {
    res.render('index.hbs'); //by default, hbs views are placed in a "views" folder
})


app.get('/about',  (req, res) => {
    res.render('about.hbs');
})


app.get('/scent', (req, res) => {
    res.render('scent.hbs'); //by default, hbs views are placed in a "views" folder
})

app.get('/chargeshare', (req, res) => {
    res.render('chargeshare.hbs'); //by default, hbs views are placed in a "views" folder
})

app.get('/astroboy', (req, res) => {
    res.render('astroboy.hbs'); //by default, hbs views are placed in a "views" folder
})

app.get('/zoffice', (req, res) => {
    res.render('zoffice.hbs'); //by default, hbs views are placed in a "views" folder
})

app.get('/bookd', (req, res) => {
    res.render('bookd.hbs'); //by default, hbs views are placed in a "views" folder
})

app.get('/smartwatch', (req, res) => {
    res.render('smartwatch.hbs'); //by default, hbs views are placed in a "views" folder
})

app.get('/contact', (req, res) => {
    res.render('contact.hbs');
})


app.post('/contact', (req, res) => {

    db.collection('contact').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
   
        console.log('saved to database') //debug console message       
        return res.send('Your message has been sent. Thank you!');
      })
})




app.post('/signup', redirectDash, (req, res) => {

    db.collection('user').insertOne(req.body, (err, result) => {
     if (err) return console.log(err)

     console.log('saved to database') //debug console message
     res.redirect('/login')
   })
  })

var sess; var thePassword; var theEmail; var user; var password; var thisKeyword;
var fileName;

app.get('/signup', (req, res) => {
  res.render('signup.hbs'); //by default, hbs views are placed in a "views" folder
})


app.get('/admin', (req, res) => {
    res.render('login.hbs');
})

app.post('/admin', redirectDash, (req, res, next) => {

  theEmail = req.body.email;
  thePassword = req.body.password;

 
  db.collection('user').find({email: theEmail})
  .next()
  .then(user => {
      console.log(user);
      console.log(user.username);
      console.log(user.email);
      console.log(user.password);
      console.log(user._id);

      //return user;
      if(user.password === thePassword){
          req.session.userName = user.username;
          req.session.userId = user._id;
          console.log(req.session.userId);
          res.redirect("/viewContact");        

      }else{
          res.send('Incorrect Username and/or Password!');
      }
  });

})



app.get('/logout', redirectLogin , (req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/admin')
    })
} )

//display the "Add book" form
app.get('/add-work', redirectLogin, (req, res) => {
    res.render('add-work.hbs'); //by default, hbs views are placed in a "views" folder
 })

  app.get('/viewContact', (req, res) => {
    db.collection('contact').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('viewContact.hbs',{contact: result})     
        
    })
})


app.post('/deleteContact/:id', (req, res) => {
    console.log (req.query.method);
    if(req.query.method == 'delete'){
        db.collection('contact').deleteOne({_id: new objectId(req.params.id)});
        console.log(req.params.id);
        console.log("the data is deleted");
        res.redirect('/viewContact') ;
    }
   
    res.status(200).send();       
})


app.get('/viewContact/:id', (req, res) => {
console.log(req.params.id);
 db.collection('contact').findOne({_id: req.params.id}, (err, result) => {
            if (err) throw err;
            res.render('viewContact.hbs', {contact: result}) 
     })
})
      
 








