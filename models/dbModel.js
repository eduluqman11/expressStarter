const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const dataModel = new Schema({
     imageurl :{
        type: String,
      },
   topic:{
        type:String,
       },
     description:{
        type:String,
     },
   
})

module.exports = mongoose.model('crud',dataModel)