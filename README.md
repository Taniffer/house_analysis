# house_analysis

## 项目介绍
一个对北京地区租房情况进行可视化分析的web_app(未完成，只完成初版，可进行热力图可视化)

![hotmap](hotmap.png)

[demo地址](120.79.69.149)

## 项目依赖
````
  1. mongoDB
````

## 安装&运行
先安装上述服务，否则无法运行
````
安装:npm install

/house_web:
运行:npm start

/house
运行：node index
(需要根据需求修改index文件)

````



## 后端内容:/house

 
 - [X] 用node+express+mongoDB做出爬虫初版(对链家网房源信息爬取)
 - [x] 代码用async，await重写，美化代码
 - [x] 用aysnc，eventproxy做出流量控制
 - [x] mongoDB存取数据，同时用高德api对所有地址做出解析
 - [x] 使用Koa，对目录树和内容重构，使用es6写法
 - [x] 使用mongoose 对原生MongoDB代码重写
 - [x] 使用jwt实现登录功能
 
 ### api
 - [x] 获取相同地区，房屋数量 密度 等信息
 
 待完成：
 - [ ] 完整的api接口文档
 - [ ] 前端数据更新控制相关接口
 - [ ] 用命令行运行的方式对项目做到自动化操作（数据更新，数据分析，增加数据）
 
 
 

## 前端内容：/house_web

 - [x] 调用高德js api热力图模块，对数据进行热力图可视化
 - [x] 支持房屋数量的可视化
 - [x] 增加登录页面
 
 待完成
 
 - [ ] 支持房屋单价，总价的直观体现
 - [ ] 对数据进行单点处理，能直观的看到各个区域租房详细信息(价位，图片)
 
 
 
 
  



前端项目运行于：[http://localhost:3000](http://localhost:3000)
后端服务器运行于：[http://localhost:8008](http://localhost:8008)

## 技术栈
- 后端 : koa+node
- 前端 :react