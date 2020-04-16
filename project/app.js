// 引入模块
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const sd = require("silly-datetime");
const session = require("express-session");
const app = express();

global.mongoModel = {};

// 项目配置

// 配置时间模板处理
app.locals.sd = sd;
// 模板引擎
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// session配置
app.use(session({
    secret: "iloveyou",//加密密钥
    resave: false,
    saveUninitialized: false
}))

// 配置静态资源
app.use(express.static("./public"));
app.use(express.static("./uploads"));

// bodyParser配置
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

// 项目路由
// 第一模块 Main前台
// app.use("/",require("./routers/Main"));  //传统开发方式
app.use(express.static("./dist")); //前后台开发方式

// 第二模块 Admin后台
app.use("/admin", require("./routers/Admin"));

// 第三模块 Api接口
app.use("/api", require("./routers/Api"));

// 数据连接与服务器开启
mongoose.connect("mongodb://127.0.0.1:27017/adminCY", { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        throw Error("数据库连接失败");
        return;
    } else {
        app.listen(3000, () => {
            console.log('请访问:http://127.0.0.1:3000');
        })
    }
})