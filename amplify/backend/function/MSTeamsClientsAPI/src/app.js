/* Amplify Params - DO NOT EDIT
	API_PRESOLVEDTEAMSADMIN_GRAPHQLAPIIDOUTPUT
	API_PRESOLVEDTEAMSADMIN_PRESOLVEDAUDITTABLE_ARN
	API_PRESOLVEDTEAMSADMIN_PRESOLVEDAUDITTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["CallManagerAPIKey"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const MSTeams = require("./teams");
const msteams = new MSTeams();
const { TransferToTeams } = require("./TransferToTeams");
const Routes = require("./routes");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/**********************
 * Example get method *
 **********************/
Routes(app);

app.get("/teams", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/teams/users", async function (req, res) {
  // Add your code here
  //Authenticate the call
  //authenticateAllCalls(req, res, next);
  //Validate the user using the authtoken
  let authToken = req.headers.authorization;
  //Remove Bearer from the token
  authToken = authToken.replace("Bearer ", "");
  //console.log("Auth Token is ", authToken);
  //let userDetails = await msteams.validateAuthToken(authToken);
  //Load the Tenant Id from the DB

  let validatedTokenResult = await msteams.validateIdToken(
    authToken,
    req.query.tenantId
  );
  console.log("Validated Token Result is ", validatedTokenResult);
  // console.log("User Details are ", userDetails);
  if (validatedTokenResult) {
    console.log("Call is from a authenticated client from MS Teams");
    let usersList = await msteams.getUsers(
      req.query.tenantId,
      req.query.displayName
    );
    res.json({ success: "get users call succeed!", users: usersList });
  } else {
    //Send 401
    res.status(401).send("Unauthorized");
  }
});

app.get("/teams/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/

app.post("/teams", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/teams/Call", async function (req, res) {
  // Add your code here
  //Authenticate the call
  //authenticateAllCalls(req, res, next);
  //Validate the user using the authtoken
  let authToken = req.headers.authorization;
  //Remove Bearer from the token
  authToken = authToken.replace("Bearer ", "");
  //console.log("Auth Token is ", authToken);
  // let userDetails = await msteams.validateAuthToken(authToken);
  //Load the Tenant Id from the DB

  let validatedTokenResult = await msteams.validateIdToken(
    authToken,
    req.query.tenantId
  );
  //console.log("Validated Token Result is ", validatedTokenResult);
  // console.log("User Details are ", userDetails);
  if (validatedTokenResult) {
    let from = req.body.from;
    let to = req.body.to;
    const transferToTeams = {
      from: from,
      to: to,
    };

    console.log("Call is from a authenticated client from MS Teams");
    let transferResponse = await TransferToTeams(transferToTeams);
    console.log("Transfer Response is ", transferResponse);

    if (transferResponse.success) {
      //Set expiry time of 30 seconds
      let expiryTime = new Date();
      expiryTime.setSeconds(expiryTime.getSeconds() + 30);
      let phonetoCall = "+16028122928";

      transferResponse.expiryTime = expiryTime;
      transferResponse.phonetoCall = phonetoCall;

      res.json({
        success: transferResponse.success,
        result: transferResponse,
      });
    } else {
      res
        .status(503)
        .send({ success: transferResponse.success, result: transferResponse });
    }
  } else {
    //Send 401
    res.status(401).send("Unauthorized");
  }
});

app.post("/teams/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/teams", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/teams/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/teams", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/teams/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});



// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
