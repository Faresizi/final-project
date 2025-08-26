import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';


import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import { notFound, errorHandler } from './middleware/error.js';


await connectDB();


const app = express();

const allowed = ['http://localhost:5173', 'http://localhost:5175'];

app.use(helmet());
app.use(cors({ origin: allowed, credentials: false }));
app.use(express.json());

app.use(morgan('dev'));


app.use('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));