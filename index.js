const express = require("express");
const cors = require("cors");
const {
   userData
} = require("./dbRepositories/liveDb/repository");
const {
    jwtHelpers
} = require("./api/helpers/authHelpers/jwtHelpers");
require("dotenv").config();

let builtDb = null;

const buildDb = async () => {
    builtDb = await userData.buildDatabase();
};

(async ()=>{
    await buildDb();

    beginBuildingDb();
    //Using dummy values for now
    database.createDatabase({
        name:"test-db",
        config:{
            dbName:"test-config",
            connectionUrl:"some/url/to/db",
            connectionCredentials:{
                cred1:"test"
            }
        }
    });

    const http = require("http");
    const ex_app = express();
    const ragAiChat = require("./chatServer/ragAiChat");
    const chatServer = http.createServer(ex_app);
    const {Server} = require("socket.io");
    const io = new Server(chatServer,
        {
            cors:{
                origin:"*",
                methods:["GET","POST"]
            }
        }
    );

    io.use(async (currentSocket, next)=>{
        try{
            const currentToken = socket.handshake.auth.userToken;
            const noTokenFound = !currentToken;
            
            if(noTokenFound){
                throw new Error("You must provide a valid JWT token. There was no token found in the connection request");
            }

            const currentDecodedToken = await jwtHelpers.validateToken(currentToken);
            
            currentSocket.userId = currentDecodedToken.message;
            
            next();
        }catch(err){
            return next(new Error(`Could not authenticate communications: ${err}`,))
        } 
    });

    ex_app.use(cors({
        origin:"*",
        allowedHeaders:"Content-Type",
        methods:"POST"
    }));

    ragAiChat(io);

    //LEARN HOW THIS MIDDLE WEAR WORKS TONIGHT.
    async function injectCurrentDb(req, _, next){
        req.database = builtDb;
        next();
    }

    function injectTokenHelper(req, _, next){
        req.authWear = jwtHelpers;
        next();
    }

    const authApi = require("./api/authApi");
    const mistakesApi = require("./api/mistakesApi");

    ex_app.use(injectCurrentDb);
    ex_app.use(injectTokenHelper);
    ex_app.use("/authApi/", authApi);
    ex_app.use("/mistakesApi/", mistakesApi);

    chatServer.on("upgrade", (req, socket, head) => {
    console.log("Upgrade requested:", req.url);
    });

    ex_app.set("port", JSON.parse(process.env.CURRENT_PORT) || 4001);

    chatServer.listen(ex_app.get("port"), ()=>{
        console.log("Listening on port " + process.env.CURRENT_PORT);
    });
})();
