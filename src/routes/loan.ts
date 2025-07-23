import express from 'express';
import { getAllLoans, createLoan, getLoanById, updateLoan } from '#/controller/loan';

const router = express.Router();

router.get('/', getAllLoans);
router.get('/:id', getLoanById);
router.post('/', createLoan);
router.put('/', updateLoan);

export default router;
