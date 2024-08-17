const Category = require('../models/CategorySchema');


exports.createCategory = async(req, res) =>{
    try {
        //fetch details
        const { name, description} = req.body;
        //validation
        if( !name || !description ){
            return res.status(400).json({
                success: false,
                message:"All fields are required"
            })
        }
        //create entry in database
        const categoryDetails = await Category.create({name:name, description:description});
        console.log('category Details ',categoryDetails);
        //return response
        return res.status(200).json({
            success: true,
            message:"category created successfully"
        });
    } catch (error) {
    return res.status(500).json({
        success: false,
        message:"category creation failed"
    });
    }
}
//get all category
exports.getAllCategory = async(req, res) => {
    try {
        const allCategory = await Category.find({}, {name:true, description:true});
        //res
        return res.status(200).json({
            success: true,
            message:"All Category fetch successfully",
            allCategory
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"All Category fetch failed"
        });
    }
}

//Category Page Details
exports.categoryDetailsPage = async(req, res) => {
    try {
        //cattegory id
        const { categoryId } = req.body;
        //get course for specfic category id
        const selectedCategory = await Category.findById({ categoryId})
                                                        .populate('courses').exec();

        //validation
        if( !selectedCategory ){
            return res.status(404).json({
                success: false,
                message: 'Data Not Found on Selected Category'
            })
        }
        //get course for different category
        const differentCategory = await Category.find(
            {
                _id: {$ne: categoryId}
            }
        ).populate('courses').exec();
        //H.W get topp selling courses

        //return
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"All Category fetch failed"
        });
    }
}