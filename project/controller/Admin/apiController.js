const Controller = require("../controller");
const InfoApi = require("../Api/apiController");
const InfoArray = new InfoApi().RouterFunctionName;

class ApiController extends Controller{
    constructor() {
        super();
        this.RouterFunctionName = [
            ["get", "/api", "index", "商品接口"]
        ]
    }

    index(){
        this.ctx.req.session.result = InfoArray;
        this.ctx.res.render("admin/api",this.ctx.req.session)
    }
}

module.exports = ApiController;