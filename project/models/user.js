const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false //默认不是管理员，true才是管理员
    }
})

module.exports = mongoModel["User"] = mongoose.model("User",userSchema);