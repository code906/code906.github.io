//设置cookies
function setCookie(c_name, value, expiredays) {                   
    var exp = new Date();
    exp.setTime(exp.getTime() + expiredays*24*60*60*1000);           
    document.cookie = c_name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";
} 


//读取cookies 
function getCookie(c_name) {
    var arr, reg = new RegExp("(^| )" + c_name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}

// 检查cookie 
function checkCookie(c_name) {     
    username = getCookie(c_name);     
    console.log(username);     
    if (username != null && username != "")     
        { return true; }     
    else
        { return false;  }
}

// 清除cookie 
function clearCookie(name) {     
    setCookie(name, "", -1); 
}

const showSubMenus = (menu) =>{
    if(menu){
        //menu.classList.add();
    }
};

const reset = (m,article) =>{
    m.addEventListener('click',()=>{
        document.cookie = ''; 
        article.setAttribute('style','');
    });
    
}

const reloadCookies = (layout,$) =>{
    if(getCookie('header_fixed') == 'true'){
        layout.classList.add('app-header-fixed');  
        $('input[name="header-fixed"]').checked=true;
    }else{
        layout.classList.remove('app-header-fixed');
    }

    if(getCookie('aside_fixed') == 'true'){
        layout.classList.add('app-aside-fixed');
        $('input[name="aside-fixed"]').checked=true;
    }else{
        layout.classList.remove('app-aside-fixed');
    }

    if(getCookie('aside_hide') == 'true'){
        layout.classList.add('app-aside-hide');
        $('input[name="aside-hide"]').checked=true;
    }else{
        layout.classList.remove('app-aside-hide');
    }

    if(getCookie('layout_box') == 'true'){
        layout.classList.add('container');
        $('input[name="layout-boxed"]').checked=true;
    }else{
        layout.classList.remove('container');
    }
   
};

const switchSet = (layout,a,b,c,d) =>{

    a.addEventListener('change',(event)=>{
        a.checked ? layout.classList.add('app-header-fixed') : layout.classList.remove('app-header-fixed');
        setCookie('header_fixed',a.checked,7);
    });
    b.addEventListener('change',(event)=>{
        b.checked ? layout.classList.add('app-aside-fixed') : layout.classList.remove('app-aside-fixed');
        setCookie('aside_fixed',b.checked,7);
    });   
    c.addEventListener('change',(event)=>{
        c.checked ? layout.classList.add('app-aside-hide') : layout.classList.remove('app-aside-hide');
        setCookie('aside_hide',c.checked,7);
    }); 
    d.addEventListener('change',(event)=>{
        d.checked ? layout.classList.add('container') : layout.classList.remove('container');
        setCookie('layout_box',d.checked,7);;
    }); 
};

const changeFontSize = (layout,a,b) =>{
    var vnum = 0;

    a.addEventListener('click',()=>{
        vnum++;
        layout.forEach((item) =>{
            item.setAttribute('style','font-size:calc(100% + '+ vnum +'px)');
        });
    });

    b.addEventListener('click',()=>{
        if(vnum < 0) {vnum=0;return;}
        vnum--;
        layout.forEach((item) =>{
            item.setAttribute('style','font-size:calc(100% + '+ vnum +'px)');
        });
    });
};

const changeTheme = (layout,theme) =>{
    var oldClass='';
    theme.forEach((item,i) => {
        item.addEventListener('click',()=>{
            if(item.checked == true && !layout.classList.contains(item.value)){ 
                oldClass != '' && layout.classList.remove(oldClass);
                layout.classList.add(item.value);
                oldClass = item.value;
                setCookie('theme_mode',item.value,7);
            }
        });
    });
};

const switchReadMode = (layout,read) =>{
    var oldClass='';
    read.forEach((item,i) => {
        item.addEventListener('click',()=>{
            if(item.checked == true ){
                for(var j=0,len=layout.length;j<len;j++){
                    if(!layout[j].classList.contains(item.value)){
                        oldClass != '' && layout[j].classList.remove(oldClass);
                        layout[j].classList.add(item.value);                        
                    }
                }
                oldClass = item.value;
                setCookie('read_mode',item.value,7);
            }
        });
    });
};


//Main function entry
(function () {
    var body = document.body,
        d = document,
        $ = d.querySelector.bind(d),
        $$ = d.querySelectorAll.bind(d),

        ex = $('.setting-box-ex');

    //基本显示/隐藏
    $('#setting-box-ex').addEventListener('click',(event)=>{
        ex.classList.toggle('active');
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;  
    });

    ex.addEventListener('click',(event)=>{
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;  
    });

    d.addEventListener('click', (event)=>{
        event = event || window.event;
        var target = event.target || event.srcElement;
        if(ex.classList.contains('active')) ex.classList.remove('active');
    });

    //预存Cookies数据,以便页面刷新或重载提取之前的值
    reloadCookies($('#alllayout'),$);

    //一些设置
    switchSet($('#alllayout'),
        $('input[name="header-fixed"]'),
        $('input[name="aside-fixed"]'),
        $('input[name="aside-hide"]'),
        $('input[name="layout-boxed"]'),
    );

    //sub-menus 位置调整

    //手机端sub-menu 展开/收缩

    //复位
    reset($('#reset'),
        $('article')
    );

    //主题
    changeTheme($('#alllayout'),
        $$('input[name="theme"]')
    );

    //字体大小
    changeFontSize($$('article'),
        $('#font-add'),
        $('#font-minus')
    );


    //阅读模式
    switchReadMode($$('article'),
        $$('input[name="readMode"]')
    );

}).call(this);