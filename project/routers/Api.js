const express = require("express");
const router = express.Router();
const fs = require("fs");

// 实例化函数类
function createObject(classDef) {
    return new classDef();
}

fs.readdir("./controller/Api", function (err, files) {
    if (err) {
        throw Error("找不到控制器");
        return;
    }
    for (let i = 0; i < files.length; i++) {
        const Controller = createObject(require("../controller/Api/" + files[i]));
        let functionName = Controller.RouterFunctionName;
        for (let j = 0; j < functionName.length; j++) {
            switch (functionName[j][0]) {
                case "get":
                    router.get(functionName[j][1], (req, res, next) => {
                        Controller.ctx = { req, res, next };
                        Controller[functionName[j][2]]();
                    })
                    break;
                case "post":
                    router.post(functionName[j][1], (req, res, next) => {
                        Controller.ctx = { req, res, next };
                        Controller[functionName[j][2]]();
                    })
                    break;
                case "use":
                    if (functionName[j][1]) {
                        router.use(functionName[j][1], (err, req, res, next) => {
                            Controller.ctx = { err, req, res, next };
                            Controller[functionName[j][2]]();
                        })
                    } else {
                        router.use((req, res, next) => {
                            Controller.ctx = { req, res, next };
                            Controller[functionName[j][2]]();
                        })
                    }
                    break;
            }
        }
    }
})



module.exports = router;

