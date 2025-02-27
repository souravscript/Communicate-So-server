import express from 'express';
import authRoutes from './auth/auth.routes';
import categoryRoutes from './category/category.routes';
import memberRoutes from './member/member.routes';
import queryRoutes from './queries/queries.routes';
import dataSourceRoutes from './data-sources/data-sources.routes';
import resourceRoutes from './resources/resource.route';

const router = express.Router();

// Mount all routes under /v1
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/members', memberRoutes);
router.use('/queries', queryRoutes);
router.use('/data-sources', dataSourceRoutes);
router.use('/resources', resourceRoutes);

export default router;

// Export all route modules
export * from './auth/auth.routes';
export * from './category/category.routes';
export * from './member/member.routes';
export * from './queries/queries.routes';
export * from './data-sources/data-sources.routes';
export * from './resources/resource.route';
