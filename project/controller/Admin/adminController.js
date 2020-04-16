// 类的继承
const Controller = require("../controller");
const md5 = require("../../function/md5");
const User = require("../../models/user");
const Navbar = require("../../models/navbar");
const TreeJson = require("../../function/treejson");


class AdminController extends Controller{
    constructor(){
        super(); //必须初始化父类参数
        this.RouterFunctionName = [
            // 路由类型 路径 函数 描述
            ["get",'/login',"login","登陆功能"],
            ["post",'/login',"loginPost","登陆功能"],
            ["use",null,"validate","验证功能"],
            ["use",null,"commonCodes","公共模块处理"],
            ["get",'/',"index","首页功能"],
            ["get",'/out',"out","退出登录"],
        ]
    }
    login(){
        this.ctx.res.render("admin/login")
    }
    loginPost(){
        // 把用户信息过滤
        let {username,password} = md5(this.ctx.req.body);

        // 通过用户名获取后台数据，验证密码是否正确
        User.findOne({username},(err,result)=>{
            if(result != null && password == result.password && result.isAdmin){
                // 添加session参数
                this.ctx.req.session.login = 1; //登陆成功
                this.ctx.req.session.username = username;
                this.ctx.res.redirect("/admin/");
            }else{
                this.ctx.res.render("admin/error",{err:"请输入正确用户名密码",url:"/admin/login",date:3000})
            }
        })
        // // 默认添加一条数据
        // User.insertMany(fields,function(err,res){
        //     console.log("成功");
        // })
    }
    validate(){
        this.ctx.req.session.login = 1; //登陆成功
        this.ctx.req.session.username = "zhangsan";
        if(this.ctx.req.session.login == 1){
            this.ctx.next();
        }else{
            this.ctx.res.render("admin/login");
        }
    }

    commonCodes(){
        Navbar.findOne({},(err,result)=>{
            this.ctx.req.session.navbar = TreeJson(result.navbar);
            this.ctx.next() 
        })
    }
    index(){
        // console.log(this);
        // this.info();
        // 1.指向类对象
        // 2.指向路由对象 调用函数体

        // res.send('第二模块 Admin后台666');
        this.ctx.res.render("admin/index",this.ctx.req.session);
    }

    out(){
        this.ctx.req.session.login = 0;
        this.ctx.req.session.username = null;
        this.ctx.res.redirect("/admin/login");
    }
}

module.exports = AdminController;