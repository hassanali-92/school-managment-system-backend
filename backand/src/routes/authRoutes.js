import express from 'express';
import { 
  registerUser, 
  loginUser, 
  setupAdmin,
  getMe 
} from '../controller/authcontroller.js';
import { protect } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.post('/setup-admin', setupAdmin);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe); // Protected route to get user info

export default router;