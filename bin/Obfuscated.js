"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Obfucated(s) {
    var a = [];
    var b = [];
    for (let i = 0; i < s.length; ++i) {
        a.push(s.charCodeAt(i));
        b.push(i);
    }
    for (let i = 0, len = a.length; i < len; ++i) {
        let ti = Math.floor(Math.random() * len);
        let at = a[ti];
        a[ti] = a[i];
        a[i] = at;
        let bt = b[ti];
        b[ti] = b[i];
        b[i] = bt;
    }
    var l1 = `var c=[],k=[${a.toString()}],i=[${b.toString()}];`;
    var l4 = `for(let j=0,l=k.length;j<l;++j){c[j]=k[i[j]];}`;
    var l5 = 'String.fromCharCode.apply(null,c);';
    console.log(l1);
    console.log(l4);
    console.log(l5);
}
exports.Obfucated = Obfucated;
Obfucated("abcdefg");
//# sourceMappingURL=Obfuscated.js.map