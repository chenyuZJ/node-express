// 类的继承
const Controller = require("../controller");
const Goods = require("../../models/goods");
const Category = require("../../models/category");
const {Upload} = require("../../function/upload");
const fs = require("fs");

class GoodsController extends Controller{
    constructor(){
        super(); //必须初始化父类参数
        this.RouterFunctionName = [
            // 路由类型 路径 函数 描述
            ["get",'/goods',"index","商品页"],
            ["get",'/goods/add',"add","商品添加"],
            ["post",'/goods/add',"addPost","商品添加"],
            ["get",'/goods/del',"del","商品删除"],
            ["get",'/goods/edit',"edit","商品修改"],
            ["post",'/goods/edit',"editPost","商品修改"],
            ["post",'/goods/upload',"upload","添加图片"],
            ["post",'/goods/uploadDel',"uploadDel","删除图片"],
        ]
    }

    index(){
        Goods.find().populate("category").then((result)=>{
            this.ctx.req.session.result = result
            this.ctx.res.render("admin/goods",this.ctx.req.session);
        })
    }
    add(){
        // 分类数据
        Category.find({"isShow":true}).then((Categorydata)=>{
            this.ctx.req.session.Categorydata= Categorydata
            this.ctx.res.render("admin/goodsAdd",this.ctx.req.session);
        })
    }
    addPost(){
        // 添加数据
        Goods.insertMany(this.ctx.req.body,(err,result)=>{
            if(err){
                this.ctx.res.render("admin/error",{err:"数据库操作失败",url:"/admin/goods",date:3000});
                return;
            }
            this.ctx.res.redirect("/admin/goods");
        })
    }
    del(){
        let _id = this.ctx.req.query._id;
        Goods.deleteOne({_id},(err,result)=>{
            if(err){
                this.ctx.res.render("admin/error",{err:"数据库操作失败",url:"/admin/goods",date:3000});
                return;
            }
            this.ctx.res.redirect("/admin/goods");
        })
    }
    edit(){
        let _id = this.ctx.req.query._id;
        Goods.findOne({_id}).then((data)=>{

            this.ctx.req.session["result"] = data;
            return Category.find({"isShow":true});
        }).then((result)=>{

            this.ctx.req.session["Categorydata"] = result
            this.ctx.res.render("admin/goodsEdit",this.ctx.req.session);
        })

    }
    editPost(){
        let {_id,...data} = this.ctx.req.body;
        Goods.updateOne({_id},data,(err,result)=>{
            if(err){
                this.ctx.res.render("admin/error",{err:"数据库操作失败",url:"/admin/goods",date:3000});
                return;
            }
            this.ctx.res.redirect("/admin/goods");
        })
    }

    upload(){
        Upload(this.ctx.req,(err,data)=>{
            if(err){
                this.ctx.res.json({code:201});
            }else{
                this.ctx.res.json(data)
            }
        })
    }

    uploadDel(){
        // 删除uploads本地图片
        fs.unlink(__dirname + "/../../uploads/" + this.ctx.req.body.url,(err)=>{
            if(err){
                this.ctx.res.send("0");
                return;
            }
            this.ctx.res.send("1");
        })
    }
}

module.exports = GoodsController;