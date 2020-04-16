const mongoose = require("mongoose");

let NavbarSchema = mongoose.Schema({
    // 只有一条导航数据
    navbar:[
        {
            id:Number,
            name:String,
            database:String,
            icon:String,
            url:String,
            img:String,
            pid:{ //父级id
                type:Number,
                default:0  //默认最大父级id为0
            },
            isShow:{
                type:Boolean,
                default:true
            }
        }
    ],
    count:{ //计算叠加值
        type:Number,
        default:1
    }
})

module.exports = mongoModel["navbar"] = mongoose.model("navbar",NavbarSchema);