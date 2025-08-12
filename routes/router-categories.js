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
        const result = await db.query(`INSERT INTO categories (name) VALUES ($1) RETURNING *`, [req.body.name]);
        res.send(`Category is created successfully\n` + JSON.stringify(result.rows[0]));
    } catch (error) {
        res.status(400).json({error: error.detail || "error adding category"});
    }
});

router.get("/", async(req, res)=>{
    try {
        const {rows: categories} = await db.query(`SELECT * FROM categories`);
        res.json(categories);
    } catch (error) {
        res.status(400).json({error: error.detail || "error getting categories"});
    }
});

router.get("/:id", async(req, res)=>{
    try {
        const result = await db.query(`SELECT * FROM categories WHERE id =$1`, [req.params.id]);
        const category= result.rows[0];
        if (category) {
            return res.json(category);
        } else {
            res.status(404).json({error: "No category is found"});
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error getting category"});
    }
});

router.patch("/:id", async(req, res)=>{
    try {
        const result = await db.query(`UPDATE categories SET name =$1 WHERE id=$2 RETURNING *`, [req.body.name, req.params.id]);
        const category= result.rows[0];
        if (category) {
            res.send("Category is updated successfully\n" + JSON.stringify(category));
        } else {
            res.status(404).json({error: "No category is found"});
        }
    } catch (error) {
        res.status(400).json({error: error.detail || "error updating category"});
    }
});

router.delete("/:id", async(req, res)=>{
    try {
        const result = await db.query(`DELETE FROM categories WHERE id =$1 RETURNING *`, [req.params.id]);
        const category= result.rows[0];
        if (category) {
            res.send("Category is deleted successfully\n" + JSON.stringify(category));
        } else {
            res.status(404).json({error: "No category is found"});
        }    
    } catch (error) {
        res.status(400).json({error: error.detail || "error deleting category"});
    }
});

export default router;