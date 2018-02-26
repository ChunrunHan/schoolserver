var mysql = require('mysql');
var connection = mysql.createConnection({
//	host: 'www.rainrain.xin',
	host:'localhost',
	user: 'root',
	password: '7773712',
	database: 'school'
});

connection.connect();
exports.register = function(req, res) {
	console.log(req.body);
	console.log(req.body.mobile);
	var sql = 'SELECT mobile FROM school.user where mobile =' + req.body.mobile;
	console.log(sql);
	//	查询是否已经注册过
	connection.query(sql, function(err, result) {
		console.log(result);
		if(err) {
			res.json(err.message);
			return;
		}

		// 如果用户不存在的话就注册该用户
		// 插入数据
		if(result.length == 0) {
			console.log('插入操作')
			insetUserInfo(req.body.username, req.body.mobile, req.body.password, req.body.role, req.body.avatar, res);
			return;
		} else {
			console.log('已存在')
			var json = {
				errCode: 1,
				errMsg: '手机号已注册',
				dataList: []
			}
			res.json(json);
		}

	});


}

exports.login = function( req, res){
	//	前后台用户登录接口
	console.log(req.params.usermobile);
	console.log(req.params.userpass);
	//	查询用户是否存在
	var sql = 'select * from user where mobile = ' + req.params.usermobile;
	connection.query(sql, function(err, result) {
		if(err) {
			console.log(err.message);
			res.json(err.message);
			return;
		}

		console.log(result);

		if(result.length == 0) {
			var json = {
				errCode: 1,
				errMsg: '用户不存在',
				dataList: []
			}
			res.json(json);
		} else {
			//	用户存在判断 密码是否正确
			console.log('用户存在');
			console.log(result);
			console.log(result[0].password);
			if(req.params.userpass == result[0].password) {

				var json = {
					errCode: 0,
					errMsg: '登录成功',
					dataList: result
				}
				res.json(json);
			} else {
				var json = {
					errCode: 2,
					errMsg: '用户密码错误',
					dataList: []
				}
				res.json(json);
			}

		}
	})
}

exports.search = function(req, res){
	console.log(req.params.page);
	console.log(typeof req.params.size);
	console.log(req.params.size * req.params.page);
	//	查询所有用户
	var totalRecords;
	var sql = 'select * from user limit  ' + req.params.size * req.params.page + ',' + req.params.size;
	var all = 'select count(*) as totalRecords from user';
	connection.query(all, function(err, result) {
		if(err) {
			console.log(err.message);
			res.json(err.message);
			return;
		}
		console.log(result)
		totalRecords = result[0].totalRecords;
		console.log(totalRecords)
		connection.query(sql, function(err, result) {
			if(err) {
				console.log(err.message);
				res.json(err.message);
				return;
			}

			console.log(result);

			if(result.length == 0) {
				var json = {
					errCode: 1,
					errMsg: '没有更多数据了',
					dataList: []
				}
				res.json(json);
			} else {
				var json = {
					errCode: 0,
					errMsg: '获取数据成功',
					totalRecords: totalRecords,
					dataList: result
				}
				res.json(json);

			}
		})
	});
}


exports.searchRole = function(req, res){
	console.log(req.params.page);
	console.log(req.params.userrole);
	console.log(req.params.size * req.params.page);
	//	根据角色查询所有用户
	var totalRecords;
	var sql = 'select * from user where role = '+ req.params.userrole + ' limit ' + req.params.size * req.params.page + ',' + req.params.size;
	var all = 'select count(*) as totalRecords from user where role = '+ req.params.userrole;
	console.log(sql)
	connection.query(all, function(err, result) {
		if(err) {
			console.log(err.message);
			res.json(err.message);
			return;
		}
		console.log(result)
		totalRecords = result[0].totalRecords;
		console.log('查找的用户总数'+totalRecords)
		connection.query(sql, function(err, result) {
			if(err) {
				console.log(err.message);
				res.json(err.message);
				return;
			}

			console.log(result);

			if(result.length == 0) {
				var json = {
					errCode: 1,
					errMsg: '没有更多数据了',
					dataList: []
				}
				res.json(json);
			} else {
				var json = {
					errCode: 0,
					errMsg: '获取数据成功',
					totalRecords: totalRecords,
					dataList: result
				}
				res.json(json);

			}
		})
	});
}


exports.searchName = function(req, res){
	console.log(req.params.page);
	console.log(typeof req.params.size);
	console.log(req.params.size * req.params.page);
	//	根据用户名查询所有用户
	var totalRecords;
	var sql = 'select * from user where username like %'+req.params.username+'% limit '+req.params.size * req.params.page + ',' + req.params.size;
	var all = 'select count(*) as totalRecords from user';
	connection.query(all, function(err, result) {
		if(err) {
			console.log(err.message);
			res.json(err.message);
			return;
		}
		console.log(result)
		totalRecords = result[0].totalRecords;
		console.log(totalRecords)
		connection.query(sql, function(err, result) {
			if(err) {
				console.log(err.message);
				res.json(err.message);
				return;
			}

			console.log(result);

			if(result.length == 0) {
				var json = {
					errCode: 1,
					errMsg: '没有更多数据了',
					dataList: []
				}
				res.json(json);
			} else {
				var json = {
					errCode: 0,
					errMsg: '获取数据成功',
					totalRecords: totalRecords,
					dataList: result
				}
				res.json(json);

			}
		})
	});
}



exports.delete = function (req,res){
	//	后台删除用户接口
	console.log(req.params.id);
	console.log(typeof req.params.id);
	//	删除用户
	var delSql = 'DELETE FROM user where id="' + req.params.id + '"';
	connection.query(delSql, function(err, result) {
		if(err) {
			console.log(err.message);
			res.json(err.message);
			return;
		}
		console.log('DELETE affectedRows', result.affectedRows);
		console.log(result);

		if(result.serverStatus == 2) {
			var json = {
				errCode: 0,
				errMsg: '删除成功'
			}
			res.json(json);
		} else {
			var json = {
				errCode: 1,
				errMsg: '删除失败'
			}
			res.json(json);

		}
	})

}

exports.edit = function(req,res){
	console.log(req.body);
	console.log(req.body.password)
	var mySql;
	var modSqlParams;
	if(req.body.password == null) {
		mySql = "update school.user set username=?,mobile=?,role=? where id='" + req.body.id + "'";
		modSqlParams = [req.body.username, req.body.mobile, req.body.role];
	} else {
		mySql = "update school.user set username=?,mobile=?,password=?,role=? where id='" + req.body.id + "'";
		modSqlParams = [req.body.username, req.body.mobile, req.body.password, req.body.role];
	}

	connection.query(mySql, modSqlParams, function(err, result) {
		if(err) {
			console.log(err.message);
			res.json(err.message);
			return;
		}
		console.log('UPDATE affectedRows', result.affectedRows);
		console.log(result);
		if(result.affectedRows == 1) {
			var json = {
				errCode: 0,
				errMsg: '修改成功'
			}
			res.json(json);
		} else {
			var json = {
				errCode: 1,
				errMsg: '修改失败'
			}
			res.json(json);
		}
	});
}

function insetUserInfo(username, mobile, password, role, avatar,res) {
	var addSql = 'INSERT INTO user(id,username,mobile,password,role,avatar) VALUES(?,?,?,?,?,?)';
	var id = uuid();
	console.log('用户ID ' + id);
	console.log('用户密码：' + password);
	var addSqlParams = [id, username, mobile, password, role, avatar];
	connection.query(addSql, addSqlParams, function(err, result) {
		if(err) {
			var json = {
				errCode: 2,
				errMsg: err.message,
				dataList: []
			}
			console.log(err.message);
			return res.json(json);

		}

		var json = {
			errCode: 0,
			errMsg: '用户注册成功',
			dataList: []
		}

		return res.json(json);
	});

}

function uuid() {
	var lut = [];
	for(var i = 0; i < 256; i++) {
		lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
	}
	var d0 = Math.random() * 0xffffffff | 0;
	var d1 = Math.random() * 0xffffffff | 0;
	var d2 = Math.random() * 0xffffffff | 0;
	var d3 = Math.random() * 0xffffffff | 0;
	return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] +
		lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] +
		lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
		lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}


