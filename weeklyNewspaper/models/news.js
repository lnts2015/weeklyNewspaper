var mongodb = require("./db"),
    objectId = require('mongodb').ObjectID;

function News(userId,newsContent){
    this.userId = userId;
    this.newsContent = newsContent;

}

module.exports = News;
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

//存储我的工作相关信息
News.prototype.save = function(callback) {

    //要存入数据库的文档
    var post = {
        userId: this.userId,
        newsContent:this.newsContent,
        createTime: time.second,
        updateTime : '',
        showDay : ''
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 myWork 集合
        db.collection('news', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将文档插入 myWork 集合
            collection.insert(post, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

//读取我的工作的相关信息
News.get = function(userId, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('news', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (userId) {
                query.userId = userId;
            }
            //根据 query 对象查询文章
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);//失败！返回 err
                    }
                    callback(null, docs);//成功！以数组形式返回查询的结果
                });
        });
    });
};

News.update = function(userId, newsUpdatePost, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 myWork 集合
        db.collection('news', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新我的工作
            collection.update({
                "userId": userId
            }, {
                $set: {newsContent: newsUpdatePost, updateTime:time.second,showDay:time.day}
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};