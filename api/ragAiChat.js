
const _ = require("lodash");
const {spawn} = require("child_process");

let runRagAI = null;
let ragAiChat = null;

const currentUsers = new Map();

function attatchResponseListeners(userId){
    try{
        if (!runRagAI) return;
        runRagAI.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            const eofStreamTag = "<<END_OF_STREAM>>";

            for (const line of lines) {
                const userId = line.substring(0, line.indexOf("::"));
                const response = line.substring(line.indexOf("::") + 2, line.length);
                if(userId){
                    const socket = currentUsers.get(userId);
                    if(socket){
                        if(!line.includes(eofStreamTag)){
                            console.log("RES : ", response);
                            socket.emit("sendResponse", response);
                        }
                    }
                }
            }
        });

        runRagAI.stderr.on('error', (data) => {
            const userId = line.substring(0, data.indexOf("::"));
            const currentError = line.substring(data.indexOf("::") + 2, data.length);
            
            const socket = currentUsers.get(userId);

            console.log(`Error in RAG AI : ${currentError}`);

            if(socket){
                currentUsers.delete(userId);
                throw new Error(`Error: ${currentError}`);
            }
        });
    }catch(err){
        throw new Error("Error while attatching response listeners => Rag AI process was never mounted!")
    }
}

function createRagAiChat(io){
    try{
        if(!runRagAI){
            ragAiChat = io.of("/ragAiChat");
            const path = require('path');
            const scriptPath = path.resolve(__dirname, '../rag_ai.py');
            
            runRagAI = spawn("python", ["-u", scriptPath]);
            attatchResponseListeners(); 
        }
        if(ragAiChat){
            ragAiChat.on("upgrade", (req, socket, head) => {
                console.log("Upgrade requested:", req.url);
            });

            ragAiChat.on("connection",(socket)=>{
                const userId = socket.userId;

                if (!userId) {
                    console.error("Connection blocked: Missing User ID.");
                    socket.disconnect();
                    return;
                }

                socket.join(userId); 

                socket.on("sendMessage",(message)=>{
                    if(!runRagAI){
                        throw new Error(`Error: ${data}`);
                    }
                    const query = message.question;

                    if(!currentUsers.get(userId)){
                        const initialTab = {};
                        initialTab[tabId] = socket;
                        currentUsers.set(userId, {
                            id:userId,
                            tabs:initialTab
                        });
                    }

                    runRagAI.stdin.write(`${userId}::${query}\n`);

                    console.log("MESSAGE LOADED");
                });
            });
            
            ragAiChat.on("close_rag_ai",(data)=>{
                currentQueries.delete(data.tabId);
                currentUsers.delete(data.userId);
            });
        }else{
            throw new Error("Chat not ready yet.");
        }
    }catch(err){
        console.log("Error constructing chat server : ", err);
    }
}

module.exports = createRagAiChat;