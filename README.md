# Cartesi Buy

## Overview

This Cartesi DApp provides a decentralized marketplace platform. It allows users to register as vendors or customers, manage products, place orders, and leave reviews. The DApp utilizes Cartesi's infrastructure to ensure secure and reliable operations, with data stored in an SQLite database.

## Features

- User registration (customer/vendor)
- Product management (add, update, view)
- Order placement and management
- Review system
- Inventory management
- User profile updates

## Installation and Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Ispavskel/cartesi-buy.git
   cd cartesi-buy
   ```

2. **Install Dependencies:**
   This project uses `pnpm`. If you don't have it installed, you can install it via:

   ```bash
   npm install -g pnpm
   ```

   Then, install the project dependencies:

   ```bash
   pnpm install
   ```

3. **Build and Run the Application:**
   ```bash
   pnpm build
   pnpm start
   ```

## Usage

### Payload Structure

The DApp uses the following structure for sending payloads:

```json
{
  "action": "ACTION_NAME",
  "data": {
    // Action-specific data
  }
}
```

### Sending Commands

- **Register User:**

  ```bash
  cartesi send --payload '{
    "action": "REGISTER_USER",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "customer"
  }'
  ```

- **Add Product:**

  ```bash
  cartesi send --payload '{
    "action": "ADD_PRODUCT",
    "vendorId": "vendor-uuid",
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "stock": 100
  }'
  ```

- **Create Order:**

  ```bash
  cartesi send --payload '{
    "action": "CREATE_ORDER",
    "userId": "user-uuid",
    "productId": "product-uuid",
    "quantity": 2
  }'
  ```

- **Add Review:**
  ```bash
  cartesi send --payload '{
    "action": "ADD_REVIEW",
    "userId": "user-uuid",
    "productId": "product-uuid",
    "rating": 5,
    "comment": "Great product!"
  }'
  ```

### Notices

After each command, a notice will be issued with the result of the operation.

### Checking Data

- **Get User Details:**

  ```http
  GET {{INSPECT_URL}}/user/:userId
  ```

- **List All Products:**

  ```http
  GET {{INSPECT_URL}}/products
  ```

- **Get Product Details:**

  ```http
  GET {{INSPECT_URL}}/product/:productId
  ```

- **Get Product Reviews:**

  ```http
  GET {{INSPECT_URL}}/product/:productId/reviews
  ```

- **Get Vendor's Products:**

  ```http
  GET {{INSPECT_URL}}/vendor/:vendorId/products
  ```

- **Get User's Orders:**
  ```http
  GET {{INSPECT_URL}}/user/:userId/orders
  ```

Replace `:userId`, `:productId`, and `:vendorId` with the respective IDs.

## Development

To extend or modify the DApp:

1. Update the handlers in `src/handlers/` directory.
2. Modify types in `src/types.ts` if needed.
3. Update the database schema in `src/database.ts` if required.
4. Run `pnpm build` to compile changes.
5. Test your changes locally before deployment.
