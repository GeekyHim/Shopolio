// controller for creating the category 
// POST CALL HOGI 
// localhost:8888/ecomm/api/v1/categories
// req body 
// {
//      name : 
//      desc :
// }

const category_model = require("../models/category.model")

exports.createNewCategory = async (req, res) => {
    //read req body
    //create category obj
    const cat_data = {
        name : req.body.name,
        description : req.body.description
    }

    //Insert into mongoDB
    //return the response
    try{
        const category = await category_model.create(cat_data)
        return res.status(201).send({
            success: true,
            message: 'Category created',
            data: category
        })
    } catch (err){
        console.log("Error while creating category ",err)
        return res.status(500).send({
            success: false,
            message : "Error while creating category",
            data : {}
        })
    }
}