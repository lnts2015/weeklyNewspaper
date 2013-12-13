/***/

(function(That){
    "use strict";
    var version = "1.0.0";

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

    //第一个参数：要扩展的对象，第二个参数：参考的属性
    function extend(child, parent){
        var key;
        for(key in parent){
            if(parent.hasOwnProperty(key)){
                child[key] = parent[key];
            }
        }
    }

    extend(That, {
        $17 : $17
    });

    extend(That.$17, {
        version : version,
        extend  : extend
    });

})(window);



/** 验证函数 */
(function($17){
    "use strict";

    //验证是否未定义或null或空字符串
    function isBlank(str){
        return str == 'undefined' || String(str) == 'null' || $.trim( str ) == '';
    }

    $17.extend($17,{
        isBlank : isBlank
    });

})($17);