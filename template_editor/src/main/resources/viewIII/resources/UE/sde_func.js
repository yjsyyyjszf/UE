/*
 * 自定义功能方法
 * Editor v2.1.0 
 * author: king-hu@todaytech.com.cn 
 * createtime: FRI, 28 Apr 2017 10:23:42 GMT

 */
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}
var databind = $W.databind.databind({
    id: 'save',
    isSrv: true,
    groupId: "editor.editorSrvII"
});

window.createElement = function (type, name) {
    var element = null;
    try {
        element = document.createElement(type);
        if (element) {
            element.id = name;
        }
    } catch (e) {
    }
    if (element == null) {
        element = document.createElement(type);
        element.name = name;
    }
    return element;
}
try {
    SDE.Plugins = [];
    SDE.Plugins_left = [];
} catch (e) {
    //debugger
}

var sdeUserFun = function () {
};//自定义方法。sdeUserFun.prototype.addFunction

var sdeFun = function () {
};

sdeFun.prototype = {
    test: function (myName, title, jsons) {
        //console.log("test");
    },
    /**
     * No1. 在工具条上自定义菜单参数1=id,参数2=名称,参数3=json,
     * 按钮操作：将第三个jsons数组赋空，即jsons=[]，再新加第四个参数，作为触发方法，如addSDEPlugins("sde-toolbar-btn", "按钮", [],"testBtn()");；
     *
     */
    addSDEPlugins: function (name, title, jsons, onclick) {
        var obj = this.getSDEPluginsObj(name, title, jsons, onclick);
        SDE.Plugins.push(obj);
    },
    /**
     * No1.1. 同上
     */
    addSDEPlugins_left: function (name, title, jsons, onclick) {
        var obj = this.getSDEPluginsObj(name, title, jsons, onclick);
        SDE.Plugins_left.push(obj);
    },
    /**
     * No1.2. 同上
     */
    getSDEPluginsObj: function (name, title, jsons, onclick) {
        (typeof jsons === 'string') ? jsons = {} : jsons;
        var obj = {
            onExpand: jsons.length ? false : true,
            onclick: onclick ? onclick : "",
            name: name,
            title: title,
            editor: null,
            init: function () {
                var div = document.createElement('div');
                div.className = 'tab-content-item';
                div.setAttribute('id', this.name);
                for (var i = 0; i < jsons.length; i++) {
                    var json = jsons[i];
                    var _div = document.createElement('div');
                    _div.className = 'tab-content-item-panel';
                    //ToDo 可以进行样式图标自定义
                    _div.innerHTML = ' <div class="tab-content-item-panel-label">' + json.name + '</div>'
                        + '<div class="tab-content-item-panel-content">'
                        + '	<div style="float:left;">'
                        + '		<div class="tab-content-item-panel-content-control" onclick="' + json.onclick + '" title="' + json.title + '">'
                        + '			<div class="sde-icon sde-icon-emrdesign" style="width: 60px;height: 32px;"></div>'
                        + '			<div style="text-align: center;">' + json.title + '</div>'
                        + ' 	</div>'
                        + '	</div>'
                        + '</div>';
                    div.appendChild(_div);
                }
                return div;
            }
        }
        return obj;
    },
    /**
     * No2.制作模板库html
     *
     */
    makePluginStore: function () {
        var pluginsJson = [];
        var plugins = this.pluginFindAll("");
        for (var i = 0, l = plugins.length; i < l; i++) {
            var plugin = plugins[i];
            var json = this.pluginToJson(plugin);
            var html = this.makeHtmlByPluginJson(json);
            json.HTML = this.getONodeHtml(json, html);
            pluginsJson.push(json);
        }
        return pluginsJson;
    },
    /**
     * No3.将数据库读取到的plugin转成json
     *
     */
    pluginToJson: function (plugin) {
        var json = {};
        if (plugin != null && plugin != '') {
            json.VER_ID = plugin.ver_id;
            json.PLUGINID = plugin.id; // 新加的插件Id ，用于后期可能出现的插件修改；
            json.ID = plugin.code ? plugin.code : "";
            json.NAME = plugin.name ? plugin.name : "";
            json.TAG = plugin.tag ? plugin.tag : "";
            json.DESCNAME = plugin.descname ? plugin.descname : "";
            json.REQUIRED = plugin.required ? plugin.required : "0";
            json.READONLY = plugin.readonly ? plugin.readonly : "0";
            json.TEXT_COLOR = plugin.text_color ? plugin.text_color : "000000";
            json.VALUE = plugin.value ? plugin.value : "";
            json.ISDISPLAY = plugin.isdisplay ? plugin.isdisplay : "0";
            json.TYPE = plugin.type;
            json.BINDINGDATA = JSON.parse(plugin.bindingdata ? plugin.bindingdata : "{}");
            json.CONNCODE = plugin.conncode || "";
            json.RULE = plugin.rule || "";
            json.CONN_TEMPLATE_VER_ID = plugin.conn_template_ver_id || "";
            json.LABEL = plugin.label||"";
            json.VERTICAL = plugin.vertical||"";
            if (plugin.isbrackets) {
                json.ISBRACKETS = plugin.isbrackets;
            }
            if (plugin.type != null && plugin.type == 'text') {
                json.TEXTCHECK = plugin.textcheck||"";
                json.CHECKMSG = plugin.checkmsg||"";
                json.VERIFYTYPE = plugin.verifytype||"";
                json.TEXTLENGTH = plugin.textlength||"";
                json.TEXTCOLS = plugin.textcols||"";
                json.DBLCLICKFUNCTION = plugin.dblclickfunction||"";
            } else if (plugin.type != null && plugin.type == 'date') {
                json.MIN = plugin.min;
                json.MAX = plugin.max;
                json.FORMAT = plugin.format;
            } else if (plugin.type != null && plugin.type == 'checkbox') {
                json.VERIFYTYPE = plugin.verifytype;
                json.REMOTEURL = plugin.remoteurl;
                json.ISRIGHTCHECKBOX = plugin.isrightcheckbox;
            } else if (plugin.type != null && plugin.type == 'select') {
                json.VERIFYTYPE = plugin.verifytype;

                json.REMOTEURL = plugin.remoteurl;
                json.FREEINPUT = plugin.freeinput;
                var datas = json.BINDINGDATA;
                if (datas && datas != undefined && datas != null) {
                    for (var i = 0, l = datas.length; i < l; i++) {
                        if (datas[i].SELECTED != undefined && datas[i].SELECTED == 1) {
                            json.TEXT = datas[i].TEXT;
                            break;
                        } else {
                            json.TEXT = "";
                        }

                    }
                } else {
                    json.TEXT = "";
                }
                if (plugin.plugin_ex_json) {
                    json.REMOTEURL = plugin.plugin_ex_json.remoteurl;
                    json.FREEINPUT = plugin.plugin_ex_json.freeinput;
                }
            }

        }
        return json;

    },
    /**
     * No4. 获取所有的控件
     */
    pluginFindAll: function () {
        var param = {};
        var plugins = findBySrvFunParam("pluginSrv", "findAll", param, false);
        //console.log("pluginFindAll:" + JSON.stringify(plugins));
        return plugins;
    },
    /**
     * No5 根据参数获取控件
     */
    pluginFindByParam: function (param) {
        var plugins = findBySrvFunParam("pluginSrv", "findByParam", param, false);
        //console.log("pluginFindByParam:" + JSON.stringify(plugins));
        return plugins;
    },
    /**
     * No6 根据Code获取控件
     */
    pluginFindByCode: function (code) {
        var param = {code: code};
        var plugins = findBySrvFunParam("pluginSrv", "findByCode", param, false);
        return plugins;
    },
    /**
     * No6.1 根据Code获取最新版本号的控件
     */
    pluginFindByCode2Newest: function (code) {
        var param = {code: code};
        var plugins = findBySrvFunParam("pluginSrv", "findByCode2Newest", param, false);
        return plugins;
    },
    /**
     * No7 根据版本号获取控件
     */
    pluginFindByVId: function (param) {
        var plugins = findBySrvFunParam("pluginSrv", "findByVId", param, false);
        //console.log("pluginFindByVId:" + JSON.stringify(plugins));
        return plugins;
    },
    /**
     * No8 新增控件
     *
     */
    addPlugin: function (param, html) {
        var json = {};
        param = this.jsonKeyToLowerCase(param);
        param.bindingdata = JSON.stringify(param.bindingdata);
        json.funName = "add";
        json.template_type_id = 1;
        json.HTML = html;
        param = $.extend(true, json, param);
        var result = srvFunByParam("pluginSrv", "add", param, false);
        return result.data;
    },
    /**
     * No8.1 更新控件
     *
     */
    updatePlugin: function (param) {
        var json = {};
        param = this.jsonKeyToLowerCase(param);
        param.bindingdata = JSON.stringify(param.bindingdata);
        json.template_type_id = 1;
        param = $.extend(true, json, param);
        var result = srvFunByParam("pluginSrv", "update", param, false);
        return result;
    },
    /**
     * No9 makeHtmlByPluginJson
     *
     */
    makeHtmlByPluginJson: function (json) {
        var show = "", showData, showCheckbox = [];
        if (json.VALUE) {
            show = json.VALUE;
            /*2017-12-24 king 计算表达式 start*/
            expshow = json.EXPSTR;
            var thisSDE = parent.sde ? parent.sde : sde;
            if (thisSDE.isSDEExpStr(expshow)) {
                //20180111 king 控件值变化时,自动计算表达式
                var arr = thisSDE.expStrToSetCode(expshow);
                thisSDE.sdes.addPluginAttrByCode(arr,json.CODE);

                var score = thisSDE.getControlScore();
                var replaceStr = thisSDE.expReplaceMath(expshow);
                var expNum = eval(replaceStr);
                if(typeof expNum=="number"){ expNum = expNum.toFixed(2)}
                json.VALUE = expNum;//将计算出来的结果赋为控件值
                show = expNum;
            }
            /*2017-12-24 king 计算表达式 end*/
        } else if ((window.SDE_CONFIG && window.SDE_CONFIG.SDE_OPEN_DESC == '1') || (parent.window.SDE_CONFIG && parent.window.SDE_CONFIG.SDE_OPEN_DESC == '1')) {
            show = json.DESCNAME || '';
        }

        if (json.TYPE == 'select') {
            var n = json.BINDINGDATA;
            for (var i = 0, l = n.length; i < l; i++) {
                if (n[i].SELECTED === 1 || n[i].VALUE === json.VALUE) {
                    show = n[i].TEXT
                }
            }
        }
        if ((json.TYPE == 'checkbox') && json.BINDINGDATA && json.BINDINGDATA.length > 0) {
            var b = '<span class="selVal" id="selVal" contenteditable="false" style="padding:0px 6px; border: 1px solid #000;" >&nbsp;</span> &nbsp;';
            for (var i = 0, str, bl = json.BINDINGDATA.length; i < bl; i++) {
                var temp = json.BINDINGDATA[i];
                var aLabel = "";
                if (json.VERIFYTYPE == "radio") {//单选框
                    //str = '<label><input name="'+json.ID+'" type="radio" ' + ((temp.CHECKED != undefined && temp.CHECKED == 1) ? ' checked="checked" ' : '') + '  value="' + temp.VALUE + '" text="' + temp.TEXT + '"/>' + temp.TEXT + '&nbsp;</label>';
                    if(json.VERTICAL){
                        aLabel = "verLabel";
                    }
                    if (json.ISRIGHTCHECKBOX == '1') {
                        str = '<label class=' + aLabel + '>' + temp.TEXT + '<input name="' + json.ID + '" type="radio" ' + ((temp.CHECKED != undefined && temp.CHECKED == 1) ? ' checked="checked" ' : '') + '  value="' + temp.VALUE + '" text="' + temp.TEXT + '"/>&nbsp;</label>';
                    } else {
                        str = '<label class=' + aLabel + '><input name="' + json.ID + '" type="radio" ' + ((temp.CHECKED != undefined && temp.CHECKED == 1) ? ' checked="checked" ' : '') + '  value="' + temp.VALUE + '" text="' + temp.TEXT + '"/>' + temp.TEXT + '&nbsp;</label>';
                    }

                } else if (json.VERIFYTYPE == "selVal") {//选值框
                    str = b + '<span class="selVal" id="selVal_' + temp.VALUE + '" contenteditable="false" val="' + temp.VALUE + '" text="' + temp.TEXT + '">' + temp.VALUE + "." + temp.TEXT + '</span> &nbsp;';
                    b = '';
                } else {
                    if (json.ISRIGHTCHECKBOX == '1') {
                        str = '<label>' + temp.TEXT + '<input type="checkbox" ' + ((temp.CHECKED != undefined && temp.CHECKED == 1) ? ' checked="checked" ' : '') + '  value="' + temp.VALUE + '" text="' + temp.TEXT + '"/></label>';
                    } else {
                        str = '<label><input type="checkbox" ' + ((temp.CHECKED != undefined && temp.CHECKED == 1) ? ' checked="checked" ' : '') + '  value="' + temp.VALUE + '" text="' + temp.TEXT + '"/>' + temp.TEXT + '</label>';
                    }
                }
                showCheckbox.push(str);
            }
            showData = showCheckbox.join('');
        } else {
            showData = show;
        }
        var point = json.ISREDPOINT == 1 ? " sde-right-point" : '';
        var required = json.REQUIRED == 1 ? " sde-require" : '';
        var span_input_width = "";
        var span_input_class = "";
        if (json.VERIFYTYPE && json.VERIFYTYPE == "textarea") {
            var rows = json.TEXTLENGTH || '5';
            var cols = json.TEXTCOLS || '80';
            showData = '<textarea id="textareaId" rows="' + rows + '" cols="' + cols + '" class="sde-textarea-position"></textarea>';
        } else if (json.TEXTLENGTH && json.VERIFYTYPE == "input") {
            var width = json.TEXTLENGTH + 'px;';
            showData = '<input type="text" style="width:' + width + 'border:0;background:transparent;"/>';
        } else if (json.TEXTLENGTH) {
            span_input_width = 'width:' + json.TEXTLENGTH + 'px;';
            span_input_class = " span_input";
        }
        var contenteditable = json.TYPE == 'text' ? "plaintext-only" : 'true';
        var displayNone = json.ISBRACKETS == 1 ? "display:none; " : '';
        var jsonID = json.ID || '';
        if (json.TYPE !== 'checkbox' && json.OLDVALUE) showData = json.OLDVALUE;
        var sde_right_iconmarks = '';
        var iconmarks = window.SDE_CONFIG || parent.window.SDE_CONFIG;
        iconmarks = iconmarks.ICONMARKS;
        if (iconmarks == 1 || iconmarks == '1') {
            switch (json.TYPE) {  //针对不同下拉框，用不同图标标记 --start Nothing 2017-11-24
                case "date":
                    sde_right_iconmarks = "own_icon_date";
                    break;
                case "select":
                    if (json.VERIFYTYPE == "checkbox") {
                        sde_right_iconmarks = "own_icon_checkbox";
                    } else {
                        sde_right_iconmarks = "own_icon_select";
                    }
                    break;
                case "text":
                    sde_right_iconmarks = "own_icon_text";
                    break;
                case "checkbox":
                    if (json.VERIFYTYPE == "radio") {
                        sde_right_iconmarks = "own_icon_radio";
                    } else {
                        sde_right_iconmarks = "own_icon_checkbox";
                    }

                    break;
                default:
                    break;
            }
        }
        var vBlock = "";
        if(json.VERTICAL) vBlock = "display:inline-block";
        var html = '<span _id="' + jsonID + '" style="' + displayNone + 'color:' + ((json.READONLY == 1) ? '#808080' : '#0000FF') + '" contenteditable="false" class="sde-left" >[</span>' +
            '<span _id="' + jsonID + '" title="' + json.DESCNAME + '" style="color:#' + json.TEXT_COLOR + ';'+ vBlock + span_input_width + '" class="sde-value' + span_input_class + '" ' + ((json.READONLY == 1) ? 'contenteditable="false"' : 'contenteditable="' + contenteditable + '" ') + '>' +
            showData +
            '</span>' +
            '<span _id="' + jsonID + '" style="' + displayNone + 'color:' + ((json.READONLY == 1) ? '#808080' : '#0000FF') + '" contenteditable="false" class="sde-right' + point + required + ' ' + sde_right_iconmarks + '">' + ']</span>';
        return html;
    },
    /**
     * No10 getONodeHtml
     *
     */
    getONodeHtml: function (json, html) {
        var oNode;
        var oNodeHtml;
        try {
            oNode = createElement('span', json.ID);
            oNode.setAttribute('_id', json.ID);
            oNode.setAttribute('title', json.NAME);
            oNode.setAttribute('type', json.TYPE);
            if (json.VER_ID) oNode.setAttribute('ver_id', json.VER_ID);
            if (json.VERIFYTYPE) oNode.setAttribute('verifytype', json.VERIFYTYPE);
            if (json.RULE) oNode.setAttribute('rule', json.RULE);
            if (json.DBLCLICKFUNCTION) oNode.setAttribute('_dblclick', json.DBLCLICKFUNCTION);
            oNode.setAttribute('sde-model', JSON.stringify(json));
            oNode.setAttribute("contenteditable", "false");
            oNode.setAttribute('class', 'sde-bg');
            oNode.innerHTML = html;
            //增加控件前边显示名称功能 Nothing 2018-01-12
            if(json.LABEL){
                oNodeHtml = "<span _name="+ json.NAME +">"+ json.LABEL +"</span>"+oNode.outerHTML;
            }else{
                oNodeHtml = oNode.outerHTML;
            }
            if (json.ISDISPLAY == 1) {
                oNodeHtml = "<span style='display: none;'>" + oNodeHtml + "</span>";
            }
            return oNodeHtml;
        } catch (e) {
            alert('控件异常，请联系管理员！');
            return false;
        }
    },
    /**
     * No11.控件已经存在，是否继续
     */
    pluginIsContinue: function (plugin) {
        var oNodeHtml;
        if (window.confirm('该控件编码：' + plugin.code + ' 模板库已经存在，是否使用原控件?')) {
            oNodeHtml = this.pluginToHtml(plugin);
        } else {
            oNodeHtml = false;
        }
        return oNodeHtml;
    },
    /**
     * No11.1.pluginToHtml
     */
    pluginToHtml: function (plugin) {
        var oNodeHtml;
        var pToJson = this.pluginToJson(plugin);
        var htmlEx = this.makeHtmlByPluginJson(pToJson);
        oNodeHtml = this.getONodeHtml(pToJson, htmlEx);
        return oNodeHtml;
    },
    /**
     * No12.根据id删除控件
     */
    pluginDeleteByVId: function (Vid) {
        Vid = Vid || "";
        var data = srvFunByParam("pluginSrv", "deleteByVId", {ver_id: Vid}, false);
        return false;
    },
    /**
     * No13. 模板保存
     *
     */
    templateSave: function (param) {
        var content = sde.html(); 					// 所有的html
        var templateDatas = sde.getAllControl();  	// 控件指标数据
        var defaults = {};
        defaults.type_id = 1; 						// 模板类型ID，TP_TEMPLATE_TYPE的主键
        defaults.org_id = 1; 						// 组织机构ID
        defaults.name = '模板名称'; 					// 模板名称
        defaults.content = content;
        defaults.templateDatas = templateDatas;
        param = $.extend(true, defaults, param);
        //console.log('templateSave：' + JSON.stringify(param));
        var data;
        if (window.confirm('请选择确定或者取消?')) {
            var data = srvFunByParam("templateSrv", "addTemplate", param, false);
        }
        return data;
    },

    /**
     * No14.1. templateFindAll
     */
    templateFindAll: function (param) {
        var template = findBySrvFunParam("templateSrv", "findAllTemplate", param, false);
        return template;
    }, /**
     * No14.2. 请用findByVer_Id(verId);
     */
    templateFindByVId: function (verId) {
        var template;
        var param = {
            template_ver_id: verId
        };
        template = findBySrvFunParam("templateSrv", "findByVer_Id", param, false);
        return template;
    },

    /**
     * No14.3 templateFindById 第一个参数是模板id 将获取最新版本的模板 第二个参数是版本号，必须与第一个参数结合用
     * 如果要findByVerId，请用findByVer_Id(param);
     */
    templateFindById: function (templateId, verId) {
        var template;
        var param = {
            template_id: templateId,
            template_ver_id: verId
        };
        template = findBySrvFunParam("templateSrv", "findById", param, false);
        return template;
    }, /**
     * No14.4. 请用findByVer_Id(verId);
     */
    templateFindByVId: function (verId) {
        var template;
        var param = {
            template_ver_id: verId
        };
        template = findBySrvFunParam("templateSrv", "findByVer_Id", param, false);
        return template;
    },
    /**
     * No15.修改模板/模板数据
     * 描述:
     * param.isRemoveData默认为没有值
     * param.isRemoveData有值时,将执行删除数据,重新插入操作.
     * param.isRemoveData没有值时,将根据控件版本id和模板版本id进行update更新.
     */
    updateTemplate: function (param) {
        var content = sde.html(); 					// 所有的html
        var templateDatas = "";
        try {
            templateDatas = sde.getAllControl();  	// 控件指标数据
        } catch (e) {
        }
        var defaults = {};
        defaults.type_id = 1; 						// 模板类型ID，TP_TEMPLATE_TYPE的主键
        defaults.org_id = 1; 						// 组织机构ID
        defaults.name = '模板名称'; 					// 模板名称
        defaults.content = content;
        defaults.template_ver_id = 1;
        defaults.templateDatas = templateDatas;
        defaults.isRemoveData;                      //有值时,将执行删除数据,重新插入操作...没有值时,将根据控件版本id和模板版本id进行update更新.
        param = $.extend(true, defaults, param);
        //console.log('templateSave：' + JSON.stringify(param));
        var data;
        if (window.confirm('请选择确定或者取消?')) {
            var data = srvFunByParam("templateSrv", "updateTemplate", param, false);
        }
        return data;
    },
    /**
     * No15.1.模板另存
     */
    templateCopy: function () {
        var template = {};
        console.log('未完待续。。。');
        return template;
    },
    /**
     * No15.2.根据模板内容添加模板数据
     */
    addTempDateByContent: function (param) {
        var date1 = new Date().getTime();
        console.log("查询条件:" + JSON.stringify(param));
        var datas = srvFunByParam("templateSrv", "findAllTemplate", param, false);//查询出需要新增的模板
        console.log("模板个数:" + datas.data.length);
        for (var i = 0, rl = datas.data.length; i < rl; i++) {
            var date11 = new Date().getTime();
            var templ = datas.data[i];
            var con = templ.content;
            var sdeModels = $(con).find("span[id][sde-model]");//将模板的content转换成JQ对象，解析出所有的控件
            var templatePlugin = [];
            for (var ii = 0, il = sdeModels.length; ii < il; ii++) {
                var pluginJson = JSON.parse(sdeModels[ii].getAttribute("sde-model"));
                var goal = sde.pluginJsonToGoal(pluginJson);
                templatePlugin.push(goal);
            }
            var param = {template_ver_id: templ.template_ver_id, templateDatas: templatePlugin};
            var res = srvFunByParam("templateSrv", "addTemplateData", param, false);
            console.log(i + ",template_ver_id=" + templ.template_ver_id + ",耗时：" + (new Date().getTime() - date11) + ",执行结果=" + JSON.stringify(res.code));
        }
        ;
        console.log("总耗时：" + (new Date().getTime() - date1));
    },
    /**
     * No15.2.根据模板内容添加模板数据
     */
    addTempDateByContent2: function (param) {
        var date1 = new Date().getTime();
        var addTDParam = [];
        var datas = srvFunByParam("templateSrv", "findAllTemplate", param, false);//查询出需要新增的模板
        for (var i = 0, rl = datas.data.length; i < rl; i++) {
            var date11 = new Date().getTime();
            var templ = datas.data[i];
            var con = templ.content;
            var sdeModels = $(con).find("span[id][sde-model]");//将模板的content转换成JQ对象，解析出所有的控件
            var templatePlugin = [];
            for (var ii = 0, il = sdeModels.length; ii < il; ii++) {
                var pluginJson = JSON.parse(sdeModels[ii].getAttribute("sde-model"));
                var goal = sde.pluginJsonToGoal(pluginJson);
                templatePlugin.push(goal);
            }
            addTDParam.push({template_ver_id: templ.template_ver_id, templateDatas: templatePlugin});
            console.log(i + ",template_ver_id=" + templ.template_ver_id + "，耗时：" + (new Date().getTime() - date11));
        }
        ;
        var addTDParams = {addTempDateArr: addTDParam};
        var res = srvFunByParam("templateSrv", "addTemplateDataArr", addTDParams, false);
        console.log("总耗时：" + (new Date().getTime() - date1));
    },
    /**
     *
     * No16. 根据模板Id删除模板
     */
    templateDeleteByVid: function (templateId) {
        param = {};
        param.template_ver_id = templateId;
        var template = findBySrvFunParam("templateSrv", "delTemplate", param, false);
        return template;
    },
    /**
     * No17.  insertImageList 根据imageList导入图片
     */
    insertImages: function (imageList, prefix) {
        var image, list = [], json = {};
        if (!prefix) {
            prefix = '';
        }
        for (var i = 0, l = imageList.length; i < l; i++) {
            image = imageList[i];
            json = {};
            json.src = image.src ? prefix + image.src : "/";
            json._src = image._src ? prefix + image._src : "";
            image.title ? json.title = image.title : "";
            image.alt ? json.alt = image.alt : "";
            image.style ? json.floatStyle = image.style : "";
            list.push(json);
        }
        if (list) {
            sde.__ue__.execCommand('insertimage', list);
        } else {
            alert("暂无数据！");
        }
    },

    /**
     * No18 insertImage 根据image导入图片
     */
    insertImage: function (image, prefix) {
        var list = [];
        if (!prefix) {
            prefix = '';
        }
        var json = {};
        json.src = image.src ? prefix + image.src : "/";
        json._src = image._src ? prefix + image._src : "";
        image.title ? json.title = image.title : "";
        image.alt ? json.alt = image.alt : "";
        image.style ? json.floatStyle = image.style : "";
        list.push(json);

        if (list) {
            sde.__ue__.execCommand('insertimage', list);
        } else {
            alert("暂无数据！");
        }
    },

    /**
     * No19. 获取get参数，转换成QueryObject对象 return值 Object
     */
    getQueryObject: function () {
        var url = window.location.search; // 获取url中"?"符后的字串
        var obj = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                var strSplit = strs[i].split("=");
                var objKey = strSplit[0];
                var objValue = strSplit[1];
                obj[objKey] = decodeURI(objValue);
            }
        }
        return obj;
    },
    /**
     * No20 . 获取get参数，根据name获取参数值value，并返回value return值 value
     *
     * 注意： value 有可能出现中文乱码，推荐使用getRequestObject();
     *
     */
    getQueryStr: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var value = window.location.search.substr(1).match(reg);
        if (value != null) {
            return unescape(value[2]);
        }
        return null;
    },
    /**
     * No21. 将json的key 转成小写
     *
     */
    jsonKeyToLowerCase: function (json) {
        for (var key in json) {
            if (/^[A-Z|_]+$/.test(key)) { // 加个判断就可以了，如果都是大写的，就转换
                json[key.toLowerCase()] = json[key];
                delete (json[key]);
            }
        }
        return json;
    },
    /**
     * No22. 将json的key 转成大写
     *
     */
    jsonKeyToUpperCase: function (json) {
        for (var key in json) {
            if (/^[a-z|_]+$/.test(key)) { // 加个判断就可以了，如果是小写的，就转换大写
                json[key.toUpperCase()] = json[key];
                delete (json[key]);
            }
        }
        return json;
    },
    /**
     * No23 .根据身份证号获取生日，年龄，性别
     */
    getIdCard: function (UUserCard, num) {
        // 获取出生日期
        if (num == 1) {
            birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
            //console.log(birth);
            return birth;
        }
        // 获取性别
        if (num == 2) {
            var sex = '';
            if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
                sex = "男";
            } else {
                sex = "女";
            }
            //console.log(sex);
            return sex;
        }
        // 获取年龄
        if (num == 3) {
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
            if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
                age++;
            }
            //console.log(age);
            return age;
        }
    },
    /**
     * No23.1 .判断空值
     */
    isEmpty: function (object) {
        if(object == null){
            return "";
        }
        if(typeof object == "undefined"){
            return true;
        }
        if(object == "undefined"){
            return true;
        }
        if( object == "" || $.trim(object) == ""){
            return true;
        }
        if( typeof object !== "boolean" && typeof object !== "number" && !object){
            return true;
        }
        return false;
    },
    /**
     * No24. 根据Param获取plugin，比如根据类型查找控件
     */
    pluginFindByParam: function (param) {
        var plugins = findBySrvFunParam("pluginSrv", "findByParam", param, false);
        return plugins;

    },
    /**
     * No25. 保存报告
     */
    addReport: function (param, reportDatas) {
        param.reportDatas = reportDatas;
        var result = srvFunByParam("reportSrv", "addReport", param, false);
        return result;

    },
    /**
     * No26. 提交报告
     */
    submitReport: function (param) {
        var result = srvFunByParam("reportSrv", "submitReport", param, false);
        return result;

    },
    /**
     * No27. 查询所有报告
     */
    findAllReport: function (param) {
        var report = findBySrvFunParam("reportSrv", "findAll", param, false);
        return report;

    },
    /**
     * No28. getById
     */
    getByIdReport: function (param) {
        var report = findBySrvFunParam("reportSrv", "getById", param, false);
        return report;

    },
    /**
     * No29. 更新报告
     */
    updateReport: function (param) {
        var defaults = {};
        defaults.status = 0;
        defaults.syn_version = 0;
        defaults.report_id = 1;
        defaults.template_ver_id = 1; 						// 模板类型ID，TP_TEMPLATE_TYPE的主键
        defaults.content = "";
        defaults.reportDatas = "";
        param = $.extend(true, defaults, param);
        var result = srvFunByParam("reportSrv", "updateReport", param, false);
        return result;
    },
    /**
     * No30. 删除报告
     */
    delReport: function (param) {
        var result = srvFunByParam("reportSrv", "delReport", param, false);
        return result;
    },
    /**
     * No31. 新增报告数据
     */
    addReportData: function (param) {
        var result = srvFunByParam("reportSrv", "addReportData", param, false);
        return result;
    },
    /**
     * No32. 修改报告数据
     */
    updateReportData: function (param) {
        var result = srvFunByParam("reportSrv", "updateReportData", param, false);
        return result;
    },
    /**
     * No33. 删除报告数据
     */
    delReportData: function (param) {
        var result = srvFunByParam("reportSrv", "delReportData", param, false);
        return result;
    },
    /**
     * No34.findByRuleId
     */
    findByRuleId: function (param) {
        var result = srvFunByParam("ruleSrv", "findById", param, false);
        return result;
    },
    /**
     * No35. findRulsList
     */
    findRuleList: function (param) {
        var result = srvFunByParam("ruleSrv", "findAll", param, false);
        return result;
    },
    /**
     * No36. getRuleById
     */
    getRuleById: function (param) {
        //param.ruleId= '';
        //param.param= '';
        var datas = this.findByRuleId(param);

        return datas;
    },
    /**
     * No36.1. getRuleParamById
     */
    getRuleParamById: function (param) {
        //param.ruleId = '6';
        var datas = srvFunByParam("ruleSrv", "getRuleParamById", param, false);
        return datas;
    },
    /**
     * No36.2. getRuleParamByCode
     */
    getRuleParamByCode: function (param) {
        //param.ruleCode = 'J3CLLTV4748';
        var datas = srvFunByParam("ruleSrv", "getRuleParamByCode", param, false);
        return datas;
    },
    /**
     * No36.3. getRuleColumnById
     */
    getRuleColumnById: function (param) {
        //param.ruleId = '6';
        var datas = srvFunByParam("ruleSrv", "getRuleColumnById", param, false);
        return datas;
    },
    /**
     * No36.4. getRuleColumnByCode
     */
    getRuleColumnByCode: function (param) {
        //param.ruleCode = 'J3CLLTV4748';
        var datas = srvFunByParam("ruleSrv", "getRuleColumnByCode", param, false);
        return datas;
    },
    getDialog: function (param) {
        var datas = sde.getDialog();
        return datas;
    },
    /**
     * No37. getRuleList
     */
    getRuleList: function (param) {
        var datas = this.findRuleList(param);

        return datas;
    },
    /**
     * No38. 修改编辑器内控件
     */
    sendAllControl: function (plugin, jsonStr, txt) {
        if (plugin) {
            sde.updateControl(plugin);
            //console.log(txt+'存在于控件库，修改编辑器内控件，，，，，，，，，，jsonStr：'+jsonStr.ID);
        } else {
            //console.log(txt+'【不】存在于控件库，新增控件并且修改编辑器内控件，jsonStr：'+JSON.stringify(jsonStr));
            delete (jsonStr['VER_ID']);
            var plugin = this.addPlugin(jsonStr);
            sde.updateControl(plugin);
        }
    },
    /**
     * No39. updateAllControl
     */
    updateAllControl: function () {
        var plugin;
        var AllControl = sde.getControl();
        for (var i = 0, l = AllControl.length; i < l; i++) {
            var jsonStr = AllControl[i];
            jsonStr.CODE = jsonStr.ID;
            //console.log('---------------------------------------------------------------------- '+i);
            if (jsonStr.VER_ID && jsonStr.ID) {
                plugin = this.pluginFindByVId({ver_id: jsonStr.VER_ID});
                this.sendAllControl(plugin[0], jsonStr, '存在ver_id，');
            } else if (jsonStr.ID) {
                plugin = this.pluginFindByCode(jsonStr.ID);
                this.sendAllControl(plugin[0], jsonStr, '【不】存在ver_id，');
            } else {
                //console.log('控件jsonStr：'+JSON.stringify(jsonStr)+'异常！！！');
            }
        }
        return;
    },
    /**
     * No39.1. checkAllControl
     */
    checkAllControl: function () {
        var srvParam = {};
        srvParam.funName = 'checkAll';
        srvParam.allControl = sde.getControl();
        var data = srvFunByParam("pluginSrv", "checkAll", srvParam, false);
        return data;
    },
    /**
     * No39.2. updateReportState
     */
    updateReportState: function (param) {
        var defaults = {};
        defaults.status = 1;
        defaults.id = document.getElementById("report_id").value;
        param = $.extend(true, defaults, param);
        var result = srvFunByParam("reportSrv", "updateReportState", param, false);
        if (result.data) {
            $.showTip("修改成功");
        } else {
            $.showTip("修改失败");
        }
        return result;
    },
    /**
     * No39.3. setAllContent
     */
    setAllContent: function (data_report, template) {
        var result = {};
        var content = template.content;
        var $content = $(content);
        for (var i = 0, l = data_report.length; i < l; i++) {
            /*var obj = data_report[i];
             var newVal = obj.value;
             var sdemodel = $content.find("#"+obj.code);
             * var n = sdemodel.getAttribute("sde-model");
             var json = JSON.parse(n);
             json.value = newVal;
             var m = sdemodel.find(".sde-value");
             var child = m.firstElementChild;
             if(child){
             child.value=newVal;
             }else{
             m.innerText = newVal;
             }*/
            var e = data_report[i];
            var newVal = e.value;
            var t = $content.find("#" + e.goal_code)[0],
                n = t.getAttribute("sde-model"),
                i = JSON.parse(n);
            if (i.VALUE = e.VALUE, void 0 !== e.READONLY) if (i.READONLY = e.READONLY, 1 === i.READONLY) {
                var o = t.getElementsByClassName("sde-value")[0];
                o.setAttribute("contenteditable", "false")
            } else if (0 === i.READONLY) {
                var r = t.getElementsByClassName("sde-value")[0];
                r.setAttribute("contenteditable", "true")
            }
            if (void 0 !== e.TEXT || "select" === e.TYPE) {
                i.TEXT = e.TEXT;
                var a = t.getElementsByClassName("sde-value")[0];
                a.innerText = e.TEXT
            } else if (void 0 !== e.TEXT || "checkbox" === e.TYPE) for (var s = t.querySelectorAll("input[type=checkbox]"), l = 0, c = s.length; l < c; l++) {
                for (var d = s[l], u = !1, h = d.getAttribute("value"), f = 0, p = e.VALUE.length; f < p; f++) if (e.VALUE[f].VALUE === h) {
                    u = !0;
                    break
                }
                u ? d.setAttribute("checked", "checked") : d.removeAttribute("checked")
            } else {
                var m = t.getElementsByClassName("sde-value")[0];
                //
                var child = m.firstElementChild;
                if (child) {
                    child.value = e.VALUE;
                } else {
                    m.innerText = e.VALUE;
                }
            }
            t.setAttribute("sde-model", JSON.stringify(i))


        }
        result.data = $content.html();
        return result;
    },
    /**
     *  No40.
     *  getNewReport
     *
     */
    getNewReport: function (param) {
        var result = {};
        var old_report = srvFunByParam("reportSrv", "getold_report", param, false);//获取旧的报告，
        var data_report = srvFunByParam("reportSrv", "getdata_report", param, false);//获取旧的报告数据，
        //var template = srvFunByParam("templateSrv", "getNewTemplate", {template_ver_id:old_report.data.template_ver_id}, false);//通过旧的报告对应的模板版本id,获取最新的模板
        var temp = srvFunByParam("templateSrv", "findById", {template_ver_id: old_report.data.template_ver_id}, false);//通过旧的报告对应的模板版本id,获取最新的模板
        var template = srvFunByParam("templateSrv", "findById", {template_id: temp.data.template_id}, false);//通过旧的报告对应的模板版本id,获取最新的模板

        sde.__ue__.body.innerHTML = template.data.content;//清空编辑器内容 //装载最新模板；

        //给最新模板设置旧的报告数据
        for (var i = 0, l = data_report.data.length; i < l; i++) {
            var e = data_report.data[i];
            sde.setControls(e.goal_code, e.goal_value ? e.goal_value : "");
        }
        var param = {};
        //param.content=sde.html();//获取新生成的报告的html
        //param.template_ver_id=template.data.template_ver_id;
        //result.data = this.addReport(param, data_report.data);//保存到数据库
        result.msg = "操作成功";
        result.code = 200;
        return result;
    },
    /**
     * No41. checkPluginByVal
     *
     * @method checkPluginByVal
     * @return { String } 字符串''
     * @eaxmple ```javascript checkPluginByVal(); //返回:'' ```
     */
    checkPluginByVal: function (_params) {
        var _log = [];
        var params = _params || ['span.sde-left', 'span.sde-value', 'span.sde-right'];
        for (var i = 0, pl = params.length; i < pl; i++) {
            var arr = sde.querySelectorAll(params[i]);
            for (var j = 0, al = arr.length; j < al; j++) {
                var obj = arr[j], $obj = $(obj), parent = $obj.parent();

                var plugin_code = parent.attr("id"),
                    plugin_title = parent.attr("title"),
                    sdeModel = parent.attr("sde-model");
                if (!plugin_code) {
                    // 控件Id不存在;
                    $obj.css("background-color", "red");
                    $obj.removeClass("display-none");
                    $obj.attr("contenteditable", "true");
                    continue;
                }
                var json;
                try {
                    json = JSON.parse(sdeModel);
                } catch (e) {
                }
                if (!sdeModel || !json) {
                    var plugin = this.pluginFindByCode(plugin_code);// 根据code
                    if (plugin.length > 0) {
                        var pToJson = this.pluginToJson(plugin[0]);
                        var $objSV = parent.find("span.sde-value");
                        pToJson.value = $objSV[0] ? $objSV[0].innerText : "";
                        parent.attr("sde-model", JSON.stringify(pToJson));
                        _log.push(plugin_code + ":" + plugin_title);
                    } else {
                        // 查询不到控件
                        $obj.css("background-color", "red");
                        $obj.attr("contenteditable", "true");
                        continue;
                    }
                }
                parent.attr("contenteditable", "false");

                if ($obj.hasClass("sde-value")) {
                    var contenteditable = json.TYPE == 'text' ? "plaintext-only" : 'true';
                    $obj.attr("contenteditable", contenteditable);
                } else {
                    $obj.attr("contenteditable", "false");
                }
            }
        }
        console.log("plugin_codes has been changedByValue:" + _log);
        return true;
    },
    /**
     * No41.1. checkPluginByModel
     *
     * @method checkPluginByModel
     * @return { String } 字符串''
     * @eaxmple ```javascript checkPluginByModel(); //返回:'' ```
     */
    checkPluginByModel: function (param, _css) {
        var _log = [];
        var arr = sde.querySelectorAll("span[id][sde-model]");
        for (var j = 0, al = arr.length; j < al; j++) {
            var obj = arr[j];
            var $obj = $(obj);

            var $objSL = $obj.find("span.sde-left");
            var $objSR = $obj.find("span.sde-right");
            var $objSV = $obj.find("span.sde-value");
            var plugin_code = $obj.attr("id"),
                plugin_title = $obj.attr("title"),
                sdeModel = $obj.attr("sde-model");
            var json;
            try {
                json = JSON.parse(sdeModel);
            } catch (e) {
            }
            if (!plugin_code || plugin_code == "undefined") {
                $obj.css("background-color", "red");
                continue;
            }
            if (!sdeModel || !json.VER_ID || json.VER_ID == "undefined" || $objSR.length == 0 || $objSL.length == 0 || $objSV.length == 0) {
                var plugin = this.pluginFindByCode2Newest(plugin_code);
                if (plugin.length == 0) {
                    $obj.css("background-color", "red");
                    continue;
                }
                var pToJson = this.pluginToJson(plugin[0]);
                pToJson.VALUE = $objSV[0] ? $objSV[0].innerText : "";
                pToJson.OLDVALUE = $objSV[0] ? $objSV[0].innerText : "";
                _log.push(plugin_code + ":" + plugin_title);
                $obj.attr("sde-model", JSON.stringify(pToJson));
                var html = this.makeHtmlByPluginJson(pToJson);
                $obj[0].innerHTML = html;
                continue;
            }

            $objSL.attr("contenteditable", "false");
            $objSR.attr("contenteditable", "false");
            $objSL.text("[");
            $objSR.text("]");

            if ($objSR.hasClass("display-none") != $objSL.hasClass("display-none")) {
                $objSR.removeClass("display-none");
                $objSL.removeClass("display-none");
                $objSV.removeClass("background_fff");
                $obj.removeClass("background_fff");
            }
            $objSV.css('background-color', "");

            var json = JSON.parse($obj.attr("sde-model"));
            var contenteditable = json.TYPE == 'text' ? "plaintext-only" : 'true';
            $objSV.attr("contenteditable", contenteditable);
        }
        console.log("plugin_codes has been changedByModel:" + _log);
        return true;
    },
    /**
     * No41.2. checkPlugin
     *
     * @method checkPlugin
     * @return { String } 字符串''
     * @eaxmple ```javascript checkPlugin(); //返回:'' ```
     */
    checkPlugin: function (_params) {
        if ("READONLY" === window.SDE_CONFIG.MODE) {
            return 'READONLY';
        }
        var date1 = new Date().getTime();
        this.checkPluginByVal();
        this.checkPluginByModel();
        console.log("Check Plugin Elapsed Time：" + (new Date().getTime() - date1));
        return '';
    },
    /**
     * No41.3. updatePluginValue
     *
     * @method updatePluginValue
     * @return { String } 字符串''
     * @eaxmple ```javascript updatePluginValue(); //返回:'' ```
     */
    updatePluginValue: function (param) {
        if ("READONLY" === window.SDE_CONFIG.MODE) {
            return 'READONLY';
        }
        var date1 = new Date().getTime();
        var arr = sde.querySelectorAll("span[id][sde-model]");
        for (var j = 0, al = arr.length; j < al; j++) {
            var obj = arr[j];
            var $obj = $(obj);
            var $objSV = $obj.find("span.sde-value"),
                sdeModel = $obj.attr("sde-model"),
                json = {};
            try {
                json = JSON.parse(sdeModel);
            } catch (e) {
            }
            if (!$objSV || $objSV == "undefined" || $objSV.length == 0) {
                if (json.TYPE == 'text') {
                    var contenteditable = "plaintext-only";
                    var showData = json.TEXT || json.VALUE;
                    var str = '<span _id="' + json.ID + '" title="' + json.DESCNAME + '" style="color:#' + json.TEXT_COLOR + ';" class="sde-value" ' + ((json.READONLY == 1) ? 'contenteditable="false"' : 'contenteditable="' + contenteditable + '" ') + '>' +
                        showData +
                        '</span>' + '';
                    $obj.find('span:first').after($(str));
                }
            }
        }
        console.log("updatePluginValue Elapsed Time：" + (new Date().getTime() - date1));
        return '';
    },
    jsonToPluginExJson: function (json) {
        json.plugin_ex_json = [];
        switch (json.TYPE) {
            case "text":
                if (json.ISBRACKETS && json.ISBRACKETS !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "isbrackets",
                    "field_name": "隐藏括号",
                    "field_value": json.ISBRACKETS
                });
                if (json.TEXTLENGTH && json.TEXTLENGTH !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "textlength",
                    "field_name": "框长",
                    "field_value": json.TEXTLENGTH
                });
                if (json.TEXTCOLS && json.TEXTCOLS !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "textcols",
                    "field_name": "框宽",
                    "field_value": json.TEXTCOLS
                });
                if (json.DBLCLICKFUNCTION && json.DBLCLICKFUNCTION !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "dblclickfunction",
                    "field_name": "双击事件",
                    "field_value": json.DBLCLICKFUNCTION
                });
                break;
            case "select":
                if (json.ISBRACKETS && json.ISBRACKETS !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "isbrackets",
                    "field_name": "隐藏括号",
                    "field_value": json.ISBRACKETS
                });
                if (json.VERIFYTYPE && json.VERIFYTYPE !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "verifytype",
                    "field_name": "数据类型",
                    "field_value": json.VERIFYTYPE
                });
                if (json.FREEINPUT && json.FREEINPUT !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "freeinput",
                    "field_name": "可补充",
                    "field_value": json.FREEINPUT
                });
                if (json.REMOTEURL && json.REMOTEURL !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "remoteurl",
                    "field_name": "动态数据",
                    "field_value": json.REMOTEURL
                });
                break;
            case "date":
                if (json.MAX && json.MAX !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "max",
                    "field_name": "最大值",
                    "field_value": json.MAX
                });
                if (json.MIN && json.MIN !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "min",
                    "field_name": "最小值",
                    "field_value": json.MIN
                });
                if (json.FORMAT && json.FORMAT !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "format",
                    "field_name": "格式",
                    "field_value": json.FORMAT
                });
                if (json.ISDISPLAY && json.ISDISPLAY !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "isdisplay",
                    "field_name": "是否隐藏",
                    "field_value": json.ISDISPLAY
                });
                if (json.ISBRACKETS && json.ISBRACKETS !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "isbrackets",
                    "field_name": "隐藏括号",
                    "field_value": json.ISBRACKETS
                });
                break;
            case "checkbox":
                if (json.REMOTEURL && json.REMOTEURL !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "remoteurl",
                    "field_name": "动态数据",
                    "field_value": json.REMOTEURL
                });
                if (json.VERIFYTYPE && json.VERIFYTYPE !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "verifytype",
                    "field_name": "数据类型",
                    "field_value": json.VERIFYTYPE
                });
                if (json.ISBRACKETS && json.ISBRACKETS !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "isbrackets",
                    "field_name": "隐藏括号",
                    "field_value": json.ISBRACKETS
                });
                if (json.ISRIGHTCHECKBOX && json.ISRIGHTCHECKBOX !== 'undefined') json.plugin_ex_json.push({
                    "field_code": "isrightcheckbox",
                    "field_name": "右边框",
                    "field_value": json.ISRIGHTCHECKBOX
                });
                break;
            case "二维码":
                break;
            case "条形码":
        }
        json.CONNCODE ? json.plugin_ex_json.push({
            "field_code": "conncode",
            "field_name": "关联取数",
            "field_value": json.CONNCODE
        }) : "";
        json.CONN_TEMPLATE_VER_ID ? json.plugin_ex_json.push({
            "field_code": "conn_template_ver_id",
            "field_name": "关联模板ID",
            "field_value": json.CONN_TEMPLATE_VER_ID
        }) : "";

        return json;
    },
    /**
     * No42. updatePluginByCode2Newest
     *
     * @method updatePluginByCode2Newest
     * @return { String } 字符串''
     * @eaxmple ```javascript updatePluginByCode2Newest(); //返回:'' ```
     * @description 保证页面控件和数据源控件库一致的问题， 因为有可能控件经过不同数据库的导入导出，导致控件的版本和当前数据库的版本不一致。
     * 如果该控件id不存在(包括undefined)于当前数据库中，则将该整个控件背景色标黄色.
     * 控件充存在两个参数：
     *  param.insert='1';当控件不存在于数据库中时，进行插入操作。
     *  param.update='1';当控件存在于数据库中时，将页面控件更新到数据中。并回显到页面。
     * -------------------------------------------------------------------------------demo:
     *  var param={};
     *  param.insert='1';
     *  param.update='1';
     *  sdefun.updatePluginByCode2Newest(param);
     */
    updatePluginByCode2Newest: function (param) {
        if ("READONLY" === window.SDE_CONFIG.MODE) {
            return 'READONLY';
        }
        var date1 = new Date().getTime();
        var _log = [];
        var arr = sde.querySelectorAll("span[id][sde-model]");
        for (var j = 0, al = arr.length; j < al; j++) {
            var obj = arr[j];
            var $obj = $(obj);
            var $objSL = $obj.find("span.sde-left");
            var $objSR = $obj.find("span.sde-right");
            var $objSV = $obj.find("span.sde-value");
            var plugin_code = $obj.attr("id"),
                plugin_title = $obj.attr("title"),
                sdeModel = $obj.attr("sde-model");
            var json;
            try {
                json = JSON.parse(sdeModel);
            } catch (e) {
            }
            if (!plugin_code || plugin_code == "undefined") {
                $obj.css("background-color", "yellow");
                continue;
            }
            //if(plugin_code == 'grs'){debugger}
            var plugin = this.pluginFindByCode2Newest(plugin_code);
            if (!plugin || plugin.length == 0) {

                if (param.insert == '1') {/*该控件不存在时，判断调用接口者，是否需要插入到数据库*/
                    if (json) {
                        json.CODE = json.ID;
                        json = this.jsonToPluginExJson(json);
                        //console.log("新增："+JSON.stringify(json));
                        plugin = this.addPlugin(json);
                    } else {
                        $obj.css("background-color", "blue");
                        continue;
                    }
                } else {
                    $obj.css("background-color", "yellow");
                    continue;
                }
            } else if (param.update == '1') { /*该控件存在时，判断调用接口者，是否需要插入到数据库*/
                plugin = plugin[0];
                if (json) {
                    json.CODE = json.ID;
                    json = this.jsonToPluginExJson(json);
                    if (json && json.VER_ID!=="" && json.VER_ID!=="undefined" && json.VER_ID!==undefined) json.VER_ID = plugin.ver_id, json.ID = plugin.id;
                    //console.log("修改："+JSON.stringify(json));
                    plugin = this.updatePlugin(json).data;
                } else {
                    $obj.css("background-color", "blue");
                    continue;
                }

            }

            var pToJson = this.pluginToJson(plugin);

            pToJson.VALUE = $objSV[0] ? $objSV[0].innerText : "";
            if (!(param.update == '1' || param.insert == '1')) pToJson.OLDVALUE = pToJson.VALUE;
            if (pToJson.VER_ID) $obj.attr('ver_id', pToJson.VER_ID);
            if (pToJson.VERIFYTYPE) $obj.attr('verifytype', pToJson.VERIFYTYPE);
            $obj.attr('id', pToJson.ID);
            $obj.attr('_id', pToJson.ID);
            $obj.attr('title', pToJson.NAME);
            $obj.attr('type', pToJson.TYPE);
            $obj.attr('sde-model', JSON.stringify(pToJson));
            $obj.attr("contenteditable", "false");
            $obj.attr('class', 'sde-bg');
            _log.push(plugin_code + ":" + plugin_title);
            var html = this.makeHtmlByPluginJson(pToJson);
            $obj[0].innerHTML = html;
        }
        console.log("plugin_codes has been updatePluginByCode2Newest:" + _log + "--- Elapsed Time：" + (new Date().getTime() - date1));
        return '';
    },
    /**
     * No43. getFilePathByHtml
     *
     * @method getFilePathByHtml
     * @return { String } 字符串''
     * @eaxmple ```javascript getFilePathByHtml(); //返回:'' ```
     * @description 上传的图片，附件，视频（img标签）中节点包括sdeupdateFlag属性，该接口根据sdeupdateFlag属性获取文件的路径。
     */
    getFilePathByHtml: function (param) {
        var filePaths = sde.querySelectorAll('[sdeupdateFlag]');
        var arr = [];
        if (filePaths && filePaths != 0) {
            for (var i = 0, fpl = filePaths.length; i < fpl; i++) {
                var $filePath = $(filePaths[i]);
                var obj = {};
                obj.src = $filePath.attr('src') || $filePath.attr('href');
                obj.original = $filePath.attr('original');
                obj.sdeupdateFlag = $filePath.attr('sdeupdateFlag');
                arr.push(obj);
            }
        }
        return arr;

    },

    /**
     * No44. forceDeletePlugin
     *
     * @method forceDeletePlugin
     * @return { String } 字符串''
     * @eaxmple ```javascript forceDeletePlugin(); //返回:'' ```
     * @description 强制删除控件。
     */
    forceDeletePlugin: function (param) {
        var range = sde.__ue__.selection.getRange();
        range.select();
        //window.getSelection().removeAllRanges();
        var getNative = sde.__ue__.selection.getNative();
        var other_range = getNative.getRangeAt(0);
        // var docFragment = other_range.cloneContents();
        var oFragment = other_range.extractContents();//选中的全部删除
        //other_range.insertNode(docFragment);

        /*  var $tempDiv = $(docFragment.childNodes);
         var parentNode = $tempDiv.find(".sde-value");
         for (var i = 0, fpl = parentNode.length; i < fpl; i++) {
         baidu.editor.dom.domUtils.remove(parentNode[i], !1)
         }*/
        return '';
    },
    /**
     * No45. getSelectionHTML
     *
     * @method getSelectionHTML
     * @return { String } 字符串''
     * @eaxmple ```javascript getSelectionHTML(); //返回:'' ```
     * @description 获取选中的html。
     */
    getSelectionHTML: function () {
        var userSelection;
        if (window.getSelection) {
            // W3C Ranges
            userSelection = window.getSelection();
            // Get the range:
            if (userSelection.getRangeAt)
                var range = userSelection.getRangeAt(0);
            else {
                var range = document.createRange();
                range.setStart(userSelection.anchorNode,
                    userSelection.anchorOffset);
                range
                    .setEnd(userSelection.focusNode,
                        userSelection.focusOffset);
            }
            // And the HTML:
            var clonedSelection = range.cloneContents();
            var div = document.createElement('div');
            div.appendChild(clonedSelection);
            return div.innerHTML;
        } else if (document.selection) {
            // Explorer selection, return the HTML
            userSelection = document.selection.createRange();
            return userSelection.htmlText;
        } else {
            return '';
        }
    },
    /**
     * No45. setRuleValue
     *
     * @method setRuleValue
     * @return { String } 字符串''
     * @eaxmple ```javascript setRuleValue(); //返回:'' ```
     * @description 设置规则值。
     */
    setRuleValue: function (params) {
        var srvparams = {};
        var findRuleParam = {report_id: 413};//默认的,需要传值进来.
        //$.extend(true, {report_id: 413, goal_code: 'xm'}, findRuleParam);
        var lists = sde.querySelectorAll("span[rule][sde-model]");
        for (var i = 0, al = lists.length; i < al; i++) {
            try {
                var obj = lists[i],
                    ruleId = $(obj).attr("rule"),
                    sdemodel = $(obj).attr("sde-model"),
                    json = JSON.parse(sdemodel),
                    connCodes = json && json.CONNCODE || json.ID,//多个控件时
                    template_ver_id = json && json.CONN_TEMPLATE_VER_ID,
                    rule_rparam = json.RULE_RPARAM;
                if(this.isEmpty(connCodes)||this.isEmpty(rule_rparam)){continue}
                if(connCodes && !$.isArray(connCodes)){
                    connCodes=[connCodes];
                }
                if(Object.prototype.toString.call(rule_rparam) === "[object String]") {
                    rule_rparam = rule_rparam.toLowerCase()
                }
                //设置的参数
                if(json.RULE_FPARAM){
                    var jr=JSON.parse(json.RULE_FPARAM);
                    for(var i=0,jl=jr.length;i<jl;i++){
                        var jrobj = jr[i];
                        findRuleParam[jrobj.param] = jrobj.value;
                    }
                }
                //传入的参数
                if(params){
                    var jr=JSON.parse(params);
                    for(var i=0,jl=jr.length;i<jl;i++){
                        var jrobj = jr[i];
                        findRuleParam[jrobj.param] = jrobj.value;
                    }
                }
                //多个控件的时候
                var resStr = "";
                for(var key in connCodes ){
                    findRuleParam['goal_code'] = connCodes[key];
                    srvparams.param = JSON.stringify(findRuleParam);
                    srvparams.ruleId = ruleId;
                    var resByRuleId = this.findByRuleId(srvparams);
                    var datas = resByRuleId.data.value;
                    console.log("findByRuleId:" + JSON.stringify(datas));
                    if (datas && datas.length>0) {
                        var resString = datas[0][rule_rparam]||"";
                        var strboo = Object.prototype.toString.call(resString) === "[object String]";//判断是否是字符
                        if (strboo && resString.substring(0, 1) == '\"' && resString.substring(resString.length - 1) == '\"') {
                            resString = resString.substr(1, resString.length - 2);
                        }
                        if(resStr){
                            resStr = resStr + "，" + resString;
                        }else{
                            resStr += resString;
                        }
                    }
                }
                sde.setControls(json.ID, resStr);
            } catch (e) {
                console.log("setRuleValue异常:" + e);
                continue;
            }
        }
        return !0;
    }
    ,
    /**
     * No46. getNewestReportByTempVId
     *
     * @method getNewestReportByTempVId
     * @return report
     * @eaxmple ```javascript getNewestReportByTempVId(); //返回:report
     * @description 根据模板版本id获取最新的报告。
     */
    getNewestReportByTempVId: function (template_ver_id) {
        var params = {template_ver_id: template_ver_id};
        var newest_report = srvFunByParam("reportSrv", "getNewestReportByTempVId", params, false);//获取旧的报告，
        return newest_report;
    },

    /**
     * No47. updateAllPluginByVerID
     *
     * @method updateAllPluginByVerID
     * @return { String } 字符串''
     * @eaxmple ```javascript updateAllPluginByVerID(); //返回:'' ```
     * @description updateAllPluginByVerID业务需求：当编辑器的html与数据库中控件不一致时，调用该接口可以根据控件版本id同步数据库控件到编辑器html。
     */
    updateAllPluginByVerID: function () {
        var date1 = new Date().getTime();
        var _log = [];
        var arr = sde.querySelectorAll("span[id][sde-model]");
        for (var j = 0, al = arr.length; j < al; j++) {
            var obj = arr[j];
            var $obj = $(obj);
            var $objSV = $obj.find("span.sde-value");
            var $objSL = $obj.find("span.sde-left");
            var $objSR = $obj.find("span.sde-right");
            $objSL.text('[');
            $objSR.text('');
            var plugin_code = $obj.attr("id"),
                plugin_title = $obj.attr("title"),
                sdeModel = $obj.attr("sde-model");
            var json;
            try {
                json = JSON.parse(sdeModel);
            } catch (e) {
            }

            if (!json.VER_ID || !plugin_code || plugin_code == "undefined") {
                $obj.css("background-color", "yellow");
                continue;
            }

            var plugin = this.pluginFindByVId({ver_id: json.VER_ID});
            if (!plugin) {
                $obj.css("background-color", "yellow");
                continue;
            }
            var pToJson = this.pluginToJson(plugin[0]);
            pToJson.VALUE = $objSV[0] ? $objSV[0].innerText : "";
            pToJson.OLDVALUE = pToJson.VALUE;				//OLDVALUE为了更新控件时保存页面显示的数据
            if (pToJson.VERIFYTYPE) $obj.attr('verifytype', pToJson.VERIFYTYPE);
            _log.push(plugin_code + ":" + plugin_title);
            $obj.attr('_id', pToJson.ID);
            $obj.attr('id', pToJson.ID);
            $obj.attr('ver_id', pToJson.ID);
            $obj.attr('title', pToJson.NAME);
            $obj.attr('type', pToJson.TYPE);
            $obj.attr('sde-model', JSON.stringify(pToJson));
            $obj.attr("contenteditable", "false");
            $obj.attr('class', 'sde-bg');
            var html = this.makeHtmlByPluginJson(pToJson);
            $obj[0].innerHTML = html;
        }
        console.log("plugin_codes has been updateAllPluginByVerID:" + _log + "--- Elapsed Time：" + (new Date().getTime() - date1));
        return '';
    },
    /**
     * No48. 初始化树
     *
     * @method
     * @return
     * @eaxmple
     * @description
     */
    initSDETree: function () {
        $("#myEditor").append('<div class="treeWrapper">' +
            '<div id="sdeTree" class="sde-tree"></div>' +
            '   <div id="sde-showtree">' +
            '       <div id="sde-arrowNav" class="sde-arrowNav-close" onclick="sdefun.openSDETree()">' +
            '       </div>' +
            '   </div>' +
            '</div>');

        treeObj.initTree("sdeTree");
        treeObj['loadData']();
        //this.openSDETree();

    },
    /**
     * No48. 打开树
     *
     * @method
     * @return
     * @eaxmple
     * @description
     */
    openSDETree: function () {
        $("#sdeTree").css("display","block").toggleClass("tree-open","tree-close");
        $("#sde-showtree").toggleClass("sde-showtree-open","sde-showtree-close");
        $("#sde-arrowNav").toggleClass("sde-arrowNav-open","sde-arrowNav-close");
    },
    createD3: function (dataset) {
        /*折线图--start Nothing 2017-11-22*/
        $("div.sde").append(
            '<div class="container" style="margin: 30px auto; width: 600px; height: 300px; border: 1px solid #000; background:#FFFFFF; position:fixed; bottom:0;right:10px ;z-index:1000;">' +
            '<div class="d3-closebtn"  style="">' + '</div>' +
            '<svg width="100%" height="100%">' +
            '</svg>' + '</div>');
        $(".d3-closebtn").on("click", function () {
            $(".container").remove();
        })

        var width = 600, height = 300;
        // SVG画布边缘与图表内容的距离
        var padding = {top: 50, right: 50, bottom: 60, left: 50};
        // 创建一个分组用来组合要画的图表元素
        var main = d3.select('.container svg').append('g')
        // 给这个分组加上main类
            .classed('main', true)
            // 设置该分组的transform属性
            .attr('transform', "translate(" + 80 + ',' + 80 + ')');
        // 模拟数据
        dataset = dataset || [
                {x: 0, y: 88}, {x: 1, y: 35},
                {x: 2, y: 23}, {x: 3, y: 78},
                {x: 4, y: 55}, {x: 5, y: 18},
                {x: 6, y: 98}, {x: 7, y: 100},
                {x: 8, y: 22}, {x: 9, y: 65}
            ];
        // 创建x轴的比例尺(线性比例尺)
        var xScale = d3.scale.linear().domain(d3.extent(dataset, function (d) {
            return d.x;
        }))
            .range([0, width - padding.left - padding.right - 40]);
        // 创建y轴的比例尺(线性比例尺)
        var yScale = d3.scale.linear().domain([0, d3.max(dataset, function (d) {
            return d.y;
        })])
            .range([height - padding.top - padding.bottom, -56]);
        // 创建x轴
        var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
        // 创建y轴
        var yAxis = d3.svg.axis().scale(yScale).orient('left');

        // 添加SVG元素并与x、y轴进行“绑定”
        main.append('g').attr('class', 'axis')
            .attr('transform', 'translate(0,' + (height - padding.top - padding.bottom) + ')')
            .call(xAxis);
        main.append('g').attr('class', 'axis').call(yAxis);

        $(".axis path,.axis line").css({"stroke": "#000", "fill": "none", "stroke-width": "2px"});
        // 添加折线
        var line = d3.svg.line()
            .x(function (d) {
                return xScale(d.x)
            })
            .y(function (d) {
                return yScale(d.y);
            })
            // 选择线条的类型
            .interpolate('linear');
        // 添加path元素，并通过line()计算出值来赋值
        main.append('path')
            .attr('class', 'line')
            .attr({"fill": "none", "stroke": "black", "stroke-width": "2px"})
            .attr('d', line(dataset));
        // 添加点
        main.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d.x);
            })
            .attr('cy', function (d) {
                return yScale(d.y);
            })
            .attr('r', 3)
            .attr('stroke', '#000000')
            .attr('stroke-width', 1)
            .attr('fill', '#FFFFFF')
    },
    /**
     * No49. 树导航位置调整
     *
     * @method
     * @return
     * @eaxmple
     * @description
     */
    adjustPos:function(param){
        var  topDis = parseInt($(".treeWrapper").css("top"));
        $(".treeWrapper").css("top",topDis + param);
    },
    /**
     * No50. 保存修订模式的修改痕迹
     * @author
     * @createTime
     * @method
     * @return
     * @eaxmple
     * @description
     */
    addReviseHtml:function(report_id) {
        report_id = report_id||"";
        var datas=[];
        var data = sde.jqSelectorAll(".span-revise[saved!='saved']");//删除线
        for(var i=0,datal=data.length; i<datal;i++){
            var obj={};
            var $data = $(data[i]);
            obj.report_id  = report_id;
            obj.user_id  = $data.attr("reviseauthor");
            obj.content = $data.html();
            obj.content_type = "2";
            obj.content_ctime  = $data.attr("revisetime");
            datas.push(obj);
        }
        var data2 = sde.jqSelectorAll(".span-revise-edit[saved!='saved']");//插入
        for(var i2=0,datal2=data2.length; i2<datal2;i2++){
            var obj={};
            var $data = $(data2[i2]);
            obj.report_id  = report_id;
            obj.user_id  = $data.attr("reviseauthor");
            obj.content = $data.html();
            obj.content_type = "1";
            obj.content_ctime  = $data.attr("revisetime");
            datas.push(obj);
        }
        if(datas.length!==0){
            var param={reviseDatas:datas};
            var result ;
            result = srvFunByParam("reportReviseSrv", "addRevise", param, false);
            if(result&&result.code==200){
                $(data).attr("saved","saved");
                $(data2).attr("saved","saved");
            }
        }
        return datas;
    }

};

/**
 * No34. 根据findBySrvFunParam查询
 *
 * 参数如下: srvName:服务名称， funName:方法名称， param:参数， async:同步锁 默认true， 返回值:result.data
 *
 * 温馨提示：调用此方法返回的是对象集，建议用对象名称变量（如：plugin）保存，以免混淆；如下: var plugin =
 * findBySrvFunParam("pluginSrv", "findByVId", param, false);
 *
 */
function findBySrvFunParam(srvName, funName, param, async) {
    var data;
    if (typeof async != 'boolean') {
        async = true
    }
    var sdeConfigTemp = window.SDE_CONFIG ? window.SDE_CONFIG : parent.window.SDE_CONFIG;
    var srvParam = {
        datasource: sdeConfigTemp.DATASOURCE||"",  //数据源配置
        funName: funName
    };
    srvParam = $.extend(true, srvParam, param);
    databind.submit(srvName, srvParam, {
        async: async
    }, function (result) {
        data = result.data;
    });
    return data;

}
/**
 * No35. 根据srvFunByParam查询，是对原方法的重构，用法与效果不变
 *
 * 参数如下:
 *    srvName:服务名称， funName:方法名称， param:参数， async:同步锁 默认true， 返回值:result
 *
 * 温馨提示：调用此方法返回的是整个结果集，建议用结果变量（如：result）保存，以免混淆；如下:
 *  var result = srvFunByParam("templateSrv", "findById", param, false);
 */
function srvFunByParam(srvName, funName, param, async) {
    var data;
    if (typeof async != 'boolean') {
        async = true
    }
    var sdeConfigTemp = window.SDE_CONFIG ? window.SDE_CONFIG : parent.window.SDE_CONFIG;
    var srvParam = {
        datasource: sdeConfigTemp.DATASOURCE||"",  //数据源配置
        funName: funName
    };
    srvParam = $.extend(true, srvParam, param);
    databind.submit(srvName, srvParam, {
        async: async
    }, function (result) {
        data = result;
    });
    return data;

}


var treeObj = {
    sdeTreeId:"sdeTree",
    initTree: function (sdeTreeId) {
        this.sdeTreeId=sdeTreeId||"sdeTree";
        $('#'+sdeTreeId).widgets({
            xtype: 'tree',
            //cascadeCheck: false,
            /*isFilterFlag: true,
            searchTip:"",
            searchType:"",
            collapsible: false,
            width: '195',
            onlyLeafCheck: false,
            noheader: true,
            fit: true,
            _css: {},
            tools: [],
            height: '400',
            closable: false,
            autoload: true,
            minimizable: false,
            checkbox: false,
            border: false,
            maximizable: false,*/
            loader: function () {//返回false 将不加载远程数据
                return false;
            },
            onLoadSuccess: function (node, row) {
                console.log("加载成功:" + node);
            },
            onClick: function (node) {
                console.log("你点击了:" + node.id);
            },
            onContextMenu: function (e, node) {//右键
                    e.preventDefault();
                    // 查找节点
                    $('#'+sdeTreeId).getWidget().select(node.target);//将当前节点选中
                    // 显示快捷菜单
                    $('#sdeTreeContextMenu').getWidget().show({
                        left: e.pageX,
                        top: e.pageY
                    });

            },
            onExpand: function (node){
                console.log("你展开了:" + node.id);
                var arr = $("#sdeTree").children();
                var totalH = 0;
                for(var i = 0, len = arr.length ; i < len ; i++){
                    totalH += arr[i].offsetHeight;
                }
                if(totalH >= 486){
                    $("#sdeTree").css({height:"486px","overflow-y":"scroll"});
                }
            },
            onCollapse: function(node){
                var arr = $("#sdeTree").children();
                var totalH = 0;
                for(var i = 0, len = arr.length ; i < len ; i++){
                    totalH += arr[i].offsetHeight;
                }
                if(totalH < 486){
                    $("#sdeTree").css({height:"auto",overflow:"initial"});
                }
            },
            onDblClick: function (node) {
                console.log("你双击了:"+node.id+",state:" + node.state);
                if(node.id=="root"){
                    sdefun.openSDETree();
                    return ;
                }
                if(node.state){
                    return ;
                }
                /*向编辑器中插入选中项*/
                insertHtml();
                function insertHtml(e) {
                    var index = node.id;
                    var sdefun = new sdeFun();
                    var plugin = sdefun.pluginFindByVId({
                        ver_id : index
                    });
                    if(plugin &&plugin.length!==0){
                        var json = sdefun.pluginToJson(plugin[0]);
                        var html = sdefun.makeHtmlByPluginJson(json);
                        var ONodeHtml = sdefun.getONodeHtml(json, html);
    