const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const userRoutes = require('./routes/UserRoute');
const slotRoute = require('./routes/SloteRoute');

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors(origin="*"));
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/slot',slotRoute);

app.listen(PORT,()=>{
    console.log(`App is listening on PORT ${PORT}`);
})