'use strict';

const assert = require('power-assert');
const Transform = require('../index');


describe('字符串转化', function() {

    it('keyword里面没有正则表达式特殊字符', function() {
        this.msg = `@super_vip,今晚K歌吗?vip包间`;
        this.wanted = `<a href="/profile/super_vip" target="_blank">@super_<em class="highlight">vip</em></a>,今晚K歌吗?<em class="highlight">vip</em>包间`;
        const transform = new Transform('vip');
        const ret = transform.exe(this.msg);
        assert(ret === this.wanted);
    });

    it('keyword里面有正则表达式特殊字符', function() {
        this.msg = `@super_+vip,今晚K歌吗?+vip包间`;
        this.wanted = `<a href="/profile/super_" target="_blank">@super_</a><em class="highlight">+vip</em>,今晚K歌吗?<em class="highlight">+vip</em>包间`;
        const transform = new Transform('+vip');
        const ret = transform.exe(this.msg);
        assert(ret === this.wanted);
    });



});