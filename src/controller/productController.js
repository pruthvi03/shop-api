const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type');
        if (isValid) {
            uploadError = null;
        }
        // console.log(`Here`);
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const fileName = file.originalname.replace(/\.[^/.]+$/, "").split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        // console.log(`${fileName}-${Date.now()}.${extension}`);
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
})

const uploadOptions = multer({ storage: storage })

const findAll = async (req, res) => {
    // product?categories=234545,23232
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }
    const product = await Product.find(filter).populate('category');
    if (!product) {
        return res.status(404).json({ success: false, 'message': 'Cannot find product' });
    }
    res.status(200).json({ success: true, message: product });
}

const findById = async (req, res) => {
    const product = await (await Product.findOne({ _id: req.params.id })).populate('category').execPopulate();
    if (!product) {
        return res.status(404).json({ success: false, 'message': 'Product with given id is not found' });
    }
    res.status(200).json({ success: true, message: product });
}

const createOne = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.body.category });
        if (!category) {
            return res.status(404).json({ success: false, 'message': 'Category with given id is not found' });
        }

        const file = req.file;
        // if (!file) return res.status(400).send('No image in the request');
        var image = ''
        if(file){
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            image = `${basePath}${fileName}`;
        }
        let product = new Product({ ...req.body, image: image });
        product = await product.save();
        if (!product) {
            res.status(404).json({ success: false, 'message': 'product cannot be created' });
        }
        return res.status(201).json({ success: true, message: product });

    } catch (error) {
        res.status(500).json({ success: false, "error": error.message });
    }
}

const updateOne = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, 'message': 'Invalid object Id' });
    }
    try {
        const category = await Category.findOne({ _id: req.body.category });
        if (!category) {
            return res.status(404).json({ success: false, 'message': 'Category with given id is not found' });
        }

        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({ success: false, 'message': 'Product with given id is not found' });
        }

        const file = req.file;
        var imagePath;
        if (file) {
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            imagePath = `${basePath}${fileName}`;
        } else {
            imagePath = product.image;
        }

        const updatedProduct = await Product.findByIdAndUpdate({ _id: req.params.id }, { ...req.body, image: imagePath }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, 'message': 'Product cannot be updated' });
        }
        return res.status(201).json({ success: true, message: updatedProduct });

    } catch (error) {
        res.status(500).json({ success: false, "error": error });
    }
}


const deleteOneById = async (req, res) => {
    try {
        const result = await Product.findOneAndRemove({ _id: req.params.id });
        if (!result) {
            return res.status(404).json({ success: false, 'message': "Product not found" });
        }
        res.status(200).json({ success: true, message: result });
    } catch (error) {
        res.status(500).json({ success: false, "error": error });
    }

}

const getProductCount = async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);
    if (!productCount) {
        return res.status(404).json({ success: false, 'message': 'Cannot count product' });
    }
    res.status(200).json({ success: true, message: { productCount: productCount } });
}

const getFeaturedProducts = async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    try {
        const products = await Product.find({ isFeatured: true }).limit(+count);
        if (!products) {
            return res.status(404).json({ success: false, 'message': 'Cannot find featured products' });
        }
        res.status(200).json({ success: true, message: products });

    } catch (error) {
        res.status(500).json({ success: false, "error": error });
    }
}

const uploadImages = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, 'message': 'Invalid object Id' });
    }
    try {

        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({ success: false, 'message': 'Product with given id is not found' });
        }

        const files = req.files;
        let imagePaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        if (files) {
            files.map(file=>{
                imagePaths.push(`${basePath}${file.filename}`);
            })
        }else{
            imagePaths = product.images;
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            { _id: req.params.id },
            { images: imagePaths },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ success: false, 'message': 'Product cannot be updated' });
        }
        return res.status(201).json({ success: true, message: updatedProduct });

    } catch (error) {
        res.status(500).json({ success: false, "error": error });
    }
}

module.exports = {
    findAll,
    findById,
    createOne,
    updateOne,
    deleteOneById,
    getProductCount,
    getFeaturedProducts,
    uploadOptions,
    uploadImages
}