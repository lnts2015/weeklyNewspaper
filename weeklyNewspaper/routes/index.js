var crypto = require('crypto'),
    User = require('../models/user.js'),
    post = require('../models/mywork.js'),
    news = require('../models/news.js');

var S = require('string');
/*
 * GET home page.
 */

module.exports = function(app) {

    //首页
    app.get('/', function (req, res) {
        res.render('index', {
            title: 'index',
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        });

        //res.redirect('/login');
    });

    // 注册
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: 'reg',
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()

        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name;
        var password = req.body.password;
        var password_re = req.body['password-repeat'];
        var team = req.body['team_type'];

        //用户名不能为空或者太长
        if(name.length == 0 || name.length > 50){
            req.flash('error', '填写正确的用户名！');
            return res.redirect('/reg');
        }

        //判读是否选择了工作组
        if(team == 0){
            req.flash('error', '请选择您的工作组！！');
            return res.redirect('/reg');
        }

        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');//返回注册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            realCode : req.body.password,
            team : req.body['team_type'],
            teamName : req.body['team_type_name']
        });
        //检查用户名是否已经存在
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');//返回注册页
            }
            //如果不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');//注册失败返回主册页
                }
                req.session.user = user;//用户信息存入 session
                //req.flash('success', '注册成功!');
                res.redirect('/myWork');//注册成功后返回主页
            });
        });
    });

    //登录
    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'login',
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        });
    });
    app.post('/login', function (req, res) {
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('hex');

        var ss = S(req.body.name).isEmpty();


        if(S(req.body.name).isEmpty()){
            req.flash('error', '用户名不能为空!');
            return res.redirect('/login');
        }

        User.get(req.body.name, function(err, user){
            if(!user){
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            //req.flash('success', '登录成功!');
            res.redirect('/myWork');
        });
    });

    //我的工作
    app.get('/myWork', function (req, res) {
        post.get(req.session.user._id, function (err, posts) {
            if (err) {
                posts = [];
            }
            res.render('myWork', {
                title: 'myWork',
                user : req.session.user,
                myWorkContent : posts,
                success : req.flash('success').toString(),
                error : req.flash('error').toString()
            });
        });
    });

    app.post('/myWork', function (req, res) {
        var currentUser = req.session.user;
        var myWorkPost = new post(currentUser.team, req.body['myWorkPost'],currentUser._id);
        myWorkPost.save(function (err) {
            if (err) {
                req.flash('error', err + "my work post err");
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/myWork');//发表成功跳转到主页
        });
    });

    //编辑我的工作
    app.get('/edit/:userId',function(req,res){
        post.get(req.session.user._id, function (err, posts) {
            if (err) {
                posts = [];
            }
            res.render('edit', {
                title: 'edit',
                user : req.session.user,
                myWorkContent : posts,
                success : req.flash('success').toString(),
                error : req.flash('error').toString()
            });
        });

    });

    app.post('/edit/:userId',function(req,res){
        var currentUser = req.session.user;
        post.update(currentUser._id, req.body['myWorkPostUpdate'], function (err) {
            var url = '/edit/' + currentUser._id;
            if (err) {
                req.flash('error', err);
                return res.redirect(url);//出错！返回文章页
            }
            req.flash('success', '修改成功!');
            res.redirect(url);//成功！返回文章页
        });



    });

    //我的周报
    app.get('/news', function (req, res) {
        news.get(req.session.user._id,function(err,newsContent){
            if (err) {
                newsContent = [];
            }
            res.render('news', {
                title: 'news',
                user : req.session.user,
                success : req.flash('success').toString(),
                newsContents : newsContent,
                error : req.flash('error').toString()
            });
        });

    });

    app.post('/news', function (req, res) {
        var currentUser = req.session.user;
        var newsContent = req.body['newsContent'];
        var content = new news(currentUser._id,newsContent.trim());
        content.save(function(err){
            if(err){
                return res.redirect('/');
            }
            req.flash('success', '周报发布成功!');
            res.redirect('/news');//发表成功跳转到主页

        });
    });

    //编辑周报
    app.post('/newsEditContent',function(req,res){
        var updateContent = req.body['newsEditContent'];
        if(updateContent == ''){
            req.flash('error', '内容不能为空!');
            res.redirect('/news');//发表成功跳转到主页
        }
        news.update(req.session.user._id,updateContent.trim(),function(err){
            if(err){
                return res.redirect('/');
            }
            req.flash('success', '周报修改成功!');
            req.session.newsContents = updateContent;
            res.redirect('/news');//发表成功跳转到主页
        });
    });

    //工作组
    app.get('/team', function (req, res) {
        res.render('team', {
            title: 'team',
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        });
    });
    app.post('/team', function (req, res) {




    });

    //修改个人信息
    app.get('/userinfo/:name', function (req, res) {
        res.render('userinfo', {
            title: 'userinfo',
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
        });
    });
    app.post('/userinfo/:name', function (req, res) {
        var updateName = req.body['updateName'];
        var url = '/userinfo/' + req.session.user.name;
        if(updateName == ''){
            req.flash('error','新用户名不能为空！');
            return res.redirect(url);
        }
        User.get(updateName, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!,请重新填写。');
                return res.redirect(url);
            }

            User.updateName(req.session.user.name, updateName,function(err){
                if (err) {
                    req.flash('error', err);
                    return res.redirect(url);
                }
                req.flash('success', '修改成功!');
                req.session.user.name = req.body['updateName'];
                res.redirect(url);
            });
        });
    });

    //updatePwd
    app.post('/updatePwd', function (req, res) {
        var pwd = req.session.user.password;
        var oldPwd = req.body['oldPwd'];
        var newPwd = req.body['newPwd'];
        var url = '/userinfo/' + req.session.user.name;
        var md5 = crypto.createHash('md5');
        var password = md5.update(newPwd).digest('hex');
        if(oldPwd == '' || newPwd == ''){
            req.flash('error', "请填写密码！");
            return res.redirect(url);
        }
        if(pwd != password){
            req.flash('error', "原始密码错误！");
            return res.redirect(url);
        }

        User.updatePwd(req.session.user.name,password,newPwd,function(err){
            if (err) {
                req.flash('error', err);
                return res.redirect(url);
            }
            req.flash('success', '修改成功!');
            res.redirect(url);
        });
    });

    //updateTeam
    app.post('/updateTeam', function(req,res){
        var team = req.body['team_type'];
        var teamName = req.body['team_type_name'];
        var url = '/userinfo/' + req.session.user.name;
        if(team == 0){
            req.flash('error', '请选择你的工作组！');
            return res.redirect(url);
        }
        User.updateTeam(req.session.user._id,teamName,team,function(err){
            if (err) {
                req.flash('error', err);
                return res.redirect(url);
            }
            req.session.user.teamName = teamName;
            req.flash('success', '修改成功!');
            res.redirect(url);

        });

    });


    //登出
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.session.myWorkContent = null;
        //req.flash('success', '登出成功!');
        res.redirect('/');
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }
};
