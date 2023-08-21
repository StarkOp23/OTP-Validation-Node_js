const express = require('express')
const { registerTeacher, loginTeacher, verifyOTP } = require("../controller/teacher.controller")

let router = express.Router();

router.post("/addteacher", registerTeacher);
router.post("/loginteacher", loginTeacher);
router.post("/verifyteacher",verifyOTP)


module.exports = router;