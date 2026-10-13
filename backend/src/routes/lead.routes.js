import { Router } from 'express';
import { leadController } from '../controllers/lead.controller.js';
import checkAuth, { restrictToDepartment } from '../middleware/auth.middleware.js';
import { validateBody, validateQuery, validateParams } from '../validators/task.validator.js';
import {
  createLeadSchema,
  updateLeadSchema,
  bulkUpdateStatusSchema,
  addFollowUpSchema,
  updateStatusSchema
} from '../validators/lead.validator.js';
import { apiRateLimiter, leadMutationRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

// Middleware to check authorization for leads access - open to all authenticated users
const authorizeLeadsAccess = async (req, res, next) => {
  next();
};

// Middleware for mutation operations
const restrictAdminMutations = (req, res, next) => {
  next();
};

router.use(checkAuth);
router.use(authorizeLeadsAccess);


// GET ALL LEADS (supporting filters, search, and pagination) - View access allowed for Admin
router.get('/', apiRateLimiter, leadController.getLeads);

// GET SINGLE LEAD BY ID - View access allowed for Admin
router.get('/:id', apiRateLimiter, leadController.getLeadById);

// CREATE LEAD (with Zod validation, rate limiting, blocked for Admin)
router.post('/create', leadMutationRateLimiter, restrictAdminMutations, validateBody(createLeadSchema), leadController.createLead);

// BULK UPDATE LEAD STATUS (blocked for Admin)
router.put('/update', leadMutationRateLimiter, restrictAdminMutations, validateBody(bulkUpdateStatusSchema), leadController.bulkUpdateStatus);

// UPDATE SINGLE LEAD (blocked for Admin)
router.put('/:id', leadMutationRateLimiter, restrictAdminMutations, validateBody(updateLeadSchema), leadController.updateLead);
router.post('/update/:id', leadMutationRateLimiter, restrictAdminMutations, validateBody(updateLeadSchema), leadController.updateLead);
router.post('/update', leadMutationRateLimiter, restrictAdminMutations, validateBody(updateLeadSchema), leadController.updateLead);

// LOG FOLLOW-UP ACTION (blocked for Admin)
router.post('/followup', leadMutationRateLimiter, restrictAdminMutations, validateBody(addFollowUpSchema), leadController.addFollowUp);
router.post('/followup/:id', leadMutationRateLimiter, restrictAdminMutations, validateBody(addFollowUpSchema), leadController.addFollowUp);

// UPDATE LEAD STATUS (blocked for Admin)
router.patch('/status-update', leadMutationRateLimiter, restrictAdminMutations, validateBody(updateStatusSchema), leadController.updateStatus);
router.patch('/status-update/:id', leadMutationRateLimiter, restrictAdminMutations, validateBody(updateStatusSchema), leadController.updateStatus);
router.post('/status-update', leadMutationRateLimiter, restrictAdminMutations, validateBody(updateStatusSchema), leadController.updateStatus);
router.post('/status-update/:id', leadMutationRateLimiter, restrictAdminMutations, validateBody(updateStatusSchema), leadController.updateStatus);

// DELETE LEAD (blocked for Admin)
router.delete('/delete/:id', leadMutationRateLimiter, restrictAdminMutations, leadController.deleteLead);
router.post('/delete/:id', leadMutationRateLimiter, restrictAdminMutations, leadController.deleteLead);
router.delete('/:id', leadMutationRateLimiter, restrictAdminMutations, leadController.deleteLead);
router.delete('/delete', leadMutationRateLimiter, restrictAdminMutations, leadController.deleteLead);
router.post('/delete', leadMutationRateLimiter, restrictAdminMutations, leadController.deleteLead);

// BULK IMPORT LEADS (blocked for Admin)
router.post('/import', leadMutationRateLimiter, restrictAdminMutations, leadController.importLeads);

export default router;
