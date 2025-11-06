
function handleMissingFieldsErrors({req, requiredFields, func}){
    try{
        if(Object.keys(req).length === requiredFields.length){
            func(req);
        } else if(requiredFields === null){
            func(req);
        }
        throw new Error(JSON.stringify({
            code:400,
            message:"Client sent incorrect data, field list is not correct : " + Object.keys(req).toString() + " should be " + requiredFields.toString()
        }));
    }catch(err){
        return err;
    }
}

async function handlDBQueryErrors({req, requiredFields, func}){
    return new Promise(async (resolve, reject) =>{
        try{
            if(Object.keys(req).length === requiredFields.length){
                const queryFunction = await func(req);
                if(queryFunction.responseCode === 200){
                    resolve({
                        code:200,
                        message:queryFunction.result
                    })
                } else {
                    throw new Error(JSON.parse({
                        code:500,
                        message:"Could not find the queried fields in the database : " + Object.keys(req).toString()
                    }));
                }
            }else{
                throw new Error(JSON.stringify({
                    code:400,
                    message:"Client sent incorrect data : " + " should be " + requiredFields.toString()
                }));
            }
        }catch(err){
            reject(err);
        }
    });
    
}

module.exports = {
    handleMissingFieldsErrors,
    handlDBQueryErrors
};
