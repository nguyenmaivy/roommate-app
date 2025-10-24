const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const path = require('path');

// Load lambda handlers
const roomCrud = require(path.join(__dirname, 'lambda', 'roomCrud'));

// Configure DynamoDB endpoint for local DynamoDB (if provided)
const DDB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || process.env.AWS_DYNAMODB_ENDPOINT;
const region = process.env.AWS_REGION || 'us-east-1';

if (DDB_ENDPOINT) {
  AWS.config.update({ region });
}

const docClient = new AWS.DynamoDB.DocumentClient({ endpoint: DDB_ENDPOINT });

// Patch handlers that use a module-level dynamoDb - we monkey-patch for local runs
try {
  // If the lambda module exports a local reference, overwrite it
  const lambdaPath = path.join(__dirname, 'lambda', 'roomCrud.js');
  // Load module from require cache and set its dynamoDb if possible
  if (roomCrud && roomCrud.__setDocumentClient) {
    roomCrud.__setDocumentClient(docClient);
  } else {
    // some lambdas reference a module-level dynamoDb; try to patch global
    // This is best-effort; the handler code already constructs a dynamo client from AWS.DynamoDB.DocumentClient()
  }
} catch (e) {
  // ignore
}

const app = express();
app.use(bodyParser.json());

// Helper to call a lambda-style handler and send back response
const callHandler = async (handler, event, res) => {
  try {
    const result = await handler.handler(event);
    if (result && result.statusCode) {
      res.status(result.statusCode).send(result.body);
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: err.message || String(err) });
  }
};

// Routes - mirror basic operations from roomCrud.js
app.post('/rooms', async (req, res) => {
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify(req.body),
    pathParameters: null,
    queryStringParameters: null,
  };
  await callHandler(roomCrud, event, res);
});

app.get('/rooms', async (req, res) => {
  const event = {
    httpMethod: 'GET',
    body: null,
    pathParameters: null,
    queryStringParameters: req.query || null,
  };
  await callHandler(roomCrud, event, res);
});

app.get('/rooms/:id', async (req, res) => {
  const event = {
    httpMethod: 'GET',
    body: null,
    pathParameters: { id: req.params.id },
    queryStringParameters: null,
  };
  await callHandler(roomCrud, event, res);
});

// Start
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Local backend server listening on http://localhost:${port}`));

module.exports = app;
