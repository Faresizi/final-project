import { Router } from 'express';
import { list, create, validateCreate } from '../controllers/product.controller.js';
import { auth } from '../middleware/auth.js';


const router = Router();


router.get('/', list);
router.post('/', auth('admin'), validateCreate, create); // only admin can create


export default router;