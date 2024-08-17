const User = require('../models/UserSchema');
const OTP = require('../models/OTPSchema');
const Profile = require('../models/ProfileSchema');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require('../mail/passwordUpdate')
require('dotenv').config();


//  signup
exports.signUp = async (req, res) => {
    try {
        //fetch  data from form
        const {firstName, lastName, email, password, confirmPassword,
            accountType, contactNumber ,otp
         } = req.body;
        //validate data
         if( !firstName || !lastName || !email || !password|| !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: 'All field is required'
            })
         }
        //2 passwords match krlo
        if( password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: 'password and confirm doesnot match'
            });
        }

        //check user already registered
        const checkingUser = await User.findOne({ email});
        if( checkingUser){
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            });
        }
        //find the most recent OTP last opt ko fetch krna hai
        const response = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        //console.log("recentOtp",recentOtp)
        //validate OTP
        if( response.length === 0){
            //opt not found
            return res.status(404).json({
                success: false,
                message: "OTP not found" 
            })
        }else if( response[0].otp !== otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        //password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        //create entry in database
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })
        const user = await User.create({
            firstName, 
            lastName, 
            email, 
            contactNumber,
            password: hashedPassword, 
            accountType: accountType, 
            additionalDetails: profileDetails._id,
            approved: approved,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        //return response
        res.status(200).json({
            success: true,
            message:" user registered successfully",
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"user cannot be registered Please try again"
        });
    }
};


//  signIN
exports.login = async (req, res) => {
    try {
        //fetch user information
        const {email, password} = req.body;
        //validation
        if( !email || !password ){
            return res.status(403).json({
                success: false,
                message: "all fields are required"
            })
        }
        //existing user or not
        const user = await User.findOne({email});
        if( !user){
            return res.status(401).json({
                success: false,
                message: "user not registered"
            });
        }
        //token generation JWT after passsword match

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET,
                 {expiresIn: "24h", });
            user.token = token;
            user.password = undefined;

            //create cookie and response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000), 
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User LogIn successfully"
            });
        }else{
            return res.status(401).json({
                success: false,
                message:"password is invalid"
            })
        }
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure Please try again"
        });
    }
};

//send  OTP
exports.sendOtp = async (req,res) => {
    
    try {
        //fetch email
        const {email} = req.body;

        //checked register or not
        const checkedEmail = await User.findOne({email});
        if(checkedEmail){
            return res.status(401).json({
                sccess: false,
                message: 'User already Registered',
            })
        }
        
        //generate OTP
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        //console.log("otp generated ", otp);

        //check opt uniquie or not
        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
            }); 
        }
        const otpPayload = {email, otp};
        //create entry in DB
        const otpBody = await OTP.create(otpPayload);
        //console.log(otpBody);
        console.log("OTP Body", otpBody);
        //response from OTP
        res.status(200).json({
            success: true,
            message: "OTP Send Successfully",
            otp
        });


    } catch (error) {
        console.log("error occure while send OTP",error);
        return res.status(500).json({
            success: false,
            message: "OTP Send Error"
        });
    }
};


// change password

exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		// if (newPassword !== confirmNewPassword) {
		// 	// If new password and confirm new password do not match, return a 400 (Bad Request) error
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "The password and confirm password does not match",
		// 	});
		// }

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};

// exports.changePassword = async(req, res) => {
//     try {
//         // fetch data
//         const userId = req.user.id;
//         const user = await User.findById(userId);
//         //get old password current password, confirm password
//         const { oldPassword, newPassword} = req.body;
//         // validate - matching old password and empty password or not
//         if( !oldPassword || !newPassword ){
//             return res.status(400).json({
//                 success: false,
//                 message: 'All Fields are required and new password or confirm password sholud be match'
//             })
//         }
//         if( await bcrypt.compare(oldPassword, user.password) ){
//             //hashing the password
//             const hashedPassword = await bcrypt.hash(newPassword, 10);
//             //update password in DB
//             const updatedUser = await User.findByIdAndUpdate({_id: user._id},
//                                                             {
//                                                                 $push:{ password: hashedPassword}
//                                                             },
//                                                             {new: true}
//             );
//             // send Email - password updated
//             try {
//                 const emailResponse = await mailSender( updatedUser.email,
//                                                 passwordUpdated(
//                                                     updatedUser.email,
//                                                     `Password updated successfully for ${updatedUser.firstName} ${updatedUser.lastName}`
//                                                 )

//                 )
//                 console.log("Email sent successfully:", emailResponse.response);
//             } catch (error) {
//                 console.error("Error occurred while sending email:", error);
// 			    return res.status(500).json({
// 				success: false,
// 				message: "Error occurred while sending email",
// 				error: error.message,
// 			});
//             }
//             //response
//             return res.status(200).send({
//                 success: true,
//                 message: "Password updated Successfully",
//             })
//         }else{
//             return res.status(400).json({
//                 success: false,
//                 message: "Old password and new password are Not Matching",
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             success : false,
//             message :"Error occur while updating password",
//             error: "Error: " + error.message
//         })
//     }
// }