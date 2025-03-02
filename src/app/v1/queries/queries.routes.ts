import express from 'express';
import { createQueryHandler, getQueriesHandler, getById, getThisWeekStatsHandler, getRecentQueriesHandler } from './queries.controller';
import { isAuthenticated } from '../../../middlewares/authValidate';

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
//router.get('/:id', getById);

// Get recent queries
router.get('/recent', getRecentQueriesHandler);

export default router;
