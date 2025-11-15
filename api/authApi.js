const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");
const {
    uuidv4
} = require("uuid");

const {
    handleMissingFieldsErrors,
    handlDBQueryErrors
} = require("./helpers/errorHandlingHelpers/apiErrorHandlingHelpers");

const {
    mailApp
} = require("./services/emailerService/emailerService");

const app = express.Router();

app.use(bodyParser.json({type:"application/json"}));

app.post("/login",(req, res)=>{
    try{
        let finalData = null;
        if(req.authWear.validateToken(req.header("authToken"))){
            handleMissingFieldsErrors({
                req:req.body,
                requiredFields:null,
                func:async (req)=>{
                    try{
                        const queryData = {}
                        const queryDataFields = [];
                        const dbQueryResult = await handlDBQueryErrors({
                            req:queryData, 
                            requiredFields:queryDataFields, 
                            func:async ()=>{
                                const requestData = await req.dbContainer.getData({
                                    dbName: "users",
                                    dbFind:(item) => item.email === req.body.email && item.password === req.body.password,
                                });

                                if(requestData){
                                    const relevantUserData = {};
                                    relevantUserData.token = req.authWear.generateToken(requestData);
                                    relevantUserData.refreshToken = req.authWear.generateToken(requestData);
                                    return {
                                        responseCode:200,
                                        result:requestData
                                    }
                                }
                                return {
                                    responseCode:500,
                                }
                            }
                        });

                        finalData = dbQueryResult.message;
                    }catch(err){
                        throw new Error(JSON.stringify(err))
                    }
                }
            });

            res.status(200).send({
                success:true,
                message:finalData
            })
        }else{
            throw new Error(JSON.stringify({
                code:401,
                message:"Token not authorized"
            }));
        }
        
    }catch(baseError){
        try{
            res.status(JSON.parse(baseError).code).send({
                success:false,
                message:JSON.parse(baseError).message,
                code:JSON.parse(baseError).code,
            });
        }catch(err){
            res.status(500).send({
                success:false,
                message:"Catastrophic server failure : " + err,
                code:500,
            });
        }
        
    }
});

app.post("/signup",(req,res)=>{
    try{
        let finalData = null;
        if(req.authWear.validateToken(req.header("authToken"))){
            handleMissingFieldsErrors({
                req:req.body,
                requiredFields:["username","password"],
                func:async (req)=>{
                    try{
                        const queryData = {};
                        const queryDataFields = ["email", "password"];
                        const dbQueryResult = await handlDBQueryErrors({
                            req:queryData, 
                            requiredFields:queryDataFields, 
                            func:async ()=>{

                                const requestData = await req.dbContainer.addData({
                                    dbName: "users",
                                    dbPath:[req.body.userId],
                                    newData:req.body
                                });

                                if(requestData){
                                    return {
                                        responseCode:200,
                                        result:"You have successfully signed up!"
                                    }
                                }

                                return {
                                    responseCode:500,
                                    result:"Could not sign you up. Pleas come back later and try again."
                                };
                            }
                        });

                        finalData = dbQueryResult.message;
                    }catch(err){
                        throw new Error(JSON.stringify(err))
                    }
                }
            });

            res.status(200).send({
                success:true,
                message:finalData
            })
        }else{
            throw new Error(JSON.stringify({
                code:401,
                message:"Token not authorized"
            }));
        }
        
    }catch(baseError){
        try{
            res.status(JSON.parse(baseError).code).send({
                success:false,
                message:JSON.parse(baseError).message,
                code:JSON.parse(baseError).code,
            });
        }catch(err){
            res.status(500).send({
                success:false,
                message:"Catastrophic server failure : " + err,
                code:500,
            });
        }
        
    }
});

app.post("/forgotpassword",(req, res)=>{
    try{
        let finalData = null;
        handleMissingFieldsErrors({
            req:req.body,
            requiredFields:null,
            func:async (req)=>{
                try{
                    const queryData = {}
                    const queryDataFields = ["email"];
                    const dbQueryResult = await handlDBQueryErrors({
                        req:queryData, 
                        requiredFields:queryDataFields, 
                        func:async ()=>{
                            const validationCode = Math.floor(Math.random() * (max - min + 1)) + min;
                            const foundUser = await req.dbContainer.getData({
                                dbName: "users",
                                dbFind:(item) => item.email === req.body.email,
                            });
                            
                            if(foundUser){
                                const userId = foundUser.id;
                                const verificationId = uuidv4();
                                const resetItemAdded = await req.dbContainer.addData({
                                    dbName: "passwordReset",
                                    dbPath:[verificationId],
                                    newData:{
                                        id:verificationId,
                                        validationCode,
                                        userId
                                    }
                                });
                                if(resetItemAdded){
                                    await mailApp.sendEmail({
                                        emailAddress:req.body.email,
                                        emailSubject:"New Auth Code",
                                        emailTemplate:"AuthEmail",
                                        emailData:{
                                            authCode:validationCode,
                                            applicationName:"Five Words"
                                        },
                                    });
                                    return {
                                        responseCode:200,
                                        result:{
                                            verifyId:verificationId
                                        }
                                    };
                                }
                                return {
                                    responseCode:500,
                                    result:"An error ocurred on our side"
                                }
                            }
                            return {
                                responseCode:500,
                                result:"An error ocurred on our side"
                            }
                        }
                    });
                    finalData = dbQueryResult.message;
                }catch(err){
                    throw new Error(JSON.stringify(err))
                }
            }
        });

        res.status(200).send({
            success:true,
            message:finalData
        })
        
    }catch(baseError){
        try{
            res.status(JSON.parse(baseError).code).send({
                success:false,
                message:JSON.parse(baseError).message,
                code:JSON.parse(baseError).code,
            });
        }catch(err){
            res.status(500).send({
                success:false,
                message:"Catastrophic server failure : " + err,
                code:500,
            });
        }
        
    }
});

app.post("/validatepasswordcode",(req, res)=>{
    try{
        let finalData = null;
        handleMissingFieldsErrors({
            req:req.body,
            requiredFields:["validationCode"],
            func:async (req)=>{
                try{
                    finalData = null;
                    const queryData = {};
                    const queryDataFields = ["verificationId"];
                    const dbQueryResult = await handlDBQueryErrors({
                    req:queryData, 
                    requiredFields:queryDataFields, 
                    func:async ()=>{
                        const verificationId = req.body.verificationId;
                        const getCode = await req.dbContainer.getData({
                            dbName: "passwordReset",
                            dbPath:[verificationId],
                        });

                        const codeExists = getCode.validationCode === req.body.validationCode;
                        const relevantUserData = {};

                        relevantUserData.userId = getCode.userId;
                        
                        if(codeExists && userIdExists){
                            return {
                                responseCode:200,
                                result:relevantUserData
                            }
                        }
                        return {
                            responseCode:500,
                        }
                    }
                });

                finalData = dbQueryResult.message;
                }catch(err){
                    throw new Error(JSON.stringify(err))
                }
            }
        });

        res.status(200).send({
            success:true,
            message:finalData
        })
        
    }catch(baseError){
        try{
            res.status(JSON.parse(baseError).code).send({
                success:false,
                message:JSON.parse(baseError).message,
                code:JSON.parse(baseError).code,
            });
        }catch(err){
            res.status(500).send({
                success:false,
                message:"Catastrophic server failure : " + err,
                code:500,
            });
        }
        
    }
});

app.post("/changepassword",(req, res)=>{
    try{
        let finalData = null;
         handleMissingFieldsErrors({
            req:req.body,
            requiredFields:["password", "userId"],
            func:async (req)=>{
                try{
                    const queryData = {};
                    const queryDataFields = ["password", "userId"];
                    const dbQueryResult = await handlDBQueryErrors({
                        req:queryData, 
                        requiredFields:queryDataFields, 
                        func:async ()=>{
                            const foundUser = await req.dbContainer.getData({
                                dbName: "users",
                                dbPath:[req.body.userId, "id"],
                            });
                            
                            if(foundUser){
                                
                                const requestData = await req.dbContainer.addData({
                                    dbName: "users",
                                    dbPath:[req.body.userId, "password"],
                                    newData:req.body.password
                                });

                                if(requestData){
                                    return {
                                        responseCode:200,
                                        result:requestData
                                    }
                                }
                            }

                            return {
                                responseCode:500,
                                result:"An error ocurred on our end, please try again later."
                            };
                        }
                    });

                    finalData = dbQueryResult.message;
                }catch(err){
                    throw new Error(JSON.stringify(err))
                }
            }
        });

        res.status(200).send({
            success:true,
            message:finalData
        })
        
    }catch(baseError){
        try{
            res.status(JSON.parse(baseError).code).send({
                success:false,
                message:JSON.parse(baseError).message,
                code:JSON.parse(baseError).code,
            });
        }catch(err){
            res.status(500).send({
                success:false,
                message:"Catastrophic server failure : " + err,
                code:500,
            });
        }
        
    }
});

app.post("/tokenHeartbeat", (req, res)=>{
    try{
        let finalData = null;
        if(req.authWear.validateToken(req.header("authToken"))){
            handleMissingFieldsErrors({
                req:req.body,
                requiredFields:null,
                func:async (req)=>{
                    try{
                        const queryData = {}
                        const queryDataFields = [];
                        const dbQueryResult = await handlDBQueryErrors({
                            req:queryData, 
                            requiredFields:queryDataFields, 
                            func:async ()=>{
                                if(req.authWear.validateToken(req.header("authToken"))){
                                    const requestData = req.authWear.resetToken();

                                    if(requestData){
                                        return {
                                            responseCode:200,
                                            result:requestData.message
                                        }
                                    }
                                    return {
                                        responseCode:500,
                                    }
                                }
                            }
                        });

                        finalData = dbQueryResult.message;
                    }catch(err){
                        throw new Error(JSON.parse())
                    }
                }
            });

            res.status(200).send({
                success:true,
                message:finalData
            })
        }else{
            throw new Error(JSON.stringify({
                code:401,
                message:"Token not authorized"
            }));
        }
    }catch(baseError){
        try{
            res.status(JSON.parse(baseError).code).send({
                success:false,
                message:JSON.parse(baseError).message,
                code:JSON.parse(baseError).code,
            });
        }catch(err){
            res.status(500).send({
                success:false,
                message:"Catastrophic server failure : " + err,
                code:500,
            });
        }
        
    }
});