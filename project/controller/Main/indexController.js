const Controller = require("../controller");

class indexController extends Controller{
    
    constructor(){
        super();//必须初始化父类参数
        this.RouterFunctionName = [
            // 路由类型 路径 函数 描述
            ["get","/","index","首页"],
            ["get","/list","list","列表页"],
        ]
    }

    index(){
        this.ctx.res.render("main/mi");
    }

    list(){
        this.ctx.res.render("main/list")
    }

}
module.exports = indexController;