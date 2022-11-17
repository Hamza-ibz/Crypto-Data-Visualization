

let AWS = require("aws-sdk");

//Create client for accessing DynamoDB
let documentClient = new AWS.DynamoDB.DocumentClient();

//Create instance of Comprehend
let comprehend = new AWS.Comprehend();

//Function that will be called
exports.handler = (event, context) => {
    console.log(JSON.stringify(event));
    
        event.Records.forEach((record) => {
            if (record.eventName === "INSERT") {
                

                
            let tweetid = record.dynamodb.NewImage.TweetId.N
            let tweets = record.dynamodb.NewImage.tweets.S
            let crypto = record.dynamodb.NewImage.crypto.S
            let timestamp = record.dynamodb.NewImage.timestamp.N
                        var TimeStampInt = parseInt(timestamp)
            var IDInt = parseInt(tweetid)
                
                let params = {
                    LanguageCode: "en",
                    Text: tweets,
                };
        
                let SentimentAnalysis = async (params) => {
                    return new Promise((resolve, reject) => {
                        //Call comprehend to detect sentiment of text
                        comprehend.detectSentiment(params, (err, data) => {
                            //Log result or error
                            if (err) {
                                reject((err));
                            } else {
                                let response = {
                                    statusCode: 200,
                                    body: JSON.stringify(data)
                                };
                                resolve(response);
                            }
                        });
                    });
                };
                
                let tweetUpdate = async function (crypto, timestamp,  tweetid) {
                    const sentiment = await SentimentAnalysis(params);
        
                    let p = {
                        TableName: "TweetSentiment",
                        Item: {
                                 TweetId: IDInt, //Crypto
                                 timestamp: TimeStampInt, //Tweet created at
                                 crypto: crypto,
                                 sentiment: JSON.parse(sentiment.body),
                        }
                    };
                    
                    //Store data in DynamoDB and handle errors
                    documentClient.put(p, (err, data) => {
                        if (err) {
                            console.error("Error JSON:", JSON.stringify(err));
                        } else {
                            console.log("Record added to table:", p.Item);
                        }
                    });
                };
                tweetUpdate(crypto, timestamp, tweetid);
            }
        });
    
};


