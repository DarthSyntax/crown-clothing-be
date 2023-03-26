const AWS = require('aws-sdk');
const fs = require('fs');

require('dotenv').config();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'crwn-inv';

const getItems = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const items = await dynamoClient.scan(params).promise();
  return items;
};

const createItem = async (item) => {
  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };
  return await dynamoClient.put(params).promise();
};

// const importDataToDynamoDB = async () => {
//   const data = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/store.json`, 'utf8')
//   );
//   const itemPromises = [];
//   data.forEach((item) => {
//     itemPromises.push(createItem({ ...item, id: `${item.id}` }));
//   });
//   await Promise.all(itemPromises);
// };

module.exports = { createItem, getItems };
