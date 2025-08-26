import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';


export const validateRegister = [
body('name').isString().isLength({ min: 2 }),
body('email').isEmail(),
body('password').isLength({ min: 6 })
];


export const validateLogin = [
body('email').isEmail(),
body('password').isLength({ min: 6 })
];


export async function register(req, res, next) {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { name, email, password } = req.body;
const exists = await User.findOne({ email });
if (exists) return res.status(409).json({ error: 'Email already in use' });


const passwordHash = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, passwordHash });


res.status(201).json({ id: user._id, name: user.name, email: user.email });
} catch (e) { next(e); }
}


export async function login(req, res, next) {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });


const ok = await user.comparePassword(password);
if (!ok) return res.status(401).json({ error: 'Invalid credentials' });


const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });


res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
} catch (e) { next(e); }
}


export async function me(req, res, next) {
try {
const user = await User.findById(req.user.id).select('-passwordHash');
res.json(user);
} catch (e) { next(e); }
}