var STS = require('ali-oss').STS;
var co = require('co');
var OSS = require('ali-oss')
var fs = require('fs');
var crypto = require('crypto');
var CryptoJS = require('crypto-js');

//	图片上传获取sts
exports.getSTS = function(req, res) {
	var conf = JSON.parse(fs.readFileSync('./config.json'));
	var policy;
	if(conf.PolicyFile) {
		policy = fs.readFileSync(conf.PolicyFile).toString('utf-8');
		policy64 = fs.readFileSync(conf.PolicyFile).toString('base64');
		console.log('policy64' + policy64);
	}

	var client = new STS({
		accessKeyId: conf.AccessKeyId,
		accessKeySecret: conf.AccessKeySecret,
	});

	co(function*() {
		var result = yield client.assumeRole(conf.RoleArn, policy, conf.TokenExpireTime);
		console.log('结果');
		console.log(result)

		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-METHOD', 'GET');

		var signature = crypto.createHmac('sha1', result.credentials.AccessKeySecret);
		signature = signature.update(new Buffer('POST' + '\n' + '\n' + '\n' + new Date().toGMTString() + '\nx-oss-security-token:' + result.credentials.SecurityToken + '\n/zaoyuan/', 'utf8')).digest('base64');
//		console.log('POST\n\n\n' + new Date().toGMTString() + '\nx-oss-security-token:' + result.credentials.SecurityToken + '\n/zaoyuan/');
//		console.log(new Date().toGMTString());
//		console.log(signature);

		res.json({
			StatusCode: result.res.statusCode,
			host: 'http://zaoyuan.oss-cn-qingdao.aliyuncs.com',
			//    policy:policy64,
			//    signature:signature,
			AccessKeyId: result.credentials.AccessKeyId,
			AccessKeySecret: result.credentials.AccessKeySecret,
			SecurityToken: result.credentials.SecurityToken,
			Expiration: result.credentials.Expiration
		});
	}).then(function() {
		// pass
	}).catch(function(err) {
		console.log(err);
		res.status(400).json(err.message);
	});

}

//	oss 删除图片
exports.delOssImg = function(req, res){
	console.log('删除的图片'+req.params.filename);
	var filename = req.params.filename;
	var conf = JSON.parse(fs.readFileSync('./config.json'));
	var client = new OSS({
	  region: 'oss-cn-qingdao',
	  accessKeyId: conf.AccessKeyId,
	  accessKeySecret: conf.AccessKeySecret,
	  bucket: 'zaoyuan'
	});
	
	co(function* () {
	 console.log(req.params.filename)
	  var result = yield client.delete(filename);
	  console.log(result);
	  res.json(result)
	}).catch(function (err) {
	  console.log(err);
	});
}
