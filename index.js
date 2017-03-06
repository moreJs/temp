'use strict';

class Transform{
    constructor(keyWord){
        this.nick = /(@([\w\d_]*))/g;
        this.reg = /[\(\[\{\\\^\$\?\*\.\+\|\}\]\)]/g;
        // keyWord 要对特殊字符进行转义
        this.keyWordReg = new RegExp(`(${this.escape(keyWord)})`, 'g');
        this.clearEnv();
    }
    // key 中的正则元字符进行转义
    escape(str) {
        return str.replace(this.reg, (s0, s1) =>  `\\${s0}`);
    }
    // 两次 replace 
    exe(msg) {
        // 检查下，是否有冲突:
        //  即填充的<a href="/profile/XXX"> 里面是否包括keyword，如有，则需要编码下，没有，则跳过
        this.checkConflict(msg);
        let ret = msg.replace(this.nick, (s0, s1, s2) => {
                            if(this.conflict) {
                                return `${this.decodeStr}${s1}</a>`;
                            }
                            return `<a href="/profile/${s2}" target="_blank">${s1}</a>`;
                        })
                      .replace(this.keyWordReg, `<em class="highlight">$1</em>`);
        if(this.conflict) {
            return ret.replace(new RegExp(`(${this.randomStr})`), this.placeholder);
        }
        // 打扫卫生，不影响下一次调用
        this.clearEnv();
        return ret;
    }

    checkConflict(msg) {
        const simple = this.nick.exec(msg);
        if(simple && simple[1] && simple[2]) {
            const temp = `<a href="/profile/${simple[2]}" target="_blank">`;
            if(this.keyWordReg.test(temp)) {
                this.conflict = true;
                this.decodeStr = temp.replace(this.keyWordReg, ($0, $1, $2) => {
                    if(!this.placeholder) {
                        this.placeholder = $1;
                    }
                    return this.decode($1);
                });
            }else{
                this.conflict = null;
            }
        }else {
            this.conflict = null;
        }
    }
    // decode, 随机生成8位随机数字
    decode(str) {
        if(!this.randomStr) {
            const gen = () => Math.floor(Math.random()*10);
            let ret = new Array(8);
            let i = 0;
            while(i < ret.length){
                ret[i++] = gen();
            }
            this.randomStr = ret.join('');
        }
        return this.randomStr;
    }
    // 清理环境
    clearEnv() {
        this.decodeStr = null;
        this.placeholder = null;
        this.conflict = null;
        this.randomStr = null;
    }
}


module.exports = Transform;