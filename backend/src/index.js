import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dbConnection from './config/db.js';
import 'dotenv/config'

import userRoutes from './routes/userRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js'
import productRouter from "./routes/productRoute.js"
import cartRouter from "./routes/cartRoute.js"
import addressRouter from "./routes/addressRoute.js"
import OrderRouter from "./routes/orderRoute.js"
import connectCloud from './config/cloudinary.js';
const app = express();
const Port = process.env.PORT || 3000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

await dbConnection();
await connectCloud()
app.use('/api/user', userRoutes);
app.use('/api/seller', sellerRoutes)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', OrderRouter)


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
export default app;