import fs = require("fs");
class MyApp {

    static conf: Conf;
    static templ: string;
    static protofileData: string;
    static tsfileData: string;

    static run(): void {

        var confUrl = "./devtool/config.json";
        MyApp.conf = JSON.parse(fs.readFileSync(confUrl).toString());
        MyApp.templ = fs.readFileSync(MyApp.conf.proto2ts.tsTemplate).toString();


        MyApp.protofileData = "";
        MyApp.tsfileData = "";

        fs.readdir(MyApp.conf.proto2ts.protoPath, (err, files) => {
            for (var i = 0; i < files.length; ++i) {
                if (files[i].lastIndexOf("proto") != files[i].length - 5) continue;
                MyApp.protofileData += fs.readFileSync(MyApp.conf.proto2ts.protoPath + "/" + files[i]).toString();
            }

            fs.writeFile(MyApp.conf.proto2ts.layaPath, MyApp.protofileData, (err) => {
                if (err == null) console.log("proto complete");
                else console.log(err.message);
            })

            var filestr = MyApp.protofileData.replace(/\t/g, "");
            var mess = MyApp.parse(filestr.split("\r\n"));

            var tsFile = MyApp.wirteTs(MyApp.templ, mess);
            fs.writeFile(MyApp.conf.proto2ts.tsPath, tsFile, (err) => {
                if (err == null) console.log("ts complete");
                else console.log(err.message);
            })

        });

    }

    static wirteTs(templ: string, mess: Message[]): string {
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
    }

    static addToIdx(target: string, str: string, idx: number): string {
        return target.substr(0, idx) + str + target.substr(idx);
    }

    static prototype2tstype(type: string): string {
        if (type.indexOf("int") != -1) return "number";
        if (type == 'float') return "number";
        return type;
    }


    static getChunk(str = "", left = "{", right = "}") {
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
                } else {
                    ++numRights;
                    idx = rightIdx;
                }
            } else if (rightIdx == -1) {
                console.log("less " + right);
                return str;
            } else if (leftIdx < rightIdx) {
                ++numLefts;
                idx = leftIdx;
            } else {
                ++numRights;
                idx = rightIdx;
            }
            if (idx != -1 && numLefts == numRights) {
                return str.substring(fristIdx + left.length, idx - 1);
            }
        }
    }


    static parse(lineArr: string[]): Message[] {
        var len = lineArr.length;
        var cache_pack: string | undefined;
        var cache_help: string | undefined;;
        var cache_mess: Message | undefined;
        var res_mess: Message[] = [];
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
    }

    static checkLine(line: string): LineRes {
        var res = new LineRes();
        var ci = line.indexOf("//");
        if (ci != -1) {
            res.help = line.substr(ci + 2);
            line = line.substr(0, ci);
        }
        var fileds = MyApp.fixEqu(line).replace(/(^\s*)|(\s*$)/g, "").split(" ");
        var i = fileds.length;
        while (--i > -1 && fileds[i].length == 0) fileds.pop();
        while (fileds.length > 0 && fileds[0].length == 0) fileds.shift();
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
    }

    static fixEqu(str: string): string {
        var arr = str.split("=");
        if (arr.length < 2) return str;
        return arr[0].replace(/(^\s*)/g, "") + " = " + arr[1].replace(/(\s*$)/g, "");
    }
}

interface Conf {
    proto2ts: Proto2TsConf;
}
interface Proto2TsConf {
    protoPath: string;
    layaPath: string;
    tsTemplate: string;
    tsPath: string;
}


class Message {
    pack: string | undefined;
    name: string | undefined;
    help: string | undefined;
    data: LineRes[] = [];
}

class LineRes {
    type: number | undefined;
    /** message name or param name */
    name: string | undefined;
    /** param: required\optional\repeated */
    mod: string | undefined;
    /** param id */
    id: number | undefined;
    /** param type */
    pvar: string | undefined;
    /** message help or param help or none's str */
    help: string | undefined;
}

enum LINE_TYP {
    NONE,
    PACK,
    MESSSTART,
    MESSEND,
    PARAM,
    HELPSTART,
    HELPEND,
    HELP
}
class PARAM_MOD {
    static REQUIRED = "required";
    static OPTIONAL = "optional";
    static REPEATED = "repeated";
}
class LINE_HEAD {
    static PACKAGE = "package";
    static MESSAGE = "message";
    static START = "{";
    static END = "}";
}
MyApp.run(); 