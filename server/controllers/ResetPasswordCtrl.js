const User = require('../models/UserSchema');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt')
const crypto = require('crypto');
// reset password token

exports.resetPasswordToken = async(req, res) => {
    try {
        // fetch email address
        const {email} = req.body;
        //check existing user
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success: false,
                message: "your email is not registered with Us"
            })
        }
        //generate token
        const token = crypto.randomBytes(20).toString("hex");

        //updateuser by adding token and expiration time
        const updateDetails = await User.findOneAndUpdate({email},
                                   {
                                        token: token,
                                        resetPasswordExpires: Date.now() + 3600000
                                    } 
                                    //update document return hota hai DB mein
                                    ,{new: true});

        //create url
        const url = `http://localhost:3000/update-password/${token}`;
        // send mail contain url
        await mailSender(email,
                        "Password Reset Link",
                        `Password Reset Link: ${url}`);
        //response return 
        return res.json({
            success: true,
            message:" Email sent successfully Please email and update your password"
        })
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"something went wrong while sending email of forget password"
        })
    }
};


//reset password

exports.resetPassword = async(req, res) => {
    try {
        //fetch data
        const { password, confirmPassword, token } = req.body;
        //validation
        if(password !== confirmPassword) {
            return res.json({
                success: false,
                message : "Password cannot match with confirm Password"
            })
        }
        //get user information
        const userDetails = await User.findOne({token: token});
        //valid token from DB and 
        if( !userDetails){
            return res.json({
                success: false,
                message : "Token Invalid"
            });
        }
        //check time expiration
        if( userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message : "Token is expired please regenerate the token"
            });
        }
        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Update password in database
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true},
        )
        //return response
        return res.status(200).json({
            success : true,
            message : "Password Reset Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"something went wrong while sending email of forget password"
        })
    }
}