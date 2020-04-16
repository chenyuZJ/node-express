// 类的继承
const Controller = require("../controller");
const Navbar = require("../../models/navbar");
const Tree = require("../../function/tree");


class navbarController extends Controller{
    constructor(){
        super(); //必须初始化父类参数
        
        this.RouterFunctionName = [
            // 路由类型 路径 函数 描述
            ["get",'/navbar',"index","商品页"],
            ["get",'/navbar/add',"add","商品添加"],
            ["post",'/navbar/add',"addPost","商品添加"],
            ["get",'/navbar/del',"del","商品删除"],
            ["get",'/navbar/edit',"edit","商品修改"],
            ["post",'/navbar/edit',"editPost","商品修改"],
        ]
    }

    index(){
        Navbar.findOne({},(err,doc)=>{
            this.ctx.req.session.result = Tree(doc.navbar);
            this.ctx.res.render("admin/navbar",this.ctx.req.session);
        })
    }
    add(){
        Navbar.findOne({},(err,doc)=>{
            this.ctx.req.session.levels = Tree(doc.navbar);
            this.ctx.res.render("admin/navbarAdd",this.ctx.req.session);
        })
        
    }
    addPost(){
        let body = this.ctx.req.body;
        // 创建空数据/
        // Navbar.insertMany({navbar:[],count:1}).then((data)=>{
        //     console.log(data);
        // })
        Navbar.findOne({},(err,doc)=>{
            body.id = doc.count || 1; //获取默认id编号
            doc.count +=1;//每添加一条数据参数值加一
            doc.navbar.push(body);
            doc.save(()=>{
                this.ctx.res.redirect("/admin/navbar");
            })
        })
    }
    del(){
        let _id = this.ctx.req.query._id;
        Navbar.findOne({},(err,doc)=>{
            let index = doc.navbar.findIndex(value=>value._id == _id);
            doc.navbar[index].isShow = false;
            doc.save(()=>{
                this.ctx.res.redirect("/admin/navbar");
            })
        })
    }
    edit(){
        let _id = this.ctx.req.query._id;
        Navbar.findOne({}).then((doc)=>{

            this.ctx.req.session.levels = Tree(doc.navbar);
            return doc.navbar.find(value=>value._id == _id);

        }).then((result)=>{

            this.ctx.req.session.result = result;
            this.ctx.res.render("admin/navbarEdit",this.ctx.req.session);

        }).catch((err)=>{
            throw Error(err);
        })
    }

    editPost(){
        let {_id,...input} = this.ctx.req.body;
        Navbar.findOne({}).then((data)=>{
            let objIndex = data.navbar.findIndex(value=>value._id==_id);
            for(let i in input){
                data.navbar[objIndex][i] = input[i];
            }
            data.save(()=>{
                this.ctx.res.redirect("/admin/navbar");
            })
        })
    }
}

module.exports = navbarController;