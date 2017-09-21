# 项目前端开发
 
### 1 使用框架介绍

##### 1) 项目前端（下称项目）是一个以 [*AngularJS(v1.4 链接可能需要翻墙浏览)*](https://code.angularjs.org/1.4.14/docs/api) 为MVVM框架的单页面应用，并以 **angular-ui-router** 作为前端路由管理库。

##### 2) 项目中使用了时下最流行的CSS框架--[*bootstrap(v3.5)*](http://v3.bootcss.com/),在其中添加了大量的自定义样式。为了避免直接编辑css的繁琐工作，项目以**SASS(SCSS)**作为前端css预编译语言。

##### 3) 项目中使用了基于流形式的前端自动化管理工具--[*Gulp.js(v3.9.1)*](https://github.com/gulpjs/gulp)，在整个项目中，gulp在整个项目中一方面负责对业务逻辑js文件进行合并压缩，一方面将SCSS文件编译为css后合并压缩，同时负责整个项目的热更新，即不需要浏览器作刷新操作，gulp如果监听到你的代码发生变动即会修改浏览器中相关的显示效果。

### 2 如何开始

##### 1）要求系统中安装有[**Node环境**](https://nodejs.org/en/download/)，作为前端自动化管理工具运行环境并提供相关的包管理操作。

##### 2）打开命令行工具，Linux和Mac下直接打开Terminal，Windows系统则建议安装**GitBash**([下载地址](https://github.com/git-for-windows/git/releases/download/v2.10.2.windows.1/Git-2.10.2-64-bit.exe))命令行增强工具后执行。

##### 3）全局安装Gulp.js 
       npm install -g gulp    
       
##### 4) 进入项目中 **package.json** 统计目录，执行 **npm install** 安装项目必要的npm包
       
##### 5）等到所有npm包加载完毕之后，会发现项目中 **package.json** 同级多了一个 **node_modules** 目录，此时输入命令**gulp** 开始前端开发
       gulp
       
### 3 目录结构
       
##### 1) lib 目录

* **js-sha1**： A simple SHA1 hash function for JavaScript supports UTF-8 encoding. [Github源码](https://github.com/emn178/js-sha1)
* **spark-md5**： Lightning fast normal and incremental md5 for javascript. [Github源码](https://github.com/satazor/js-spark-md5)
* **lrsjng.jquery-qrcode**: generate QR codes dynamically.  [官网介绍](https://larsjung.de/jquery-qrcode/)  
* **xpage.js**: 自己使用和编写的js库 

##### 2) views 目录

* **home**： home目录将包括HXUI官网页面，分为首页，文档（主要为样式介绍和插件介绍），下载页面和关于页面
* **admin**： pc_quick_starter项目核心模块--HXUI-admin， 一个可供项目快速套用的管理后台（前端），用于存放结合[angularJS（v1.4）](https://code.angularjs.org/1.4.14/docs/api)并且有进行有效排版的页面，如*列表展示页面*和**表单详情页面**


       
       
       