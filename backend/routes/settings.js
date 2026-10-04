import { Router } from 'express';
import { resetData } from '../controllers/settingsController.js';

const r = Router();
r.delete('/data', resetData);
export default r;
