//模块依赖
var express = require('express');
var app = express();
var cors = require('cors'); //	解决跨域
var bodyParser = require('body-parser');
var sts = require('./sts');
var user = require('./user');
var phone = require('./phone');
//环境变量
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: false
}));
// for parsing application/x-www-form-urlencoded
// 创建 applicati;on/x-www-form-urlencoded 编码解析

//	连接本地mysql数据库
// var mysql = require('mysql');
// var connection = mysql.createConnection({
// 	host: 'www.rainrain.xin',
// 	user: 'root',
// 	password: '7773712',
// 	database: 'school'
// });
// connection.connect();

// oss图片上传获取sts接口
app.get('/school/sts', sts.getSTS)
//	用户注册接口
app.post('/school/user/register',user.register);
//	用户登录
app.get('/school/user/login/:usermobile/:userpass', user.login);
//	查看所有用户
app.get('/school/user/search/:page/:size', user.search);
//	删除用户
app.delete('/school/user/delete/:id', user.delete);
//	编辑用户
app.put('/school/user/edit', user.edit);
//	图片上传
app.post('/school/imgUpdate', function(req, res) {
	console.log(req.body);
});

//	新增电话
app.post('/school/phone/add', phone.add);
//	获取电话
app.get('/school/phone/search/:page/:size', phone.search);
//  删除电话
app.delete('/school/phone/delete/:id', phone.delete);
//	编辑电话
app.put('/school/phone/edit', phone.edit);


//	服务器监听端口
var server = app.listen(12345, function() {
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
