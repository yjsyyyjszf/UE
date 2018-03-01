package com.ry.editor.template.ueditor;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ry.editor.template.ueditor.define.ActionMap;
import com.ry.editor.template.ueditor.define.AppInfo;
import com.ry.editor.template.ueditor.define.BaseState;
import com.ry.editor.template.ueditor.define.State;
import com.ry.editor.template.ueditor.hunter.FileManager;
import com.ry.editor.template.ueditor.hunter.ImageHunter;
import com.ry.editor.template.ueditor.upload.Uploader;
import com.tt.pwp.rule.parse.render.RuleRenderManager;

@Controller
@RequestMapping("/editor/enter")
public class ActionEnter {
	private static Logger logger = Logger.getLogger(ActionEnter.class);

	private String actionType = null;
	private ConfigManager configManager = null;
	private HttpServletRequest request = null;
	private String rootPath = null;
	private String contextPath = null;
	@Autowired
	RuleRenderManager ruleRenderManager;

	/*	
	public ActionEnter ( HttpServletRequest request, String rootPath ) {
		this.request = request;
		this.rootPath = rootPath;
		this.actionType = request.getParameter( "action" );
		this.contextPath = request.getContextPath();
		this.configManager = ConfigManager.getInstance( this.rootPath, this.contextPath, request.getRequestURI().replace(request.getContextPath(),"") );
	}
	*/

	@ResponseBody
	@RequestMapping(value = "exec")
	public String exec(HttpServletRequest request) {
		// logger.info("--------------------开始-----------------------------");
		this.request = request;
		String callbackName = request.getParameter("callback");
		String requestURI = request.getRequestURI().replace(request.getContextPath(), "");
		this.rootPath = request.getSession().getServletContext().getRealPath("/");
		this.actionType = request.getParameter("action");
		this.contextPath = request.getContextPath();
		this.configManager = ConfigManager.getInstance(this.rootPath,this.contextPath,requestURI);
		String invokeReturn = "";
		if (callbackName != null) {
			if (!validCallbackName(callbackName)) {
				BaseState baseState = new BaseState(false, AppInfo.ILLEGAL);
				return baseState.toJSONString();
			}
			String invoke = this.invoke();
			invokeReturn = callbackName + "(" + invoke + ");";
		} else {
			invokeReturn = this.invoke();
		}
		// logger.info("--------------------结束-----------------------------invokeReturn="+invokeReturn);
		return invokeReturn;
	}

	public String invoke() {
		if (actionType == null || !ActionMap.mapping.containsKey(actionType)) {
			return new BaseState(false, AppInfo.INVALID_ACTION).toJSONString();
		}
		if (this.configManager == null || !this.configManager.valid()) {
			return new BaseState(false, AppInfo.CONFIG_ERROR).toJSONString();
		}
		State state = null;
		int actionCode = ActionMap.getType(this.actionType);
		Map<String, Object> conf = null;
		switch (actionCode) {
		case ActionMap.CONFIG:
			return this.configManager.getAllConfig().toString();
		case ActionMap.UPLOAD_IMAGE:
		case ActionMap.UPLOAD_SCRAWL:
		case ActionMap.UPLOAD_VIDEO:
		case ActionMap.UPLOAD_FILE:
			conf = this.configManager.getConfig(actionCode);
			state = new Uploader(request, conf).doExec();
			break;
		case ActionMap.CATCH_IMAGE:
			conf = configManager.getConfig(actionCode);
			String[] list = this.request.getParameterValues((String) conf.get("fieldName"));
			state = new ImageHunter(conf).capture(list);
			break;
		case ActionMap.LIST_IMAGE:
		case ActionMap.LIST_FILE:
			conf = configManager.getConfig(actionCode);
			int start = this.getStartIndex();
			state = new FileManager(conf).listFile(start);
			break;
		}
		return state.toJSONString();

	}
	/**
	 * callback参数验证
	 */
	public boolean validCallbackName(String name) {
		if (name.matches("^[a-zA-Z_]+[\\w0-9_]*$")) {
			return true;
		}
		return false;
	}
	
	public int getStartIndex() {
		String start = this.request.getParameter("start");
		try {
			return Integer.parseInt(start);
		} catch (Exception e) {
			return 0;
		}
	}

	@ResponseBody
	@RequestMapping(value = "test")
	public Object test(HttpServletRequest request) {
		logger.info("--------------------开始动态取数-----------------------------");
		Object obj = null;
		try {
			obj = ruleRenderManager.renderBycode("J2SPJ0ZO260", "");
		} catch (Exception e) {
			logger.info("异常:"+ e);
		}
		logger.info("--------------------结束动态取数-----------------------------");
		return obj;
	}

	@Override
	public String toString() {
		return "ActionEnter [actionType=" + actionType + ", configManager=" + configManager + ", rootPath=" + rootPath + ", contextPath=" + contextPath + "]";
	}
}
