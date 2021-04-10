// import and instantiate express
const express = require("express") // CommonJS import style!
const app = express() // instantiate an Express object
const cors = require('cors')
const profileRouter = require('./profile')
const sellingpostbackRouter = require('./sellingpostback')
const photocards = require('./public/photocards.json');


// import some useful middleware
// const bodyParser = require("body-parser") // middleware to help parse incoming HTTP POST data
const multer = require("multer") // middleware to handle HTTP POST requests with file uploads
const axios = require("axios") // middleware for making requests to APIs
require("dotenv").config({ silent: true }) // load environmental variables from a hidden file named .env
const morgan = require("morgan") // middleware for nice logging of incoming HTTP requests

/**
 * Typically, all middlewares would be included before routes
 * In this file, however, most middlewares are after most routes
 * This is to match the order of the accompanying slides
 */

// use the morgan middleware to log all incoming http requests
app.use(morgan("dev")) // morgan has a few logging default styles - dev is a nice concise color-coded style

app.use(cors())

// use the bodyparser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// make 'public' directory publicly readable with static content
app.use("/static", express.static("public"))


// use profile router
app.use("/profile", profileRouter)

//use sellingpostback router
app.use("/sellingpostback", sellingpostbackRouter)

//search
app.get('/search', (req,res)=> {
  const parsedInfo = {};
  let filtered = [];
  const all = photocards;

  if(req.query.name !== undefined){
      if (req.query.name.length !== 0){
          parsedInfo.name = req.query.name;
      }
      all.forEach(card =>{
        if (card.photocard_name.toLowerCase().match(parsedInfo.name.toLowerCase())){
            filtered.push(card);
        }
      });
  }else{
    filtered = all;
  }

  res.send(filtered);
});

// app.get('/api/search', (req,res)=> {
//   const parsedInfo = {};

//   if(req.query.name !== undefined){
//       if (req.query.name.length !== 0){
//           parsedInfo.name = req.query.name;
//       }
//   }
//   const filtered = [];
  
//   photocards.forEach(card =>{
//     if (card.photocard_name.toLowerCase().match(parsedInfo.name)){
//         filtered.push(card);
//     }
//   });
  
//   res.send(filtered);
// });

const photocard_json = require("./public/photocards.json")

app.get("/photocarddata", (req, res, next) => {
  // axios
  //   .get("https://my.api.mockaroo.com/photocard.json?key=49083ca0")
  //   .then(apiResponse => res.json(apiResponse.data))
  //   .catch(err => next(err))
  res.json(photocard_json)
})

app.get("/tradingdata", (req, res, next) => {

  axios
    .get("https://my.api.mockaroo.com/photocardtrading.json?key=49083ca0")
    .then(apiResponse => res.json(apiResponse.data))
    .catch(err => next(err))
})

app.get("/sellingdata", (req, res, next) => {

  axios
    .get("https://my.api.mockaroo.com/photocardselling.json?key=49083ca0")
    .then(apiResponse => res.json(apiResponse.data))
    .catch(err => next(err))
})

app.get("/lookingfordata", (req, res, next) => {

  axios
    .get("https://my.api.mockaroo.com/photocardlookingfor.json?key=49083ca0")
    .then(apiResponse => res.json(apiResponse.data))
    .catch(err => next(err))
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
