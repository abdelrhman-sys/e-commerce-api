import express from "express";
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

const router = express.Router();

router.post("/", async(req, res)=> {
    try {        
        const result = await db.query(`INSERT INTO products (name, price, category_id) VALUES ($1, $2, $3) RETURNING *`, [req.body.name, req.body.price, req.body.category_id]);
        res.send("Product is created successfully\n" + JSON.stringify(result.rows[0]));
    } catch (error) {
        res.status(400).json({ error: error.detail || "error adding product"});
    }
});

router.get("/", async(req, res)=>{
    try {
        const {rows: products} = await db.query(`SELECT * FROM products`);
        res.json(products);
    } catch (error) {
        res.status(400).json({ error: error.detail || "error getting products" });
    }
});

router.get("/:id", async(req, res)=>{
    try {
        const result = await db.query(`SELECT * FROM products WHERE id =$1`, [req.params.id]);
        const product= result.rows[0];
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error getting product"});
    }
});

router.patch("/:id", async(req, res)=>{
    if (!req.body) return res.status(400).json({error: "No fields are provided"}); // nothing is provided for updating
    const {name, price, category_id} =req.body;
    let toUpdate =[];
    let values=[];
    let index =1;
    if (name) {
        toUpdate.push(`name = $${index++}`);
        values.push(name);
    }
    if (price) {
        toUpdate.push(`price = $${index++}`);
        values.push(price);
    }
    if (category_id) {
        toUpdate.push(`category_id = $${index++}`);
        values.push(category_id);
    }
    values.push(req.params.id);
    try {
        const result = await db.query(`UPDATE products SET ${toUpdate.join(', ')} WHERE id=$${index} RETURNING *`, values);
        const product= result.rows[0];
        if (product) {
            res.send("Product is updated successfully\n" + JSON.stringify(product));
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error updating product"});
    }
});

router.delete("/:id", async(req, res)=>{
    try {
        const result= await db.query(`DELETE FROM products WHERE id =$1 RETURNING *`, [req.params.id]);
        const product= result.rows[0];
        if (product) {
            res.send("Product is deleted successfully\n" + JSON.stringify(product));
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error deleting product"});
    }
});

export default router;