var express = require('express');
var cookieParser = require('cookie-parser');
var app = express;
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser());
app.use(cookieParser());
app.use(express.static('.'));

//获取用户
function getUser(){
	return JSON.parse(fs.readFileSync('./user.json'));
}
function getNaire(){
	return JSON.parse(fs.readFileSync('./naire.json'));
}

app.get('/', function(req, res){
	res.sendfile(index.html);
});

//登录
app.post('/signin', (req, res) =>{
	var user = getUser();
	var name = req.body.name;
	var password = req.body.password;
	console.log('新用户登录' + 'name:' + name, 'password:' + password);
	if(user[name]){
		if(user[name] === password){
			res.end('登录成功');
		}else{
			res.end('密码错误');
		}
	}else{
		res.end('账号不存在');
	}
});

//注册
app.post('/signup', (req, res)=>{
	var user = getUser();
	user[req.body.name] = req.body.password;
	//写入新用户
	fs.writeFileSync('./user.json', JSON.stringify(user));
	res.end('注册成功');
});

//检测账号是否存在
app.post('/test', (req, res)=>{
	var user = getUser();
	for (let key in user){
		if(key === req.body.name){
			res.end('账号存在');
			return;
		}
	}
	res.end('ok');
});

//上传新问题
app.post('/new', (req,res)=>{
	var naire = getNaire();
	console.log(`新的问卷：${req.body.title}`);
	naire.naireList.unshift(req.body);
	fs.writeFileSync('./naire.json', JSON.stringify(naire));
	res.end('成功');
});

//删除问题
app.post('/delete', (req,res)=>{
	var naire = getNaire().naireList;
	var index = req.body.index;
	if(typeof index === 'number'){
		naire.splice(index, 1);
		console.log(`删除了第${index}个问卷`);
		fs.writeFileSync('./naire.json', JSON.stringify({naireList:naire}));
		res.end('删除成功');
	}
	if(Object.prototype.toString.call(index) === '[object Array]'){
		index.forEach(inx=>{
			console.log(`删除了第${inx}个问卷`);
			naire.splice(inx,1,'temp');
		});
		naire = naire.filter(niare=>{
			return naire !== 'temp';
		});
		fs.writeFileSync('./naire.json', JSON.stringify({naireList:naire}));
		res.end('删除成功');
	}
});

//更新问题
app.post('/update',(req,res)=>{
	var naire = getNaire();
	var naireList = naire.naireList;
	var index = req.body.index;
	naireList[index] = req.body.naire;
	fs.writeFileSync('./naire.json', JSON.stringify(naire));
	res.end('更新成功');
})