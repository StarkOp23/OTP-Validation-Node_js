const nodemailer = require('nodemailer');

let invitationMail = async (email, name, otp) => {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "sanjumaiti.maligram@gmail.com",
            pass: "iihgjyrblrnfndpq"
        }
    })
    transporter.sendMail({
        from: "sanjumaiti.maligram@gmail.com",
        to: email,
        subject: "Invitational Mail ",
        text: "Thanks for registering with us",
        html: `<h1> Thanks for Registering ${name}</h1>
        <p> Your otp is : <h3>${otp}</h3></p>`,
    }, () => {
        console.log("Mail sent successfully")
    })

}



module.exports = {
    invitationMail
}