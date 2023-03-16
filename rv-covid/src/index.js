const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector');
const mongoose = require('mongoose');

app.get("/totalRecovered" , async (req,res)=>{
    var count = 0 ;
    const recd = await connection.find();
    recd.map((key)=>{
        count = count + parseInt(key.recovered);
    })
    res.status(200).send({count});
})


app.get("/totalActive" , async (req,res)=>{
    var count = 0 ;
    const recd = await connection.find();
    recd.map((key)=>{
        count = count + parseInt(key.infected) - parseInt(key.recovered);
    })
    res.status(200).send({count});
})

app.get("/totalActive" , async (req,res)=>{
    var count = 0 ;
    const recd = await connection.find();
    recd.map((key)=>{
        count = count + parseInt(key.infected) - parseInt(key.recovered);
    })
    res.status(200).send({count});
})

app.get("/totalDeath" , async (req,res)=>{
    var count = 0 ;
    const recd = await connection.find();
    recd.map((key)=>{
        count = count + parseInt(key.death);
    })
    res.status(200).send({count});
})

app.get("/hotspotStates" , async (req,res)=>{
    const arr = []
    const recd = await connection.find();
    recd.map((key)=>{
        var rate = parseFloat(((parseInt(key.infected) - parseInt(key.recovered)) / parseInt(key.infected)).toFixed(5));

        if(rate >(0.1)){
            const obj = {state : key.state , rate : rate}
            arr.push(obj);
            
        }
    })
    res.status(200).send({arr});
})
app.get("/healthyStates" , async (req,res)=>{
    const arr = []
    const recd = await connection.find();
    recd.map((key)=>{
        var rate = parseFloat(parseInt(key.death)/parseInt(key.infected)).toFixed(5)
        if(rate < (0.005)){
            const obj = {state : key.state , mortality : rate}
            arr.push(obj);
        }
    })
    res.status(200).send({arr});
})



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;