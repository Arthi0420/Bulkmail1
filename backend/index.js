const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");
require('dotenv').config();

const app = express()

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json())//Middleware

//Contencting DB
mongoose.connect(process.env.MONGO_URL).then(function () {
    console.log('Connected to DB')
})
    .catch(function () {
        console.log("Failed to connect")
    })

//Create Model
const credential = mongoose.model('credential', {}, "bulkmail")


//Sending an email 

app.post("/sendemail", function (req, res) {

    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function (data) {

        //Create a Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
              },
        });
    
    
        new Promise(async function (resolve, reject) {
            try {
                for (var i = 0; i < emailList.length; i++) {
    
                    await transporter.sendMail({
                        from: "arthifswd2024@gmail.com",
                        to: emailList[i],
                        subject: "Message from Kedi!",
                        text: msg
                    }
                    )
                    console.log("Email sent to:" + emailList[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("Failed")
            }
    
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })
    
    }).catch(function (error) { console.log(error) })    

})

app.listen(5000, function () {
    console.log("Server Started...")
})