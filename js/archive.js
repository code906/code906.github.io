
var s = {
	
    /*获取坐标*/
	getPos : (node) =>{
        var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
                scrollt = document.documentElement.scrollTop || document.body.scrollTop;
        var pos = node.getBoundingClientRect();
        return {top:pos.top + scrollt, right:pos.right + scrollx, bottom:pos.bottom + scrollt, left:pos.left + scrollx }		
	},

	//constructor : this,


	initialize : function (options) {
        var inputId = options.inputId;
        this.input = document.querySelector(inputId);
        this.input.autocomplete="off";
        this.selectData = options.selectData;
        this._template = options._template;
        this.placeholder = options.placeholder;
        this.inputEvent();
	},

    /*创建wrap框架，一个UI界面*/
	createWarp : function(){
		var that = this;
        var inputPos = that.getPos(that.input);
        var div = that.rootDiv = document.createElement('div');
 
        // 设置DIV阻止冒泡
        that.rootDiv.addEventListener('click',function(event){
            event = event || window.event;
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        });

        // 设置点击文档隐藏弹出的选择框
        document.addEventListener('click', function (event){
            event = event || window.event;
            var target = event.target || event.srcElement;
            if(target == that.input) return false;

            if (that.menuBarBox) that.menuBarBox.classList.add('hide');
            if (that.ul) that.ul.classList.add('hide');
            if(that.myIframe) that.myIframe.classList.add('hide');
        });
        window.onresize = function() {
            if (that.menuBarBox) that.menuBarBox.classList.add('hide');
        };


        div.className = 'archiveBarSelector';
        div.style.position = 'absolute';
        div.style.left = inputPos.left + 'px';
        div.style.top = inputPos.bottom + 'px';
        div.style.zIndex = 999;

        // 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
        var isIe = (document.all) ? true : false;
        var isIE6 = that.isIE6 = isIe && !window.XMLHttpRequest;
        if(isIE6){
            var myIframe = that.myIframe =  document.createElement('iframe');
            myIframe.frameborder = '0';
            myIframe.src = 'about:blank';
            myIframe.style.position = 'absolute';
            myIframe.style.zIndex = '-1';
            that.rootDiv.appendChild(that.myIframe);
        }

        var childdiv = that.menuBarBox = document.createElement('div');
        childdiv.className = 'archiveBarBox';
        childdiv.id = 'archiveBarBox';
        childdiv.innerHTML = this._template.join('');
        var hotmenuBar = that.hotmenuBar =  document.createElement('div');
        hotmenuBar.className = 'hotmenuBar';
        childdiv.appendChild(hotmenuBar);
        div.appendChild(childdiv);
        that.createHotmenuBar();
    },

    /*在创建的wrap框架基础上，添加数据*/
    createHotmenuBar : function(){
        var odiv,odl,odt,odd,odda=[],str,key,ckey,sortKey,
            regEx = /^([1-9]\d*)\|([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)$/g,
            DataBox = this.selectData,
            firstFlag = true;

            DataBox.forEach((dataItem,i) => {

                if((key = i%4) == 0){ //每4个json表格数据创建一个页面
                    odiv = this[key] = document.createElement('div');//创建一个界面，往界面填表格数据
                    // 先设置全部隐藏hide
                    odiv.className = 'page-'+ key + ' ' + 'archiveBarTab hide';
                }
                

                {
                    odl = document.createElement('dl');
                    odt = document.createElement('dt');
                    odd = document.createElement('dd');
                    odt.innerHTML = '<a href="#" title=' + dataItem.year  +'>' + dataItem.year + '</a>';
                    
                    odda = [];
                    for(var m=0,n=dataItem.months.length;m<n;m++){
                        var content = (/([\u4E00-\u9FA5\uf900-\ufa2d]+)/g).exec(dataItem.months[m])[0]; //取中文显示
                        var num = (/([1-9]\d*)/g).exec(dataItem.months[m])[0]; //取数字显示
                        str = '<a href="#" title=' + dataItem.year + '/' + num +'>' + content + '</a>';
                        odda.push(str);
                    }
                    odd.innerHTML = odda.join('');
                    odl.appendChild(odt);
                    odl.appendChild(odd);
                    odiv.appendChild(odl);
                }
                // 移除第一个div的隐藏CSS
                if(firstFlag == true){   
                	odiv.classList.remove('hide');
                    firstFlag = false;
                }
                
                this.hotmenuBar.appendChild(odiv);
                

        });
        document.body.appendChild(this.rootDiv);
        /* IE6 */
        this.changeIframe();

        //this.searchLiBarEvent();    //去除模板_template的input后，该函数失效
        this.tabChange();
        this.hotMenulinkEvent();
    },

    /*在创建的wrap框架基础上，tabs切换*/
    tabChange : function(){
        var lis = this.menuBarBox.querySelectorAll('li');        
        var divs = this.hotmenuBar.querySelectorAll('div');
        var that = this;
        for(var i=0,n=lis.length;i<n;i++){
            lis[i].index = i;
            lis[i].onclick = function(){
                for(var j=0;j<n;j++){
                	lis[j].classList.remove('on');
                	divs[j].classList.add('hide');
                }
                this.classList.add('on');
                divs[this.index].classList.remove('hide');

                /* IE6 改变TAB的时候 改变Iframe 大小*/
                that.changeIframe();
            };
        }
    },

    hotMenulinkEvent : function(){
        var links = this.hotmenuBar.querySelectorAll('a');//寻找所有a
        var that = this;
        for(var i=0,n=links.length;i<n;i++){
            links[i].onclick = function(){
                //that.input.value = this.innerHTML;
                that.input.value = this.title;
                that.input.setAttribute('data-result',this.title);
                that.menuBarBox.classList.add('hide');
                /* 点击城市名的时候隐藏myIframe */
                that.myIframe && that.myIframe.add('hide');
            }
        }
    },

    inputEvent : function(){  
        var that = this;
        var defaultInput = this.placeholder;
        that.input.addEventListener("click", function(){
            event = event || window.event;
            if(!that.menuBarBox){
                that.createWarp();
            }else if(!!that.menuBarBox && that.menuBarBox.classList.contains('hide')){
                // slideul 不存在或者 slideul存在但是是隐藏的时候 两者不能共存
                if(!that.ul || (that.ul && that.ul.classList.contains('hide'))){
                    that.menuBarBox.classList.remove('hide');

                    var inputPos = that.getPos(this);
                    that.rootDiv.style.left = inputPos.left + 'px';

                    /* IE6 移除iframe 的hide 样式 */
                    //alert('click');
                    that.myIframe && that.myIframe.classList.remove('hide');
                    that.changeIframe();
                }
            }
        });
        that.input.addEventListener("focus", function(){
            that.input.select();
            if(that.input.value == defaultInput) that.input.value = '';
        });
 		that.input.addEventListener("blur", function(){
            if(that.input.value == '') that.input.value = defaultInput;
        });
        that.input.addEventListener("keyup", function(event){
            event = event || window.event;
            var keycode = event.keyCode;

            that.menuBarBox.classList.add('hide');
            that.createSearchUl();

            /* 移除iframe 的hide 样式 */
            that.myIframe && that.myIframe.classList.remove('hide');

            // 下拉菜单显示的时候捕捉按键事件
            if(that.ul && !that.ul.classList.contains('hide') && !that.isEmpty){
                that.KeyboardEvent(event,keycode);
            }
        });
    },

    searchResultUl:function(monthN,monthC,year){
        var str;
        str = '<li title = '+ year +'/'+ monthN +'><b class="archiveBarname">' + year + '</b><b class="archiveBarspell">' + monthC + '</b></li>';
        return str;
    },

    /*在创建的wrap框架基础上，搜索结果界面*/
    createSearchUl :function () {
        var searchData = this.selectData;
        var that = this;
        var str,match = null,searchResult=[];
        var regExChiese = /[一|二|三|四|五|六|七|八|九|十|十一|十二]月/g,
            regExNum = /([1-9]\d*)/g,
            regExEnglish = /([a-zA-Z]+)/g;

        var value = this.input.value.trim();
        // 当value不等于空的时候执行
        if (value !== '') {
            //var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
            var reg = new RegExp( value, 'i');
            // 此处需设置中文输入法也可用onpropertychange

            searchData.forEach((dataItem,i) => {
                if(dataItem.months instanceof Array){
                    for(var i=0,len=dataItem.months.length;i<len;i++){
                        if(reg.test(dataItem.months[i])){
                            var monthNum = regExNum.exec(dataItem.months[i]);
                            //var monthEN = regExEnglish.exec(dataItem.months[i]);
                            var monthCN = regExChiese.exec(dataItem.months[i]);

                            searchResult.push(that.searchResultUl(monthNum[0],monthCN[0],dataItem.year));
                        }
                    }
                }
            });

            this.isEmpty = false;
            // 如果搜索数据为空
            if (searchResult.length == 0) {
                this.isEmpty = true;
                str = '<li class="empty">对不起，没有找到数据 "<em>' + value + '</em>"</li>';
                searchResult.push(str);
            }
            // 如果slideul不存在则添加ul
            if (!this.ul) {
                var ul = this.ul = document.createElement('ul');
                ul.className = 'archiveBarslide';
                this.rootDiv && this.rootDiv.appendChild(ul);
                // 记录按键次数，方向键
                this.count = 0;
            } else if (this.ul && this.ul.classList.contains('hide')) {
                this.count = 0;
                this.ul.classList.remove('hide');
            }
            this.ul.innerHTML = searchResult.join('');
            /* IE6 */
            this.changeIframe();

            // 绑定Li事件
            this.searchLiEvent();
        }else{
        	this.ul && this.ul.classList.add('hide');
        	this.menuBarBox && this.menuBarBox.classList.remove('hide');
        	this.myIframe && this.myIframe.classList.remove('hide');

            this.changeIframe();
        }
    },

    /* IE6的改变遮罩SELECT 的 IFRAME尺寸大小 */
    changeIframe:function(){
        if(!this.isIE6)return;
        this.myIframe.style.width = this.rootDiv.offsetWidth + 'px';
        this.myIframe.style.height = this.rootDiv.offsetHeight + 'px';
    },

    /* *
     * 特定键盘事件，上、下、Enter键
     * @ KeyboardEvent
     * */

    KeyboardEvent:function(event,keycode){
        var lis = this.ul.querySelectorAll('li');
        var len = lis.length;
        var regExChiese = /([\u4E00-\u9FA5\uf900-\ufa2d]+)/g;
        switch(keycode){
            case 40: //向下箭头↓
                this.count++;
                if(this.count > len-1) this.count = 0;
                for(var i=0;i<len;i++){
                	lis[i].classList.remove('on');
                }
                lis[this.count].classList.add('on');
                break;
            case 38: //向上箭头↑
                this.count--;
                if(this.count<0) this.count = len-1;
                for(i=0;i<len;i++){
                	lis[i].classList.remove('on');
                }
                lis[this.count].classList.add('on');
                break;
            case 13: // enter键
                this.input.value = regExChiese.exec(lis[this.count].innerHTML)[0];
                this.ul.classList.add('hide');
                /* IE6 */
                this.myIframe && this.myIframe.classList.add('hide');
                break;
            default:
                break;
        }
    },

    /* *
     * 下拉的搜索框
     * @ searchLiBarEvent
     * */
     searchLiBarEvent:function (){
        var that = this;
        var liBarSearch =  this.querySelector('#menuBarSearch');
        liBarSearch.addEventListener('input',function(event){
            event = event || window.event;
            var target = event.target || event.srcElement;
            var value = liBarSearch.value.trim();

        })
     },

    /* *
     * 搜索结果的下拉列表的li事件
     * @ liEvent
     * */

    searchLiEvent:function(){
        var that = this;
        var lis = this.ul.querySelectorAll('li');

        for(var i = 0,n = lis.length;i < n;i++){
        	lis[i].addEventListener('click',function(event){
                event = event || window.event;
                var target = event.target || event.srcElement;
                that.input.value = this.title;
                that.input.setAttribute('data-result',this.title);

                that.ul.classList.add('hide');
                /* IE6 下拉菜单点击事件 */
                that.myIframe && that.myIframe.classList.add('hide');
            });
            lis[i].addEventListener('mouseover',function(event){
                event = event || window.event;
                var target = event.target || event.srcElement;
                target.classList.add('on');
            });
            lis[i].addEventListener('mouseout',function(event){
                event = event || window.event;
                var target = event.target || event.srcElement;
                target.classList.remove('on');
            })
        }
    }
}


var Vmoment = {

    /* HTML模板 */
    _template : [
        '<p class="tip">年月(支持汉字/英文/数字搜索)</p>',
        '<ul id="menul">',
        // '<li><input type="text" id="menuBarSearch"/></li>',
        '<li class="on">年月数据</li>',
        //'<li>2016~2019</li>',
        //'<li>2020~2023</li>',
        '</ul>'
    ],

    menuBarSelector : function () {
        arguments[0]._template = Vmoment._template;
        this.initialize.apply(this, arguments);
    }

};



//Main function entry
const archiveClick = () =>{

	var archive_json = (typeof ARCHIVE != "undefined") ? ARCHIVE.DATA.replace(/&#34;/g,'"').replace(/&#39;/g,"'") : '';
    if(archive_json == '') return;
	archive_json = JSON.parse(archive_json);
	//console.log(archive_json);

    /*input*/
	Vmoment.menuBarSelector.prototype = s;
	new Vmoment.menuBarSelector({
		inputId:'#archivesBarinput',
		selectData:archive_json,
		placeholder:'请输入内容'
	});

    /*button*/
	var result,
        archivesBarBtn = document.querySelector('#archivesBarBtn'),
        archivesBarInput = document.querySelector('#archivesBarinput');
    archivesBarBtn.addEventListener('click',() => {
        result = archivesBarInput.getAttribute('data-result');

        if(result){
            archivesBarBtn.querySelector('a').href = '/archives/' + result;
        }
    });
};

(function (w,d){
    /*暴露函数供外部使用*/
    var k = { archiveClick:archiveClick };
    Object.keys(k).reduce(function (g, e) {
        g[e] = k[e];
        return g
    }, w.BLOG);
})(window, document);