//模块依赖
var express = require('express');
var app = express();
var cors = require('cors'); //	解决跨域
var bodyParser = require('body-parser');
var sts = require('./sts');
var user = require('./user');
var phone = require('./phone');
var collegeSale = require('./collegeSale');
//环境变量
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: false
}));
// for parsing application/x-www-form-urlencoded
// 创建 applicati;on/x-www-form-urlencoded 编码解析


//-----------------------oss公用部分--------------------------------------------
// oss图片上传获取sts接口
app.get('/school/sts', sts.getSTS)
//	图片删除
app.get('/school/delOssImg/:filename', sts.delOssImg);


//-----------------------用户接口------------------------------------------------
//	用户注册接口
app.post('/school/user/register',user.register);
//	用户登录
app.get('/school/user/login/:usermobile/:userpass', user.login);
//	查看所有用户
app.get('/school/user/search/:page/:size', user.search);
//	根据用户角色查询用户
app.get('/school/user/search/role/:userrole/:page/:size', user.searchRole);
//	根据用户名查询用户
app.get('/school/user/search/name/:username/:page/:size', user.searchName);
//	删除用户
app.delete('/school/user/delete/:id', user.delete);
//	编辑用户
app.put('/school/user/edit', user.edit);


//----------------------电话接口------------------------------------------------
//	新增电话
app.post('/school/phone/add', phone.add);
//	获取电话
app.get('/school/phone/search/:page/:size', phone.search);
//  删除电话
app.delete('/school/phone/delete/:id', phone.delete);
//	编辑电话
app.put('/school/phone/edit', phone.edit);

//-------------------------------校园特卖---------------------------------------
// 发表动态
app.post('/school/campusSale/add', campusSale.add);
// 获取动态
app.get('/school/campusSale/search/:page/:size', campusSale.search);
// 删除动态
app.delete('/school/campusSale/delete/:id', campusSale.delete);
// // 发表评论
// app.post('/school/campusSale/user/feed/comment',campusSale.feed);
// // 删除评论
// app.delete('/school/campusSale/user/feed/comment/:commentId/delete',campusSale.delFeed);
// 点赞
app.get('/school/campusSale/user/feed/:id/like',campusSale.likeFeed);
// 取消赞
app.get('/school/campusSale/user/feed/:id/cancelLike',campusSale.cancelLike);




//	服务器监听端口
var server = app.listen(12345, function() {
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
