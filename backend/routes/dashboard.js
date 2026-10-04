import { Router } from 'express';
import { summary } from '../controllers/dashboardController.js';

const r = Router();
r.get('/summary', summary);
export default r;
