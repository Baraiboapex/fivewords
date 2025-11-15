import nodemailer from "nodemailer";
import dotenv from 'dotenv'; 

dotenv.config();

const setupEmailer = async ()=>{
    try{
        const emailSenderConfig = {
            service: 'gmail',
            secure: false,
            pool: true,
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.EMAILER_SERVICE_EMAIL,
                pass: process.env.EMAILER_SERVICE_PASSWORD
            }
        }

        let emailSender = nodemailer.createTransport(emailSenderConfig);
        
        return emailSender;
    }catch(err){
        console.log("EMAILTER SETUP ERROR : ",err);
        throw new Error("Could not set up emailer : ", err);
    }
}

module.exports = {
    setupEmailer
};