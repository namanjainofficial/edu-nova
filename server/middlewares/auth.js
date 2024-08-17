const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/UserSchema')


//auth
exports.auth = async(req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token || req.body.token 
                      || req.header("Authorization").replace("Bearer ","");
        if( !token ) {
            return res.status(401).json({
                success: false,
                message: " token is Missing"
            })
        }
        //verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            //verfication issue
            return res.status(401).json({
                success: false,
                message: " token is Invalid"
            })
            
        }  
        next();            
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while validating token"
        })
    }
};

//student
exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Students Only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User Account Type cannot be be verified"
        })
    }
};

//admin
exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin Only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User Account Type cannot be be verified"
        })
    }
};

// Instructor
exports.isInstructor = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Instructor Only"
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "User Account Type cannot be be verified"
        })
    }
};