const RatingAndReview = require('../models/RatingAndReviewSchema');
const Course = require('../models/CourseSchema');

//create a rating and review
exports.createRatingAndReview = async (req, res) => {
    try {
        //fetch user ID and Course ID
        const userId = req.user.id;
        //fetch data from req body
        const { rating, review, courseId} = req.body;
        //check user enrolled or not validation
        const courseDetails = await Course.findOne({ _id: courseId,
                                         studentEnrolled: {$elemMatch: {$eq: userId}}
        });
        if( !courseDetails){
            return res.status(404).json({
                success: false,
                message: 'Student does not Enrolled in this Course',
            })
        }
        // check user already review or not
        const alreadyReviewed = await RatingAndReview.find({ user: userId, course: courseId });
        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "Course is already reviewed By the user",
            })
        }
        //create  rating and review
        const ratingAndReview = await RatingAndReview.create({
                                        rating, 
                                        review, 
                                        user: userId, 
                                        course: courseId
        })
        //update Course schema
        await Course.findByIdAndUpdate({_id: courseId},
                                                            {
                                                                $push: {
                                                                    ratingAndReview: ratingAndReview._id,
                                                                }
                                                            },{new: true})
    

        //reponse
        return res.status(200).json({
            success: true,
            message: "Creation of rating and review successfully",
            ratingAndReview
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while creating the rating'
        });
    }
}
//get Average rating and review
exports.getAverageRating = async (req, res) => {
    try {
        //get course Id
        const courseId = req.body.courseId;
        //calculate average rating
        const result = await RatingAndReview.aggregate(
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id: null,
                    averageRating: { $avg: "$rating"}
                }
            }
        )
        if( result.length > 0 ){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }
        //return rating if not found
        return res.status(200).json({
            success: true,
            message: "Average rating not found till know",
            averageRating:0,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while getting Average of rating'
        });
    }
}
//get all rating and review
exports.getAllRatingAndReview = async (req, res) => {
    try {
        //fetch course ID
        const allRating = await RatingAndReview.find({})
                                                .sort({rating : 'desc'})
                                                .populate({
                                                    path : 'user',
                                                    select:"firstName, lastName, email, image"
                                                })
                                                .populate({
                                                    path: 'course',
                                                    select: 'courseName'
                                                }).exce();
        //return response
        return res.status(200).json({
            success: true,
            message: 'fetching all Rating and Review',
            data: allRating
        })                                        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while getting all rating and Review'
        });
    }
}