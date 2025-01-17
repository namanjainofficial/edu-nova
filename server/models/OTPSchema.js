const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/emailVerificationTemplate')

const OTPSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        expires: 5*60
    }
});

async function sendVerificationEmail(email, opt){

    try {
        const mailResponse = await mailSender(email,"Verification email from Edu-Nova",
            emailTemplate(opt));
        console.log("email send successfully ",mailResponse);
    } catch (error) {
        console.log("error occuence while sending opt on email",error);
        throw error;
    }
}
OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model('OTP', OTPSchema);