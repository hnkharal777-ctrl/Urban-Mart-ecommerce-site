const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).render('register', { 
                error: 'User already exists with this email' 
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        if (user) {
            const token = generateToken(user._id);
            
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.redirect('/products');
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('register', { 
            error: 'Server error. Please try again.' 
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).render('login', { 
                error: 'Invalid email or password' 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).render('login', { 
                error: 'Invalid email or password' 
            });
        }

        const token = generateToken(user._id);
        
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.redirect('/products');
    } catch (error) {
        console.error(error);
        res.status(500).render('login', { 
            error: 'Server error. Please try again.' 
        });
    }
};

// Logout User
exports.logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.redirect('/');
};

// Get current user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};