const SubSection = require('../models/SubSectionSchema');
const Section = require('../models/SectionSchema');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require('dotenv').config();

//create Sub section

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description } = req.body
    const video = req.files.video

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" })
    }
    console.log(video)

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    )
    console.log(uploadDetails)
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    })

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection")

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection })
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
// exports.createSubSection = async (req,res) => {
//     try {
//         //fetch data
//         const {sectionId, title, description} = req.body;
//         //extract file
//         const video = req.files.videoFile;
//         //validation
//         if(!sectionId || !title || !description || !video){
//             return res.status(400).json({
//                 success: false,
//                 message:"All fiels are required to field"
//             });
//         }
//         //upload video to cloudinary server
//         const uploadDetails = await uploadImageToCloudinary(video, process.env.CLOUD_FOLDER)
//         //create a sub Section
//         const subSectionDetails = await SubSection.create({
//             title: title,
//             timeDuration:  `${uploadDetails.duration}`,
//             description: description,
//             videoUrl: uploadDetails.secure_url
//         })
//         //update section schema with this sub section
//         const updatedSubSection = await Section.findByIdAndUpdate({_id: sectionId},
//             {
//                 $push: {
//                     subSection: subSectionDetails._id,
//                 }
//             },{new: true}
//          ).populate('subSection').exec();
         
//          //add populate in this query upper
//         //response
//         return res.status(200).json({
//             success: true,
//             data: updatedSubSection,
//             message:"Creation of Sub Section successfully"
//         })

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Sub Section creation failed Please try again",
//             error: error.message
//         })
//     }
// }

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId,subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    const updatedSection = await Section.findById(sectionId).populate("subSection")


    return res.json({
      success: true,
      data:updatedSection,
      message: "Section updated successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}


// exports.updateSubSection = async (req, res) => {
//     try {
//       const { sectionId,subSectionId, title, description } = req.body
//       const subSection = await SubSection.findById(subSectionId)
  
//       if (!subSection) {
//         return res.status(404).json({
//           success: false,
//           message: "SubSection not found",
//         })
//       }
  
//       if (title !== undefined) {
//         subSection.title = title
//       }
  
//       if (description !== undefined) {
//         subSection.description = description
//       }
//       if (req.files && req.files.video !== undefined) {
//         const video = req.files.video
//         const uploadDetails = await uploadImageToCloudinary(
//           video,
//           process.env.FOLDER_NAME
//         )
//         subSection.videoUrl = uploadDetails.secure_url
//         subSection.timeDuration = `${uploadDetails.duration}`
//       }
  
//       await subSection.save()
//       const updatedSection = await Section.findById(sectionId).populate("subsection")
  
//       return res.json({
//         success: true,
//         data: updatedSection,
//         message: "Section updated successfully",
//       })
//     } catch (error) {
//       console.error(error)
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while updating the section",
//       })
//     }
//   }
  
// exports.deleteSubSection = async (req, res) => {
//     try {
//       const { subSectionId, sectionId } = req.body
//       await Section.findByIdAndUpdate(
//         { _id: sectionId },
//         {
//           $pull: {
//             subSection: subSectionId,
//           },
//         }
//       )
//       const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
//       if (!subSection) {
//         return res
//           .status(404)
//           .json({ success: false, message: "SubSection not found" })
//       }
//       const updatedSection = await Section.findById(sectionId).populate("subsection")
  
//       return res.json({
//         success: true,
//         data: updatedSection,
//         message: "SubSection deleted successfully",

//       })
//     } catch (error) {
//       console.error(error)
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while deleting the SubSection",
//       })
//     }
//   }
  exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }
