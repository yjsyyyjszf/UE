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
@Table(name = "TP_REPORT_REVISE", schema = "EDITOR")
public class TpReportRevise extends DefaultDTO {
    //private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID")
    private Integer id;
    @Basic
    @Column(name = "REPORT_ID")
    private Integer report_id;
    @Basic
    @Column(name = "USER_ID")
    private Integer user_id;
    @Basic
    @Column(name = "CONTENT")
    private String content;
    @Basic
    @Column(name = "CONTENT_TYPE")
    private Boolean content_type;
    @Basic
    @Column(name = "CREATE_TIME")
    private Date create_time;
    @Basic
    @Column(name = "STATUS")
    private String status;
    @Basic
    @Column(name = "CONTENT_CTIME")
    private Date content_ctime;

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public TpReportRevise() {
    }

    public TpReportRevise(Integer id, Integer report_id, Integer user_id, String content, Boolean content_type, Date create_time, String status, Date content_ctime) {
        this.id = id;
        this.report_id = report_id;
        this.user_id = user_id;
        this.content = content;
        this.content_type = content_type;
        this.create_time = create_time;
        this.status = status;
        this.content_ctime = content_ctime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TpReportRevise that = (TpReportRevise) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (report_id != null ? !report_id.equals(that.report_id) : that.report_id != null) return false;
        if (user_id != null ? !user_id.equals(that.user_id) : that.user_id != null) return false;
        if (content != null ? !content.equals(that.content) : that.content != null) return false;
        if (content_type != null ? !content_type.equals(that.content_type) : that.content_type != null) return false;
        if (create_time != null ? !create_time.equals(that.create_time) : that.create_time != null) return false;
        if (status != null ? !status.equals(that.status) : that.status != null) return false;
        return content_ctime != null ? content_ctime.equals(that.content_ctime) : that.content_ctime == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (report_id != null ? report_id.hashCode() : 0);
        result = 31 * result + (user_id != null ? user_id.hashCode() : 0);
        result = 31 * result + (content != null ? content.hashCode() : 0);
        result = 31 * result + (content_type != null ? content_type.hashCode() : 0);
        result = 31 * result + (create_time != null ? create_time.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        result = 31 * result + (content_ctime != null ? content_ctime.hashCode() : 0);
        return result;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getReport_id() {
        return report_id;
    }

    public void setReport_id(Integer report_id) {
        this.report_id = report_id;
    }

    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getContent_type() {
        return content_type;
    }

    public void setContent_type(Boolean content_type) {
        this.content_type = content_type;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getContent_ctime() {
        return content_ctime;
    }

    public void setContent_ctime(Date content_ctime) {
        this.content_ctime = content_ctime;
    }
}
