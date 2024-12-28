# API Documentation

## Authentication

### Login

**Endpoint:** `/login`

**Method:** `POST`

**Headers:**

-   `Content-Type: application/json`

**Request Body:**

```json
{
    "username": "adminUser",
    "password": "adminPassword123"
}
```

**Response:**

-   `"token": "your-jwt-token"`

## Buyer Routes

### Deposit

**Endpoint:** `/api/v1/buyer/deposit`

**Method:** POST

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

**Request Body:**

```json
{
    "transactionId": "0",
    "amount": "1.0"
}
```

**Response:**

```json
{
    "transactionHash": "0x1234567890abcdef"
}
```

## Confirm Completion

**Endpoint:** `/api/v1/buyer/confirmCompletion`

**Method:** `POST`

**Headers:**

`Content-Type: application/json`
`Authorization: Bearer <your-jwt-token>`

**Request Body:**

```json
{
    "transactionId": "0"
}
```

**Response:**

```json
{
    "transactionHash": "0x1234567890abcdef"
}
```

## Raise Dispute

**Endpoint:** `/api/v1/buyer/raiseDispute`

**Method:** `POST`

**Headers:**

`Content-Type: application/json`
`Authorization: Bearer <your-jwt-token>`

**Request Body:**

```json
{
    "transactionId": "0"
}
```

**Response:**

```json
{
    "transactionHash": "0x1234567890abcdef"
}
```

## Cancel Order

**Endpoint:** `/api/v1/buyer/cancelOrder`

**Method:** `POST`

**Headers:**

`Content-Type: application/json`
`Authorization: Bearer <your-jwt-token>`

**Request Body:**

```json
{
    "transactionId": "0"
}
```

**Response:**

```json
{
    "transactionHash": "0x1234567890abcdef"
}
```

## Raise Dispute

**Endpoint:** `/api/v1/buyer/raiseDispute`

**Method:** `POST`

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

**Request Body:**

```json
{
    "transactionId": "0"
}
```

**Response:**

```json
{
    "transactionHash": "0x1234567890abcdef"
}
```

## Get Transaction

**Endpoint:** `/api/v1/buyer/transaction/:transactionId`

**Method:** `GET`

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

**Response:**

```json
{
    "transactionId": "0",
    "buyer": {
        "name": "Buyer Company",
        "walletAddress": "0x1234567890abcdef"
    },
    "seller": {
        "name": "Seller Company",
        "walletAddress": "0xabcdef1234567890"
    },
    "amount": "1.0",
    "state": "DEPOSITED",
    "deliveryDate": "2023-12-31T23:59:59Z"
}
```

## Seller Routes

### Accept Order

**Endpoint:** `/api/v1/seller/acceptOrder`

**Method:** `POST`

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

**Request Body:**

```json
{
    "transactionId": "0"
}
```

**Response:**

```json
{
    "transactionHash": "0x1234567890abcdef"
}
```

## Cancel Order

**Endpoint:** `/api/v1/seller/cancelOrder`

**Method:** `POST`

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

    **Request Body:**

```json
{
    "transactionId": "0"
}
```

**Response:**

```json
{
    "transactionHash": "0x1234567890abcdef"
}
```

## Get Transaction

**Endpoint:** `/api/v1/seller/transaction/:transactionId`

**Method:** `GET`

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

**Response:**

```json
{
    "transactionId": "0",
    "buyer": {
        "name": "Buyer Company",
        "walletAddress": "0x1234567890abcdef"
    },
    "seller": {
        "name": "Seller Company",
        "walletAddress": "0xabcdef1234567890"
    },
    "amount": "1.0",
    "state": "DEPOSITED",
    "deliveryDate": "2023-12-31T23:59:59Z"
}
```

## Admin Routes

### Add User

**Endpoint:** `/api/v1/admin/addUser`

**Method:** `POST`

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

**Request Body:**

```json
{
    "username": "newUser",
    "password": "newUserPassword123",
    "role": "buyer || seller || admin"
}
```

**Response:**

```json
{
    "_id": "60d0fe4f5311236168a109ca",
    "username": "newUser",
    "role": "buyer",
    "company": "60d0fe4f5311236168a109c9",
    "__v": 0
}
```

**Request Parameters:**

-   `username (string): The username for the new user.`
-   `password (string): The password for the new user.`
-   `role (string): The role of the new user. It can be "buyer", "seller", or "admin".`

### Get Transaction

**Endpoint:** `/api/v1/admin/transaction/:transactionId`

**Method:** `GET`

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

**Response:**

```json
{
    "transactionId": "0",
    "buyer": {
        "name": "Buyer Company",
        "walletAddress": "0x1234567890abcdef"
    },
    "seller": {
        "name": "Seller Company",
        "walletAddress": "0xabcdef1234567890"
    },
    "amount": "1.0",
    "state": "DEPOSITED",
    "deliveryDate": "2023-12-31T23:59:59Z"
}
```

## Mediator Routes

### Resolve Dispute

**Endpoint:** `/api/v1/admin/resolveDispute`

**Method:** `POST`

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

**Request Body:**

```json
{
    "transactionId": "1234567890abcdef",
    "releaseFundsToPartyB": true
}
```

**Response:**

```json
{
    "transactionHash": "0x1234567890abcdef"
}
```

### Create Company

**Endpoint:** `/api/v1/mediator/createCompany`

**Method:** `POST`

**Headers:**
`Content-Type: application/json`

**Request Body:**

```json
{
    "name": "New Company",
    "adminUsername": "adminUser",
    "adminPassword": "adminPassword123",
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "privateKey": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef"
}
```

**Response:**

```json
{
    "company": {
        "_id": "60d0fe4f5311236168a109c9",
        "name": "New Company",
        "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
        "__v": 0
    },
    "admin": {
        "_id": "60d0fe4f5311236168a109ca",
        "username": "adminUser",
        "role": "admin",
        "company": "60d0fe4f5311236168a109c9",
        "__v": 0
    }
}
```

**Request Parameters:**

-   `name (string): The name of the new company.`
-   `adminUsername (string): The username for the admin user.`
-   `adminPassword (string): The password for the admin user.`
-   `walletAddress (string): The wallet address for the company.`
-   `privateKey (string): The private key for the company's wallet.`

## Get Transaction

**Endpoint:** `/api/v1/mediator/transaction/:transactionId`

**Method:** `GET`

**Headers:**

-   `Content-Type: application/json`
-   `Authorization: Bearer <your-jwt-token>`

**Response:**

```json
{
    "transactionId": "0",
    "buyer": {
        "name": "Buyer Company",
        "walletAddress": "0x1234567890abcdef"
    },
    "seller": {
        "name": "Seller Company",
        "walletAddress": "0xabcdef1234567890"
    },
    "amount": "1.0",
    "state": "DEPOSITED",
    "deliveryDate": "2023-12-31T23:59:59Z"
}
```

## Enviroment Variables

RPC_URL=http://127.0.0.1:8545
MEDIATOR_PRIVATE_KEY=<PRIVATE_KEY>
CONTRACT_ADDRESS=<CONTRACT_ADDRESS>
PORT=3000
MONGODB_URI=<MONGO_DB_URI>
ENCRYPTION_KEY=483dfcd7a676aa6d33ba1feb2bb9b3394458d9a3c7b4694ebc4d04f1c51e9f3b
JWT_SECRET="UbGB/b@[.97Wl&T;536c2n55366Vcs"

## Running the Application

**Install Dependencies:**
`npm install`

**Start the Server:**
`npm start`

Access the API: The API will be available at http://localhost:3000
