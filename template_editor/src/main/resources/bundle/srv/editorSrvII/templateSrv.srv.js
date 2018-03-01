/**
 * 1.在srv里面调用
 *        var service = new Service('editor.templateSrvV2.templateSrv').callService({});
 * 2.在VOP上面调用，调用方法跟普通的srv方式一样，只不过需要在原有的参数上面增加一个参数funName
 * @Autor : Bryant
 * @Date : 2017-05-19
 **/

function getDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var ss = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate + "  " + hour + ":" + min + ":" + ss;
    return currentdate;
};

var toJs = require('nodejava').toJs;
var spring = require("spring");
var result = {};
result.data = '';
result.msg = '操作失败';
result.code = 500;
var isDataSeq =  param.isDataSeq || true; //20180122 king 是否手动读取主键序列号.
var this_time = com.tt.pwp.framework.util.formatter.DateFormatterUtil.long2YYYY_MM_DDHH24miss(new java.util.Date());
var this_user_id = com.tt.pwp.framework.security.SecurityUtils.getLoginAccountId();
/*	var logUtil = com.tt.pwp.framework.util.log.LogUtil();
 logUtil.debug("logUtil debug 日志");
 logUtil.info("logUtil info 日志");*/
var datasource="";                          //数据源
if (param && param.datasource) {
    var dsMgr = require('pwp-datasource');  //数据源管理对象
    db = dsMgr.db(param.datasource);        //调用db([datasouceId])函数得到指定的数据源对象,dsMgr.db('default')可得到默认数据源
    datasource = param.datasource;
}

var handler = {
    /**
     * 根据ID查询某一个
     *
     **/
    findById: function (param) {
        if (param.template_id && param.template_ver_id) {
            var datas = toJs.parse(db.dao.findAll("editor.editorModel.tp_template", "template_id = ? and template_ver_id = ? ", [param.template_id, param.template_ver_id]));
            result.data = datas[0];
        } else if (param.template_ver_id) {
            var datas = toJs.parse(db.dao.findAll("editor.editorModel.tp_template", "template_ver_id = ? ", [param.template_ver_id]));
            result.data = datas[0];
        } else {
            var sql = "select * from tp_template where template_ver_id = (select max(template_ver_id) from tp_template where template_id = ?)";
            var template = toJs.parse(db.queryForList(sql, [param.template_id]));
            result.data = template[0];
        }
        if (result.data) {
            result.msg = '查询成功';
            result.code = 200;
        } else {
            result.msg = '查询失败';
            result.code = 500;
        }
        return result;
    },

    /**
     * 根据模板ID(template_id)查询模板
     */
    findByTem_Id: function (param) {
        var template = db.dao.findAll("editor.editorModel.tp_template", "template_id=?", [param.template_id]);
        result.data = toJs.parse(template);
        result.msg = '查询模板数据成功';
        result.code = 200;
        return result;
    },

    /**
     * 根据模板TypeId(type_id)查询模板
     */
    findByTypeId: function (param) {
        var template = db.dao.findAll("editor.editorModel.tp_template", "type_id = ?", [param.type_id]);
        result.data = toJs.parse(template);
        result.msg = '查询模板数据成功';
        result.code = 200;
        return result;
    },

    /**
     * 根据模板TypeId(type_id)查询出非删除状态的模板
     */
    findTemByStatus: function (param) {
        var sql = "select * from tp_template where type_id = ? and status in(0,1,2)"
        var template = db.queryForList(sql, [param.type_id]);
        result.data = toJs.parse(template);
        result.msg = '查询模板数据成功';
        result.code = 200;
        return result;
    },

    /**
     * 根据模板版本ID(template_ver_id)查询模板
     */
    findByVer_Id: function (param) {
        var template = db.dao.findAll("editor.editorModel.tp_template", "template_ver_id=?", [param.template_ver_id]);
        result.data = toJs.parse(template);
        result.msg = '查询模板数据成功';
        result.code = 200;
        return result;
    },

    /**
     * 查询某个模板类型最新的模板
     * param:{type_id:type_id}
     */
    findValidTem: function (param) {
        var sql = "select * from tp_template where status = 1 and valid_date < sysdate and type_id = ? and lastupdate_time = "
            + "(select max(lastupdate_time) from tp_template where status = 1 and valid_date < sysdate and type_id = ?)";
        var template = db.queryForList(sql, [param.type_id, param.type_id]);
        result.data = toJs.parse(template);
        result.msg = '查询模板数据成功';
        result.code = 200;
        return result;
    },

    /**
     * 查询版本号最高的模板
     */
    findMaxVerTem: function (param) {
        var sql = "select * from tp_template where template_ver_id = (select max(template_ver_id) from tp_template where type_id = ?)";
        var template = db.queryForList(sql, [param.type_id]);
        if (template) {
            result.data = toJs.parse(template);
            result.msg = '查询模板数据成功';
            result.code = 200;
            return result;
        } else {
            result.msg = '查询模板数据失败';
            result.code = 500;
            return result;
        }
    },

    /**
     * 查询最高的版本号
     */
    findMaxVerId: function (param) {
        var sql = "select max(template_ver_id) from tp_template where type_id = ?";
        var ver_id = db.queryForList(sql, [param.type_id]);
        if (ver_id) {
            result.data = toJs.parse(ver_id);
            result.msg = '查询版本号成功';
            result.code = 200;
            return result;
        } else {
            result.msg = '查询版本号失败';
            result.code = 500;
            return result;
        }
    },

    /**
     * 查询模板类型ID对应的模板ID
     */
    findTemIdByTypeId: function (param) {
        var sql = "select distinct(template_id) from tp_template where type_id = ?";
        var tem_id = db.queryForList(sql, [param.type_id]);
        if (tem_id) {
            result.data = toJs.parse(tem_id);
            result.msg = '查询模板ID成功';
            result.code = 200;
            return result;
        } else {
            result.msg = '查询模板ID失败';
            result.code = 500;
            return result;
        }
    },

    /**
     * 根据启用，禁用状态来查询模板
     */
    findByStatus: function (param) {
        var template = db.dao.findAll("editor.editorModel.tp_template", "status = ?", [param.status]);
        result.data = toJs.parse(template);
        result.msg = '查询模板数据成功';
        result.code = 200;
        return result;
    },

    /**
     * 新增模板
     * param参数 {template_id : '',type_id : '',name : '',syn_version : '',...}
     */
    addTemplate: function (param) {
        param.create_time = this_time;


        var templateIdSeq = this.getSeqNum({seqName:"SEQ_TP_TEMPLATE_ID"});
        param.template_id = templateIdSeq.seqNum;//非主键

        param.syn_version = 0; 	//乐观锁，新增时syn版本号为0;后面没修改一次，版本号就在原基础上 +1
        param.user_id = this_user_id;
        param.create_user = this_user_id;
        param.status = 0;		//对status状态进行限制（不能自己修改状态），避免自定义传值出现的状态值错乱的问题；
        if(isDataSeq ) {
            var templateVIdSeq = this.getTemplateSeq();
            param.template_ver_id = templateVIdSeq.seqNum;//主键
        }
        var template = db.dao.insertSelective("editor.editorModel.tp_template", param);
        result.data = toJs.parse(template);
        //console.log("addTemplate:"+JSON.stringify(template));
        var templateDatas = param.templateDatas;
        if (templateDatas && templateDatas.length > 0) {
            param.template_ver_id = template.template_ver_id;
            var res = this.addTemplateData(param);
            result.templatedata = res;
        }
        result.msg = '新增模板成功';
        result.code = 200;
        return result;
    },
    /**
     * 批量插入模板数据
     */
    addTemplateDataArr: function (paramArr) {
        if (paramArr.addTempDateArr && Array.isArray(paramArr.addTempDateArr)) {
            paramArr = paramArr.addTempDateArr;
        }
        var paramInsert = [];
        for (var iii in paramArr) {
            var params = paramArr[iii];
            var template_ver_id = params.template_ver_id;
            var templateDatas = params.templateDatas;
            for (var i in templateDatas) {
                var templateData = templateDatas[i];
                templateData.create_user = this_user_id;
                templateData.create_time = this_time;
                templateData.template_ver_id = template_ver_id;
                templateData.updateFlag = "Appended";
                if(isDataSeq ) {
                    var templateDataSeq = this.getTemplateDataSeq();
                    templateData.id = templateDataSeq.seqNum;//主键
                }
                paramInsert.push(templateData);
            }
        }
        var res = db.dao.batchInsert("editor.editorModel.tp_template_data", paramInsert);//批量插入
        result.data = res;
        result.msg = '新增模板数据成功';
        result.code = 200;
        return result;
    },
    /**
     * 插入模板数据
     */
    addTemplateData: function (params) {
        var paramInsert = [];
        var template_ver_id = params.template_ver_id;
        var templateDatas = params.templateDatas;
        for (var i = 0, tl = templateDatas.length; i < tl; i++) {
            var templateData = templateDatas[i];
            templateData.create_user = this_user_id;
            templateData.create_time = this_time;
            templateData.template_ver_id = template_ver_id;
            if(isDataSeq ) {
                var templateDataSeq = this.getTemplateDataSeq();
                templateData.id = templateDataSeq.seqNum;//主键
            }
            templateData.updateFlag = "Appended";
            paramInsert.push(templateData);
        }
        var res = db.dao.batchInsert("editor.editorModel.tp_template_data", paramInsert);//批量插入
        result.data = res;
        result.msg = '新增模板数据成功';
        result.code = 200;
        return result;
    },
    /**
     * 删除模板（逻辑删除），通过template_ver_id来删除，只是改变status字段的值
     */
    delTemplate: function (param) {
        var template = db.dao.find("editor.editorModel.tp_template", "template_ver_id = ?", [param.template_ver_id]);
        if (template.status == 1) {
            result.msg = '模板已启用，不能删除';
            result.code = 500;
            return result;
        }
        if (template.status == 0 || template.status == 2) {
            param.status = 3;//对status状态进行限制（不能自己修改状态），避免自定义传值出现的状态值错乱的问题；
            var data = db.dao.updateSelective("editor.editorModel.tp_template", param);
            result.data = toJs.parse(data);
            result.msg = '删除模板成功';
            result.code = 200;
            return result;
        }
    },

    /**
     * 根据模板类型名称查询模板
     */
    findTemByTypeName: function (param) {
        var sql = "select tt.* from tp_template tt , tp_template_type tp where tt.type_id = tp.id and tp.type_name = ?";
        var template = db.queryForList(sql, [param.type_name]);
        result.data = toJs.parse(template);
        result.msg = '查询模板成功';
        result.code = 200;
        return result;
    },

    /**
     * 查询所有的模板
     */
    findAllTemplate: function (param) {
        var whereStr = "1=?";
        var whereVal = [1];
        if (param) {
            if (param.template_ver_id) {
                whereStr += " and template_ver_id = ? ";
                whereVal.push(param.template_ver_id);
            } else if (param.template_ver_ids && Array.isArray(param.template_ver_ids)) {
                whereStr += " and template_ver_id in( ? )";
                whereVal.push(param.template_ver_ids);
            } else if (param.min_ver_id && !param.max_ver_id) {
                whereStr += " and template_ver_id > ?";
                whereVal.push(param.min_ver_id);
            } else if (!param.min_ver_id && param.max_ver_id) {
                whereStr += " and template_ver_id < ?";
                whereVal.push(param.max_ver_id);
            } else if (param.min_ver_id && param.max_ver_id) {
                whereStr += " and template_ver_id > ? and template_ver_id < ?";
                whereVal.push(param.min_ver_id);
                whereVal.push(param.max_ver_id);
            }
        }
        var datas = toJs.parse(db.dao.findAll("editor.editorModel.tp_template", whereStr, whereVal));
        result.data = datas;
        result.msg = '查询所有模板成功';
        result.code = 200;
        return result;
    },

    /**
     * 查询所有的模板数据
     */
    findAllTemplateData: function (param) {
        var whereStr = "1=?";
        var whereVal = [1];
        if (param) {
            if (param.template_ver_id) {
                whereStr += " and template_ver_id = ? ";
                whereVal.push(param.template_ver_id);
            } else if (param.template_ver_ids && Array.isArray(param.template_ver_ids)) {
                whereStr += " and template_ver_id in( ? )";
                whereVal.push(param.template_ver_ids);
            } else if (param.min_ver_id && !param.max_ver_id) {
                whereStr += " and template_ver_id > ?";
                whereVal.push(param.min_ver_id);
            } else if (!param.min_ver_id && param.max_ver_id) {
                whereStr += " and template_ver_id < ?";
                whereVal.push(param.max_ver_id);
            } else if (param.min_ver_id && param.max_ver_id) {
                whereStr += " and template_ver_id > ? and template_ver_id < ?";
                whereVal.push(param.min_ver_id);
                whereVal.push(param.max_ver_id);
            }
        }
        var datas = toJs.parse(db.dao.findAll("editor.editorModel.tp_template_data", whereStr, whereVal));
        result.data = datas;
        result.msg = '查询所有模板数据成功';
        result.code = 200;
        return result;
    },
    /**
     * 修改模板
     * param参数 {template_id : '',type_id : '',name : '',syn_version : '',isRemoveData:XX}
     *
     * 描述:
     * param.isRemoveData默认为没有值
     * param.isRemoveData有值时,将执行删除数据,重新插入操作.
     * param.isRemoveData没有值时,将根据控件版本id和模板版本id进行update更新.
     */
    updateTemplate: function (param) {
        //console.log(typeof param.syn_version+",updateTemplate:" + JSON.stringify(param));
        param.lastupdate_user = this_user_id;
        param.lastupdate_time = this_time;
        var template = db.dao.find("editor.editorModel.tp_template", "template_ver_id = ?", [param.template_ver_id]);
        if (isNaN(param.syn_version)) { // param.syn_version%1 === 0 ---用于除整
            result.msg = '同步锁参数错误！';
            result.code = 500;
            return result;
        }

        if (template.syn_version != param.syn_version) { //乐观锁，新增时syn版本号为0;后面没修改一次，版本号就在原基础上 +1
            result.msg = '模板已被修改，不能再修改';
            result.code = 500;
            return result;
        }

        if (template.status == 3) {
            result.msg = '模板已删除，不能再修改';
            result.code = 500;
            return result;
        }
        if (template.status == 1) {
            param.type_id = template.type_id;
            param.org_id = template.org_id;
            param.template_id = template.template_id;
            var data = this.addTemplate(param);
            result.data = toJs.parse(data);
            result.msg = '模板已新增';
            result.code = 200;
            return result;
        }
        if (template.status == 0 || template.status == 2) {
            param.syn_version = template.syn_version + 1; 	//乐观锁，新增时syn版本号为0;后面没修改一次，版本号就在原基础上 +1
            param.status = template.status;					//对status状态进行限制（不能自己修改状态），避免自定义传值出现的状态值错乱的问题；
            result.data = db.dao.updateSelective("editor.editorModel.tp_template", param);
            var templateDatas = param.templateDatas;
            if (templateDatas && templateDatas.length > 0) {
                param.template_ver_id = template.template_ver_id;
                //param.isRemoveData="1";
                var data = this.updateTemplateData(param);
            }
            result.msg = '修改模板成功';
            result.code = 200;
            return result;
        }
    },
    /**
     * 修改模板数据
     * param参数 {}
     *
     */
    updateTemplateData: function (param) {
        var paramTemp = [];
        var updateToInsert = [];
        var updateSuccess = [];
        var templateDatas = param.templateDatas;
        var sqlself = "UPDATE TP_TEMPLATE_DATA t SET t.conn_rule_code = ?," + "t.conn_template_ver_id = ?,t.conn_plugin_code = ?," + "t.goal_name = ?, t.goal_value = ?,t.goal_type = ?," + "t.lastupdate_time = to_date(?,'yyyy-mm-dd hh24:mi:ss') ,t.lastupdate_user = ?," + "t.goal_code = ?  WHERE t.template_ver_id = ?  and t.plugin_ver_id = ?";
        for (var i = 0; i < templateDatas.length; i++) {
            var templateData = templateDatas[i];
            templateData.template_ver_id = param.template_ver_id;
            templateData.create_user = this_user_id;
            templateData.create_time = this_time;
            templateData.updateFlag = "Appended";
            paramTemp.push(templateData);
            if (!param.isRemoveData) {
                var goal_name = templateData.goal_name || "";
                var goal_value = "";
                if ((typeof templateData.goal_value) == 'string') {
                    goal_value = templateData.goal_value;
                } else if (templateData.goal_value) {
                    goal_value = JSON.stringify(templateData.goal_value);
                }
                var goal_type = templateData.goal_type || "";
                var lastupdate_time = this_time;
                var lastupdate_user = this_user_id;
                var template_ver_id = templateData.template_ver_id || "";
                var goal_code = templateData.goal_code || "";
                var plugin_ver_id = templateData.plugin_ver_id || "";

                var conn_rule_code = templateData.conn_rule_code || "";
                var conn_template_ver_id = templateData.conn_template_ver_id || "";
                var conn_plugin_code = templateData.conn_plugin_code || "";
                conn_plugin_code = JSON.stringify(conn_plugin_code);
                var templateUArr = [conn_rule_code, conn_template_ver_id, conn_plugin_code, goal_name, goal_value, goal_type, lastupdate_time, lastupdate_user, goal_code, template_ver_id, plugin_ver_id];

                //console.log("更新sqlself：" + JSON.stringify(sqlself));
                //console.log("更新templateUArr：" + JSON.stringify(templateUArr));
                var updateRes = db.update(sqlself, templateUArr);
                //console.log("更新updateRes：-----------------------------------" +updateRes);
                if (template_ver_id && plugin_ver_id && updateRes == 0) {//更新不成功,或者不存在,后续进行批量插入
                    if(isDataSeq ) {
                        var templateDataSeq = this.getTemplateDataSeq();
                        templateData.id = templateDataSeq.seqNum;//主键
                    }
                    updateToInsert.push(templateData);
                } else {
                    updateSuccess.push(templateData);//更新成功
                }
            }
        }
        if (updateToInsert && updateToInsert.length > 0) {
            //console.log("更新不成功或者不存在的数据,进行批量插入updateToInsert.length:"+updateToInsert.length+",updateToInsert：" +JSON.stringify(updateToInsert));
            var updateToInsertRes = db.dao.batchInsert("editor.editorModel.tp_template_data", updateToInsert); //批量插入
            result.updateToInsertRes = updateToInsertRes;
            //console.log("批量插入结果:"+JSON.stringify(result.updateToInsertRes));
        }
        if (param.isRemoveData) {
            //console.log("删除更新param：" + JSON.stringify(param));
            //console.log("删除更新paramTemp：" + JSON.stringify(paramTemp));
            var dataRemoveRes = db.dao.remove("editor.editorModel.tp_template_data", 'template_ver_id = ?', [param.template_ver_id]);
            var paramArr = [];
            for (var i = 0,pl=paramTemp.length; i < pl; i++) {
                var reportDataSeq = this.getReportDataSeq();
                paramTemp[i].id = reportDataSeq.seqNum;//主键;
                paramArr.push(paramTemp[i]);
            }
            var removeToInsertRes = db.dao.batchInsert("editor.editorModel.tp_template_data", paramArr); //批量插入
            result.removeToInsertRes = removeToInsertRes;
            //console.log("删除更新removeToInsertRes：-----------------------------------" +removeToInsertRes);
        }
        result.updateSuccess = updateSuccess;
        result.msg = '修改模板数据成功';
        result.code = 200;

        return result;

    },
    /**
     * 提交模板,修改状态为1
     * param参数 {template_ver_id : ''}
     *
     */
    submitTemplate: function (param) {
        param.status = 1;//对status状态进行限制（不能自己修改状态），避免自定义传值出现的状态值错乱的问题；
        param.lastupdate_user = this_user_id;
        param.lastupdate_time = this_time;
        var data = db.dao.updateSelective("editor.editorModel.tp_template", param);
        if (data) {
            result.msg = '修改状态成功';
            result.code = 200;
            return result;
        } else {
            result.msg = '修改状态失败';
            result.code = 500;
            return result;
        }
    },

    /**
     * 修改模板状态
     * param参数 {template_ver_id : '',status : ''}
     *
     */
    alterStatus: function (param) {
        param.lastupdate_user = this_user_id;
        param.lastupdate_time = this_time;
        var data = db.dao.updateSelective("editor.editorModel.tp_template", param);
        if (data) {
            result.msg = '修改状态成功';
            result.code = 200;
            return result;
        } else {
            result.msg = '修改状态失败';
            result.code = 500;
            return result;
        }
    },

    /**
     * 获取最新模板
     * param参数 {template_ver_id : '',status : ''}
     *
     */
    getNewTemplate: function (param) {
        var template;
        var sql;
        if (param.template_ver_id) {
            sql = "select * from tp_template where template_ver_id = (select max(template_ver_id) from tp_template where template_id = (select max(template_id) from tp_template where template_ver_id = ?))";
            template = toJs.parse(db.queryForList(sql, [param.template_ver_id]));
        } else if (param.template_id) {
            sql = "select * from tp_template where template_ver_id = (select max(template_ver_id) from tp_template where template_id = ?)";
            template = toJs.parse(db.queryForList(sql, [param.template_id]));
        }
        if (template[0]) {
            result.data = template[0];
            result.msg = '操作成功';
            result.code = 200;
        } else {
            result.data = "";
            result.msg = '操作失败';
            result.code = 500;
        }
        return result;
    },
    /*
     * 获取Template序列号
     */
    getTemplateSeq: function (params) {
        var seqName1 = "TP_TEMPLATE_SEQ";
        return this.getSeqNum({seqName:seqName1});
    },
    /*
     * 获取TemplateData序列号
     */
    getTemplateDataSeq: function(params){
        var seqName2 = "TP_TEMPLATE_DATA_SEQ";
        return this.getSeqNum({seqName:seqName2});
    },
    /*
     * 获取序列号
     */
    getSeqNum:function(params){
        var par = {
            seqName:params.seqName,
            datasource:datasource,
            funName:"getSeqNum"
        };
        var res = new Service('editor.editorSrvII.seqNumSrv').callService(par);
        return res;
    }


};

return handler[param.funName](param);