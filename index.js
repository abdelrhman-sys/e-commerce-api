import express from "express";
import createTables from "./createTables.js";
import products from "./routes/router-products.js";
import categories from "./routes/router-categories.js";
import cart from "./routes/router-cart.js";

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
createTables();

app.use("/api/products", products);
app.use("/api/categories", categories);
app.use("/api", cart);

app.listen(3000, ()=> {
    console.log("listening on http://localhost:3000");
}) 