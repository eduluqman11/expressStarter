const express = require('express');
const bodyParser=require('body-parser')
const app = express()
const port=3000

app.get('/',(req, res)=>{
    res.send("Hello")
})

app.listen(port,()=>{
     console.log(`Server is running on ${port}`)
})