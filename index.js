const express = require("express");
const cors = require("cors");
const {
    dbContainer
} = require("./dbRepositories/dummyDb/repository");
require("dotenv").config();

const database = dbContainer;

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

ex_app.use(cors({
    origin:"*",
    allowedHeaders:"Content-Type",
    methods:"POST"
}));

ragAiChat(io);

//LEARN HOW THIS MIDDLE WAER WORKS TONIGHT.
function injectCurrentDb(req, _, next){
    req.database = database;
    next();
}

const authApi = require("./api/authApi");
const mistakesApi = require("./api/mistakesApi");

ex_app.use(injectCurrentDb);
ex_app.use("/authApi/", authApi);
ex_app.use("/mistakesApi/", mistakesApi);

chatServer.on("upgrade", (req, socket, head) => {
  console.log("Upgrade requested:", req.url);
});

ex_app.set("port", JSON.parse(process.env.CURRENT_PORT) || 4001);

chatServer.listen(ex_app.get("port"), ()=>{
    console.log("Listening on port " + process.env.CURRENT_PORT);
});