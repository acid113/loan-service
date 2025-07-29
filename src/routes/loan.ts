import express from 'express';
import { getAllLoans, createLoan, getLoanById, updateLoan, deleteLoan } from '#/controllers/loan';
import { authenticate } from '#/middlewares/auth';

const router = express.Router();

router.get('/', authenticate, getAllLoans);
router.get('/:id', authenticate, getLoanById);
router.post('/', authenticate, createLoan);
router.put('/:id', authenticate, updateLoan);
router.delete('/:id', authenticate, deleteLoan);

export default router;
