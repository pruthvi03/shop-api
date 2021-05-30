const Category = require('../models/category');

const findAll = async (req,res)=>{
    const category = await Category.find();
    if(!category){
        return res.status(404).json({success:false,'message':'Cannot find category'});
    }
    res.status(200).json({success:true,message:category});
}

const findById = async (req,res)=>{
    const category = await Category.findOne({_id:req.params.id});
    if(!category){
        return res.status(404).json({success:false,'message':'Category with given id is not found'});
    }
    res.status(200).json({success:true,message:category});
}

const createOne = async (req, res) => {
    let category = new Category({ ...req.body });
    try {
        category = await category.save();
        if (!category) {
            res.status(404).json({success:false,'message':'category cannot be created'});
        }
        return res.status(201).json({success:true,message:category});

    } catch (error) {
        res.status(500).json({ success:false, "error": error });
    }
}

const updateOne = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate({_id:req.params.id},{...req.body},{new:true});
        if (!category) {
            res.status(404).json({success:false,'message':'Category cannot be updated'});
        }
        return res.status(201).json({success:true,message:category});

    } catch (error) {
        res.status(500).json({ success:false, "error": error });
    }
}


const deleteOneById = async (req,res)=>{
    try {
        const result = await Category.findOneAndRemove({_id:req.params.id});
        if(!result){
            return res.status(404).json({success:false,'message':"Category not found"});
        }
        res.status(200).json({success:true,message:result});
    } catch (error) {
        res.status(500).json({ success:false, "error": error });
    }

}
module.exports = {
    findAll,
    findById,
    createOne,
    updateOne,
    deleteOneById
}