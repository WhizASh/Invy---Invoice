import { Router } from 'express';
import { createInvoice, getInvoiceById, getAllInvoices } from '../controllers/invoiceController.js';

const router = Router();

router.post('/', createInvoice);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);

export default router;
