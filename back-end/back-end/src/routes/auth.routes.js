import { Router } from 'express';
import { register, login, me, validateRegister, validateLogin } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.js';


const router = Router();


router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', auth(), me);


export default router;