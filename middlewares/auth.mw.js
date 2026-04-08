// mw stands for middle ware
// mw to check if the req body is proper nd correct 

const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_config = require('../configs/auth.config')

const verifySignUpBody = async (req,res,next) =>{
    try{

        //check for all the essentials
        if(!req.body.name){ // 400 -> Bad request
            return res.status(400).send({
                success: false,
                message : "FAILED : Name was not provided",
                data : {}
            })
        }

        if(!req.body.email){
            return res.status(400).send({
                success: false,
                message : "FAILED : Email was not provided",
                data : {}
            })
        }

        if(!req.body.userId){
            return res.status(400).send({
                success: false,
                message : "FAILED : User ID was not provided",
                data : {}
            })
        }

        if(!req.body.password){
            return res.status(400).send({
                success: false,
                message : "FAILED : Password was not provided",
                data : {}
            })
        }

        if(!req.body.userType){
            return res.status(400).send({
                success: false,
                message : "FAILED : userType was not provided",
                data : {}
            })
        }
        
        const user = await user_model.findOne({userId : req.body.userId})
        
        if(user){
            return res.status(400).send({
                success: false,
                message : "FAILED : User with same User ID exists",
                data : {}
            })
        }

        //sab pass ho gya toh move next
        next()

    }catch(err){
        console.log("Error while validating the request object ",err)
        res.status(500).send({ // 500 -> internal server error
            success: false,
            message : "Error while validating request body",
            data : {}
        })
    }
}

const verifySignInBody = (req,res,next) =>{
    if(!req.body.userId){
        return res.status(400).send({
            success: false,
            message : "User Id Not Provided",
            data : {}
        })
    }

    
    if(!req.body.password){
        return res.status(400).send({
            success: false,
            message : "Password Not Provided",
            data : {}
        })
    }

    next()
}

const verifyToken = async (req,res,next) =>{
    // Check if token is present in header.
    // Swagger sends `Authorization: Bearer <token>`.
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token =
        typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
            ? authHeader.slice('Bearer '.length)
            : req.headers['x-access-token'];

    if(!token){
        return res.status(401).send({ // 401 unauthorized
            success: false,
            message : "Unauthorized: No token provided",
            data : {}
        })
    }
    // is the token valid
    jwt.verify(token, auth_config.secretKey, async (err,decoded)=>{
        if(err) {
            return res.status(401).send({
                success: false,
                message : "Unauthorized: Invalid token",
                data : {}
            })      
        }
        const user = await user_model.findOne({userId : decoded.id})
        // user id ko use karke token bnaya tha, isiliye decode karne pe wo mil jayegi 
        if(!user){
            return res.status(401).send({
                success: false,
                message : "Unauthorized: User for the token doesn't exist",
                data : {}
            })
        }
        
        // setting user info to req body
        req.user = user

        // only go to next if verified
        next()
    })
}


const isAdmin = async (req, res, next) =>{
    const user = req.user // could i have used req.body.user???
    if(user && user.userType == "ADMIN"){
        next()
    }
    else{
        return res.status(401).send({
            success: false,
            message : "Only Admin Users are allowed to access this endpoint",
            data : {}
        })
    }
}

module.exports = {
    verifySignUpBody : verifySignUpBody,
    verifySignInBody : verifySignInBody,
    verifyToken : verifyToken,
    isAdmin : isAdmin
}