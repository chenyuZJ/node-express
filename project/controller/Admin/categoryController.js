// 类的继承
const Controller = require("../controller");
const Category = require("../../models/category");

class CategoryController extends Controller{
    constructor(){
        super(); //必须初始化父类参数
        this.RouterFunctionName = [
            // 路由类型 路径 函数 描述
            ["get",'/category',"index","分类页面"],
            ["get",'/category/add',"add","添加功能"],
            ["post",'/category/add',"addPost","添加功能"],
            ["get",'/category/del',"del","删除功能"],
            ["get","/category/edit","edit","修改功能"],
            ["post","/category/edit","editPost","修改功能"],
            // *代表匹配路径前部分相同进入路由
            ["use","/category*","error","报错处理"]
        ]
    }

    index(){
        // this.ctx.next(); //跳出当前路由，执行下一个路由
        // 数据中isShow必须为true才能显示
        Category.find({isShow:true}).then((result)=>{
            this.ctx.req.session.result = result;
            this.ctx.res.render("admin/category",this.ctx.req.session);
        })
    }

    add(){
        this.ctx.res.render("admin/categoryAdd",this.ctx.req.session);
    }

    addPost(){
        Category.create(this.ctx.req.body,(err,result)=>{
            // next(error)方法可以传递报错
            if(err) this.ctx.next(err);
            // if(err) this.ctx.next();

            this.ctx.res.redirect("/admin/category");
        })
    }

    del(){
        if(!this.ctx.req.query._id){
            return;
        }
        Category.updateOne({_id:this.ctx.req.query._id},{$set:{isShow:false}},(err,result)=>{   
            if(err) this.ctx.next(err);

            this.ctx.res.redirect("/admin/category");
        })
    }

    edit(){
        Category.findOne({_id:this.ctx.req.query._id},(err,result)=>{
            if(err) this.ctx.next(err);
            this.ctx.req.session.result = result;
            this.ctx.res.render("admin/categoryEdit", this.ctx.req.session);
        })
    }

    editPost(){
        if(!this.ctx.req.body._id){
            return;
        }
        let {_id,...Obj} = this.ctx.req.body;
        Category.updateOne({_id},Obj,(err)=>{
            if(err) this.ctx.next();
            this.ctx.res.redirect("/admin/category");
        })
    }

    // 报错处理路由
    error(){
        // console.log(this.ctx.err);
        this.ctx.res.render("admin/error",{err:"数据操作失败",url:"/admin/category",date:3000})
    }
}

module.exports = CategoryController;