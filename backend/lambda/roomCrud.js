const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const TABLE_NAME = 'Rooms';
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN; // Set in Lambda env: pk.xxx

const geocodeAddress = async (address) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&country=VN&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

exports.handler = async (event) => {
  const { httpMethod, pathParameters, body, queryStringParameters } = event;
  const data = body ? JSON.parse(body) : {};

  // Auth check (giả sử từ Cognito, add validator nếu cần)
  if (!data.ownerId) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

  switch (httpMethod) {
    case 'POST': // Add room với geocoding
      const coords = await geocodeAddress(data.address);
      const item = {
        id: uuidv4(),
        ownerId: data.ownerId,
        price: data.price,
        address: data.address,
        amenities: data.amenities || [],
        images: data.images || [],
        district: data.district,
        location: coords || { lat: 0, lng: 0 }, // Fallback nếu fail
        createdAt: new Date().toISOString(),
      };
      await dynamoDb.put({ TableName: TABLE_NAME, Item: item }).promise();
      
      // Trigger n8n webhook cho thông báo (nếu có room mới)
      await fetch('https://your-n8n-webhook-url/new-room', { method: 'POST', body: JSON.stringify(item) });
      
      return { statusCode: 200, body: JSON.stringify({ message: 'Room added', id: item.id }) };

    case 'GET': // Get rooms (all hoặc by ID, include location)
      if (pathParameters?.id) {
        const result = await dynamoDb.get({ TableName: TABLE_NAME, Key: { id: pathParameters.id } }).promise();
        return { statusCode: 200, body: JSON.stringify(result.Item) };
      } else {
        // Scan all (production: use query with index)
        const params = { TableName: TABLE_NAME };
        if (queryStringParameters?.district) {
          params.FilterExpression = 'district = :district';
          params.ExpressionAttributeValues = { ':district': queryStringParameters.district };
        }
        const results = await dynamoDb.scan(params).promise();
        return { statusCode: 200, body: JSON.stringify(results.Items) };
      }

    // ... (PUT, DELETE như mẫu trước, thêm update location nếu cần)

    default:
      return { statusCode: 405, body: 'Method Not Allowed' };
  }
};