const mongoose = require("mongoose");
// 分类数据库
let CategorySchemaType = mongoose.Schema({
    name:String,
    isShow:{   //删除数据
        type:Boolean,
        default:true //默认参数值
    }
})


module.exports = mongoModel["Category"] = mongoose.model("Category",CategorySchemaType);