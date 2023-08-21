const Teacher = require("../models/teacher.models");
const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const { invitationMail } = require("../helper/mailHelper");
const { response } = require("express");



//* Create  Joy validation object -------------

const teacherValidationObject = Joi.object({
    name: Joi.string().min(4).max(20).required().messages({
        "string.base": "Name must be string",
        "string.min": "Name should contains atlist 4 characters",
        "string.max": "Name should contains maximum 20 charactors",
        "string.empty": "Name is mandatory"
    }),
    email: Joi.string().email().required().messages({
        "string.base": "Email must be string",
        "string.empty": "Email is mandatory",
        "string.email": "Your input should be email"
    }),
    otp: Joi.number().required().messages({
        "number.base": "otp must be number",
        "number.empty": "otp is mandatory"
    }),
    password: Joi.string().min(6).max(15).required().messages({
        "string.base": "password must be string",
        "string.min": "password should contains atlist 6 characters",
        "string.max": "password should contains maximum 15 charactors",
        "string.empty": "password is mandatory"
    })

})



let registerTeacher = async (req, res, next) => {
    try {

        let { email, name, password } = req.body

        //* OTP validation-------------

        let otp = Math.floor(100000 + Math.random() * 900000)
        console.log(otp)

        const { value, error } = teacherValidationObject.validate({ name, email, otp, password });

        if (error) {
            return res.status(400).json({ error: true, message: "Validation failed", err: error.details[0].message });
        }
        else {
            const isTeacher = await Teacher.findOne({ email: value.email });
            console.log(value)
            if (!isTeacher) {
                const createTeacher = await Teacher.create(value);


                //*send mail--------------

                invitationMail(value.email, value.name, value.otp);
                return res.status(201).json({
                    error: false, message: "Teacher Added successfully", data: {
                        name: createTeacher.name,
                        age: createTeacher.age, gender: createTeacher.gender, email: createTeacher.email
                    }
                });
            }

            res.status(403).json({ error: true, message: "Teacher already exist with this email!!" })

        }

    }
    catch (err) {
        next(err)
    }
}

let loginTeacher = async (req, res, next) => {
    try {
        let { email, password } = req.body
        console.log(password)

        let isTeacherAvailable = await Teacher.findOne({ email })
        console.log(isTeacherAvailable);

        if (!isTeacherAvailable) {
            return res.status(404).json({ error: true, message: "No teacher found at given email" })
        }

        let hashedPassword = await isTeacherAvailable.compareMyPassword(password)

        if (hashedPassword) {
            return res.status(201).json({ error: false, message: "Login SuccessFull" })
        }

        else {
            return res.status(401).json({ error: true, message: "Invalid password" })
        }
    }

    catch (err) {
        next(err)
    }
}


const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body

        const isFindTeacher = await Teacher.findOne({ email })
        console.log(isFindTeacher)

        if (isFindTeacher) {
            const isOTPMatch = await isFindTeacher.compareMyOTP(otp)
            if (isOTPMatch) {
                const updateTeacher = await Teacher.findOneAndUpdate({ email }, { verified: true })
                return res.status(200).json({ error: false, data: updateTeacher, message: "Teacher Verified Successfully" })
            }
            else {
                return res.status(404).json({ error: true, message: "Invalid OTP" })
            }
        }
        res.status(404).json({ error: true, message: "No Teacher Found" })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    registerTeacher,
    loginTeacher,
    verifyOTP
}