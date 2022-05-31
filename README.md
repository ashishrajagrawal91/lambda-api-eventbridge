# Payment Process Service

### To setup in local

* Install node js (v14.16.0+)
* Run: `git clone https://github.com/ashishrajagrawal91/lambda-api-eventbridge.git`
* Run: `npm install`


### To run eslint and fix error

* Run: `npm run lint:fix`


### To Deploy via serverless framwork

#### Install Serverelss 
* Run: `npm install serverless -g`
#### Configure AWS profile for serverless deployment
* Run: `serverless config credentials \
  --provider aws \
  --key XXXX \
  --secret XXXX \
  --profile XXXX`
#### Deploy application
* Run: `sls deploy --aws-profile XXXX --stage develop --region eu-west-2 --verbose`
#### Check deploy list
* Run: `sls list --aws-profile XXXX --verbose`
#### Delete serverless stack
* Run: `sls remove --aws-profile XXXX --stage develop --region eu-west-2 --verbose`


### API Details


#### Create todo item API
https://buyqnpot4m.execute-api.eu-west-2.amazonaws.com/develop/todoItem
#### Method
POST
#### Request Body
| Input | Type | Required |
| --- | ----------- | ----------- |
| paymentSource | Text | Required |
| destination | Text | Required |
| currency | Text | Required |
| amount | Text | Required |
#### Request Header
- application/json
#### Response
```json
{
    "data": "Payment processed successfully."
}
```

### Response Codes 
#### Response Codes
```
200: Success
400: Bad request
```
#### Error Codes Details
```
400: InvalidRequestError
```
#### Example Error Message
```json
http code 400
{
    "statusCode": 400,
    "errorName": "InvalidRequestError",
    "errorMessage": "[\"\\\"paymentSource\\\" must be one of [client, vendor]\"]"
}
```