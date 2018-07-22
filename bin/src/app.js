"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var MyApp = /** @class */ (function () {
    function MyApp() {
    }
    MyApp.run = function () {
        var confUrl = "./devtool/config.json";
        MyApp.conf = JSON.parse(fs.readFileSync(confUrl).toString());
        MyApp.templ = fs.readFileSync(MyApp.conf.proto2ts.tsTemplate).toString();
        MyApp.protofileData = "";
        MyApp.tsfileData = "";
        fs.readdir(MyApp.conf.proto2ts.protoPath, function (err, files) {
            for (var i = 0; i < files.length; ++i) {
                if (files[i].lastIndexOf("proto") != files[i].length - 5)
                    continue;
                MyApp.protofileData += fs.readFileSync(MyApp.conf.proto2ts.protoPath + "/" + files[i]).toString();
            }
            fs.writeFile(MyApp.conf.proto2ts.layaPath, MyApp.protofileData, function (err) {
                if (err == null)
                    console.log("proto complete");
                else
                    console.log(err.message);
            });
            var filestr = MyApp.protofileData.replace(/\t/g, "");
            var mess = MyApp.parse(filestr.split("\r\n"));
            var tsFile = MyApp.wirteTs(MyApp.templ, mess);
            fs.writeFile(MyApp.conf.proto2ts.tsPath, tsFile, function (err) {
                if (err == null)
                    console.log("ts complete");
                else
                    console.log(err.message);
            });
        });
    };
    MyApp.wirteTs = function (templ, mess) {
        var fileStr = MyApp.getChunk(templ, "#<TS>", "END");
        var PROTO_CONST = MyApp.getChunk(templ, "#<PROTO_CONST>", "END");
        var PROTO_FUNC = MyApp.getChunk(templ, "#<PROTO_FUNC>", "END");
        var PROTO_INTERFACE = MyApp.getChunk(templ, "#<PROTO_INTERFACE>", "END");
        var PROTO_PARAM = MyApp.getChunk(templ, "#<PROTO_PARAM>", "END");
        for (var i = 0; i < mess.length; ++i) {
            var messvo = mess[i];
            var protoConst = PROTO_CONST.replace(/\$\{PROTOVO_NAME\}/g, String(messvo.name));
            var idx = fileStr.indexOf("${PROTO_CONST}");
            fileStr = MyApp.addToIdx(fileStr, protoConst, idx);
            var protoFunc = PROTO_FUNC.replace(/\$\{PROTOVO_NAME\}/g, String(messvo.name));
            var idx = fileStr.indexOf("${PROTO_FUNC}");
            fileStr = MyApp.addToIdx(fileStr, protoFunc, idx);
            var protoInterface = PROTO_INTERFACE.replace(/\$\{PROTOVO_NAME\}/g, String(messvo.name));
            for (var j = 0; j < messvo.data.length; ++j) {
                var param = messvo.data[j];
                var protoParam = PROTO_PARAM.replace("${HELP}", param.help || "");
                var protoParam = protoParam.replace("${PARAM_NAME}", param.name || "");
                var pvar = MyApp.prototype2tstype(param.pvar || "");
                var protoParam = protoParam.replace("${PARAM_TYPE}", pvar);
                var idx = protoInterface.indexOf("${PROTO_PARAM}");
                protoInterface = MyApp.addToIdx(protoInterface, protoParam, idx);
            }
            protoInterface = protoInterface.replace("${PROTO_PARAM}", "");
            var idx = fileStr.indexOf("${PROTO_INTERFACE}");
            fileStr = MyApp.addToIdx(fileStr, protoInterface, idx);
        }
        fileStr = fileStr.replace("${PROTO_CONST}", "");
        fileStr = fileStr.replace("${PROTO_FUNC}", "");
        fileStr = fileStr.replace("${PROTO_INTERFACE}", "");
        return fileStr;
    };
    MyApp.addToIdx = function (target, str, idx) {
        return target.substr(0, idx) + str + target.substr(idx);
    };
    MyApp.prototype2tstype = function (type) {
        if (type.indexOf("int") != -1)
            return "number";
        if (type == 'float')
            return "number";
        return type;
    };
    MyApp.getChunk = function (str, left, right) {
        if (str === void 0) { str = ""; }
        if (left === void 0) { left = "{"; }
        if (right === void 0) { right = "}"; }
        var idx = str.indexOf(left);
        if (idx == -1) {
            console.log("less " + left);
            return str;
        }
        var numLefts = 1;
        var numRights = 0;
        var fristIdx = idx;
        while (true) {
            var leftIdx = str.indexOf(left, idx + 1);
            var rightIdx = str.indexOf(right, idx + 1);
            if (leftIdx == -1) {
                if (rightIdx == -1) {
                    console.log("less " + right);
                    return str;
                }
                else {
                    ++numRights;
                    idx = rightIdx;
                }
            }
            else if (rightIdx == -1) {
                console.log("less " + right);
                return str;
            }
            else if (leftIdx < rightIdx) {
                ++numLefts;
                idx = leftIdx;
            }
            else {
                ++numRights;
                idx = rightIdx;
            }
            if (idx != -1 && numLefts == numRights) {
                return str.substring(fristIdx + left.length, idx - 1);
            }
        }
    };
    MyApp.parse = function (lineArr) {
        var len = lineArr.length;
        var cache_pack;
        var cache_help;
        ;
        var cache_mess;
        var res_mess = [];
        for (var i = 0; i < len; ++i) {
            var res = MyApp.checkLine(lineArr[i]);
            if (res.name == "SlotsRewardLineVO") {
                console.log("1");
            }
            switch (res.type) {
                case LINE_TYP.NONE:
                    if (cache_help !== undefined) {
                        cache_help += res.help;
                    }
                    break;
                case LINE_TYP.HELP:
                    cache_help = res.help;
                    break;
                case LINE_TYP.PACK:
                    cache_pack = res.name;
                    break;
                case LINE_TYP.MESSSTART:
                    cache_mess = new Message();
                    cache_mess.pack = cache_pack;
                    cache_mess.name = res.name;
                    cache_mess.help = res.help;
                    if (cache_help !== undefined) {
                        cache_mess.help = cache_help + "\r" + cache_mess.help;
                        cache_help = undefined;
                    }
                    break;
                case LINE_TYP.PARAM:
                    if (cache_mess !== undefined) {
                        cache_mess.data.push(res);
                    }
                    break;
                case LINE_TYP.MESSEND:
                    if (cache_mess !== undefined) {
                        res_mess.push(cache_mess);
                        cache_mess = undefined;
                    }
            }
        }
        return res_mess;
    };
    MyApp.checkLine = function (line) {
        var res = new LineRes();
        var ci = line.indexOf("//");
        if (ci != -1) {
            res.help = line.substr(ci + 2);
            line = line.substr(0, ci);
        }
        var fileds = MyApp.fixEqu(line).replace(/(^\s*)|(\s*$)/g, "").split(" ");
        var i = fileds.length;
        while (--i > -1 && fileds[i].length == 0)
            fileds.pop();
        while (fileds.length > 0 && fileds[0].length == 0)
            fileds.shift();
        switch (fileds[0]) {
            case PARAM_MOD.OPTIONAL:
            case PARAM_MOD.REPEATED:
            case PARAM_MOD.REQUIRED:
                res.mod = fileds[0];
                res.type = LINE_TYP.PARAM;
                res.pvar = fileds[1];
                res.name = fileds[2];
                res.id = parseInt(fileds[4]);
                break;
            case LINE_HEAD.MESSAGE:
                res.type = LINE_TYP.MESSSTART;
                res.name = fileds[1];
                break;
            case LINE_HEAD.END:
                res.type = LINE_TYP.MESSEND;
                break;
            case LINE_HEAD.PACKAGE:
                res.type = LINE_TYP.PACK;
                res.name = fileds[1].replace(";", "");
                break;
            default:
                res.type = LINE_TYP.NONE;
                res.help = fileds.toString();
                break;
        }
        return res;
    };
    MyApp.fixEqu = function (str) {
        var arr = str.split("=");
        if (arr.length < 2)
            return str;
        return arr[0].replace(/(^\s*)/g, "") + " = " + arr[1].replace(/(\s*$)/g, "");
    };
    return MyApp;
}());
var Message = /** @class */ (function () {
    function Message() {
        this.data = [];
    }
    return Message;
}());
var LineRes = /** @class */ (function () {
    function LineRes() {
    }
    return LineRes;
}());
var LINE_TYP;
(function (LINE_TYP) {
    LINE_TYP[LINE_TYP["NONE"] = 0] = "NONE";
    LINE_TYP[LINE_TYP["PACK"] = 1] = "PACK";
    LINE_TYP[LINE_TYP["MESSSTART"] = 2] = "MESSSTART";
    LINE_TYP[LINE_TYP["MESSEND"] = 3] = "MESSEND";
    LINE_TYP[LINE_TYP["PARAM"] = 4] = "PARAM";
    LINE_TYP[LINE_TYP["HELPSTART"] = 5] = "HELPSTART";
    LINE_TYP[LINE_TYP["HELPEND"] = 6] = "HELPEND";
    LINE_TYP[LINE_TYP["HELP"] = 7] = "HELP";
})(LINE_TYP || (LINE_TYP = {}));
var PARAM_MOD = /** @class */ (function () {
    function PARAM_MOD() {
    }
    PARAM_MOD.REQUIRED = "required";
    PARAM_MOD.OPTIONAL = "optional";
    PARAM_MOD.REPEATED = "repeated";
    return PARAM_MOD;
}());
var LINE_HEAD = /** @class */ (function () {
    function LINE_HEAD() {
    }
    LINE_HEAD.PACKAGE = "package";
    LINE_HEAD.MESSAGE = "message";
    LINE_HEAD.START = "{";
    LINE_HEAD.END = "}";
    return LINE_HEAD;
}());
MyApp.run();
//# sourceMappingURL=app.js.map