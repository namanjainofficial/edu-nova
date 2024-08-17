const { instance } = require('../config/razorpay');
const User = require('../models/UserSchema');
const Course = require('../models/CourseSchema')
const mailSender = require('../utils/mailSender');

//capture the payment and initial the razorpay order
exports.capturePayment = async (req, res) => {
    try {
        //fetch user details and course details
        const userId = req.user.id; 
        const { course_id} = req.body;
        //validation - course ID, User ID
        if( !course_id ){
            return res.json({
                success: false,
                message: "course Id is invalid"
            })
        }
        //valid course details
        let course;
        try {
            course = await Course.findById(course_id);
            if( !course ){
                return res.json({
                    success: false,
                    message: "Course Details are not found"
                })
            }
             //Already Purchase this order or course
             const uid = new mongoose.Types.ObjectId(course_id);
             if( course.studentEnrolled.includes(uid) ){
                return res.status(200).json({
                    success: false,
                    message: "Course is already Purchase By the User && Student is already Enrollerd"
                })
             }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: "Error occure while trying to purchase"
            })
        }
       
        // create order
        const amount = course.price;
        const currency = "INR";
        const options = {
            amount: amount*100,
            currency,
            recipt: Math.round(Date.now()).toString(),
            notes:{
                courseId: course_id,
                userId,
            },
           
        }
        try {
            const paymentResponse = await instance.orders.create(options); 
            console.log("payment response",paymentResponse)

            return res.status(200).json({
                success: true,
                message: "Order created successfully",
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId : paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount, 

            })
        } catch (error) {
            return res.json({
                success: false,
                message: "could not initialise order"
            })
        }
        //response

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating Capture payment & order",
            error
        })
    }
};


//signature Verification
exports.verifySignature = async (req, res) => {
    const webHookSecret = "123456";

    const signature = req.headers["x-razorpay-signature"];

    crypto.createHmac("sha256", webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    //match signature
    if(digest === signature){

        const{ courseId, userId} = req.body.payload.payment.entity.notes;
        
        try {
            //find the student and enrolled in the course
            const enrolledCourse = await Course.findByIdAndUpdate({ _id: courseId},
                                                        {
                                                            $push: { studentEnrolled: userId }
                                                        },
                                                        {new: true},
            );
            if ( !enrolledCourse){
                return res.status(400).json({
                    success: false,
                    message: 'Course not found'
                })
            }
            //update in user Schema 
            const enrolledStudent = await User.findByIdAndUpdate({_id: userId},
                                                            {
                                                                $push:{ courses: courseId}
                                                            },
                                                            {new: true},
            );
            //mail send krna hai
            const emailResponse = await mailSender(
                                                enrolledStudent.email,
                                                "Congratulations, Onboarding to Courses",
                                                "Congratulations, Onboarding to Courses"
            )
            return res.status(200).json({
                success: true,
                message: 'Purchase Course successfully'
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }else{
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }
}