import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import { createCart } from "../createTables.js";

dotenv.config();
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
db.connect();
const router = express.Router();

router.get("/carts", async(req, res)=> { // view all carts and items
    try {
        const {rows} = await db.query(`SELECT * FROM carts`);
        if (rows[0]) {
            return res.json(rows);
        } else {
            res.json({message: "Carts are empty"});
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error getting carts"});
    }
})

router.get("/cart/:cartId/items",async(req, res)=> { // view all items in a specific cart
    try {
        const {rows} = await db.query(`SELECT * FROM carts WHERE cart_id=$1`, [req.params.cartId]);
        if (rows[0]) {
            return res.json(rows); 
        } else {
            return res.status(404).json({error: "Cart id is not found"});
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error getting items"});
    }
})

router.post("/cart", async (req, res)=> { // create carts table
    const result = await createCart();
    if (result.rowCount) {
        return res.json({message: "Cart is created successfully"});
    } else {
        res.status(400).json({error: "Cart is already created"});
    }  
})

router.post("/cartItems/:cartId", async(req, res)=> { // add item to a specific cart
    const {product_id, quantity}= req.body;
    try {
        const result = await db.query(`INSERT INTO carts (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`, [req.params.cartId, product_id, quantity]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({error: error.detail || "error adding item"});
    }
})

router.patch("/cartItems/:cartId/:product_id", async(req, res)=>{ // update a product inside a specific cart
    if(!req.body || !req.body.quantity) return res.status(400).json({error: "No quantity is provided"});
    try {
        const {rows} = await db.query(`UPDATE carts SET quantity=$1 WHERE cart_id=$2 AND product_id=$3 RETURNING *`, [req.body.quantity, req.params.cartId, req.params.product_id]);
        if (rows[0]) {
            return res.send("Product is updated successfully\n" + JSON.stringify(rows[0]));
        } else {
            res.status(404).json({error: "Product is not found in the cart"});
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error updating product"});   
    }

})

router.delete("/carts", async (req, res)=> { // delete all carts table
    try {
        await db.query(`DROP TABLE carts`);
    } catch (error) {
        return res.status(404).json({error: "Table doesn't exist"});
    }
    res.json({message: "Cart is deleted successfully"});
})

router.delete("/cart/:cartId", async(req, res)=> { // delete a specific cart
    try {
        const result = await db.query(`DELETE FROM carts WHERE cart_id= $1 RETURNING *`, [req.params.cartId]);
        const cart = result.rows[0];
        if (cart) {
            return res.send("Cart is deleted successfully\n" + JSON.stringify(cart));
        } else {
            res.status(404).json({error: "Cart not found"});
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error deleting cart"});
    }
})

router.delete("/cartItems/:id", async(req, res)=> { // delete an item in carts table
    try {
        const result = await db.query(`DELETE FROM carts WHERE id= $1 RETURNING *`, [req.params.id]);
        const item = result.rows[0];
        if (item) {
            return res.send("Item is deleted successfully\n" + JSON.stringify(item));
        } else {
            res.status(404).json({error: "Item not found"});
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error deleting item"});
    }
})

export default router;