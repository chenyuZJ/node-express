const express = require("express");
const router = express.Router();
const fs = require("fs");

// 实例化函数类
function createObject(classDef){
    return new classDef();
}

fs.readdir("./controller/Admin",function(err,files){
    if(err){
        throw Error("找不到控制器");
        return;
    }
    // 遍历文件名称
    for(let i = 0; i < files.length;i++){
        const Controller = createObject(require("../controller/Admin/" + files[i]));
        // 读取函数名称
        let functionName = Controller.RouterFunctionName;
        // 遍历功能里面路由
        for(let j = 0; j < functionName.length; j++){
            switch(functionName[j][0]){
                case "get":
                    router.get(functionName[j][1],(req,res,next)=>{
                        // 类中this指向问题？
                        // 让指向对象，不指向路由，指向类对象
                        Controller.ctx = {req,res,next};
                        Controller[functionName[j][2]]();
                        // 1.模仿其他框架
                        // 2.为了函数中不用传参，每次写对象
                        // 3.传参多导致内存不足
                    })
                    break;
                case "post":
                    router.post(functionName[j][1],(req,res,next)=>{
                        Controller.ctx = {req,res,next};
                        Controller[functionName[j][2]]();
                    })
                    break;
                case "use":
                    if(functionName[j][1]){
                        router.use(functionName[j][1],(err,req,res,next)=>{
                            Controller.ctx = {err,req,res,next};
                            Controller[functionName[j][2]]();
                        })
                    }else{
                        router.use((req,res,next)=>{
                            Controller.ctx = {req,res,next};
                            Controller[functionName[j][2]]();
                        })
                    }
                    break;
            }
        }
    }
})


// // 处理报错路由
// // 路由 /admin/goods  /admin/category  /admin/goods/add
// // 拼接路径 /admin/*
// router.use("/*",(req,res)=>{
//     console.log("报错了，清查看原因....");
//     res.send("报错");
// })



// fs.readdir("./controller/Admin",function(err,files){
//     if(err){
//         throw Error("找不到控制器");
//         return;
//     }
//     // 遍历文件名称
//     for(let i = 0; i < files.length;i++){
//         const Controller = createObject(require("../controller/Admin/" + files[i]));
//         // 读取函数名称
//         let functionName = Controller.RouterFunctionName;
//         // 遍历功能里面路由
//         for(var j = 0; j < functionName.length; j++){
//             switch(functionName[j][0]){
//                 case "get":
//                     router.get(functionName[j][1],Controller[functionName[j][2]])
//                     break;
//                 case "post":
//                     router.post(functionName[j][1],Controller[functionName[j][2]])
//                     break;
//                 case "use":
//                     if(functionName[j][1]){
//                         router.use(functionName[j][1],Controller[functionName[j][2]])
//                     }else{
//                         router.use(Controller[functionName[j][2]])
//                     }
//                     break;
//             }
//         }
//     }
// })

// const adminController = createObject(require("../controller/Admin/adminController"));
// const goodsController = createObject(require("../controller/Admin/goodsController"));
// const navbarController = createObject(require("../controller/Admin/navbarController"));

// router.get('/',adminController.index);

// router.get('/goods',goodsController.index)
// router.get('/goods/add',goodsController.add)
// router.get('/goods/del',goodsController.del)
// router.get('/goods/edit',goodsController.edit)

// router.get('/navbar',navbarController.index)
// router.get('/navbar/add',navbarController.add)
// router.get('/navbar/del',navbarController.del)
// router.get('/navbar/edit',navbarController.edit)


module.exports = router;

