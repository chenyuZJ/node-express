const mongoose = require("mongoose");
// 分类数据库
let GoodsSchemaType = mongoose.Schema({
    // 分类id
    category:{
        // 类型
        type:mongoose.Schema.Types.ObjectId,
        // 引用
        ref:"Category" //数据库
    },
    // 标题
    title:{
        type:String,
        default:""
    },
    // 地址
    address:{
        type:String,
        default:""
    },
    // 收藏
    iscollect:{
        type:String,
        default:"false"
    },
    // 简介
    description:{
        type:String,
        default:""
    },
    // 内容
    content:{
        type:String,
        default:""
    },
    // 缩略图
    thumbnail:{
        type:String,
        default:""
    },
    // 多图
    imgs:{
        type:Array
    },
    // 添加时间
    addTime:{
        type:Date,
        default:Date.now()
    }
})


module.exports = mongoModel["Goods"] = mongoose.model("Goods",GoodsSchemaType);