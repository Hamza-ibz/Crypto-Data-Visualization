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
{
    const AWS = require("aws-sdk");
    AWS.config.update({
        region: "us-east-1",
        endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    });
    let documentClient = new AWS.DynamoDB.DocumentClient();
    // const moment = require('moment');
    //Reads keys from .env file
    // const dotenv = require('dotenv');
    // dotenv.config();
    //Axios will handle HTTP requests to web service
    const axios = require('axios');
    class CryptoCompare {
        constructor() {
            this.baseUrl = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        }
        downloadCryptoData(cryp) {
            return __awaiter(this, void 0, void 0, function* () {
                //Start with base url
                let url = this.baseUrl + cryp + "&";
                //Add query parameters
                url += "tsym=GBP&limit=500";
                //Add Key
                url += "&api_key=" + "{d47eef5490362eec2b44fa86919ef403047bad035a9afb3057c4abe442a5b63d}";
                //Log URL
                console.log(url);
                try {
                    //Pull data
                    let data = (yield axios.get(url)).data;
                    //Output humidity for each day
                    for (let day of data.Data.Data) {
                        let params = {
                            TableName: "CryptoInfo",
                            Item: {
                                crypto: cryp,
                                timestamp: day.time + "",
                                Rate: day.high,
                            },
                        };
                        //Store data in DynamoDB and handle errors
                        documentClient.put(params, (err) => {
                            if (err) {
                                console.error("Unable to add item", params.Item);
                                console.error("Error JSON:", JSON.stringify(err));
                            }
                            else {
                                console.log("Record added to table:", params.Item);
                            }
                        });
                        console.log("crypto: " + cryp + "| Timestamp: " + day.time + "| price: " + day.high);
                    }
                }
                catch (err) {
                    console.error("Failed to fetch data: " + err);
                }
            });
        }
    }
    let vc = new CryptoCompare();
    vc.downloadCryptoData("BTC");
    vc.downloadCryptoData("ETH");
    vc.downloadCryptoData("DOGE");
    vc.downloadCryptoData("LUNA");
    vc.downloadCryptoData("XLM");
}
