

let AWS = require("aws-sdk");

//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();

//Returns all of the connection IDs
module.exports.getConnectionIds = async () => {
    let params = {
        TableName: "WebSocketClients"
    };
    return documentClient.scan(params).promise();
};

//Deletes the specified connection ID
module.exports.deleteConnectionId = async (connectionId) => {
    console.log("Deleting connection Id: " + connectionId);

    let params = {
        TableName: "WebSocketClients",
        Key: {
            ConnectionId: connectionId
        }
    };
    return documentClient.delete(params).promise();
};

//Returns all of the connection IDs
module.exports.getCryptoData = async () => {
    
          let paramsBTC = {
              ExclusiveStartKey:{"crypto":"BTC","timestamp":"1640131200	"},
         TableName: 'CryptoInfo',
         Limit: 100,
                 FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'BTC'
        },
      ExpressionAttributeNames: {
             '#ts':'timestamp',
             '#r' :'Rate'
         },
         ProjectionExpression:"#ts, #r",
         

     };
     
          let paramsETH = {
         TableName: 'CryptoInfo',
         ExclusiveStartKey:{"crypto":"ETH","timestamp":"1640131200	"},
         Limit: 100,
                 FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'ETH'
        },
      ExpressionAttributeNames: {
             '#ts':'timestamp',
             '#r' :'Rate'
         },
         ProjectionExpression:"#ts, #r"

     };
     
               let paramsDOGE = {
         TableName: 'CryptoInfo',
         ExclusiveStartKey:{"crypto":"DOGE","timestamp":"1640131200	"},
         Limit: 100,
                 FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'DOGE'
        },
      ExpressionAttributeNames: {
             '#ts':'timestamp',
             '#r' :'Rate'
         },
         ProjectionExpression:"#ts, #r"

     };
                    let paramsLUNA = {
         TableName: 'CryptoInfo',
         ExclusiveStartKey:{"crypto":"LUNA","timestamp":"1640131200	"},
         Limit: 100,
                 FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'LUNA'
        },
      ExpressionAttributeNames: {
             '#ts':'timestamp',
             '#r' :'Rate'
         },
         ProjectionExpression:"#ts, #r"

     };
     
        let paramsXLM = {
         TableName: 'CryptoInfo',
         ExclusiveStartKey:{"crypto":"XLM","timestamp":"1640131200	"},
         Limit: 100,
                 FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'XLM'
        },
      ExpressionAttributeNames: {
             '#ts':'timestamp',
             '#r' :'Rate'
         },
         ProjectionExpression:"#ts, #r"

     };
     
    
              let paramsBTCTweets = {
         TableName: 'TweetSentiment',
        FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'BTC'
        },
      ExpressionAttributeNames: {
             '#s':'sentiment'
         },
         ProjectionExpression:'#s'
     };
     
        let paramsETHTweets = {
         TableName: 'TweetSentiment',
        FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'ETH'
        },
      ExpressionAttributeNames: {
             '#s':'sentiment'
         },
         ProjectionExpression:'#s'
     };
     
        let paramsDOGETweets = {
         TableName: 'TweetSentiment',
        FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'DOGE'
        },
      ExpressionAttributeNames: {
             '#s':'sentiment'
         },
         ProjectionExpression:'#s'
     };
     
             let paramsLUNATweets = {
         TableName: 'TweetSentiment',
        FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'LUNA'
        },
      ExpressionAttributeNames: {
             '#s':'sentiment'
         },
         ProjectionExpression:'#s'
     };
     
        let paramsXLMTweets = {
         TableName: 'TweetSentiment',
        FilterExpression : 'crypto = :pr',
        ExpressionAttributeValues : {
            ':pr' : 'XLM'
        },
      ExpressionAttributeNames: {
             '#s':'sentiment'
         },
         ProjectionExpression:'#s'
     };
     

        let data = {
        BTC: {
            actual: {
                x: [],
                y: []
            },
            predicted: {
                x: [],
                y: []
            },
            sentiment: {
                average:[],
                positive:[],
                negative: [],
                mixed: [],
                neutral: []
            },
            twitter: {
                tweets:[]
            },
        },
                LUNA: {
            actual: {
                x: [],
                y: []
            },
            predicted: {
                x: [],
                y: []
            },
            sentiment: {
                average:[],
                positive:[],
                negative: [],
                mixed: [],
                neutral: []
            },
            twitter: {
                tweets:[]
            },
        },
                DOGE: {
            actual: {
                x: [],
                y: []
            },
            predicted: {
                x: [],
                y: []
            },
            sentiment: {
                average:[],
                positive:[],
                negative: [],
                mixed: [],
                neutral: []
            },
            twitter: {
                tweets:[]
            },
        },
                XLM: {
            actual: {
                x: [],
                y: []
            },
            predicted: {
                x: [],
                y: []
            },
            sentiment: {
                average:[],
                positive:[],
                negative: [],
                mixed: [],
                neutral: []
            },
            twitter: {
                tweets:[]
            },
        },
                ETH: {
            actual: {
                x: [],
                y: []
            },
            predicted: {
                x: [],
                y: []
            },
            sentiment: {
                average:[],
                positive:[],
                negative: [],
                mixed: [],
                neutral: []
            },
            twitter: {
                tweets:[]
            },
        },
    };
    
    //calculate average of all sentiment
function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
    

    //BTC DATA
    
    let resultBTC = await documentClient.scan(paramsBTC).promise();
    let resultSent = await documentClient.scan(paramsBTCTweets).promise();
    
    let SentBTC = resultSent.Items.map(a => a.sentiment);
    let rateBTC = resultBTC.Items.map(a => a.Rate);
    let timestampBTC = resultBTC.Items.map(a => a.timestamp);
    
    //convert timestamp to human date
    timestampBTC = timestampBTC.map(function (x) { 
        let dateObject = new Date(x*1000)
        dateObject=dateObject.toLocaleString().split(',')[0];;
  return dateObject
});
    
    //insert time and rate into data
    data.BTC.actual.y = rateBTC
    data.BTC.actual.x = timestampBTC
    
    
    let sentArrayBTC=[];
    let PositiveBTC=[];
    let NegativeBTC=[];
    let MixedBTC=[];
    let NeutralBTC=[];
    
    SentBTC.forEach((element) => {
    sentArrayBTC.push(element.Sentiment)
    PositiveBTC.push(element.SentimentScore.Positive)
    NegativeBTC.push(element.SentimentScore.Negative)
    MixedBTC.push(element.SentimentScore.Mixed)
    NeutralBTC.push(element.SentimentScore.Neutral)
    
});
data.BTC.sentiment.average = sentArrayBTC

mode(sentArrayBTC)
data.BTC.sentiment.average=mode(sentArrayBTC)

//calculate avarage positive
average(PositiveBTC).toFixed(2);
data.BTC.sentiment.positive=average(PositiveBTC) *100;

//calculate avarage negative
average(NegativeBTC).toFixed(2);
data.BTC.sentiment.negative=average(NegativeBTC) *100;

//calculate avarage mixed
average(MixedBTC).toFixed(2);
data.BTC.sentiment.mixed=average(MixedBTC) *100;

//calculate avarage neutral
average(NeutralBTC).toFixed(2);
data.BTC.sentiment.neutral=average(NeutralBTC) *100;

//ETH DATA

    let resultETH = await documentClient.scan(paramsETH).promise();
    let resultSentETH = await documentClient.scan(paramsETHTweets).promise();
    
    let SentETH = resultSentETH.Items.map(a => a.sentiment);
    let rateETH = resultETH.Items.map(a => a.Rate);
    let timestampETH = resultETH.Items.map(a => a.timestamp);
    
    timestampETH = timestampETH.map(function (x) { 
        let dateObject = new Date(x*1000)
        dateObject=dateObject.toLocaleString().split(',')[0];;
  return dateObject
});
    
    data.ETH.actual.y = rateETH
    data.ETH.actual.x = timestampETH
    
    let sentArrayETH=[];
    let PositiveETH=[];
    let NegativeETH=[];
    let MixedETH=[];
    let NeutralETH=[];
    
    SentETH.forEach((element) => {
    sentArrayETH.push(element.Sentiment)
    PositiveETH.push(element.SentimentScore.Positive)
    NegativeETH.push(element.SentimentScore.Negative)
    MixedETH.push(element.SentimentScore.Mixed)
    NeutralETH.push(element.SentimentScore.Neutral)
    
});
data.ETH.sentiment.average = sentArrayETH

mode(sentArrayETH)
data.ETH.sentiment.average=mode(sentArrayETH)

//calculate avarage positive
average(PositiveETH).toFixed(2);
data.ETH.sentiment.positive=average(PositiveETH) *100;

//calculate avarage negative
average(NegativeETH).toFixed(2);
data.ETH.sentiment.negative=average(NegativeETH) *100;

//calculate avarage mixed
average(MixedETH).toFixed(2);
data.ETH.sentiment.mixed=average(MixedETH) *100;

//calculate avarage neutral
average(NeutralETH).toFixed(2);
data.ETH.sentiment.neutral=average(NeutralETH) *100;


//DOGE DATA

    let resultDOGE = await documentClient.scan(paramsDOGE).promise();
    let resultSentDOGE = await documentClient.scan(paramsDOGETweets).promise();
    
    let SentDOGE = resultSentDOGE.Items.map(a => a.sentiment);
    let rateDOGE = resultDOGE.Items.map(a => a.Rate);
    let timestampDOGE = resultDOGE.Items.map(a => a.timestamp);
    
    timestampDOGE = timestampDOGE.map(function (x) { 
        let dateObject = new Date(x*1000)
        dateObject=dateObject.toLocaleString().split(',')[0];;
  return dateObject
});
    
    data.DOGE.actual.y = rateDOGE
    data.DOGE.actual.x = timestampDOGE
    
    let sentArrayDOGE=[];
    let PositiveDOGE=[];
    let NegativeDOGE=[];
    let MixedDOGE=[];
    let NeutralDOGE=[];
    
    SentDOGE.forEach((element) => {
    sentArrayDOGE.push(element.Sentiment)
    PositiveDOGE.push(element.SentimentScore.Positive)
    NegativeDOGE.push(element.SentimentScore.Negative)
    MixedDOGE.push(element.SentimentScore.Mixed)
    NeutralDOGE.push(element.SentimentScore.Neutral)
    
});
data.DOGE.sentiment.average = sentArrayDOGE

mode(sentArrayDOGE)
data.DOGE.sentiment.average=mode(sentArrayDOGE)

//calculate avarage positive
average(PositiveDOGE).toFixed(2);
data.DOGE.sentiment.positive=average(PositiveDOGE) *100;

//calculate avarage negative
average(NegativeDOGE).toFixed(2);
data.DOGE.sentiment.negative=average(NegativeDOGE) *100;

//calculate avarage mixed
average(MixedDOGE).toFixed(2);
data.DOGE.sentiment.mixed=average(MixedDOGE) *100;

//calculate avarage neutral
average(NeutralDOGE).toFixed(2);
data.DOGE.sentiment.neutral=average(NeutralDOGE) *100;


//LUNA DATA

    let resultLUNA = await documentClient.scan(paramsLUNA).promise();
    let resultSentLUNA = await documentClient.scan(paramsLUNATweets).promise();
    
    let SentLUNA = resultSentLUNA.Items.map(a => a.sentiment);
    let rateLUNA = resultLUNA.Items.map(a => a.Rate);
    let timestampLUNA = resultLUNA.Items.map(a => a.timestamp);
    
    timestampLUNA = timestampLUNA.map(function (x) { 
        let dateObject = new Date(x*1000)
        dateObject=dateObject.toLocaleString().split(',')[0];;
  return dateObject
});
    
    data.LUNA.actual.y = rateLUNA
    data.LUNA.actual.x = timestampLUNA
    
    let sentArrayLUNA=[];
    let PositiveLUNA=[];
    let NegativeLUNA=[];
    let MixedLUNA=[];
    let NeutralLUNA=[];
    
    SentLUNA.forEach((element) => {
    sentArrayLUNA.push(element.Sentiment)
    PositiveLUNA.push(element.SentimentScore.Positive)
    NegativeLUNA.push(element.SentimentScore.Negative)
    MixedLUNA.push(element.SentimentScore.Mixed)
    NeutralLUNA.push(element.SentimentScore.Neutral)
    
});
data.LUNA.sentiment.average = sentArrayLUNA

mode(sentArrayLUNA)
data.LUNA.sentiment.average=mode(sentArrayLUNA)

//calculate avarage positive
average(PositiveLUNA).toFixed(2);
data.LUNA.sentiment.positive=average(PositiveLUNA) *100;

//calculate avarage negative
average(NegativeLUNA).toFixed(2);
data.LUNA.sentiment.negative=average(NegativeLUNA) *100;

//calculate avarage mixed
average(MixedLUNA).toFixed(2);
data.LUNA.sentiment.mixed=average(MixedLUNA) *100;

//calculate avarage neutral
average(NeutralLUNA).toFixed(2);
data.LUNA.sentiment.neutral=average(NeutralLUNA) *100;

// XLM DATA

    let resultXLM = await documentClient.scan(paramsXLM).promise();
    let resultSentXLM = await documentClient.scan(paramsXLMTweets).promise();
    
    let SentXLM = resultSentXLM.Items.map(a => a.sentiment);
    let rateXLM = resultXLM.Items.map(a => a.Rate);
    let timestampXLM = resultXLM.Items.map(a => a.timestamp);
    
    timestampXLM = timestampXLM.map(function (x) { 
        let dateObject = new Date(x*1000)
        dateObject=dateObject.toLocaleString().split(',')[0];;
  return dateObject
});
    
    data.XLM.actual.y = rateXLM
    data.XLM.actual.x = timestampXLM
    
    let sentArrayXLM=[];
    let PositiveXLM=[];
    let NegativeXLM=[];
    let MixedXLM=[];
    let NeutralXLM=[];
    
    SentXLM.forEach((element) => {
    sentArrayXLM.push(element.Sentiment)
    PositiveXLM.push(element.SentimentScore.Positive)
    NegativeXLM.push(element.SentimentScore.Negative)
    MixedXLM.push(element.SentimentScore.Mixed)
    NeutralXLM.push(element.SentimentScore.Neutral)
    
});
data.XLM.sentiment.average = sentArrayXLM

mode(sentArrayXLM)
data.XLM.sentiment.average=mode(sentArrayXLM)

//calculate avarage positive
average(PositiveXLM).toFixed(2);
data.XLM.sentiment.positive=average(PositiveXLM) *100;

//calculate avarage negative
average(NegativeXLM).toFixed(2);
data.XLM.sentiment.negative=average(NegativeXLM) *100;

//calculate avarage mixed
average(MixedXLM).toFixed(2);
data.XLM.sentiment.mixed=average(MixedXLM) *100;

//calculate avarage neutral
average(NeutralXLM).toFixed(2);
data.XLM.sentiment.neutral=average(NeutralXLM) *100;


     return data;
}