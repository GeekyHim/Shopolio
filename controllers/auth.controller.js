const bcrypt = require('bcryptjs')
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const secret = require("../configs/auth.config")

// need to write the controller / logic to register a user

// create/register a user, should be available as a module everywhere
exports.signup = async (req,res) => {
    
    //logic to create the user
    //1. read req body
    const request_body = req.body  // this gets me the req body in the form of js obj  


    //2. insert the data in the users collections in mongodb 
    //3. Return the response back to the user
    
    const userObj = {
        name : request_body.name,
        userId : request_body.userId,
        email : request_body.email,
        userType : request_body.userType,
        password : bcrypt.hashSync(request_body.password,8)

    }

    try{
        const user_created = await user_model.create(userObj)
        
        // return now
        const res_obj = {
            name : user_created.name,
            userId : user_created.userId,
            email : user_created.email,
            userType : user_created.userType,
            createdAt : user_created.createdAt,
            updatedAt : user_created.updatedAt
        } // this doesnt have password for security purposes
        res.status(201).send({
            success: true,
            message: 'Signup successful',
            data: res_obj
        }) // 201 means successfully created
    }catch(err){
        console.log("Error while registering the user...",err)
        res.status(500).send({
            success: false,
            message : "Some Error Happened while registering the user",
            data : {}
        }) //500 means internal server error
    }
    
}
//contoller ke pass both req and res ka control hona chahiye 


// FOR LOGIN 

exports.signin = async (req,res) => {

    // check if the user id is present in the db 
    const user = await user_model.findOne({userId : req.body.userId})
    if(user == null){
        return res.status(400).send({
            success: false,
            message : "ERROR - User Id provided is Invalid or Doesn't Exist",
            data : {}
        })
    }
   
    // if password is correct or not
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)   
    // since same instance of bcrypt is using to call this method hence it alrdy knows
    // salt etc so ye khud hash kar compare karke bta dega 
    // true if match else false
    if(!isPasswordValid){
        return res.status(401).send({
            success: false,
            message : "ERROR : Password Invalid", // Galat hai, Sahi daalo :P
            data : {}
        })
    }

    // using jwt generate/create an access token with a given TTL (time to live) and return it 
    const token = jwt.sign({id : user.userId}, secret.secretKey ,{ expiresIn : 120 })
    // sign ek method hai jo mujhe token dega
    // kis data pe token bnega, here userId
    // 2nd is secret word -> dont hard code, keeps on changing --> config files me bna diya
    // TTL in seconds, here 2 mins ie 120 sec

    res.status(200).send({
        success: true,
        message: 'Signin successful',
        data: {
            name : user.name,
            userId : user.userId,
            email : user.email,
            userType : user.userType,
            accessToken : token
        }
    })
}