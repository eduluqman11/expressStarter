const express = require('express');
const bodyParser=require('body-parser')
const mongoose = require('mongoose')
const jwt= require('jsonwebtoken')
const db= require('./models/dbModel')
const methodOverride= require('method-override')
const app = express()
const ejs= require('ejs')
const port=3000

//middelware 
app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'views')


//middware functions for validation age
  function validate(req, res, next) {
         if(!req.params.age && req.params.age == "" ){
            res.send("please enter age");
         }else if(req.params.age <= 18){
            res.send("you are not allowed visit ");
         }else{
            next()
         }
  }


  function verifyToken(req, res, next) {
  
    const bearerHeader = req.headers['authorization'];
   if(typeof bearerHeader !== 'undefined') {
     const bearer = bearerHeader.split(' ');
     const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
    } else {
      res.sendStatus(403);
    }
  
  }


  

//database connection with mongodb;
let url = "mongodb://localhost:27017/edulabSignupS"
 mongoose.connect(url,(err)=>{
    if(err) throw err
    console.log("connection successfully established")
})  

//get Routes
app.get('/create',(req,res)=>{
  res.render('create.ejs')
})



app.get('/',(req,res)=>{
  db.find({},(err,data)=>{
    if(err){
      res.json({status:404,messgae:err.message})
      console.log(err.messgae)
    }else{
      console.log("data shown in main page",data)
      res.render('main.ejs',{res:data})
    }
  })

})
// //post Routes
// app.post('/post',(req,res)=>{
//     db.create({
//           imageurl: req.body.imageurl,
//           title: req.body.title,
//           description: req.body.description,
//          },(err,result)=>{
//         if(err){
//             res.json({error:err.message,status:403})
//             console.log("Error creating in creating database with value :",err.message);
//              }else{
//              jwt.sign({result},'secretKey',{expiresIn:216000},(err,data)=>{
//                     if(err){
//                    res.json({status:403,message:"token not find"})
//                      console.log("token not found")
//                     }else{
//                       res.render('/',)
//                     //  res.json({status:200,message:"token created successfully",data:data})
//                      console.log("token created successfully :"+ data )
//                     }
//               })
//              }
//        })
// })


app.post('/create',(req,res)=>{
 db.create({
    imageurl: req.body.imageurl,
    topic: req.body.topic,
    description: req.body.description
  },(err,data)=>{
    if(err){
      res.json({status:404,message:err.message})
      console.log(`Error in request: ${err.message}`)
    }else{
      res.redirect('/')
      // res.json({status:200,message:"data saved successfully"})
      console.log("data save successfully",data)
    }
  })
})



app.get('/post/auth',verifyToken ,(req,res)=>{
    console.log(req.token)
    jwt.verify(req.token,"secretKey",(err,result)=>{
          if(err){
            res.json({status:403,message:"you are failed to access this site"})
            console.log("failed")
          }else{
            res.json({
                message:"Welcome brother you are authenticated",
                status:200,
                data:result
            })
          }
    }) 
})


app.get('/:id',(req,res)=>{
  db.findOne({_id:req.params.id},(err,data)=>{
    if(err){
      res.json({status:404,message:"data not found" })
      console.log("data not found")
    } else{
      console.log("data found successfully")
      res.render('create.ejs',{value:data})
    }
  })
})

//update Routes
app.put('/create/:id',(req,res)=>{
  console.log(req.params.id)
   db.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{new:true})
   .then((result)=>{
    if(!result){
        res.json({messgae:"data not updated due to some err"})
        console.log("Data not  updated")
    }else{
      res.redirect('/')
        console.log("data updated",result)
    }
   })
})

//delete Routes
app.delete('/:id',(req,res)=>{
    db.deleteOne({_id:req.params.id},(err,result)=>{
        if(err){
            res.json({messgae:"data not deleted due to some issue",status:406})
            console.log("err in deleting",err.message)
        }else{
             res.redirect('/')
            console.log("successfully ",result)
        }
    })
})


app.listen(port,()=>{
     console.log(`Server is running on ${port}`)
     console.log(3600*60)
})


