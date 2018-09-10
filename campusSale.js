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
 * 发表动态
 * @param {Object} req
 * @param {Object} res
 */
exports.add = function(req, res) {
	console.log(req.body);
	console.log(req.body.mobile);
	insertCampusSale(req.body.userId, req.body.content, req.body.image, res);


}

exports.search = function(req, res){
	console.log(req.params.page);
	console.log(typeof req.params.size);
	console.log(req.params.size * req.params.page);
	//	查询所有动态列表
	var totalRecords;
//	var sql = 'select * from sale limit  ' + req.params.size * req.params.page + ',' + req.params.size;
	var sql = 'select sale.*, user.avatar,user.username from sale left join user on sale.userId = user.id order by sale.createTime desc limit  ' + req.params.size * req.params.page + ',' + req.params.size;
	var all = 'select count(*) as totalRecords from sale';
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
// 删除校园特卖动态
exports.delete = function (req,res){
	console.log(req.params.id);
	console.log(typeof req.params.id);
	//	删除动态
	var delSql = 'DELETE FROM sale where id="' + req.params.id + '"';
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

//	校园特卖信息插入到数据库
function insertCampusSale(userId, content, image, res) {
	var addSql = 'INSERT INTO sale(id,userId, content, image) VALUES(?,?,?,?)';
	var id = uuid();
	var addSqlParams = [id,userId, content, image];
	console.log(addSqlParams)
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


