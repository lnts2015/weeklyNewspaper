/**
 * $17 定义及基本功能
 */
(function(That){
    "use strict";

    var version = "3.1.0";

    //元素选择器，只用于屏蔽
    function $17(element){
        if(arguments.length > 1){
            for(var i = 0, elements = [], length = arguments.length; i < length; i++){
                elements.push($17(arguments[i]));
            }
            return elements;
        }

        if(Object.prototype.toString.call(element) == "[object String]"){
            element = document.getElementById(element);
        }
        return element;
    }

    //用于扩展当前对象
    //第一个参数：要扩展的对象，第二个参数：参考的属性
    function extend(child, parent){
        var key;
        for(key in parent){
            if(parent.hasOwnProperty(key)){
                child[key] = parent[key];
            }
        }
    }

    //扩展原型对象
    //第一个参数：要扩展的原型对象，第二个参数：参考的属性
    function include(child, parent){
        var key;
        for(key in parent){
            if(parent.hasOwnProperty(key)){
                child.prototype[key] = parent[key];
            }
        }
    }

    extend(That, {
        $17 : $17
    });

    extend(That.$17, {
        version : version,
        extend  : extend,
        include : include
    });
}(window));

/**
 * 小工具
 */
(function($17){
    "use strict";

    //生成命名空间
    //第一个参数：检查对象是否存在，不存在就初始化成 Object 对象
    //第二个参数[可选]：检查对象是否存在，不存在就用第二个参数初始化第一个对象值
    function namespace(){
        var space = arguments[0];
        var str = "window.";
        space = space.split(".");
        for(var i = 0, len = space.length; i < len; i++){
            str += space[i];

            if(i == len-1 && arguments.length == 2){
                eval("if(!" + str + "){ " + str + " = '" + arguments[1] + "';}");
            }else{
                eval("if(!" + str + "){ " + str + " = {};}");
            }

            str += ".";
        }
        return true;
    }

    //代理函数
    function proxy(fun){
        var self = this;
        return (function(){
            return fun.apply(self, arguments);
        });
    }

    //辅助生成 GUID 编号
    function guid(format){
        return format.toLowerCase().replace(/[xy]/g, function(c){
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        }).toUpperCase();
    }

    //获得地址栏参数
    function getQuery(item){
        var svalue = location.search.match(new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
        return svalue ? decodeURIComponent(svalue[1]) : '';
    }

    //获得 Hash 参数
    function getHashQuery(item){
        var svalue = location.hash.match(new RegExp('[\#\&]' + item + '=([^\&]*)(\&?)', 'i'));
        return svalue ? decodeURIComponent(svalue[1]) : '';
    }

    //替换所有符合要求的字符串
    //第一个参数：需要检查的字符串
    //第二个参数：需要替换的字符串
    //第三个参数：用于替换的字符串
    function replaceAll(target, str1, str2){
        return target.replace(new RegExp(str1,"gm"), str2);
    }

    //补位函数
    //第一个参数：需要补位的字符串
    //第二个参数：用于补位的字符串
    //第三个参数：补位后字符串长度
    //第四个参数[可选]：补位位置
    function strPad(str, padStr, padLength, position){
        var i = 0;
        var s = "";

        while(i != padLength){
            s += padStr.toString();
            i++;
        }

        position = position || "l";

        str = position == "l" ? s.concat(str) : str.concat(s);
        return position == "l" ? str.substring(str.length - padLength, str.length) : str.substring(0, padLength);
    }

    //MVC － Model & Controller 没有 view 部分
    function Model(param){
        var key;
        for (key in param) {
            if (param.hasOwnProperty(key)) {
                this[key] = param[key];
            }
        }
        return this;
    }

    $17.extend($17, {
        proxy        : proxy,
        namespace    : namespace,
        guid         : guid,
        getQuery     : getQuery,
        getHashQuery : getHashQuery,
        replaceAll   : replaceAll,
        strPad       : strPad,
        Model        : function(param){
            var obj = new Model(param);
            $17.extend(obj, {
                extend: Model
            });
            return obj;
        }
    });
}($17));

/**
 * 验证函数
 */
(function($17){
    "use strict";

    //验证是否数字
    function isNumber(value){
        var reg = /^[0-9]+$/;
        if($17.isBlank(value) || !reg.test(value)){
            return false;
        }
        return true;
    }

    //验证是否未定义或null或空字符串
    function isBlank(str){
        return str == 'undefined' || String(str) == 'null' || $.trim( str ) == '';
    }

    //验证是否邮政编码
    function isZipCode(value){
        var req = /^[0-9]{6}$/;
        if($17.isBlank(value) || !req.test(value)){
            return false;
        }
        return true;
    }

    //验证是否中文字符
    function isCnString(value){
        if(!value) return false;
        var req = /^[\u4e00-\u9fa5]+$/;
        value = value.replace(/\s+/g, "");
        return req.test(value);
    }

    //验证是否手机号
    function isMobile(value){
        value = value + "";
        //严格判定
        var _reg = /^0{0,1}(13[4-9]|15[7-9]|15[0-2]|18[7-8])[0-9]{8}$/;
        //简单判定
        var reg = /^1[0-9]{10}$/;
        if( ! value || value.length != 11 || !reg.test(value)){
            return false;
        }
        return true;
    }

    //验证是否邮箱
    function isEmail(value){
        var req = /^[-_.A-Za-z0-9]+@[-_.A-Za-z0-9]+(\.[-_.A-Za-z0-9]+)+$/;
        return value && req.test(value);
    }

    $17.extend($17, {
        isNumber		: isNumber,
        isBlank         : isBlank,
        isZipCode       : isZipCode,
        isCnString      : isCnString,
        isMobile        : isMobile,
        isEmail         : isEmail
    });
}($17));

/**
 * 日期相关方法
 */
(function($17){
    "use strict";

    var formats = {
        s: function(date){
            return $17.strPad(date.getSeconds(), "0", 2);
        },

        m: function(date){
            return $17.strPad(date.getMinutes(), "0", 2);
        },

        h: function(date){
            return $17.strPad(date.getHours(), "0", 2);
        },

        d: function(date){
            return $17.strPad(date.getDate(), "0", 2);
        },

        M: function(date){
            return $17.strPad(date.getMonth() + 1, "0", 2);
        },

        y: function(date){
            return $17.strPad(date.getYear()%100, "0", 2);
        },

        Y: function(date){
            return date.getFullYear();
        },

        w: function(date){
            return date.getDay();
        },

        W: function(date){
            var _week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            return _week[date.getDay()];
        }
    };

    function _strftime(_format, diff, type, _date_){
        var _date = _date_ == null ? new Date() : _date_;
        switch(type){
            case "y":
                _date.setFullYear(_date.getFullYear() + diff);
                break;
            case "M":
                _date.setMonth(_date.getMonth() + diff);
                break;
            case "D":
            case "d":
                _date.setDate(_date.getDate() + diff);
                break;
            case "H":
            case "h":
                _date.setHours(_date.getHours() + diff);
                break;
            case "m":
                _date.setMinutes(_date.getMinutes() + diff);
                break;
            case "S":
            case "s":
                _date.setSeconds(_date.getSeconds() + diff);
                break;
            case "W":
            case "w":
                _date.setDate(_date.getDate() + diff * 7);
                break;
        }

        return (_format + "").replace(/%([a-zA-Z])/g, function(m, f){
            var formatter = formats && formats[f];

            switch(typeof formatter){
                case "function":
                    return formatter.call(formats, _date);
                case "string":
                    return _strftime(formatter, date);
            }

            return f;
        });
    }

    //无参数：返回 "%Y-%M-%d" 格式的当前日期时间
    //一个参数：指定格式的当前日期时间
    //二个参数：
    //   第一个参数：返回日期时间格式
    //   第二个参数：与当天的所差天数
    //三个参数：
    //   第一个参数：返回日期时间格式
    //   第二个参数：第三个参数指定的单位所差值
    //   第三个参数：制定第二个参数的单位 w d h m s
    //四个参数：
    //   第一个参数：返回日期时间格式
    //   第二个参数：第三个参数指定的单位所差值
    //   第三个参数：指定第二个参数的单位 w d h m s
    //   第四个参数：指定要返回的日期
    function dateUtils(){
        switch(arguments.length){
            case 0:
                return _strftime("%Y-%M-%d", 0, "d", null);
            case 1:
                return _strftime(arguments[0], 0, "d", null);
            case 2:
                return _strftime(arguments[0], arguments[1], "d", null);
            case 3:
                return _strftime(arguments[0], arguments[1], arguments[2], null);
            case 4:
                return _strftime(arguments[0], arguments[1], arguments[2], arguments[3]);
            default:
                return _strftime("%Y-%M-%d");
        }
    }

    //时间对比函数
    //第一个参数：开始时间
    //第二个参数：结束时间
    //第三个参数：要得到差异的单位
    //第四个参数[可选。第三个为timer时]：返回的计时格式
    //第五个参数[可选。第四个参数包括日期属性时]：日期格式化长度
    function dateDiff(start, end, type, format, dayLength){
        var startDate   = $17.strPad(start, "0", 20, "r");
        var endDate     = $17.strPad(end, "0", 20, "r");
        var diff        = null;

        startDate 	= new Date(startDate.substring(0, 4), startDate.substring(5, 7), startDate.substring(8, 10), startDate.substring(11, 13), startDate.substring(14, 16), startDate.substring(17, 19));
        endDate		= new Date(endDate.substring(0, 4), endDate.substring(5, 7), endDate.substring(8, 10), endDate.substring(11, 13), endDate.substring(14, 16), endDate.substring(17, 19));
        diff		= Date.parse(endDate) - Date.parse(startDate);
        format      = format || "%d %h:%m:%s";
        dayLength   = dayLength || 0;

        switch(type){
            case "W":
            case "w":
                return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
            case "D":
            case "d":
                return Math.floor(diff / (24 * 60 * 60 * 1000));
            case "H":
            case "h":
                return Math.floor(diff / (60 * 60 * 1000));
            case "m":
                return Math.floor(diff / (60 * 1000));
            case "S":
            case "s":
                return Math.floor(diff / 1000);
            case "timer":
                format = format.replace(/%d/g, dayLength == 0 ? Math.floor(diff / (24 * 60 * 60 * 1000)) : $17.strPad(Math.floor(diff / (24 * 60 * 60 * 1000)), "0", dayLength));
                format = format.replace(/%h/g, $17.strPad(Math.floor(diff / (60 * 60 * 1000)) % 24, "0", 2));
                format = format.replace(/%m/g, $17.strPad(Math.floor(diff / (60 * 1000)) % 60, "0", 2));
                format = format.replace(/%s/g, $17.strPad(Math.floor(diff / 1000) % 60, "0", 2));
                return format;
            default:
                return null;
        }
    }

    $17.extend($17, {
        DateUtils   : dateUtils,
        DateDiff    : dateDiff
    });
}($17));



////////////////// 扩展框架 //////////////////

/**
 * Hash回调
 */
(function($17){
    "use strict";

    function hash(name, value){
        if($17.isBlank(name)){
            return;
        }

        var clearReg = new RegExp("(&" + name + "=[^&]*)|(\\b" + name + "=[^&]*&)|(\\b" + name + "=[^&]*)", "ig");
        if(value === null){
            location.hash = location.hash.replace(clearReg, "");
        }else{
            value = value + "";

            var temp = location.hash.replace(clearReg, "");
            temp += ((temp.indexOf("=") != -1) ? "&" : "") + name + "=" + encodeURIComponent(value);
            location.hash = temp;
        }
    }

    function urlCallback(prams, callback){
        var time        = new Date().getTime();
        var _v          = null;

        for(var i = 0, len = prams.length; i < len; i++){
            _v = $17.getQuery(prams[i]);
            if(_v == ""){
                return false;
            }else{
                $17.namespace("__hashCallback__" + time + "." + prams[i], _v);
            }
        }

        var callFun = $17.proxy(callback);
        callFun(eval("__hashCallback__" + time));
    }

    function hashCallback(prams, callback){
        var time        = new Date().getTime();
        var _v          = null;

        for(var i = 0, len = prams.length; i < len; i++){
            _v = $17.getHashQuery(prams[i]);
            if(_v == ""){
                return false;
            }else{
                $17.namespace("__hashCallback__" + time + "." + prams[i], _v);
            }
            hash(prams[i], null);
        }

        hash("=^_^", "");

        var callFun = $17.proxy(callback);
        callFun(eval("__hashCallback__" + time));
    }

    $17.extend($17, {
        hashCallback : hashCallback,
        urlCallback  : urlCallback
    });
}($17));

/**
 * jQuery 扩展小工具
 * 注: 依赖 'jQuery'
 */
(function($17){
    "use strict";

    jQuery.fn.getClassId = function(){
        var classId = $(this).val().toUpperCase();
        return classId.substring(0, 1) == "C" ? $.trim(classId.substring(1, classId.length)) : $.trim(classId);
    };

    function getClassId(classId){
        classId = classId.toUpperCase();
        return classId.substring(0, 1) == "C" ? $.trim(classId.substring(1, classId.length)) : $.trim(classId);
    }

    function setSelect(elem, keys, values, def){
        $(elem).html("");

        for(var i = 0, len = keys.length; i < len; i++) {
            if(keys[i] == def) {
                $(elem).append('<option value ="' + keys[i] + '" selected="selected">' + values[i] + '</option>');
            } else {
                $(elem).append('<option value ="' + keys[i] + '">' + values[i] + '</option>');
            }
        }
    }

    function backToTop(){
        top.$('html, body').animate({scrollTop: '0px'}, 0);
    }

    jQuery.fn.backToCenter = function(){
        top.$('html, body').animate({scrollTop: $(this).offset().top}, 1000);
        return this;
    };

    function promptAlert(){
        if($.prompt.jqib != undefined){
            $.prompt.close();
        }
        switch(arguments.length){
            case 1:
                $.prompt(arguments[0], { title: "系统提示", buttons: { "知道了": true }, position:{width : 400}});
                break;
            case 2:
                $.prompt(arguments[0], { title: "系统提示", buttons: { "知道了": true }, position:{width : 400}, submit: arguments[1] });
                break;
        }
    }

    function setTimeoutFun(object){
        if(!$17.isBlank(object)){
            setTimeout(function(){ window.location.href = object }, 200);
        }
    }

    $17.extend($17, {
        setSelect   : setSelect,
        backToTop   : backToTop,
        getClassId  : getClassId,
        alert       : promptAlert
    });
}($17));



/**
 * 扩展剪贴板功能
 * 注: 依赖 'ZeroClipboard'
 */
(function($17){
    "use strict";

    function copyToClipboard($target, $button){

        if(window.clipboardData){
            $button.on("click", function(){

                window.clipboardData.setData("Text", $target.val());
                alert("复制成功，请使用 ctrl + v 贴到您需要的地方！");
                return true;
            });
        }else{
            var clip = new ZeroClipboard.Client();
            clip.setHandCursor(true);
            if(arguments.length == 4){
                clip.glue(arguments[2], arguments[3]);
            }else{
                clip.glue("clip_button", "clip_container");
            }

            clip.addEventListener("mouseover", function(){
                clip.setText($target.val());
            });

            clip.addEventListener("complete", function(){
                alert("该地址已经复制，你可以使用Ctrl+V 粘贴。");
                return true;
            });
        }

        return false;
    }

    $17.extend($17, {
        copyToClipboard : copyToClipboard
    });
}($17));



/**
 * 页面数据请求提示
 * 注： 依赖 jQuery 框架
 */
$(function(){
    $("#loading").ajaxStart(function () {
        $(this).show();
    }).ajaxStop(function () {
        $(this).hide();
    });
});


/**
 * 错误统计
 * 注： 依赖 jQuery 框架
 */
window.onerror = function(err, file, line){
    var userId=($.cookie ? $.cookie('uid') : '');
    var url = "http://trace.17zuoye.com/jserr/?userId="+userId+"&"+$.param({'err': err, 'file': file, 'line': line});
    $('<img />').attr('src', url).css('display', 'none').appendTo($('body'));
};


/**
 * 实现翻页组件
 * 注： 依赖 jQuery 框架
 */
$.fn.page = function(option){
    function draw($target, def){
        if(def.model == "normal"){
            var current = parseInt(def.current);
            var maxNum  = parseInt(def.maxNumber);
            var _total  = parseInt(def.total);
            var _start  = current - Math.floor(def.maxNumber / 2);
            var _end    = current + Math.floor(def.maxNumber / 2);

            _start  = _start < maxNum ? 1 : _start;
            _end    = _end > _total ? _total : _end;

            $target.html('<a v="prev" href="' + def.href + '" class="' + (def.current > 1 ? def.enableMark : def.disabledMark) + ' ' + def.prev.className + '" style="' + def.prev.style + '">' + def.prev.text + '</a>');
            if(_start > 1){
                $target.append('<a href="' + def.href + '"><span>1</span></a>');
                $target.append('<span class="points"> ... </span>');
            }
            for(var i = _start; i <= _end; i++){
                $target.append('<a href="' + def.href + '" ' + (i == def.current ? ('class="' + def.currentMark + '"') : '') + '><span>' + i + '</span></a>');
            }
            if(_end < _total){
                $target.append('<span class="points"> ... </span>');
                $target.append('<a href="' + def.href + '"><span>' + _total + '</span></a>');
            }
            $target.append('<a v="next" href="' + def.href + '" class="' + ( _total <= 1 || def.current >= _total ? def.disabledMark : def.enableMark ) + ' ' + def.next.className + '" style="' + def.next.style + '">' + def.next.text + '</a>');
            $target.show();

            $target.find('a[class != ' + def.currentMark + '][class != ' + def.disabledMark + ']').one("click", function(){
                switch($(this).attr( "v" )){
                    case "prev":
                        jump($target, def, current - 1);
                        break;
                    case "next":
                        jump($target, def, current + 1);
                        break;
                    default:
                        jump($target, def, $(this).find('span').html());
                        break;
                }
            });
        }else{
            //为非常规页码，如“A，B..”，预留
        }
    }

    function jump($target, def, index){
        if(index < 1 || index > def.total){
            return false;
        }

        def.current = index;

        draw($target, def);

        if($.isFunction(def.jumpCallBack)){
            def.jumpCallBack(def.current);
        }else if(def.jumpCallBack){
            eval(def.jumpCallBack + "(options.current)");
        }
        if(def.autoBackToTop){
            $17.backToTop();
        }
    }

    return this.each(function(){
        var $target = $(this);
        var def = {
            total           : 0,
            current         : 1,
            maxNumber       : 5,
            currentMark     : "this",
            disabledMark    : "disable",
            enableMark      : "enable",
            model           : "normal",
            autoBackToTop   : true,
            next: {
                text        : "<span>下一页</span>",
                className   : "",
                style       : ""
            },
            prev: {
                text        : "<span>上一页</span>",
                className   : "",
                style       : ""
            },
            href            : "javascript:void(0);",
            jumpCallBack    : null
        };

        $.extend(def, option);

        if($target.length < 1){
            return false;
        }

        if(def.total < 1){
            $target.empty().hide();
            return false;
        }

        def.maxNumber = def.maxNumber > 5 ? def.maxNumber : 5;

        draw($target, def);
    });
};

/**
 * 实现radioClass
 * 注： 依赖 jQuery 框架
 */
(function($){
    $.fn.radioClass = function(className){
        return this.addClass(className).siblings().removeClass(className).end();
    };
}(jQuery));


/**
 * 容错方案
 */
(function($17){
    "use strict";

    $17.extend($17, {
        config : {
            debug : false
        }
    });

    $17.namespace("console.info", "isNotFunction");
    if(console.info == "isNotFunction"){
        console.info = function(){};
    }

    $17.namespace("console.log", "isNotFunction");
    if(console.log == "isNotFunction"){
        console.log = function(){};
    }

    $17.namespace("console.dir", "isNotFunction");
    if(console.dir == "isNotFunction"){
        console.dir = function(){};
    }

    $17.namespace("console.error", "isNotFunction");
    if(console.error == "isNotFunction"){
        console.error = function(){};
    }

    function _info(msg){
        if($17.config.debug){
            console.info(msg);
        }
    }

    function _dir(msg){
        if($17.config.debug){
            console.dir(msg);
        }
    }

    function _log(msg){
        if($17.config.debug){
            console.log(msg);
        }
    }

    function _error(msg){
        if($17.config.debug){
            console.error(msg);
        }
    }

//  第一个参数:正式环境参数, 第二个参数:测试环境参数
    function setDebugValue(value, debugValue){
        return ($17.config.debug && $17.getQuery("debug") === "true") ? debugValue : value;
    }

    $17.extend($17, {
        info    : _info,
        dir     : _dir,
        log     : _log,
        error   : _error,
        sdv     : setDebugValue
    });
}($17));


/**
 * 百度统计
 */
(function(){
    function tongji(){
        //百度统计初始化
        window._hmt = window._hmt || [];

        $17.info(arguments);

        switch(arguments.length){
            case 1:
                _hmt.push(["_trackEvent", arguments[0], arguments[0], arguments[0]]);
                break;
            case 2:
                _hmt.push(["_trackEvent", arguments[0], arguments[1], arguments[0] + "_" + arguments[1]]);
                break;
            case 3:
                _hmt.push(["_trackEvent", arguments[0], arguments[1], arguments[2]]);
                break;
        }

        return false;
    }

    $17.extend($17, {
        tongji: tongji
    });
}());



/**
 * 锁标识位工具
 */
(function($){

    var ft = {
        name        : "ice_cream",
        freezing    : "freezing",
        thaw        : "thaw"
    };

    $.fn.extend({
        //冻结函数
        //无参数：给对象添加冰激淋属性，并将其冻结
        //一个参数：给对象添加指定属性，并将其冻结
        freezing: function(){
            this.attr(arguments[0] || ft.name, ft.freezing);
            return this;
        },
        //判断是否冻结
        //无参数：判断对象的冰激淋属性是否被冻结
        //一个参数：判断指定对象是否被冻结
        isFreezing: function(){
            return this.attr(arguments[0] || ft.name) == ft.freezing;
        },
        //解冻函数
        //无参数：将对象的冰激淋属性解冻
        //一个参数：将指定属性解冻
        thaw: function(){
            this.attr(arguments[0] || ft.name, ft.thaw);
            return this;
        },
        //判断是否解冻
        //无参数：判断冰激淋属性是否被解冻
        //一个参数：判断指定属性是否被解冻
        isThaw: function(){
            return this.attr(arguments[0] || ft.name) == ft.thaw;
        }
    });
}(jQuery));



//////////////////////// App库 ////////////////////

/**禁止使用缓存*/
$.ajaxSetup( { cache : false } );

if ( jQuery.validator ) {
    /*
     * Translated default messages for the jQuery validation plugin.
     * Locale: CN
     */
    jQuery.extend( jQuery.validator.messages, {
        required : "必选字段",
        remote : "请修改该字段",
        email : "请填写正确格式的电子邮件",
        url : "请填写合法的网址",
        date : "请填写合法的日期",
        dateISO : "请填写合法的日期 (ISO).",
        number : "请填写合法的数字",
        digits : "只能填写整数",
        creditcard : "请填写合法的信用卡号",
        equalTo : "请再次填写相同的值",
        accept : "请填写拥有合法后缀名的字符串",
        maxlength : jQuery.validator.format( "请填写一个长度最多是 {0} 的字符串" ),
        minlength : jQuery.validator.format( "请填写一个长度最少是 {0} 的字符串" ),
        rangelength : jQuery.validator.format( "请填写一个长度介于 {0} 和 {1} 之间的字符串" ),
        range : jQuery.validator.format( "请填写一个介于 {0} 和 {1} 之间的值" ),
        max : jQuery.validator.format( "请填写一个最大为 {0} 的值" ),
        min : jQuery.validator.format( "请填写一个最小为 {0} 的值" )
    } );
    /** 中文验证 **/
    jQuery.validator.addMethod( "chineseCheck", function( value, element ) {
        value = value.replace( /\s+/g, "" );
        var _v = value.match(/[^\u4e00-\u9fa5]/g);
        if(!_v){ return true; }else{ return this.optional( element ) || (_v.length == 0)}
    }, "只能输入中文" );

    /** 字符验证 **/
    jQuery.validator.addMethod( "stringCheck", function( value, element ) {
        value = value.replace( /\s+/g, "" );
        return this.optional( element ) || /^[\u0391-\uFFE5\w]+$/.test( value );
    }, "只能包括中文字、英文字母、数字和下划线" );

    /** 中文字两个字节 **/
    jQuery.validator.addMethod( "byteRangeLength",
        function( value, element, param ) {
            var length = value.length;
            for ( var i = 0; i < value.length; i++ ) {
                if ( value.charCodeAt( i ) > 127 ) {
                    length++;
                }
            }
            return this.optional( element )
                || (length >= param[0] && length <= param[1]);
        }, "请确保填写的值在3-15个字节之间(一个中文字算2个字节)" );

    /** 身份证号码验证**/
    jQuery.validator.addMethod( "idCard", function( value, element ) {
        return this.optional( element ) || isIdCardNo( value );
    }, "请正确填写身份证号码" );

    /** 手机号码验证**/
    jQuery.validator.addMethod( "mobile", function( value, element ) {
        var length = value.length;
        var mobile = /^((1)+\d{10})$/;
        return this.optional( element ) || (length == 11 && mobile.test( value ));
    }, "请正确填写手机号码" );

    /** 电话号码验证**/
    jQuery.validator.addMethod( "tel", function( value, element ) {
        var tel = /^\d{3,4}-?\d{7,9}$/;
        return this.optional( element ) || (tel.test( value ));
    }, "请正确填写电话号码" );

    /** 联系电话(手机/电话皆可)验证**/
    jQuery.validator.addMethod( "phone", function( value, element ) {
        var length = value.length;
        var mobile = /^((1)+\d{10})$/;
        var tel = /^\d{3,4}-?\d{7,9}$/;
        return this.optional( element ) || (tel.test( value ) || mobile.test( value ));

    }, "请正确填写联系电话" );

    /** 邮政编码验证**/
    jQuery.validator.addMethod( "zipcode", function( value, element ) {
        var tel = /^[0-9]{6}$/;
        return this.optional( element ) || (tel.test( value ));
    }, "请正确填写邮政编码" );

    /** 判断班级编号是否以C字母开头**/
    jQuery.validator.addMethod( "clzcode", function( value, element ) {
        var length = value.length;
        var code = /^(C|c)/;
        return this.optional( element ) || (length >= 6 && code.test( value ));
    }, "请正确填写班级编号（必须以C字母开头6位以上）" );
}

var App = {
    postJSON : function( url, data, callback, error, dataType ) {
        dataType = dataType || "json";
        if ( error == null || !$.isFunction( error ) ) {
            error = function() {
                alert( App.config.info._404 );
            };
        }
        return $.ajax( {
            type : 'post',
            url : url,
            data : $.toJSON( data ),
            success : callback,
            error : error,
            dataType : dataType,
            contentType : 'application/json;charset=UTF-8'
        } );
    },
    getJSON : function( url, callback, error, dataType ) {
        dataType = dataType || "json";
        if ( error == null || !$.isFunction( error ) ) {
            error = function() {
                alert( App.config.info._404 );
            };
        }
        return $.ajax( {
            type : 'get',
            url : url,
            success : callback,
            error : error,
            dataType : dataType,
            contentType : 'application/json;charset=UTF-8'
        } );
    },
    post : function( url, data, callback, error ) {
        if ( $.isFunction( data ) ) {
            callback = data;
            data = undefined;
        }
        if ( error == null || !$.isFunction( error ) ) {
            error = function() {
                alert( App.config.info._404 );
            };
        }
        return $.ajax( {
            type : 'post',
            url : url,
            data : data,
            success : callback,
            error : error,
            contentType : 'text/plain;charset=UTF-8'
        } );
    },

    call : function( callback, value ) {
        try {
            if ( $.isFunction( callback ) ) {
                callback( value );
            } else if ( !$17.isBlank( callback ) ) {
                eval( callback + "(value)" );
            }
        } catch ( e ) {
        }
    },

    parseInt : function( value, defaultValue ) {
        value = value || ( defaultValue || 0 );
        value = parseInt( value );
        return ( !isNaN( parseFloat( value ) ) && isFinite( value ) ) ? value : ( defaultValue || 0 );
    },

    config : {
        sign : {
            locked : "app_locked",
            lockedDelay : "app_unlock_delay"
        },
        info : {
            _404 : "网络请求失败，请稍等重试或者联系客服人员"
        },
        practice : {
            type : {
                _0 : "英语练习",
                _1 : "全文跟读",
                _2 : "全文背诵",
                _3 : "连词成句",
                _4 : "单词拼写",
                _5 : "单词辨识",
                _6 : "单词跟读",
                _7 : "句子听力",
                _8 : "单词排序",
                _9 : "看图识词",
                _10 : "单词英英解释",
                _11 : "自然拼读",
                _12 : "PUZZLE",
                _13 : "单词改错",
                _14 : "听音选词",
                _15 : "英汉解释"
            },
            list : {
                _0 : {title : "", type : 0},
                _1 : {title : "音节纠错、打分技术指导学生独立进行口语练习，迅速提高学生发音、听力水平。", type : 1},
                _2 : {title : "", type : 0},
                _3 : {title : "", type : 0},
                _4 : {title : "", type : 0},
                _5 : {title : "考查学生的观察能力、听力能力及瞬间记忆能力，培养学生综合分析和运用英语的能力。", type : 0},
                _6 : {title : "看文章，了解文章意思，综合考察英语运用能力。", type : 0},
                _7 : {title : "", type : 0},
                _8 : {title : "通过录音的形式完成中英文互译练习，综合考查学生的单词记忆、翻译技巧和说英语。", type : 0},
                _9 : {title : "", type : 0},
                _10 : {title : "", type : 0},
                _11 : {title : "根据中文提示完成英文跟读、背诵，不仅考查听力能力，更考查记忆的能力及翻译的技巧。", type : 2},
                _12 : {title : "考查学生语法掌握情况，在有限的时间内调整单词块的顺序，培养学生快速组织语言的能力。", type : 3},
                _13 : {title : "单词发音训练，通过小游戏形式进行跟读，加深单词发音印象，打好发音基础。", type : 6},
                _14 : {title : "将枯燥的单词记忆融入到游戏之中，激发学生兴趣，让学生主动记忆单词的中文意思。", type : 5},
                _15 : {title : "检查学生单词记忆效果，单词听写不再枯燥，融合发音和单词解释双重训练，强化单词记忆。", type : 4},
                _16 : {title : "检查学生单词记忆效果，单词听写不再枯燥，融合发音和单词解释双重训练，强化单词记忆。", type : 4},
                _17 : {title : "将枯燥的单词记忆融入到游戏之中，激发学生兴趣，让学生主动记忆单词的中文意思。", type : 5},
                _18 : {title : "", type : 0},
                _19 : {title : "", type : 0},
                _20 : {title : "", type : 0},
                _21 : {title : "", type : 0},
                _22 : {title : "", type : 0},
                _23 : {title : "", type : 0},
                _24 : {title : "", type : 0},
                _25 : {title : "", type : 0},
                _26 : {title : "", type : 0},
                _27 : {title : "考查学生语法掌握情况，在有限的时间内调整单词块的顺序，培养学生快速组织语言的能力。", type : 3},
                _28 : {title : "单词发音训练，通过小游戏形式进行跟读，加深单词发音印象，打好发音基础。", type : 6},
                _29 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 7},
                _30 : {title : "训练低年级学生的单词拼写能力。将正确的单词顺序打乱，让学生按照记忆中的顺序，重新将字母组合。", type : 8},
                _31 : {title : "训练低年级学生的单词拼写能力。将正确的单词顺序打乱，让学生按照记忆中的顺序，重新将字母组合。", type : 7},
                _32 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 8},
                _33 : {title : "以有趣的故事情节为主线,利用先进的音节纠错、打分技术指导学生独立进行口语练习，迅速提高学生发音、听力水平。", type : 1},
                _34 : {title : "以有趣的故事情节为主线,利用先进的音节纠错、打分技术指导学生独立进行口语练习，迅速提高学生发音、听力水平。", type : 1},
                _35 : {title : "通过图片认识英文单词，从直观的认知角度让学生灵活掌握词汇，并给与英语发音的提示。", type : 9},
                _36 : {title : "考查学生语法掌握情况，在有限的时间内调整单词块的顺序，培养学生快速组织语言的能力。", type : 3},
                _37 : {title : "检查学生单词记忆效果，单词听写不再枯燥，融合发音和单词解释双重训练，强化单词记忆。", type : 4},
                _38 : {title : "检查学生单词记忆效果，单词听写不再枯燥，融合发音和单词解释双重训练，强化单词记忆。", type : 4},
                _39 : {title : "根据词汇的英英解释提示，猜出正确的单词，从理解方面进一步掌握单词，进而学会单词应用。", type : 10},
                _40 : {title : "", type : 0},
                _41 : {title : "将枯燥的单词记忆融入到游戏之中，激发学生兴趣，让学生主动记忆单词的中文意思。", type : 5},
                _42 : {title : "检查学生单词记忆效果，单词听写不再枯燥，融合发音和单词解释双重训练，强化单词记忆。", type : 4},
                _43 : {title : "单词发音训练，通过小游戏形式进行跟读，加深单词发音印象，打好发音基础。", type : 6},
                _44 : {title : "检查学生单词记忆效果，单词听写不再枯燥，融合发音和单词解释双重训练，强化单词记忆。", type : 4},
                _45 : {title : "将枯燥的单词记忆融入到游戏之中，激发学生兴趣，让学生主动记忆单词的中文意思。", type : 5},
                _46 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 4},
                _47 : {title : "将枯燥的单词记忆融入到游戏之中，激发学生兴趣，让学生主动记忆单词的中文意思。", type : 9},
                _48 : {title : "根据音节拼读单词，并跟读打分。", type : 11},
                _49 : {title : "将枯燥的单词记忆融入到游戏之中，激发学生兴趣，让学生主动记忆单词的中文意思。", type : 1},
                _50 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 3},
                _51 : {title : "将枯燥的单词记忆融入到游戏之中，激发学生兴趣，让学生主动记忆单词的中文意思。", type : 5},
                _52 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 9},
                _53 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 9},
                _54 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 13},
                _55 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 5},
                _56 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 4},
                _57 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 12},
                _58 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 14},
                _59 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 3},
                _60 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 10},
                _61 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 6},
                _62 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 7},
                _63 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 1},
                _64 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 15},
                _65 : {title : "训练学生的听力能力。将枯燥的听力练习形式，完美的融入到游戏中，不但增加学生的学习兴趣，也能提高学习效率。", type : 13}
            }
        }
    },
    practice : function( id ) {
        var p = eval( "App.config.practice.list._" + id );
        if ( !p ) {
            p = App.config.practice.list._0;
        }
        var t = eval( "App.config.practice.type._" + (p.type) );
        return {id : id, title : p.title, type : p.type, typeTitle : t};
    },
    districtSelect : {
        installState : 0,
        clearDistrictNextLevel : function( obj ) {
            if ( obj.attr( "next_level" ) ) {
                App.districtSelect.clearDistrictNextLevel( $( "#" + obj.attr( "next_level" ) ).html( '<option value=""></option>' ) );
            }
        },
        get : function( _this ) {
            var next_level = _this.attr( "next_level" );
            if ( next_level ) {
                next_level = $( "#" + next_level );
                App.districtSelect.clearDistrictNextLevel( _this );
                if ( $17.isBlank( _this.val())) {return false}
                $.getJSON( '/getregion-' + _this.val() + '.shtml', function( data ) {
                    if ( data.success && data.total > 0 ) {
                        var html = '';
                        var defaultOption = next_level.attr( "default_option" );

                        if ( !$17.isBlank( defaultOption ) ) {
                            try {
                                defaultOption = eval( "(" + defaultOption + ")" );
                                html = '<option value="' + defaultOption.key + '">' + defaultOption.value + '</option>';
                            } catch ( e ) {
                            }
                        }

                        $.each( data.rows, function() {
                            html += '<option value="' + this.key + '">' + this.value + '</option>';
                        } );

                        next_level.html( html );
                        var defaultValue = next_level.attr( "defaultValue" );
                        if ( $17.isBlank( defaultValue ) && !$17.isBlank( defaultOption ) ) {
                            defaultValue = defaultOption.key;
                        }
                        if ( !$17.isBlank( defaultValue ) ) {
                            //under IE6, 'select' can not be used after change. must delay some time
                            setTimeout(function(){
                                next_level.val( defaultValue );
                                next_level.attr( "defaultValue", '' );
                            },1);
                        }
                        if ( !$17.isBlank( next_level.attr( "next_level" ) ) ) {
                            if ( !$17.isBlank( next_level.val() ) && next_level.val() != "-1" ) {
                                //under IE6, 'select' can not be used after change. must delay some time
                                setTimeout(function(){
                                    next_level.trigger( 'change' );
                                },5);
                            }
                        }
                        App.call( next_level.attr( "success_callback" ), next_level );
                    } else {
                        if ( $17.isBlank( next_level.attr( "show_error" ) ) || next_level.attr( "show_error" ) == "true" ) {
                            alert( data.info );
                        }
                        App.call( next_level.attr( "error_callback" ), next_level );
                    }
                } );
            }
        },
        install : function( obj ) {
            if ( App.districtSelect.installState == 1 ) return;
            obj = obj || $( "select.district_select" );
            obj.live( "change", function() {
                App.districtSelect.get( $( this ) );
            } );
            App.districtSelect.installState = 1;
            return App.districtSelect;
        },
        init : function( obj ) {
            if ( App.districtSelect.installState == 0 ) {
                App.districtSelect.install();
            }
            obj = obj || $( "select.district_select:first" );
            if ( obj.attr( "isLoaded" ) != "1" ) {
                obj.trigger( 'change' );
                obj.attr( "isLoaded", 1 );
            }
        }
    },

    string : {
        transformUrl : function( url ) {
            return url.replace( /((https?\:\/\/|ftp\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi, function( m ) {
                return '<a href="' + m + '" target="_blank">' + m + '</a>';
            } );
        }
    },
    lock : {
        init : function( _this, types, fn ) {
            if ( !_this ) return;

            _this.locked = function() {
                App.lock.locked( _this );
            };

            _this.unlock = function( delay ) {
                App.lock.lockedDelay( _this, delay || 0 );
                App.lock.unlock( _this );
            };

            return _this.on( types, function() {
                if ( App.lock.isLocked( _this ) ) return;
                App.call( fn, _this );
            } );
        },
        locked : function( _this ) {
            _this.attr( App.config.sign.locked, 1 );
        },
        unlock : function( _this ) {
            setTimeout( function() {
                _this.attr( App.config.sign.locked, 0 );
            }, App.parseInt( _this.attr( App.config.sign.lockedDelay ) ) );
        },
        lockedDelay : function( _this, delay ) {
            _this.attr( App.config.sign.lockedDelay, delay );
        },
        isLocked : function( _this ) {
            return _this.attr( App.config.sign.locked ) == 1;
        }
    },
    focusEnd : function( _this ) {
        if ( !_this ) return;
        var length = _this.val().length;
        if ( _this.val().lengh == 0 ) return _this;
        var input = _this[0];
        if ( input.createTextRange ) {
            var range = input.createTextRange();
            range.collapse( true );
            range.moveEnd( 'character', length );
            range.moveStart( 'character', length );
            range.select();
        } else if ( input.setSelectionRange ) {
            input.focus();
            input.setSelectionRange( length, length );
        }
        return _this;
    }
};

$.fn.extend( {
    postJSON : function( url, data, callback, error ) {
        var _this = $( this );
        if ( App.lock.isLocked( _this ) ) return;

        var _callback = function( data ) {
            App.call( callback, data, _this );
            App.lock.unlock( _this );
        };
        var _error = function() {
            alert( App.config.info._404 );
            App.call( error, _this );
            App.lock.unlock( _this );
        };

        App.lock.locked( _this );
        App.postJSON( url, data, _callback, _error );
        return this;
    },
    post : function( url, data, callback, error ) {
        var _this = $( this );
        if ( App.lock.isLocked( _this ) ) return;

        var _callback = function( data ) {
            App.call( callback, data, _this );
            App.lock.unlock( _this );
        };
        var _error = function() {
            alert( App.config.info._404 );
            App.call( error, _this );
            App.lock.unlock( _this );
        };

        App.lock.locked( _this );
        App.post( url, data, _callback, _error );
        return this;
    },
    lock : function( types, fn, delay ) {
        App.lock.lockedDelay( this, delay || 0 );
        return App.lock.init( this, types, fn );
    },
    focusEnd : function() {
        return App.focusEnd( this );
    }
} );

var QTIP_OPTIONS = {
    position : {
        at : 'bottom center',
        my : 'top center',
        viewport : $( window ),
        effect : false
    },
    style : {
        classes : 'ui-tooltip-cream ui-tooltip-shadow'
    }
};

$.fn.submitLoadding = function() {
    var imgUrl = '/resources/apps/default/images/loadding.gif';
    $( this ).hide();
    $( "#submitLoadding_box" ).remove();
    $( this ).after( '<div id="submitLoadding_box"><img src="' + imgUrl + '"/>处理中...</div>' );
};
$.fn.hideSubmitLoadding = function() {
    $( this ).show();
    $( "#submitLoadding_box" ).remove();
};


$( function() {

    if ( $.isFunction( $.fn.jQselectable ) ) {
        $( "select.selectable" ).jQselectable( {set : "fadeIn", setDuration : "fast", opacity : .9, callback : function() {
            $( this ).trigger( "change" );
        }} );
        $( "select.simpleselectable" ).jQselectable( {style : "simple", set : "slideDown", out : "fadeOut", setDuration : 150, outDuration : 150, setDuration : "fast", opacity : .9, callback : function() {
            $( this ).trigger( "change" );
        }} );
    }

    /**链接事件统一控制*/
    $( ".app_get_click_event" ).live( "click", function() {
        var _this = $( this );
        if ( _this.attr( "app_loading" ) == "1" ) {
            return;
        }
        _this.attr( "app_loading", 1 );
        var _callbeforeback = _this.attr( "app_call_before" );
        var _callback = _this.attr( "app_call_back" );
        var detail = _this.data( 'detail' );
        var _redirectUrl = _this.attr( 'redirectUrl' );
        var _app_delay = _this.attr( 'app_delay' );
        var _nocache = _this.attr( 'app_nocache' ) || "false";
        var _app_error_prompt = _this.attr( 'app_error_prompt' ) || "true";

        if ( _callbeforeback ) {
            eval( _callbeforeback + "( _this )" );
        }

        if ( detail ) {
            if ( _callback ) {
                eval( _callback + "( _this, detail )" );
            }
            _this.attr( "app_loading", 0 );
        } else {
            App.getJSON( _this.attr( "dataurl" ), function( data ) {
                if ( data.success && _nocache == "false" ) {
                    _this.data( 'detail', data );
                }

                if ( !$17.isBlank( _redirectUrl ) ) {
                    setTimeout( function() {
                        location.href = _redirectUrl;
                    }, App.parseInt( _app_delay, 0 ) );
                }

                eval( _callback + "( _this, data )" );
                _this.attr( "app_loading", 0 );
            }, function( e ) {
                var data = { success : false, info : "网络请求失败" };
                eval( _callback + "( _this, data )" );
                _this.attr( "app_loading", 0 );
                if ( _app_error_prompt == "true" ) {
                    alert( "网络请求失败，请稍等重试或者联系客服人员" );
                }
            } );
        }
    } );


    /**链接事件统一控制*/
    $( ".app_get_html_click_event" ).live( "click", function() {
        var _this = $( this );
        var _appName = _this.attr( "app_name" );
        var _callbeforeback = _this.attr( "app_call_before" );
        var _calllaterback = _this.attr( "app_call_later" );
        var _callcompleteback = _this.attr( "app_call_complete" );
        var _writeOnce = _this.attr( "app_write_once" );
        var _writeTarget = _this.attr( "app_write_target" );
        var _htmlPlace = _this.attr( "app_html_place" );

        _writeTarget = _writeTarget || "body";
        _writeTarget = _writeTarget == "this" ? this : _writeTarget;

        if ( _callbeforeback ) {
            App.call( _callbeforeback, _this );
        }

        var detail = _this.data( "detail" );
        if ( !detail ) {
            $.get( _this.attr( "dataurl" ), function( data ) {
                _this.data( "detail", data );
                if ( _calllaterback ) {
                    App.call( _calllaterback, _this );
                }

                if ( _htmlPlace == "foot" ) {
                    $( _writeTarget ).append( data );
                } else if ( _htmlPlace == "body" ) {
                    $( _writeTarget ).html( data );
                } else {
                    $( _writeTarget ).prepend( data );
                }

                if ( _callcompleteback ) {
                    App.call( _callcompleteback, _this );
                }
            } );
        } else {
            if ( _calllaterback ) {
                App.call( _calllaterback, _this );
            }

            if ( !_writeOnce ) {

                if ( _htmlPlace == "foot" ) {
                    $( _writeTarget ).append( detail );
                } else if ( _htmlPlace == "body" ) {
                    $( _writeTarget ).html( detail );
                } else {
                    $( _writeTarget ).prepend( detail );
                }
            } else {
                if ( !$17.isBlank( _appName ) ) {
                    App.call( "app_auto_html_" + _appName + "_init", _this );
                }
            }

            if ( _callcompleteback ) {
                App.call( _callcompleteback, _this );
            }
        }
    } );

    /**自动加载*/
    $( ".app_init_auto_get_html" ).each( function() {
        var _this = $( this );
        var _app_delay = _this.attr( "app_delay" ) || 0;

        if ( !_this.attr( "dataurl" ) ) return;

        setTimeout( function() {
            $.get( _this.attr( "dataurl" ), function(data){
                _this.html( data );
            });
        }, _app_delay );
    } );
} );