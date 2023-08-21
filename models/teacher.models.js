const { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');
let teacherSchema = new Schema({

    name: {
        type: String,
        required: [true, "Name is mandatory"]
    },
    password: {
        type: String,
        required: [true, "Password is mandatory"]
    },

    email: {
        type: String,
        required: [true, "Email is mandatory"]
    },
    otp: {
        type: String,
        required: [true, "Otp is Mandatory"]

    },
    verified: {
        type: Boolean,
        default: false
    }

},
    { timestamps: true })

//* Don't use arrow function for pre method.

teacherSchema.pre("save", async function (next) {

    console.log(this.otp)
    console.log(this.password)


    let salt = await bcryptjs.genSalt(11)
    this.password = await bcryptjs.hash(this.password, salt);
    this.otp = await bcryptjs.hash(this.otp, salt)
    console.log(this.otp)

    //* from 5 and above version of mongoose next() is not required
    //next()
})

//* Compare OTP

teacherSchema.methods.compareMyOTP = async function (otp) {
    let hashedOTP = await bcryptjs.compare(otp, this.otp)
    return hashedOTP
}



module.exports = new model("OTPvalidation", teacherSchema)