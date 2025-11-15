const dotenv = require('dotenv'); 

const {generateHTMLTemplate} = require("../emailTemplates/templateGenerator.js");
const { setupEmailer } = require("./setupEmailer.js");

dotenv.config();

const emailer = setupEmailer();

const mailApp = {
    closeSenderConnectionfunction({
        emailSender
    }){
        emailSender.close();
    },
    async sendEmail({
        emailAddress,
        emailSubject,
        emailTemplate,
        emailData,
    }){
        try{
            const currentEmailTemplate = await generateHTMLTemplate({
                templateName:emailTemplate,
                emailData
            });

            const mailToOptions = {
                from: process.env.EMAILER_SERVICE_EMAIL,
                to: emailAddress,
                subject: emailSubject,
                html: currentEmailTemplate
            };

            emailer.sendMail(mailToOptions, (err,info)=>{
                if(err){
                    console.log("Could not send email ", err);
                    closeSenderConnection({
                        emailSender
                    });
                    throw new Error("Email Not Sent: " + err);
                }else{
                    console.log("SENDER INFO : ", info);
                    closeSenderConnection({
                        emailSender
                    });
                    resolve(info);
                }
            });

        }catch(err){
            console.log("Problem with emailer: " + err);
            throw new Error("Problem with emailer: " + err);
        }
    }
};

module.exports = {mailApp};