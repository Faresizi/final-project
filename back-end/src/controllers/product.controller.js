import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';


export const validateCreate = [
body('name').isString().isLength({ min: 2 }),
body('price').isFloat({ min: 0 })
];


export async function list(req, res, next) {
try {
const items = await Product.find().sort({ createdAt: -1 });
res.json(items);
} catch (e) { next(e); }
}


export async function create(req, res, next) {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const item = await Product.create(req.body);
res.status(201).json(item);
} catch (e) { next(e); }
}