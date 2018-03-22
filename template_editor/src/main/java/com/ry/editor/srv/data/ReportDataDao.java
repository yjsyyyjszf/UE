package com.ry.editor.srv.data;

import com.ry.editor.srv.dao.EditorDao;
import com.ry.editor.srv.entity.TpTemplateReportdata;
import com.ry.editor.srv.utils.SDEUtil;
import com.tt.pwp.acl.model.Account;
import com.tt.pwp.framework.data.dao.DaoFactory;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by KING on 2018/3/13.
 */
@Component
public class ReportDataDao extends EditorDao<Account, Integer> {
    public static Logger log = Logger.getLogger(ReportDataDao.class);

    private DaoFactory daoFactory = null;

    /**
     * 批量插入报告数据,返回实体list
     *
     * @return List
     */
    public List<TpTemplateReportdata> batchInsertReportData(List<TpTemplateReportdata> list, String aloDataSource) throws Exception {
        //ReportDataJdbcDao dao =  SpringContextUtil.getBeanOfType(ReportDataJdbcDao.class);
        List<TpTemplateReportdata> res = null;
        long startTime = SDEUtil.logStart("batchUpdateReportData", aloDataSource);
        if (aloDataSource != null && !aloDataSource.isEmpty()) {
            res = super.getDao(aloDataSource).batchInsert(list);
        } else {
            res = super.getDefaultDao().batchInsert(list);
        }
        SDEUtil.logEnd("batchUpdateReportData", startTime, res);
        return res;
    }

    /**
     * 批量修改报告数据
     *
     * @return Dao
     */
    public int batchUpdateReportData(List<TpTemplateReportdata> list, String aloDataSource) throws Exception {
        //ReportDataJdbcDao dao =  SpringContextUtil.getBeanOfType(ReportDataJdbcDao.class);
        int res = 0;
        long startTime = SDEUtil.logStart("batchUpdateReportData", aloDataSource);
        if (aloDataSource != null && !aloDataSource.isEmpty()) {
            res = super.getDao(aloDataSource).batchUpdate(list);
        } else {
            res = super.getDefaultDao().batchUpdate(list);
        }
        SDEUtil.logEnd("batchUpdateReportData", startTime, res);
        return res;
    }

    /**
     * 批量删除报告数据
     *
     * @return int
     */
    public int batchRemoveReportData(List<TpTemplateReportdata> list, String aloDataSource) throws Exception {
        int res = 0;
        long startTime = SDEUtil.logStart("batchRemoveReportData", aloDataSource);
        if (aloDataSource != null && !aloDataSource.isEmpty()) {
            res = super.getDao(aloDataSource).batchRemove(list);
        } else {
            res = super.getDefaultDao().batchRemove(list);
        }
        SDEUtil.logEnd("batchRemoveReportData", startTime, res);
        return res;
    }

}
