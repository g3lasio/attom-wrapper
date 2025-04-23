# Property Ownership Verifier API

This API verifies property ownership and provides property details for Owl Fence contractors.

## Overview

The Property Ownership Verifier API allows contractors to validate property ownership before beginning work. It provides detailed property information including ownership verification.

## API Endpoints

### Get Property Details

**Endpoint:** `GET /api/property/details`

**Query Parameters:**
- `address` (string, required): Full property address

**Example Request:**
```
GET /api/property/details?address=123 Main St, Anytown, CA 12345
```

**Success Response:** (200 OK)
```json
{
  "owner": "John Smith",
  "address": "123 Main St, Anytown, CA 12345",
  "sqft": 2500,
  "bedrooms": 4,
  "bathrooms": 2.5,
  "lotSize": "0.25 acres",
  "yearBuilt": 1985,
  "propertyType": "Single Family Home",
  "ownerOccupied": true,
  "verified": true,
  "ownershipVerified": true
}
```

**Error Responses:**

- **400 Bad Request:** Invalid address format
```json
{
  "message": "Invalid address format",
  "errorCode": "INVALID_ADDRESS_FORMAT",
  "details": "Address is too short, please provide a complete address"
}
```

- **404 Not Found:** Property not found
```json
{
  "message": "Property not found in our database",
  "errorCode": "PROPERTY_NOT_FOUND",
  "details": "The requested property could not be found in our database"
}
```

- **502 Bad Gateway:** Service provider issues
```json
{
  "message": "Failed to connect to property data provider",
  "errorCode": "EXTERNAL_SERVICE_ERROR",
  "details": "There was an issue connecting to the property data provider"
}
```

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and update values
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```

## Deployment

The API is configured for deployment to Vercel using the included `vercel.json` file.

To deploy:
```
vercel
```