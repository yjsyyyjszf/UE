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
@Table(name = "TP_TEMPLATE", schema = "EDITOR")
public class TpTemplate extends DefaultDTO {
    //private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "TEMPLATE_VER_ID")
    private Integer template_ver_id;
    @Basic
    @Column(name = "TEMPLATE_ID")
    private Integer template_id;
    @Basic
    @Column(name = "NAME")
    private String name;
    @Basic
    @Column(name = "CONTENT")
    private String content;
    @Basic
    @Column(name = "ORG_ID")
    private String org_id;
    @Basic
    @Column(name = "USER_ID")
    private String user_id;
    @Basic
    @Column(name = "CREATE_USER")
    private String create_user;
    @Basic
    @Column(name = "LASTUPDATE_USER")
    private String lastupdate_user;
    @Basic
    @Column(name = "CREATE_TIME")
    private Date create_time;
    @Basic
    @Column(name = "LASTUPDATE_TIME")
    private Date lastupdate_time;
    @Basic
    @Column(name = "STATUS")
    private String status;
    @Basic
    @Column(name = "SYN_VERSION")
    private String syn_version;
    @Basic
    @Column(name = "VALID_DATE")
    private Date valid_date;

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public TpTemplate() {
    }

    public TpTemplate(Integer template_ver_id, Integer template_id, String name, String content, String org_id, String user_id, String create_user, String lastupdate_user, Date create_time, Date lastupdate_time, String status, String syn_version, Date valid_date) {
        this.template_ver_id = template_ver_id;
        this.template_id = template_id;
        this.name = name;
        this.content = content;
        this.org_id = org_id;
        this.user_id = user_id;
        this.create_user = create_user;
        this.lastupdate_user = lastupdate_user;
        this.create_time = create_time;
        this.lastupdate_time = lastupdate_time;
        this.status = status;
        this.syn_version = syn_version;
        this.valid_date = valid_date;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TpTemplate that = (TpTemplate) o;

        if (template_ver_id != null ? !template_ver_id.equals(that.template_ver_id) : that.template_ver_id != null)
            return false;
        if (template_id != null ? !template_id.equals(that.template_id) : that.template_id != null) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        if (content != null ? !content.equals(that.content) : that.content != null) return false;
        if (org_id != null ? !org_id.equals(that.org_id) : that.org_id != null) return false;
        if (user_id != null ? !user_id.equals(that.user_id) : that.user_id != null) return false;
        if (create_user != null ? !create_user.equals(that.create_user) : that.create_user != null) return false;
        if (lastupdate_user != null ? !lastupdate_user.equals(that.lastupdate_user) : that.lastupdate_user != null)
            return false;
        if (create_time != null ? !create_time.equals(that.create_time) : that.create_time != null) return false;
        if (lastupdate_time != null ? !lastupdate_time.equals(that.lastupdate_time) : that.lastupdate_time != null)
            return false;
        if (status != null ? !status.equals(that.status) : that.status != null) return false;
        if (syn_version != null ? !syn_version.equals(that.syn_version) : that.syn_version != null) return false;
        return valid_date != null ? valid_date.equals(that.valid_date) : that.valid_date == null;
    }

    @Override
    public int hashCode() {
        int result = template_ver_id != null ? template_ver_id.hashCode() : 0;
        result = 31 * result + (template_id != null ? template_id.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (content != null ? content.hashCode() : 0);
        result = 31 * result + (org_id != null ? org_id.hashCode() : 0);
        result = 31 * result + (user_id != null ? user_id.hashCode() : 0);
        result = 31 * result + (create_user != null ? create_user.hashCode() : 0);
        result = 31 * result + (lastupdate_user != null ? lastupdate_user.hashCode() : 0);
        result = 31 * result + (create_time != null ? create_time.hashCode() : 0);
        result = 31 * result + (lastupdate_time != null ? lastupdate_time.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        result = 31 * result + (syn_version != null ? syn_version.hashCode() : 0);
        result = 31 * result + (valid_date != null ? valid_date.hashCode() : 0);
        return result;
    }

    public Integer getTemplate_ver_id() {
        return template_ver_id;
    }

    public void setTemplate_ver_id(Integer template_ver_id) {
        this.template_ver_id = template_ver_id;
    }

    public Integer getTemplate_id() {
        return template_id;
    }

    public void setTemplate_id(Integer template_id) {
        this.template_id = template_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getOrg_id() {
        return org_id;
    }

    public void setOrg_id(String org_id) {
        this.org_id = org_id;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSyn_version() {
        return syn_version;
    }

    public void setSyn_version(String syn_version) {
        this.syn_version = syn_version;
    }

    public Date getValid_date() {
        return valid_date;
    }

    public void setValid_date(Date valid_date) {
        this.valid_date = valid_date;
    }
}
