const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
    {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and superior sound quality. Perfect for music lovers and professionals.',
        price: 99.99,
        category: 'Electronics',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        featured: true
    },
    {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking, notifications, and long battery life. Stay connected on the go.',
        price: 199.99,
        category: 'Electronics',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        featured: true
    },
    {
        name: 'Running Shoes',
        description: 'Comfortable running shoes designed for all terrains. Lightweight and durable with excellent grip.',
        price: 79.99,
        category: 'Sports',
        stock: 100,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
    },
    {
        name: 'Laptop Backpack',
        description: 'Durable backpack with padded laptop compartment, multiple pockets, and water-resistant material.',
        price: 49.99,
        category: 'Other',
        stock: 75,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
    },
    {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe. Brew perfect coffee every morning with ease.',
        price: 89.99,
        category: 'Home',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'
    },
    {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and home workouts.',
        price: 29.99,
        category: 'Sports',
        stock: 150,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'
    },
    {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 12-hour battery life.',
        price: 59.99,
        category: 'Electronics',
        stock: 60,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'
    },
    {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness and color temperature. Energy-efficient and eye-friendly.',
        price: 39.99,
        category: 'Home',
        stock: 85,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'
    }
];

const seedDB = async () => {
    try {
        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});

        console.log('Database cleared');

        // Insert products
        await Product.insertMany(products);
        console.log('Products added');

        // Create admin user
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true
        });

        // Create test user
        await User.create({
            name: 'Test User',
            email: 'user@example.com',
            password: 'user123'
        });

        console.log('Users created');
        console.log('\n=================================');
        console.log('Database seeded successfully!');
        console.log('=================================');
        console.log('\nTest Accounts:');
        console.log('Admin: admin@example.com / admin123');
        console.log('User:  user@example.com / user123');
        console.log('=================================\n');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB(); 
