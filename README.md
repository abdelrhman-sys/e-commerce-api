# E-Commerce API

This project is a RESTful API for an e-commerce platform, built with Node.js and Express.js. It provides endpoints for managing products, categories, carts.

## Features

- **Product Management:** Create, read, update, and delete products.
- **Category Management:** Organize products into categories.
- **Cart Management:** Create, read, update, and delete carts and items.
- **Error Handling:** Consistent error responses for invalid requests.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- dotenv for environment variables

## Getting Started

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/e-commerce-api.git
    cd e-commerce-api
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure environment variables:**
    - Create a `.env` file in the root directory.
    - Add your database connection configurations. For example:
      ```
      DB_HOST=localhost
      DB_USER=your_db_user
      DB_PASSWORD=your_db_password
      DB_NAME=your_db_name
      ```

4. **Start the server:**
    ```bash
    npm start
    ```
    The API will be available at `http://localhost:3000` (or your configured port).

## API Endpoints

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product  
    **Body fields:**  
    ```json
    {
        "name": "string",
        "price": number,
        "category_id": number,
    }
    ```

- `PATCH /api/products/:id` - Update a product  
    **Body fields:** (any subset of the following)  
    ```json
    {
        "name": "string",
        "price": number,
        "category_id": number,
    }
    ```
- `DELETE /api/products/:id` - Delete a product

### Categories

- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get a single category
- `POST /api/categories` - Create a new category  
    **Body fields:**  
    ```json
    {
        "name": "string"
    }
    ```

- `PATCH /api/categories/:id` - Update a category  
    **Body fields:**  
    ```json
    {
        "name": "string"
    }
    ```
- `DELETE /api/categories/:id` - Delete a category

### Carts

- `GET /api/carts` - List all carts
- `GET /api/cart/:cartId/items` - Get all items in a certain cart
- `POST /api/cart` - Create a new cart
- `POST /api/cartItems/:cartId` - Add item to a certain cart  
    **Body fields:**  
    ```json
    {
            "product_id": number,
            "quantity": number
    }
    ```

- `PATCH /api/cartItems/:cartId/:product_id` - Update product inside a certain cart  
    **Body fields:**  
    ```json
    {
            "quantity": number
    }
    ```
- `DELETE /api/carts` - Delete all carts
- `DELETE /api/cart/:cartId` - Delete a certain cart
- `DELETE /api/cartItems/:id` - Delete an item from a cart
