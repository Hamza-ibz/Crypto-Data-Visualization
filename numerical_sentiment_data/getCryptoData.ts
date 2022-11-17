{

   
const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
  });

  let documentClient = new AWS.DynamoDB.DocumentClient();

    interface CryptoCompare {
        days:Array<Day>
        Data:any
    }

    interface Day {
        // crypto: string;
        time: number ;
        high: number;
        Response: boolean;
        // data: any
        Data:any
    }
    // const moment = require('moment');

    //Reads keys from .env file
    // const dotenv = require('dotenv');
    // dotenv.config();

    //Axios will handle HTTP requests to web service
    const axios = require ('axios');


    class CryptoCompare {
        baseUrl: string = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";

        async downloadCryptoData(cryp: string): Promise<void> {
           
                //Start with base url
                let url: string = this.baseUrl + cryp + "&";

                //Add query parameters
                url += "tsym=GBP&limit=500";

                //Add Key
                url += "&api_key=" + "{d47eef5490362eec2b44fa86919ef403047bad035a9afb3057c4abe442a5b63d}";

                //Log URL
                console.log(url);

                try {
                    //Pull data
                    let data:CryptoCompare = (await axios.get(url)).data;
                    //Output humidity for each day
                    for(let day of data.Data.Data){
                        let params = {
                            TableName: "CryptoInfo",
                            Item: {
                                crypto: cryp,
                                timestamp: day.time + "",
                                Rate: day.high,
                            },
                        };
    
                        //Store data in DynamoDB and handle errors
                        documentClient.put(params, (err: any) => {
                            if (err) {
                                console.error("Unable to add item", params.Item);
                                console.error("Error JSON:", JSON.stringify(err));
                            } else {
                                console.log("Record added to table:", params.Item);
                            }
                        });
                        console.log("crypto: "+ cryp+ "| Timestamp: " +day.time + "| price: " + day.high);
                    }
                }
                catch(err){
                    console.error("Failed to fetch data: " + err);
                }

        }


    }


    let vc: CryptoCompare = new CryptoCompare();
    vc.downloadCryptoData("BTC");
    vc.downloadCryptoData("ETH");
    vc.downloadCryptoData("DOGE");
    vc.downloadCryptoData("LUNA");
    vc.downloadCryptoData("XLM")


}