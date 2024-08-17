const Profile = require('../models/ProfileSchema');
const User = require('../models/UserSchema');
const Course = require('../models/CourseSchema');
const mongoose =require("mongoose");
const { uploadImageToCloudinary}   = require('../utils/imageUploader');

//update profile
exports.updateProfile = async (req, res) => {
    try {
        //get data 
        const { dateOfBirth="", about="", contactNumber, gender =""} = req.body;
        //get user id
        const userId = req.user.id;
        //validation
        if( !contactNumber || !userId ){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //find profile
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile other method to update object properties
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;
        profileDetails.gender = gender;
        await profileDetails.save();
        
        //response
        return res.status(200).json({
            success: true,
            message: "Update profile details successfully",
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "profile updation failed Please try again",
            error: error.message
        })
    }
};

//delete 
//How can we schedule this delete operation

exports.deleteAccount = async(req, res) =>{
    try {
        //get id user
        const userId = req.user.id;
        //validation
        const user = await User.findById(userId);
        if( !user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        // delete profile of user
        //const profileId = user.additionalDetails;
        await Profile.findByIdAndDelete({_id: user.additionalDetails});
        //HW Delete enrolledStudent from Courses 
        const uid = new mongoose.Types.ObjectId(userId);
        await Course.findByIdAndDelete( userId ,{ studentEnrolled : uid})

        // delete user
        await User.findByIdAndDelete({_id: userId}); 

        //response
        return res.status(200).json({
            success: true,
            message: "User deleted Account successfully",
        });
    } catch (error) {
      console.log(error);
        return res.status(500).json({
            success: false,
            message: "profile Deletion failed Please try again",
            error: error.message
        })
    }
}

//get User Detail
exports.getAllUserDetail = async (req, res) => {
    try {
        //get Id 
        const userId = req.user.id;
        //find user and validate
        const userDetails = await User.findById(userId).populate("additionalDetails").exec();
        //response
        return res.status(200).json({
            success: true,
            message: "User Detail fetch successfully",
            userDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " failed Please try again",
            error: error.message
        })
    }
};

//update  display picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(
          displayPicture,
          process.env.FOLDER_NAME,
          
        )
        // console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
          { _id: userId },
          { image: image.secure_url },
          { new: true }
        )
        console.log(updatedProfile)
        return res.status(200).json({
          success: true,
          message: `Image Updated successfully`,
          data: updatedProfile,
        })
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
  };
    
exports.getEnrolledCourses = async (req, res) => {
      try {
        const userId = req.user.id
        const userDetails = await User.findOne({
          _id: userId,
        })
          .populate("courses")
          .exec()
        if (!userDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
          })
        }
        return res.status(200).json({
          success: true,
          data: userDetails.courses,
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
  };