# Node 项目

## 1.项目描述
    后台模块主要有三大模块。三大模块分别为：后台模块(Admin),前台模块(Main),接口模块(API)。使用后台开发思想MVC结构，前端框架MVVM开发思想。进行传统开发方式开发后台模块。使用前后台分离开发方式开发前端网站。

    MVC架构，框架是大智慧，用来对软件设计进行分工；设计模式是小技巧，对具体问题提出解决方案，以提高代码复用率，降低耦合度

## 2.安装包命令

```shell
$npm install //安装package.json所有包

$cnpm i express ejs mongoose express-session body-parser -S 
$cnpm i formidable silly-datetime -S

$cnpm install -g nodemon //自动重启服务器
```

## 3.文件夹与文件介绍

    controller   控制器
    models       模型
    views        视图
        -admin   后台模板
        -main    前台模板
    function     公共方法模块
    routers      路由
    uploads      文件存放(图片,文件,视频,音频)
    public       公共文件
        -js/css/img/icon
    node_modules 依赖包
    dist         vue.js项目目录
    package.json 项目配置
    app.js       入口文件

## 4.后台模块

    1.Admin 后台
    2.Index(Main) 前台
    3.Api   接口

## 5.项目运行

```
    $node app.js //运行项目
    $nodemon app.js //服务器热加载
```

## 6.数据库运行
```
$mongod --dbpath c:/data/db1970  //数据库
$mongo  //连接控制台
```