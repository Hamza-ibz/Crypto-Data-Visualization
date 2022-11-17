// //Import external library with websocket functions
let ws = require('websocket');
let db = require('database');

//Hard coded domain name and stage - use when pushing messages from server to client
let domainName = "27wctlrwy0.execute-api.us-east-1.amazonaws.com";
let stage = "prod";

exports.handler = async (event, context) => {
    try {
        
        //Get current data
        const data = await db.getCryptoData();


                if ('Records' in event) {
        const msg=JSON.stringify(data)

        console.log("Domain: " + domainName + " stage: " + stage);

        //Get promises message to connected clients
        let sendMsgPromises = await ws.getBroadCastCliemt(msg, domainName, stage);

        //Execute promises
        await Promise.all(sendMsgPromises);
            }
            
        //Get connection id of client that sent message
        let connId = event.requestContext.connectionId;
        
        console.log("Client ID: " + connId);

        console.log("Domain: " + domainName + " stage: " + stage);


        //send messages to connected client
        await ws.getSingleClient(connId, JSON.stringify(data), domainName, stage);

    }
    catch(err){
        console.log("Error sending data.");
        return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
    }

    //Success
    return { statusCode: 200, body: "Data sent successfully." };
};

