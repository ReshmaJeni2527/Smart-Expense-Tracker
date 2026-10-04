import { Router } from 'express';
import * as c from '../controllers/categoryController.js';

const r = Router();
r.route('/').get(c.list).post(c.create);
r.route('/:id').delete(c.remove);
export default r;
