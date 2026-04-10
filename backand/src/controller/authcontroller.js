import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Setup the first Admin (One-time setup)
// @route   POST /api/auth/setup-admin
// @access  Public (Only works if no admin exists in DB)
export const setupAdmin = async (req, res) => {
  try {
    // 1. Check if an admin already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      return res.status(403).json({ 
        message: 'Admin setup is locked. An admin already exists.' 
      });
    }

    const { name, email, password } = req.body;

    // 2. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // 3. Create the first Admin
    // Hum yahan role hardcode 'admin' kar rahe hain security ke liye
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin', 
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, admin.role),
        message: 'First Admin created successfully. Setup locked.'
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user (Student or Teacher)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Security Check: Koi bhi direct API call karke 'admin' nahi ban sakta
    if (role === 'admin') {
      return res.status(403).json({ 
        message: 'Cannot register as Admin via this route. Use setup-admin or contact existing Admin.' 
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Default role 'student' agar kuch pass na kiya gaya ho
    const validRole = (role === 'teacher') ? 'teacher' : 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: validRole,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (Requires Token)
export const getMe = async (req, res) => {
  // req.user middleware (protect) se aa raha hai
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};