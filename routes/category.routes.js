// api endpoint localhost:8888/ecomm/api/v1/categories
// post call 

const category_controller = require("../controllers/category.controller") 
const authMW = require('../middlewares/auth.mw')

// route ko app ke sath mila ke chalna hota hai 
// isiliye module.exports me = ke baad (app) likha hai 
module.exports = (app) => {
    app.post("/api/v1/categories",[authMW.verifyToken, authMW.isAdmin],category_controller.createNewCategory)
}
