"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeTwitterData = void 0;
//Module that reads keys from .env file
const dotenv = require("dotenv");
//Node Twitter library
const Twitter = require("twitter");
let AWS = require("aws-sdk");
//Configure AWS
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
});
//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();
function storeTwitterData(created_at, keyword, id, text) {
    let params = {
        TableName: "CryptoTweet",
        Item: {
            crypto: keyword,
            timestamp: created_at,
            TweetId: id,
            tweets: text,
        },
    };
    return new Promise((resolve, reject) => {
        documentClient.put(params, (err) => {
            if (err) {
                reject("Unable to add item: " + JSON.stringify(err));
            }
            else {
                resolve("Item added to table with id: " + id);
            }
        });
    });
}
exports.storeTwitterData = storeTwitterData;
//Copy variables in file into environment variables
dotenv.config();
//Set up the Twitter client with the credentials
let client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
//Downloads and outputs tweet text
function searchTweets(keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Set up parameters for the search
            let searchParams = {
                q: keyword,
                count: 1,
                lang: "en",
                trim_user: true,
                exclude_replies: true,
            };
            //Wait for search to execute asynchronously
            let result = yield client.get("search/tweets", searchParams);
            let promiseArray = [];
            result.statuses.forEach((tweet) => {
                promiseArray.push(storeTwitterData(Number(new Date(tweet.created_at).getTime() / 1000), keyword, Number(tweet.id), tweet.text));
            });
            //Execute all of the save data promises
            let databaseResult = yield Promise.all(promiseArray);
            console.log("Database result: " + JSON.stringify(databaseResult));
        }
        catch (error) {
            console.log(JSON.stringify(error));
        }
    });
}
searchTweets("BTC");
searchTweets("ETH");
searchTweets("LUNA");
searchTweets("XLM");
searchTweets("DOGE");
