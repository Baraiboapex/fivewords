const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");

const {
    handleMissingFieldsErrors,
    handlDBQueryErrors
} = require("./helpers/errorHandlingHelpers/apiErrorHandlingHelpers");

const app = express.Router();

app.use(bodyParser.json({type:"application/json"}));

app.post("/login",(req, res)=>{
    try{
        let finalData = null;

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
                                dbPath:[auth.userId]
                            });

                            if(requestData){
                                const relevantUserData = {};
                                relevantUserData.token = req.authWear.generateToken(requestData);
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
                    throw new Error(JSON.parse())
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
                            //Perform token heartbeat here.

                            const requestData = req.authWear.resetToken()

                            if(requestData){
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
                    throw new Error(JSON.parse())
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