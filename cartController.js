const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).render('cart', { 
            cart: { items: [] }, 
            error: 'Error loading cart' 
        });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ 
                success: false, 
                message: 'Insufficient stock' 
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity: parseInt(quantity),
                price: product.price
            });
        }

        await cart.save();
        
        res.json({ 
            success: true, 
            message: 'Product added to cart',
            cartItemsCount: cart.items.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding to cart' 
        });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        const item = cart.items.id(itemId);
        
        if (!item) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found in cart' 
            });
        }

        if (quantity <= 0) {
            item.remove();
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        
        res.json({ 
            success: true, 
            cart 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating cart' 
        });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        cart.items = cart.items.filter(
            item => item._id.toString() !== req.params.itemId
        );

        await cart.save();
        
        res.json({ 
            success: true, 
            message: 'Item removed from cart' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error removing item' 
        });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({ 
            success: true, 
            message: 'Cart cleared' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error clearing cart' 
        });
    }
};