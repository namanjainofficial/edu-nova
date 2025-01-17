const express = require("express")
const router = express.Router();
const { auth } = require("../middlewares/auth");

const {
    deleteAccount,
    updateProfile,
    getAllUserDetail,
    updateDisplayPicture,
    getEnrolledCourses,
  } = require("../controllers/ProfileCtrl")



  // Delet User Account
router.delete("/deleteProfile", auth,  deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetail)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router