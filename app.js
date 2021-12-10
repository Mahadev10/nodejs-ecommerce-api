const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());
app.use(morgan('tiny'));


//Routes
const categoriesRoutes = require('./routes/categories.js');
const productsRoutes = require('./routes/products.js');
const usersRoutes = require('./routes/users.js');
const ordersRoutes = require('./routes/orders.js');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Database
mongoose.connect("mongodb://localhost/eshop-database")
.then(()=>{
  console.log('Database Connection is ready...')
})
.catch((err)=> {
  console.log(err);
})
const PORT = process.env.PORT;
// server
app.listen(PORT,()=>console.log(`server running on http://localhost:${PORT}/api/v1/products/`));