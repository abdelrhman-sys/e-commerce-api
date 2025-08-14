import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
db.connect();

export default function createTables() {
        db.query(`CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE)`);

        db.query(`CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                price INT,
                category_id INT REFERENCES categories(id))`);        
}

export async function createCart() {
        const result = db.query(`CREATE TABLE IF NOT EXISTS carts (
                id SERIAL PRIMARY KEY,
                cart_id INT NOT NULL,
                product_id INT REFERENCES products(id) NOT NULL,
                quantity INT NOT NULL,
                UNIQUE (cart_id, product_id))`);
        return result;
}