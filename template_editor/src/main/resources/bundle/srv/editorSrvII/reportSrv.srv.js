/**
 * 1.在srv里面调用
 *        var service = new Service('editor.reportSrvV2.reportSrv').callService({});
 * 2.在VOP上面调用，调用方法跟普通的srv方式一样，只不过需要在原有的参数上面增加一个参数funName
 *        funName:findById/loadAll
 * @Autor : KING
 * @Date : 2017-05-23
 **/
var toJs = require('nodejava').toJs;
var spring = require("spring");
var reportSrvBean;
var reportDataSrvBean;
try {
    reportSrvBean = spring.getBean("reportSrv");
    reportDataSrvBean = spring.getBean("reportDataSrv");
} catch (e) {
}
var result = {};
result.data = {};
result.msg = '操作失败';
result.code = 500;
var isDataSeq = param.isDataSeq || true; //20180122 king 是否手动读取主键序列号.
var thisUserId = com.tt.pwp.framework.security.SecurityUtils.getLoginAccountId();
var thisTime = com.tt.pwp.framework.util.formatter.DateFormatterUtil.long2YYYY_MM_DDHH24miss(new java.util.Date());
var logger = com.tt.pwp.framework.util.log.LogUtil();
logger.info("reportSrv.srv.js---thisUserId:" + thisUserId + "---thisTime:" + thisTime + "---Param:" + JSON.stringify(param));
var datasource = "";                          //数据源
if (param && param.datasource) {
    var dsMgr = require('pwp-datasource');  //数据源管理对象
    db = dsMgr.db(param.datasource);        //调用db([datasouceId])函数得到指定的数据源对象,dsMgr.db('default')可得到默认数据源
    datasource = param.datasource;
}

var handler = {
    /**
     * 测试srv调用别的srv,
     */
    test: function (params) {
        params.id = "2";
        params.funName = 'findById';
        //params.datasource='fuDataSource';
        var templateTypeSrv = new Service("editor.editorSrvII.templateTypeSrv");
        var res = templateTypeSrv.callService(params);
        return res;
    },
    /**
     * 查询所有报告
     */
    getAll: function (param) {
        var data = db.dao.findAll("editor.editorModel.tp_template_report");
        if (data) {
            result.data = toJs.parse(data);
            result.msg = '查询所有报告成功';
            result.code = 200;
            return result;
        } else {
            result.msg = '查询所有报告失败';
            result.code = 500;
            return result;
        }

    },

    /**
     * 根据ID查询Report包含Content
     */
    getById: function (param) {
        var data = db.dao.findById("editor.editorModel.tp_template_report", param.id);
        if (data) {
            result.data = toJs.parse(data);
            result.msg = '查询报告成功';
            result.code = 200;
            return result;
        } else {
            result.msg = '查询报告失败';
            result.code = 500;
            return result;
        }

    },

    /**
     * 该方法除了会查询report表之外，还会查询data表的检查项
     */
    getReportDataById: function (param) {
        var report = toJs.parse(db.dao.findById("editor.editorModel.tp_template_report", param.id));
        if (report != null) {
            var report_goal = toJs.parse(db.dao.findAll("editor.editorModel.tp_template_reportdata", "report_id = ?", [param.id]));
            report.report_goal = report_goal;
            result.data = report;
            if (report.report_goal) {
                result.msg = '查询报告成功';
                result.code = 200;
                return result;
            } else {
                result.msg = '查询报告失败';
                result.code = 500;
                return result;
            }
        } else {
            result.msg = '查询报告失败';
            result.code = 500;
            return result;
        }
    },


    /**
     * 删除报告 逻辑删除
     * param参数{id:''}
     **/
    delReport: function (param) {
        var report = db.dao.findById("editor.editorModel.tp_template_report", param.id);
        if (report.status == '1') {
            result.msg = '报告已启用，不能再删除';
            result.code = 500;
            return result;
        }
        if (report.status == '0' || report.status == '2') {
            param.status = '3';
            var data = db.dao.updateSelective('editor.editorModel.tp_template_report', param);
            if (data) {
                result.msg = '删除报告成功';
                result.code = 200;
                return result;
            } else {
                result.msg = '删除报告失败';
                result.code = 500;
                return result;
            }
        }
    },

    /**
     * 修改报告,同时删除报告数据表关联的数据并重新插入
     * @Autor : KING
     * param参数 {id : '',template_ver_id : '', status : '',content : '',...,reportDatas:[{goal_id : '',goal_name : '',goal_code : '',goal_value : '',goal_value : '',...},{}]}
     * 如果报告已经是提交状态，则新增一条记录，
     * @Date : 2017-05-23
     **/
    updateReportRemoveData: function (param) {
        var datasource = param.datasource;
        var isdbdaobatchInsert = param.isdbdaobatchInsert;
        param.lastupdate_user = thisUserId;
        param.lastupdate_time = thisTime;
        if (!param.syn_version || !(typeof param.syn_version === 'number' && param.syn_version % 1 === 0)) {// param.syn_version%1 === 0 ---用于除整
            result.msg = '同步锁参数错误！';
            logger.error(result.msg);
            result.code = 500;
            return result;
        }
        var report = db.dao.findById("editor.editorModel.tp_template_report", param.id);
        if (!report) {
            result.msg = '报告不存在！';
            logger.error(result.msg);
            result.code = 500;
            return result;
        }
        if (report.syn_version != param.syn_version) { //乐观锁，新增时syn版本号为0;后面没修改一次，版本号就在原基础上 +1
            result.msg = '报告已被修改，不能再修改。report.syn_version=' + report.syn_version;
            logger.error(result.msg);
            result.code = 500;
            return result;
        }
        //status(状态)：0-草稿，1-启用，2-禁用，3-删除
        var reportStatus = "";
        if (report.status !== undefined) {
            reportStatus += report.status; //过滤int类型
            reportStatus = reportStatus.replace(/(^\s*)|(\s*$)/g, "");//去掉字符串前后所有空格
        }
        if (reportStatus == '3') {
            result.msg = '报告已删除，不能再修改';
            logger.error(result.msg);
            result.code = 500;
            return result;
        }
        if (reportStatus == '1') {
            report = toJs.parse(report);
            report.reportDatas = param.reportDatas;
            this.addReport(report);
            result.msg = '报告已新增';
            logger.info(result.msg);
            result.code = 200;
            return result;
        }
        logger.info("reportSrv.srv.js---updateReportRemoveData---updateSelective开始:" + reportStatus);
        if (reportStatus == '0' || reportStatus == '2') {
            param.syn_version = report.syn_version + 1;
            var updateReportRes = db.dao.updateSelective('editor.editorModel.tp_template_report', param);
            result.updateReportRes = updateReportRes;
            logger.info("reportSrv.srv.js---updateReportRemoveData---updateSelective结果:" + updateReportRes);
            if (updateReportRes) {
                var paraList = [];
                var reportDatas = param.reportDatas || [];
                var rplength = reportDatas.length;
                logger.info("reportSrv.srv.js---updateReportRemoveData---reportId=" + report.id + "的reportData长度:" + rplength);
                for (var i = 0; i < rplength; i++) {
                    var reportData = reportDatas[i];
                    reportData.report_id = report.id;
                    if (isdbdaobatchInsert && isdbdaobatchInsert == "1" && isDataSeq) {
                        var tp_template_reportdata_seq = this.getReportDataSeq();
                        reportData.id = tp_template_reportdata_seq.seqNum;//主键;
                    }
                    reportData.lastupdate_user = thisUserId;
                    reportData.lastupdate_time = thisTime;
                    reportData.updateFlag = "Appended";
                    paraList.push(reportData);
                }
                if (paraList.length > 0) {
                    if (isdbdaobatchInsert && isdbdaobatchInsert == "1") {
                        try {
                            logger.info("reportSrv.srv.js---updateReportRemoveData---removeRes开始---report.id:" + report.id);
                            var removeRes = db.dao.remove('editor.editorModel.tp_template_reportdata', "report_id = ?", [report.id]);
                            result.removeReportDataRes = removeRes;
                            logger.info("reportSrv.srv.js---updateReportRemoveData---removeRes结束:" + removeRes + "---report.id:" + report.id);
                        } catch (e) {
                            logger.error("reportSrv.srv.js---updateReportRemoveData---removeRes异常:" + e);
                        }
                        logger.info("reportSrv.srv.js---updateReportRemoveData---db.dao.batchInsert批量插入开始---report.id:" + report.id + ",paraList:" + paraList);
                        var res = db.dao.batchInsert("editor.editorModel.tp_template_reportdata", paraList);
                    } else {
                        try {
                            logger.info("reportSrv.srv.js---updateReportRemoveData---批量插入开始---report.id:" + report.id + ",paraList:" + paraList);
                            var date1 = new Date().getTime();
                            var reportDataRes = reportDataSrvBean.batchInsertReportData(paraList, datasource);
                            result.reportDataRes = toJs.parse(reportDataRes);
                            var date2 = new Date().getTime();
                            logger.info("reportSrv.srv.js---updateReportRemoveData---批量插入结束---report.id:" + report.id + ",总耗时:" + (date2 - date1) + ",结果:" + result.batchInsertReportDataRes);
                        } catch (e) {
                            logger.error("reportSrv.srv.js---updateReportRemoveData---批量插入异常:" + e);
                        }
                    }
                }
                result.data = {syn_version: param.syn_version};
                result.msg = '修改报告成功';
                result.code = 200;
            } else {
                result.msg = '修改报告失败';
                result.code = 500;
            }
        } else {
            result.msg = '报告状态异常,reportStatus:' + reportStatus;
            result.code = 500;
            logger.error("reportSrv.srv.js---updateReportRemoveData---" + result.msg);
        }
        return result;
    },
    /**
     * 修改多条报告
     * @Autor : king
     * param参数
     * @Date : 2018-03-06
     **/
    updateReportArr: function (param) {
        if (param.reportArr && !Array.isArray(param.reportArr)) {
            result.msg = '参数错误！';
            result.code = 500;
            return result;
        }
        var resArr = [];
        var date1 = new Date().getTime();
        var reportArr = param.reportArr || [];
        var reportArrL = reportArr.length;
        logger.info("reportSrv.srv.js---updateReportArr修改多条报告开始!报告数量:" + reportArrL);
        for (var i = 0; i < reportArrL; i++) {
            logger.info("reportSrv.srv.js---updateReportArr第" + (i + 1) + "次(" + reportArrL + ")开始,数据源:" + param.datasource + ",isdbdaobatchInsert:" + param.isdbdaobatchInsert);
            var date11 = new Date().getTime();
            reportArr[i].datasource = param.datasource || "";
            reportArr[i].isdbdaobatchInsert = param.isdbdaobatchInsert || "";
            resArr.push(this.updateReportRemoveData(reportArr[i]));
            var date12 = new Date().getTime();
            logger.info("reportSrv.srv.js---updateReportArr第" + (i + 1) + "次(" + reportArrL + ")结束,单个updateReportRemoveData耗时:" + (date12 - date11));
            logger.info("-------------------------------------------------------------------------------------------------------------------");
        }
        var date2 = new Date().getTime();
        logger.info("reportSrv.srv.js---updateReportArr修改多条报告全部结束---总总总耗时:" + (date2 - date1));
        result.dataArr = resArr;
        result.msg = '修改多条报告成功';
        result.code = 200;
        return result;
    },
    /**
     * 修改多条报告
     * @Autor : king
     * param参数
     * @Date : 2018-03-06
     **/
    updateReportArr2: function (param) {
        logger.error("reportSrv.srv.js---updateReportArr2开始---param:" + JSON.stringify(param));
        var date1 = new Date().getTime();
        if (param.reportArr && !Array.isArray(param.reportArr)) {
            result.msg = '参数错误！';
            result.code = 500;
            return result;
        }
        var resArr = [];
        var reportArr = param.reportArr || [];
        var reportArrL = reportArr.length;
        var updateReportList = [];
        var removeReportDataList = [];
        var batchInsertReportDataList = [];
        for (var i = 0; i < reportArrL; i++) {
            reportArr[i].datasource = param.datasource || "";
            reportArr[i].isdbdaobatchInsert = param.isdbdaobatchInsert || "";
            logger.info("reportSrv.srv.js---reportArr[i].reportdatas:" + reportArr[i].reportDatas.length);
            batchInsertReportDataList = batchInsertReportDataList.concat(reportArr[i].reportDatas);
            delete (reportArr[i].reportDatas);
            removeReportDataList.push(reportArr[i].id);
            updateReportList.push(reportArr[i]);
        }
        var dateUpdate1 = new Date().getTime();
        logger.error("reportSrv.srv.js---updateReportArr2前期耗时" + (dateUpdate1 - date1));
        logger.error("--------------------------------1------------------------------------------------------------");
        logger.error("reportSrv.srv.js---batchUpdateReport开始");
        var d = this.batchUpdateReport({"reportList": updateReportList, "datasource": param.datasource});
        var dateUpdate2 = new Date().getTime();
        logger.error("reportSrv.srv.js---batchUpdateReport结束,耗时:" + (dateUpdate2 - dateUpdate1));
        logger.error("--------------------------------2------------------------------------------------------------");
        logger.error("reportSrv.srv.js---batchRemoveReportData开始");
        var d2 = this.batchRemoveReportData({"reportDataList": removeReportDataList, "datasource": param.datasource});
        var dateUpdate3 = new Date().getTime();
        logger.error("reportSrv.srv.js---batchRemoveReportData结束,耗时:" + (dateUpdate3 - dateUpdate2));
        logger.error("--------------------------------3------------------------------------------------------------");
        logger.error("reportSrv.srv.js---batchInsertReportData开始");
        var d3 = this.batchInsertReportData({
            "reportDataList": batchInsertReportDataList,
            "datasource": param.datasource
        });
        var dateUpdate4 = new Date().getTime();
        logger.error("reportSrv.srv.js---batchInsertReportData结束,耗时:" + (dateUpdate4 - dateUpdate3));
        logger.error("--------------------------------4------------------------------------------------------------");
        var date2 = new Date().getTime();
        logger.error("reportSrv.srv.js---updateReportArr修改多条报告全部结束---总总总耗时:" + (date2 - date1));
        result.dataArr = resArr;
        result.msg = '修改多条报告成功';
        result.code = 200;
        return result;
    },

    batchInsertReport: function (param) {
        var reportRes = reportSrvBean.batchInsertReport(param.reportList, param.datasource);
        return toJs.parse(reportRes);
    },

    removeUpdateReport: function (param) {
        var reportRes = reportSrvBean.removeUpdateReport(param.reportList, param.datasource);
        return toJs.parse(reportRes);
    },

    batchUpdateReport: function (param) {
        var reportRes = reportSrvBean.batchUpdateReportList(param.reportList, param.datasource);
        return reportRes;
    },

    batchInsertReportData: function (param) {
        var reportDataRes = reportDataSrvBean.batchInsertReportData(param.reportDataList, param.datasource);
        return toJs.parse(reportDataRes);
    },

    batchRemoveReportData: function (param) {
        var reportDataRes = reportDataSrvBean.batchRemoveReportDataList(param.reportDataList, param.datasource);
        return toJs.parse(reportDataRes);
    },

    batchUpdataReportData: function (param) {
        var reportDataRes = reportDataSrvBean.batchUpdataReportData(param.reportDataList, param.datasource);
        return toJs.parse(reportDataRes);
    },
    /**
     * 修改报告,同时修改报告数据表关联的数据,如果有必要删除原来的data数据时，请使用updateReportRemoveData
     * @Autor : king
     * param参数 {id : '',template_ver_id : '', status : '',content : '',...,reportDatas:[{goal_id : '',goal_name : '',goal_code : '',goal_value : '',goal_value : '',...},{}]}
     * 如果报告已经是提交状态，则新增一条记录，
     * @Date : 2017-05-23
     **/
    updateReport: function (param) {
        logger.info("reportSrv.srv.js---updateReport---param:" + JSON.stringify(param));
        var report = db.dao.findById("editor.editorModel.tp_template_report", param.id);
        logger.info("reportSrv.srv.js---updateReport---report:" + JSON.stringify(report));
        if (!(typeof param.syn_version === 'number' && param.syn_version % 1 === 0)) {// param.syn_version%1 === 0 ---用于除整
            result.msg = '同步锁参数错误！';
            result.code = 500;
            return result;
        }
        if (report.syn_version != param.syn_version) { //乐观锁，新增时syn版本号为0;后面没修改一次，版本号就在原基础上 +1
            result.msg = '报告已被修改，不能再修改';
            result.code = 500;
            return result;
        }
        //status(状态)：0-草稿，1-启用，2-禁用，3-删除
        var reportStatus = "";
        if (report.status !== undefined) {
            reportStatus += report.status; //过滤int类型
            reportStatus = reportStatus.replace(/(^\s*)|(\s*$)/g, "");//去掉字符串前后所有空格
        }
        if (reportStatus == '3') {
            result.msg = '报告已删除，不能再修改';
            result.code = 500;
            return result;
        }
        if (reportStatus == '1') {
            report = toJs.parse(report);
            report.reportDatas = param.reportDatas;
            this.addReport(report);
            result.msg = '报告已新增';
            result.code = 200;
            return result;
        }
        if (reportStatus == '0' || reportStatus == '2') {
            var syn_version = report.syn_version + 1;
            param.syn_version = syn_version;
            param.lastupdate_user = thisUserId;
            param.lastupdate_time = thisTime;
            logger.info("reportSrv.srv.js---updateReport即将更新报告---param:" + JSON.stringify(param));
            var data = db.dao.updateSelective('editor.editorModel.tp_template_report', param);
            logger.info("更新updateReportID=" + param.id + ",更新结果：" + data + ",更新参数:" + JSON.stringify(param));
            result.data = data;
            if (data) {
                var para = [];
                var reportDatas = param.reportDatas || [];
                var sqlself = "UPDATE TP_TEMPLATE_REPORTDATA t SET t.goal_name = ?, t.goal_value = ?,t.goal_type = ? ,t.lastupdate_time = to_date(?,'yyyy-mm-dd hh24:mi:ss') ,t.lastupdate_user = ? ,t.plugin_ver_id = ?  WHERE t.report_id = ?  and t.goal_code = ?";
                //var date1 = new Date().getTime();
                var rpslength = reportDatas.length;
                for (var i = 0; i < rpslength; i++) {
                    var reportdata = reportDatas[i];
                    reportdata.report_id = report.id;
                    reportdata.lastupdate_user = thisUserId;
                    reportdata.lastupdate_time = thisTime;
                    reportdata.updateFlag = "Appended";
                    para.push(reportdata);
                    if (!param.isRemoveData) {
                        var goal_name = reportdata.goal_name || "";
                        var goal_value = "";
                        if ((typeof reportdata.goal_value) == 'string') {
                            goal_value = reportdata.goal_value;
                        } else if (reportdata.goal_value) {
                            goal_value = JSON.stringify(reportdata.goal_value);
                        }
                        var lastupdate_user = thisUserId;
                        var lastupdate_time = thisTime;
                        var goal_type = reportdata.goal_type || "";
                        var plugin_ver_id = reportdata.plugin_ver_id || "";
                        var report_id = reportdata.report_id || "";
                        var goal_code = reportdata.goal_code || "";
                        var reportUArr = [goal_name, goal_value, goal_type, lastupdate_time, lastupdate_user, plugin_ver_id, report_id, goal_code];
                        try {
                            var reportUDataRes = db.update(sqlself, reportUArr);
                            logger.info("更新report:" + report_id + "的reportData,更新结果：" + reportUDataRes + ",更新参数:" + JSON.stringify(reportUArr));
                        } catch (e) {
                            logger.error("更新report:" + report_id + "reportData异常：" + e);
                        }
                    }
                }
                //console.log("更新reportData完毕：");
                if (param.isRemoveData) {
                    var dataRemove = db.dao.remove("editor.editorModel.tp_template_reportdata", 'report_id = ?', [param.id]);
                    //var res = db.dao.batchInsert("editor.editorModel.tp_template_reportdata", para);//批量插入
                    var res = reportDataSrvBean.batchInsertReportData(para, datasource);
                }
                result.syn_version = syn_version;
                result.msg = '修改报告成功';
                result.code = 200;
            } else {
                result.msg = '修改报告失败';
                result.code = 500;
            }
        } else {
            result.msg = '报告状态异常,状态:' + reportStatus;
            result.code = 500;
            logger.error("reportSrv.srv.js---updateReportRemoveData---" + result.msg);
        }
        return result;
    },

    /*
     *新增报告
     *@Autor : KING
     *param参数 {template_ver_id : '', status : '',content : '',...,reportDatas:[{goal_id : '',goal_name : '',goal_code : '',goal_value : '',goal_value : '',...},{}]}
     */
    addReport: function (param) {
        param.create_user = thisUserId;
        param.create_time = thisTime;
        /*param.lastupdate_user = thisUserId;
         param.lastupdate_time = thisTime;*/
        if (param.status == null) {//默认状态为草稿
            param.status = '0';
        }
        param.syn_version = 0;
        if (isDataSeq) {
            var reportseq = this.getReportSeq();
            param.id = reportseq.seqNum;//主键;
        }
        var result = {};
        var report = db.dao.insertSelective('editor.editorModel.tp_template_report', param);
        result.data = report;
        var report_id = report.id;
        var reportDatas = param.reportDatas;
        var para = [];
        var rpslength = reportDatas.length;
        for (var i = 0; i < rpslength; i++) {
            var reportData = reportDatas[i];
            //if (reportData.plugin_ver_id != null) { // 在保存报告的时候，报告指标没有template_ver_id也是可以保存的
            reportData.create_user = thisUserId;
            reportData.create_time = thisTime;
            reportData.report_id = report_id;
            if (isDataSeq) {
                var tp_template_reportdata_seq = this.getReportDataSeq();
                reportData.id = tp_template_reportdata_seq.seqNum;//主键;
            }
            reportData.updateFlag = "Appended";
            para.push(reportData);
        }
        var res = db.dao.batchInsert("editor.editorModel.tp_template_reportdata", para);//批量插入
        result.reportdata = res;
        result.msg = "新增报告成功";
        result.code = 200;
        return result;
    },

    /*
     *提交报告，如果没有传id，则新增一条记录；如果传了id，则修改这条记录
     *param参数 {utype : '',id : '',template_ver_id : '', status : '',content : '',...,reportDatas:[{goal_id : '',goal_name : '',goal_code : '',goal_value : '',goal_value : '',...},{}]}
     *id没有则新增记录，如果是修改则要传入utype,传入规则查看updateReport方法
     */
    submitReport: function (param) {
        param.lastupdate_user = thisUserId;
        param.lastupdate_time = thisTime;
        param.status = '2';
        if (param.id == null || param.id == 0) {
            //未保存过的，需要保存report和goal
            param.create_user = thisUserId;
            param.create_time = thisTime;
            if (isDataSeq) {
                var reportSeq = this.getReportSeq();
                param.id = reportSeq.seqNum;//主键;
            }
            var report = db.dao.insertSelective('editor.editorModel.tp_template_report', param);
            result.data = report;
            //清空tp_template_reportdata表数据
            var removeRDRes = db.dao.remove("editor.editorModel.tp_template_reportdata", 'report_id = ?', [report.id]);
            var goals = param.report_goal;
            if (goals != null) {
                var goalslength = goals.length;
                for (var i = 0; i < goalslength; i++) {
                    var goal = goals[i];
                    goal.report_id = report.id;
                    goal.create_user = thisUserId;
                    goal.create_time = thisTime;
                    if (isDataSeq) {
                        var reportDataSeq = this.getReportDataSeq();
                        goal.id = reportDataSeq.seqNum;//主键;
                    }
                    var insertRDRes = db.dao.insertSelective('editor.editorModel.tp_template_reportdata', goal);
                }
            }
        } else {
            var updateRRes = db.dao.updateSelective('editor.editorModel.tp_template_report', param);
            var removeRDRes = db.dao.remove("editor.editorModel.tp_template_reportdata", 'report_id = ?', [param.id]);
            var goals = param.report_goal;
            if (goals != null) {
                var goalslength = goals.length;
                for (var i = 0; i < goalslength; i++) {
                    var goal = goals[i];
                    goal.report_id = param.id;
                    goal.create_time = thisUserId;
                    goal.create_user = thisTime;
                    if (isDataSeq) {
                        var reportDataSeq = this.getReportDataSeq();
                        goal.id = reportDataSeq.seqNum;//主键;
                    }
                    var insertRDRes = db.dao.insertSelective('editor.editorModel.tp_template_reportdata', goal);
                }
            }
        }
        result.msg = '提交报告成功';
        result.code = 200;
        return result;
    },

    saveReport: function (param) {
        param.lastupdate_user = thisUserId;
        param.lastupdate_time = thisTime;
        param.status = '1';	//默认是1-保存
        if (param.id == null || param.id == 0) {
            param.create_user = thisUserId;
            param.create_time = thisTime;
            if (isDataSeq) {
                var reportSeq = this.getReportSeq();
                param.id = reportSeq.seqNum;//主键;
            }
            result.data = db.dao.insertSelective('editor.editorModel.tp_template_report', param);
        } else {
            result.data = db.dao.updateSelective('editor.editorModel.tp_template_report', param);
        }
        result.msg = '保存成功';
        result.code = 200;
        return result;
    },

    /*
     * 新增模板报告
     *
     */
    addReportData: function (params) {
        var paramArr = [];
        var reportDataSeq = "";
        var pl = params.length;
        for (var i = 0; i < pl; i++) {
            if (isDataSeq) {
                reportDataSeq = this.getReportDataSeq();
                params[i].id = reportDataSeq.seqNum;//主键;
            }
            paramArr.push(params[i]);
        }
        result.data = toJs.parse(db.dao.insertSelective("editor.editorModel.tp_template_reportdata", paramArr));
        result.msg = "保存模板报告成功";
        rssult.code = 200;
        return result;
    },

    /*
     * 删除模板报告
     */
    delReportData: function (param) {
        db.dao.removeById("editor.editorModel.tp_template_reportdata", param.id);
        result.msg = "删除模板报告成功";
        result.code = 200;
        return result;
    },

    /*
     * 根据id,report_id,或者plugin_ver_id来查询模板报告
     */
    find: function (param) {
        if (param.id) {
            result.data = toJs.parse(db.dao.findById("editor.editorModel.tp_template_reportdata", [param.id]));
            result.msg = "查询数据成功";
            result.code = 200;
            return result;
        }
        if (param.report_id) {
            result.data = toJs.parse(db.dao.findAll("editor.editorModel.tp_template_reportdata", "report_id=?", [param.report_id]));
            result.msg = "查询数据成功";
            result.code = 200;
            return result;
        }
        if (param.plugin_ver_id) {
            result.data = toJs.parse(db.dao.findAll("editor.editorModel.tp_template_reportdata", "plugin_ver_id=?", [param.plugin_ver_id]));
            result.msg = "查询数据成功";
            result.code = 200;
            return result;

        }
    },


    /*
     * 查询所有模板报告数据
     */
    findAll: function (param) {
        result.data = toJs.parse(db.dao.findAll("editor.editorModel.tp_template_reportdata"));
        result.msg = "查询所有数据成功";
        result.code = 200;
        return result;
    },


    /*
     * 修改模板报告数据
     */
    updateReportData: function (param) {
        result.data = db.dao.updateSelective("editor.editorModel.tp_template_reportdata", param);
        result.msg = "修改数据成功";
        result.code = 200;
        return result;
    },
    /*
     * 修改模板报告状态
     */
    updateReportState: function (param) {
        result.data = db.dao.updateSelective('editor.editorModel.tp_template_report', param);
        result.msg = "修改状态成功";
        result.code = 200;
        return result;
    },

    getold_report: function (param) {
        result.data = db.dao.findById("editor.editorModel.tp_template_report", param.report_id);
        result.msg = "修改状态成功";
        result.code = 200;
        return result;
    },
    getdata_report: function (param) {
        result.data = toJs.parse(db.dao.findAll("editor.editorModel.tp_template_reportdata", "report_id=?", [param.report_id]));
        result.msg = "修改状态成功";
        result.code = 200;
        return result;
    },

    /*
     * 根据模板版本id获取最新的报告
     */
    getNewestReportByTempVId: function (param) {
        var sql = "select * from tp_template_report t1 where t1.id = (select max(t2.id) from tp_template_report t2 where t2.template_ver_id = ?)";
        var report = toJs.parse(db.queryForList(sql, [param.template_ver_id]));
        result.data = report;
        result.msg = "查询成功";
        result.code = 200;
        return result;
    },
    /*
     * 获取report序列号
     */
    getReportSeq: function (params) {
        var seqName1 = "TP_TEMPLATE_REPORT_SEQ";
        return this.getSeqNum({seqName: seqName1});
    },
    /*
     * 获取reportData序列号
     */
    getReportDataSeq: function (params) {
        var seqName2 = "TP_TEMPLATE_REPORTDATA_SEQ";
        return this.getSeqNum({seqName: seqName2});
    },
    /*
     * 获取序列号
     */
    getSeqNum: function (params) {
        var par = {
            seqName: params.seqName,
            datasource: datasource,
            funName: "getSeqNum"
        };
        var res = this.getSeqNum2(par);
        return res;
    },
    getSeqNum2: function (params) {
        if (!params.seqName)return;
        var seqName = "";
        var seqRes = {};
        var seqNum = -1;
        seqName = params.seqName;

        if (datasource) {
            seqName = datasource.toUpperCase() + "_" + seqName;
            seqRes.isDataSource = true;
        }
        if (!isDataSeq) {//是否需要自己读取序列号
            try {
                var sequenceFactory = spring.getBean("sequenceFactory");
                var datasourceManager = spring.getBean("datasourceManager");
                var dt = datasourceManager.getDataSource(datasource);
                var seqdatasource = new com.tt.pwp.data.dao.util.CurrentThreadSeqDatasourceInfo();
                seqdatasource.setSequenceDataSource(dt);//也可以设置数据源对应的jdbctemplate
                com.tt.pwp.data.dao.util.CurrentThreadDatasourceUtil.setCurrentThreadSeqDatasourceInfo(seqdatasource);            //把这个数据源对象信息给设置到线程变量中
                seqNum = sequenceFactory.generate(params.seqName); //直接调用获取序列号的方法
            } finally {
                //记得清除掉这个线程里面的数据源信息。
                com.tt.pwp.data.dao.util.CurrentThreadDatasourceUtil.clearCurrentThreadSeqDatasourceInfo();
            }
        } else {
            var sequence = spring.getBean("sequence");
            //console.log("seqName:"+seqName);
            seqNum = sequence.generate(seqName);// 获取已创建的序列;
        }
        if (seqNum !== "" && seqNum !== undefined) {
            seqRes.seqNum = seqNum;
            seqRes.msg = "获取成功";
            seqRes.code = 200;
        } else {
            seqRes.seqNum = "";
            seqRes.msg = "获取失败";
            seqRes.code = 500;
        }
        return seqRes;
    }

};

return handler[param.funName](param);
