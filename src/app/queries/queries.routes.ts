import express from 'express';
import { createQueryHandler, getQueriesHandler, getQueryByIdHandler, getThisWeekStatsHandler } from './queries.controller';
import { isAuthenticated } from '../../middlewares/authValidate';

const router = express.Router();

// Apply auth middleware to all routes
router.use(isAuthenticated);

// Create a new query
router.post('/', createQueryHandler);

// Get all queries for the authenticated user
router.get('/', getQueriesHandler);

// Get this week's query statistics
router.get('/stats/week', getThisWeekStatsHandler);

// Get a specific query by ID
router.get('/:id', getQueryByIdHandler);

export default router;
