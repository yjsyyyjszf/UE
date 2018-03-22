package com.ry.editor.srv.entity;

import com.tt.pwp.framework.data.model.DefaultDTO;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by KING on 2018/3/13.
 */
@Entity
@Table(name = "TP_TEMPLATE_REPORTDATA", schema = "EDITOR")
public class TpTemplateReportdata extends DefaultDTO {
    //private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID")
    private Integer id;
    @Basic
    @Column(name = "REPORT_ID")
    private String report_id;
    @Basic
    @Column(name = "GOAL_CODE")
    private String goal_code;
    @Basic
    @Column(name = "GOAL_NAME")
    private String goal_name;
    @Basic
    @Column(name = "GOAL_VALUE")
    private String goal_value;
    @Basic
    @Column(name = "GOAL_TYPE")
    private String goal_type;
    @Basic
    @Column(name = "CREATE_TIME")
    private Date create_time;
    @Basic
    @Column(name = "LASTUPDATE_TIME")
    private Date lastupdate_time;
    @Basic
    @Column(name = "CREATE_USER")
    private String create_user;
    @Basic
    @Column(name = "LASTUPDATE_USER")
    private String lastupdate_user;
    @Basic
    @Column(name = "PLUGIN_VER_ID")
    private String plugin_ver_id;

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public TpTemplateReportdata() {
    }

    public TpTemplateReportdata(Integer id, String report_id, String goal_code, String goal_name, String goal_value, String goal_type, Date create_time, Date lastupdate_time, String create_user, String lastupdate_user, String plugin_ver_id) {
        this.id = id;
        this.report_id = report_id;
        this.goal_code = goal_code;
        this.goal_name = goal_name;
        this.goal_value = goal_value;
        this.goal_type = goal_type;
        this.create_time = create_time;
        this.lastupdate_time = lastupdate_time;
        this.create_user = create_user;
        this.lastupdate_user = lastupdate_user;
        this.plugin_ver_id = plugin_ver_id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TpTemplateReportdata that = (TpTemplateReportdata) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (report_id != null ? !report_id.equals(that.report_id) : that.report_id != null) return false;
        if (goal_code != null ? !goal_code.equals(that.goal_code) : that.goal_code != null) return false;
        if (goal_name != null ? !goal_name.equals(that.goal_name) : that.goal_name != null) return false;
        if (goal_value != null ? !goal_value.equals(that.goal_value) : that.goal_value != null) return false;
        if (goal_type != null ? !goal_type.equals(that.goal_type) : that.goal_type != null) return false;
        if (create_time != null ? !create_time.equals(that.create_time) : that.create_time != null) return false;
        if (lastupdate_time != null ? !lastupdate_time.equals(that.lastupdate_time) : that.lastupdate_time != null)
            return false;
        if (create_user != null ? !create_user.equals(that.create_user) : that.create_user != null) return false;
        if (lastupdate_user != null ? !lastupdate_user.equals(that.lastupdate_user) : that.lastupdate_user != null)
            return false;
        return plugin_ver_id != null ? plugin_ver_id.equals(that.plugin_ver_id) : that.plugin_ver_id == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (report_id != null ? report_id.hashCode() : 0);
        result = 31 * result + (goal_code != null ? goal_code.hashCode() : 0);
        result = 31 * result + (goal_name != null ? goal_name.hashCode() : 0);
        result = 31 * result + (goal_value != null ? goal_value.hashCode() : 0);
        result = 31 * result + (goal_type != null ? goal_type.hashCode() : 0);
        result = 31 * result + (create_time != null ? create_time.hashCode() : 0);
        result = 31 * result + (lastupdate_time != null ? lastupdate_time.hashCode() : 0);
        result = 31 * result + (create_user != null ? create_user.hashCode() : 0);
        result = 31 * result + (lastupdate_user != null ? lastupdate_user.hashCode() : 0);
        result = 31 * result + (plugin_ver_id != null ? plugin_ver_id.hashCode() : 0);
        return result;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getReport_id() {
        return report_id;
    }

    public void setReport_id(String report_id) {
        this.report_id = report_id;
    }

    public String getGoal_code() {
        return goal_code;
    }

    public void setGoal_code(String goal_code) {
        this.goal_code = goal_code;
    }

    public String getGoal_name() {
        return goal_name;
    }

    public void setGoal_name(String goal_name) {
        this.goal_name = goal_name;
    }

    public String getGoal_value() {
        return goal_value;
    }

    public void setGoal_value(String goal_value) {
        this.goal_value = goal_value;
    }

    public String getGoal_type() {
        return goal_type;
    }

    public void setGoal_type(String goal_type) {
        this.goal_type = goal_type;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public Date getLastupdate_time() {
        return lastupdate_time;
    }

    public void setLastupdate_time(Date lastupdate_time) {
        this.lastupdate_time = lastupdate_time;
    }

    public String getCreate_user() {
        return create_user;
    }

    public void setCreate_user(String create_user) {
        this.create_user = create_user;
    }

    public String getLastupdate_user() {
        return lastupdate_user;
    }

    public void setLastupdate_user(String lastupdate_user) {
        this.lastupdate_user = lastupdate_user;
    }

    public String getPlugin_ver_id() {
        return plugin_ver_id;
    }

    public void setPlugin_ver_id(String plugin_ver_id) {
        this.plugin_ver_id = plugin_ver_id;
    }


}
