var mongodb = require('./db'),
    objectId = require('mongodb').ObjectID;

function User(user){
    this.name = user.name; // 用户名
    this.password = user.password; // md5 密码
    this.realCode = user.realCode; // 明文 密码
    this.team = user.team; //工作组类型
    this.teamName = user.teamName; // 工作组名称

}


module.exports = User;
var date = new Date();
//存储各种时间格式，方便以后扩展
var time = {
    date: date,
    year : date.getFullYear(),
    month : date.getFullYear() + "-" + (date.getMonth() + 1),
    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
    second : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds())
}

User.prototype.save = function(callback){


    //要存入数据库的用户文档
    var user = {
        name : this.name,
        password : this.password,
        realCode : this.realCode,
        team : this.team,
        teamName : this.teamName,
        createTime : time.second,
        updateTime : ''
    };

    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err + "db open err");
        }

        //读取 users 集合
        db.collection('users', function(err,collection){
            if(err){
                mongodb.close();
                return callback(err + "db collection err");
            }

            //将用户数据插入 users 集合
            collection.insert(user,{
                safe : true
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err + "db insert err");
                }
                 callback(null, user[0]);
            });
        });
    });
};

//读取用户信息
User.get = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};

//修改姓名
User.updateName = function(_name,name,callback){
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新我的工作
            collection.update({
                "name": _name
            }, {
                $set: {name: name,updateTime:time.second}
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}

//修改密码
User.updatePwd = function(name,md5pwd,pwd,callback){
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新我的密码
            collection.update({
                "name": name
            }, {
                $set: {password: md5pwd, realCode:pwd, updateTime:time.second}
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}

//修改工作组
User.updateTeam = function(userId, teamName,team, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.update({"_id" : objectId(userId)},{
                $set:{teamName:teamName, team:team,updateTime: time.second}
            },function(err){
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}