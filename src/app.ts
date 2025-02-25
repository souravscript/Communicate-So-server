import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './app/auth/auth.routes';
import resourceRoutes from './app/resources/resource.route';
import categoryRoutes from './app/category/category.routes';
import memberRoutes from './app/member/member.routes';
import queryRoutes from './app/queries/queries.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Secure CORS configuration
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/queries', queryRoutes);

export default app;
