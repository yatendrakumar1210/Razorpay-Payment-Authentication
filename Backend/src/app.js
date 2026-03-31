const express = require("express");
const cors = require('cors');
const productRoutes = require('../src/routes/product.routes');
const paymentRoutes = require('../src/routes/payment.routes')

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/product', productRoutes )
app.use('/api/payment', paymentRoutes )
module.exports = app;
