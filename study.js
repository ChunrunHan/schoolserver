var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'www.rainrain.xin',
//  host: 'localhost',
	user: 'root',
	password: '7773712',
	database: 'school'
});

connection.connect();
/**
 * 发表活动
 * @param {Object} req
 * @param {Object} res
 */
exports.add = function(req, res) {
	console.log(req.body);
	insertStudy(req.body.userId, req.body.title, req.body.content, req.body.image, res);
}

//获取所有学习交流
exports.search = function(req, res){
	console.log(req.params.page);
	console.log(typeof req.params.size);
	console.log(req.params.size * req.params.page);
	var totalRecords;
//	var sql = 'select * from sale limit  ' + req.params.size * req.params.page + ',' + req.params.size;
	var sql = 'select study.*, user.avatar,user.username from study left join user on study.userId = user.id order by study.createTime desc limit  ' + req.params.size * req.params.page + ',' + req.params.size;
	var all = 'select count(*) as totalRecords from study';
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
// 删除学习交流
exports.delete = function (req,res){
	console.log(req.params.id);
	console.log(typeof req.params.id);
	//	删除动态
	var delSql = 'DELETE FROM study where id="' + req.params.id + '"';
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

//	新建学习交流
function insertStudy(userId, title, content, image, res) {
	var addSql = 'INSERT INTO school.study(userId, title, content, image) VALUES(?,?,?,?)';
	var addSqlParams = [userId, title, content, image];
	console.log("上传的数据："+addSqlParams)
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
			errMsg: '发表成功',
			dataList: []
		}

		return res.json(json);
	});

}



