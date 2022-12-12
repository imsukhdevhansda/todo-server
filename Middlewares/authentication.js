let jwt = require("jsonwebtoken")
require("dotenv").config();

let validator = async (req,res,next)=>{

    let header = req.headers;

  try{

 if (header.authtoken) {

let token = header.authtoken;
let decoded = jwt.verify(token, process.env.SECRET_KEY);
let { UserId} = decoded;
req.body.UserId = UserId;
next();
 } else {
   res.send({ msg: "Auth token is missing" });
 }

  }
  catch(err){
     res.send({ msg: err });
     console.log( "From validator-->", err)

  }





   
    // res.send("I am from middleware")

}

module.exports = validator;