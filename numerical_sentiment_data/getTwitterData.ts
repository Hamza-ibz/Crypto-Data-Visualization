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



export function storeTwitterData(
  created_at: number,
  keyword: string,
  id: number,
  text: string,
): Promise<string> {
  let params = {
    TableName: "CryptoTweet",
    Item: {
      crypto: keyword, 
      timestamp: created_at, 
      TweetId: id,
      tweets: text,
    },
  };
  
  return new Promise<string>((resolve, reject) => {
    documentClient.put(params, (err: any) => {
      if (err) {
        reject("Unable to add item: " + JSON.stringify(err));
      } else {
        resolve("Item added to table with id: " + id);
      }
    });
  });
}

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
async function searchTweets(keyword: string) {
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
	let result = await client.get("search/tweets", searchParams);

	let promiseArray: Array<Promise<string>> = [];

	result.statuses.forEach((tweet: any) => {
	  promiseArray.push(
		storeTwitterData(
		  Number(new Date(tweet.created_at).getTime() / 1000),
		  keyword,
		  Number(tweet.id),
		  tweet.text,
		)
	  );
	});

	//Execute all of the save data promises
	let databaseResult: Array<string> = await Promise.all(promiseArray);
	console.log("Database result: " + JSON.stringify(databaseResult));
  } catch (error) {
	console.log(JSON.stringify(error));
  }
}

searchTweets("BTC");
searchTweets("ETH");
searchTweets("LUNA");
searchTweets("XLM");
searchTweets("DOGE");
