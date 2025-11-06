const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');

const {
    handleMissingFieldsErrors,
    handlDBQueryErrors
} = require("./helpers/errorHandlingHelpers/apiErrorHandlingHelpers");

const app = express.Router();

app.use(bodyParser.json({type:"application/json"}));

app.get("/loadMistakes",(req, res)=>{
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
                                dbPath:[auth.userId, "userMistakes"]
                            });

                            if(requestData){
                                return {
                                    responseCode:200,
                                    result:userMistakes
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

app.get("/loadSingleMistake",(req, res)=>{
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
                                dbPath:[auth.userId, "userMistakes", auth.mistakeId]
                            });

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

app.post("/addMistake",(req, res)=>{
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
                            const newId = uuidv4();
                            const requestData = await req.dbContainer.addData({
                                dbName: "users",
                                dbPath: [auth.userId, "userMistakes", newId],
                            });

                            if(requestData){
                                return {
                                    responseCode:200,
                                    result:{message:"Success!"}
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

app.put("/editMistake", (req,res)=>{
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
                            const newId = uuidv4();
                            const requestData = await req.dbContainer.addData({
                                dbName: "users",
                                dbPath: [auth.userId, "userMistakes", auth.mistakeId],
                            });
                            
                            if(requestData){
                                return {
                                    responseCode:200,
                                    result:{message:"Success!"}
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