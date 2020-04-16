const Controller = require("../controller");
const md5 = require("../../function/md5");
const jwt = require("jsonwebtoken");
const secret = "iloveyoumeinv";


class ApiController extends Controller {
    constructor() {
        super();//必须初始化父类参数
        this.RouterFunctionName = [
            // 路由类型 路径 函数 描述 是否显示接口 接口描述
            // http://127.0.0.1:3000/api/login
            ["get", "/login", "login", "登陆接口", true, "username=?&password=?"],
            ["get", "/register", "register", "注册接口", true, "username=?&password=?"],
            ["use",null,"validate","验证登陆",false],
            ["get", "/getdata", "getdata", "获取接口", true, "token=?&d=?&data=?&page=?&limit=?"],
            ["get", "/setdata", "setdata", "添加接口", true, "token=?&d=?&data=?"],
            ["get", "/deldata", "deldata", "删除接口", true, "token=?&d=?&data=?"],
            ["get", "/editdata", "editdata", "修改接口", true, "token=?&d=?&data=?&_id=?"],

        ]
    }

    index() {
        this.ctx.res.send("api页面")
    }
    /**
     * 登录接口Api
     * @param {String} username 用户名
     * @param {String} password 密码
     * @return {json} 数据
     * url=> http://127.0.0.1:3000/api/login?username=admin&password=123123
     */
    login() {
        let fields = md5(this.ctx.req.query);
        if (!fields) {
            this.ctx.res.json({ code: 201, message: "请输入正确信息" });
            return;
        }
        // 获取用户名密码
        let { username, password } = fields;

        // 生成token值 令牌
        let token = jwt.sign(fields, secret, { expiresIn: "1 days" });

        mongoModel["User"].findOne({ username }).then((result) => {
            if (result != null && password == result.password) {
                this.ctx.res.json({ code: 200, message: "登陆成功", result: { token } })
            } else {
                this.ctx.res.json({ code: 201, message: "请输入正确信息" });
            }
        })


    }
    /**
     * 注册接口Api
     * @param {String} username 用户名
     * @param {String} password 密码
     * @return {json} 数据
     * url=> http://127.0.0.1:3000/api/register?username=admin&password=123123
     */
    register() {
        let fields = md5(this.ctx.req.query);
        if (!fields) {
            this.ctx.res.json({ code: 201, message: "请输入正确信息" });
            return; //终止后面代码
        }

        // 验证用户名是否存在
        mongoModel["User"].findOne({ username: fields.username }).then((result) => {
            if (result) {  //判断是否相同用户名
                this.ctx.res.json({ code: 201, message: "请输入正确信息" });
                return;
            }
            // 插入数据
            return mongoModel["User"].insertMany(fields);
        }).then((result) => {
            if (result) {
                this.ctx.res.json({ code: 200, message: "注册成功" });
            } else {
                this.ctx.res.json({ code: 201, message: "请输入正确信息" });
            }
        }).catch((err) => {
            this.ctx.res.json({ code: 201, message: "请输入正确信息" });
        })
    }

    /**
     * 验证是否token值
     * 注意：必须登陆
     * url=> http://127.0.0.1:3000/api/XXXXX?token=?&d=?&username=admin&password=123123
     */
    validate() {
        let { req, res, next } = this.ctx;
        let token = req.query.token;
        let database = req.query.d || "";//数据库
        if (!mongoModel[database] || database == "User") {
            res.json({ code: 201, message: "请输入正确信息" });
            return;
        }

        // 判断token是否正确
        let tokendata;
        try {
            tokendata = jwt.verify(token, secret);
        } catch (err) {
            res.json({ code: 201, message: "请输入正确信息" });
            return;
        }

        // 验证数据库信息
        mongoModel["User"].findOne({ username: tokendata.username }).then((data) => {
            // 密码验证成功 增删改查数据
            if (data && data.password == tokendata.password) {
                next();
            } else {
                res.json({ code: 201, message: "请输入正确信息" });
                return;
            }
        })


    }


    /**
     * 获取接口Api
     * @param {String} token 令牌
     * @param {String} d 数据库名称
     * @param {String} data 参数
     * @param {String} page 页数
     * @param {String} limit 数据量
     * @return {json} 数据
     * url=> http://127.0.0.1:3000/api/getdata?token=?&d=?&data=?&page=?&limit=?
     */
    getdata() {
        let { req, res } = this.ctx;
        let result = {};
        let { token = "", d, page = 0, limit = 10, ...findData } = req.query;//判断条件
        let database = req.query.d || "";//数据库

        mongoModel[database]
            .find(findData) //查询数据条件
            .limit(limit) //获取数据条数
            .skip(page * limit) //游标，获取数据位置
            .sort({ _id: -1 }) // 排序 {key(数据对象):(-1升序,1降序)}
            .then((data) => {
                // 特性：导航数据结构特殊
                result['result'] = database == "Navbar" ? data[0].navbar : data;
                return mongoModel[database].find().countDocuments();//获取数据总条数

            }).then((num) => {
                result["pages"] = Math.ceil(num / limit);//页数
                res.json({ code: 200, message: "注册成功", result });

            }).catch((err) => {
                res.json({ code: 201, message: "请输入正确信息" });
                return;
            })

    }


    /**
     * 添加接口Api
     * @param {String} token 令牌
     * @param {String} d 数据库名称
     * @param {String} data 参数
     * @return {json} 数据
     * url=> http://127.0.0.1:3000/api/setdata?token=?&d=?&data=?
     */
    setdata() {
        let { req, res } = this.ctx;
        let { token, d, ...data } = req.query;
        mongoModel[d].insertMany(data, (err, result) => {
            if (err) {
                res.json({ code: 201, message: "请输入正确信息" })
                return;
            }
            res.json({ code: 200, message: "数据请求成功" })
        })
    }


    /**
     * 删除接口Api
     * @param {String} token 令牌
     * @param {String} d 数据库名称
     * @param {String} data 参数
     * @return {json} 数据
     * url=> http://127.0.0.1:3000/api/deldata?token=?&d=?&data=?
     */
    deldata() {
        let { req, res } = this.ctx;
        let { token, d, ...data } = req.query;
        if (!data) {
            res.json({ code: 201, message: "请输入正确信息" })
            return;
        }
        mongoModel[d].deleteOne(data, (err) => {
            if (err) {
                res.json({ code: 201, message: "请输入正确信息" })
                return;
            }
            res.json({ code: 200, message: "数据请求成功" })
        })
    }


    /**
     * 修改接口Api
     * @param {String} token 令牌
     * @param {String} d 数据库名称
     * @param {String} data 参数
     * @param {String} _id 修改数据
     * @return {json} 数据
     * url=> http://127.0.0.1:3000/api/deldata?token=?&d=?&data=?&_id=?
     */
    editdata() {
        let { req, res } = this.ctx;
        let { token, d, _id, ...data } = req.query;
        if (database == "Navbar") {
            res.json({ code: 201, message: "请输入正确信息" })
            return;
        }
        mongoModel[d].updateOne({ _id }, data, (err, result) => {
            if (err) {
                res.json({ code: 201, message: "请输入正确信息" })
                return;
            }
            res.json({ code: 200, message: "数据请求成功" })
        })
    }


}

module.exports = ApiController;