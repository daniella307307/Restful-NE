const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const userRoutes = require('./routes/UserRoute');
const slotRoute = require('./routes/SloteRoute');
const bookRoute = require('./routes/BookingRoute');
const { swaggerui, swaggerSpec } = require("./utils/swagger");

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors(origin="*"));
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/slot',slotRoute);
app.use('/api/v1/book',bookRoute);
app.use('/api-docs',swaggerui.setup(swaggerSpec));

app.listen(PORT,()=>{
    console.log(`App is listening on PORT ${PORT}`);
})