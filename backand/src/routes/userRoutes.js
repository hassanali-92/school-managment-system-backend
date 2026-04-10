import express from 'express';
import { 
  getUsers, 
  getUserById,
  createUser, 
  updateUser,
  deleteUser,
  getStats 
} from '../controller/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all routes below
router.use(protect);
router.use(authorize('admin'));

router.route('/stats')
  .get(getStats);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;