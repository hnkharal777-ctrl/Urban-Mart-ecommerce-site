const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        
        res.render('products', { 
            products, 
            category: category || 'all',
            search: search || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('products', { 
            products: [], 
            error: 'Error loading products' 
        });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).render('404', { message: 'Product not found' });
        }

        res.render('product-detail', { product });
    } catch (error) {
        console.error(error);
        res.status(500).render('404', { message: 'Error loading product' });
    }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, featured } = req.body;
        
        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            featured: featured === 'on',
            image: req.file ? `/uploads/${req.file.filename}` : '/images/default-product.jpg'
        });

        res.status(201).json({ 
            success: true, 
            product 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating product' 
        });
    }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating product' 
        });
    }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting product' 
        });
    }
};