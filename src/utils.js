export default {
    isURL(url){
        return /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(url);
    },
    //数组判断
    isArray: Array.isArray || function (arr) {
        return Array.prototype.toString.call(arr) === '[object Array]';
    },
    //判断数字
    isNumber: function (val) {
        //isFinite 检测是否为无穷大
        //isNumber(parseInt(a))   // true
        // 第一种写法
        return typeof val === 'number' && isFinite(val);
        //第二种写法
        // return typeof val === 'number' && !isNaN(val)
    },
    //判断字符串
    isString: function (str) {
        return typeof str === 'string';
    },
    //判断布尔值
    isBoolean: function (bool) {
        return typeof bool === 'boolean';
    },
    //判断函数
    isFun: function (fn) {
        return typeof fn === 'function';
    },
    //判断对象
    isObject: function (obj) {
        //{},[],null 用typeof检测不出来
        return Object.prototype.toString.call(obj) === '[object Object]';
    },
    //判断undefined
    isUndefined: function (undefined) {
        return typeof undefined === 'undefined';
    },
    isNull: function (n) {
        //判断空值用 n === null
        return n === null;
    },
    isNaN: function (val) {
        return typeof val === 'number' && isNaN(val);
    },
    $(ele){
        if(document.querySelector){
            return document.querySelector(ele);
        } else {
            if (ele.indexOf('#') > -1){
                return document.getElementById(ele.replace('#',''));
            } else if (ele.indexOf('.') > -1){
                return document.getElementsByClassName(ele.replace('.',''))[0];
            } else {
                return document.getElementsByTagName(ele)[0];
            }
        }
    },
    toggleClass(ele, cls){
        ele.className.indexOf(cls) > -1 ? ele.classList.remove(cls) : ele.classList.add(cls);
    },
    addEvent(element, type, handler, useCapture) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, useCapture ? true : false);
        } else if(element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else if(element != window){
            element['on' + type] = handler;
        }
    },
    removeEvent(element, type, handler, useCapture) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, useCapture ? true : false);
        } else if(element.detachEvent) {
            element.detachEvent('on' + type, handler);
        } else if(element != window){
            element['on' + type] = null;
        }
    },
    cancelEvent(e) {
        if(e.preventDefault){
            e.preventDefault();
        }
        else{
            e.returnValue = false;
        }
        if(e.stopPropagation){
            e.stopPropagation();
        }
        else{
            e.cancelBubble = true;
        }
        return false;
    },
};