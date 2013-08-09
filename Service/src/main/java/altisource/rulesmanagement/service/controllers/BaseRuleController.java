package altisource.rulesmanagement.service.controllers;

import altisource.rulesmanagement.dao.BaseRuleDao;
import altisource.rulesmanagement.domain.BaseRule;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.CommandResult;
import com.mongodb.DBObject;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Richard Gu
 * Date: 6/25/13
 * Time: 10:12 AM
 */

@Controller
@RequestMapping("rule")
public class BaseRuleController {

    @Autowired
    private View jsonView_i;

    @Autowired
    private BaseRuleDao baseRuleDao;

    private String prevSearch = "";

    private static final String DATA_FIELD = "data";
    private static final String ERROR_FIELD = "error";

    private Map<String,Object> packageRule(BaseRule rule){
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("title",rule.getTitle());
        map.put("content",rule.getContent());
        map.put("version",rule.getVersion());
        map.put("group",rule.getGroup());
        map.put("reference",rule.getReference());
        map.put("jurisdiction",rule.getJurisdiction());
        map.put("description",rule.getDescription());
        map.put("id",rule.getId().toString());
        return map;
    }
    @RequestMapping(value="/{title}", method = RequestMethod.GET)
    public ModelAndView getBaseRule(@PathVariable String title) throws Exception{

        if(title == null) {
            return createErrorResponse("Rule title is empty.");
        }
        String decoded = URLDecoder.decode(title, "UTF-8");
        BaseRule rule = baseRuleDao.getRuleByTitle(decoded);
        ModelAndView modelAndView = new ModelAndView(jsonView_i);
        modelAndView.addObject("title",rule.getTitle());
        modelAndView.addObject("content",rule.getContent());
        modelAndView.addObject("version",rule.getVersion());
        modelAndView.addObject("id",rule.getId().toString());
        return modelAndView;

    }

    @RequestMapping(value={"/delete/{id}"}, method=RequestMethod.DELETE)
    public ModelAndView removeBaseRule(@PathVariable String id) throws Exception{
        try{
            baseRuleDao.removeRule(id);
        } catch (Exception ex) {
            String msg = "Error removing rule. [%1$s]";
            return createErrorResponse(String.format(msg, ex.toString()));
        }

        return new ModelAndView(jsonView_i, DATA_FIELD, id);
    }

    private BasicDBList getDistinct(String key){
        DBObject cmd = new BasicDBObject();
        cmd.put("distinct","baserules");
        cmd.put("key",key);
        CommandResult commandResult = baseRuleDao.getDatastore().getDB().command(cmd);
        return (BasicDBList) commandResult.get("values");
    }

    private List<BaseRule> searchRules(String searchTerm,Map<String,String> query) throws Exception{
        int pageSize = Integer.parseInt(query.get("page_size"));
        int currentPage = Integer.parseInt(query.get("current_page"));
        List<Map<String,Object>> ruleList = new ArrayList<Map<String,Object>>();
        DBObject cmd = new BasicDBObject();
        cmd.put("text","baserules");
        String decoded = URLDecoder.decode(searchTerm, "UTF-8");
        cmd.put("search",decoded);
        CommandResult commandResult = baseRuleDao.getDatastore().getDB().command(cmd);
        BasicDBList results = (BasicDBList) commandResult.get("results");
        int index = pageSize*currentPage;
        List<BaseRule> baseRuleList = new ArrayList<BaseRule>();
        for(int i=0; i<results.size(); i++){
            CommandResult result = (CommandResult) results.get(i);
            if(result.containsField("obj")){
                CommandResult ruleResult = (CommandResult) result.get("obj");
                String title = ruleResult.get("title").toString();
                BaseRule rule = baseRuleDao.getRuleByTitle(title);
                baseRuleList.add(rule);
                Map<String,Object> map = packageRule(rule);
                ruleList.add(map);
            }
        }
        return baseRuleList;
        /*
        Map<String,Object> ret = new HashMap<String, Object>();
        Integer size = results.size();
        Integer totalPages = size/pageSize;
        Integer remainder = size%pageSize;
        if(remainder!=0)totalPages++;
        query.put("total_entries",size.toString());
        query.put("total_pages",totalPages.toString());
        ret.put("state",query);
        ret.put("list",ruleList);
        ret.put("groups",getDistinct("group"));
        ret.put("jurisdictions",getDistinct("jurisdiction"));
        return new ModelAndView(jsonView_i,DATA_FIELD,ret);
        */
    }
    private Map<String,String> parseQuery(String query){
        String[] queryParams = query.split("&");
        Map<String,String> parsed = new HashMap<String, String>();
        for(int i = 0; i < queryParams.length; i++){
            String[] param = queryParams[i].split("=");
            if(param.length>1){
                parsed.put(param[0],param[1]);
            }
        }
        return parsed;
    }
    @RequestMapping(value={"/"}, method=RequestMethod.GET)
    public ModelAndView getAllBaseRules(HttpServletRequest req,HttpServletResponse res) throws Exception{
        Map<String,String> query = parseQuery(req.getQueryString());
        String search = query.get("search");
        String group = query.get("group");
        String jurisdiction = query.get("jurisdiction");
        List<Map<String,Object>> ruleList = new ArrayList<Map<String,Object>>();
        List<BaseRule> baseRuleList = new ArrayList<BaseRule>();
        int currentPage = Integer.parseInt(query.get("current_page"));
        int pageSize = Integer.parseInt(query.get("page_size"));

        if(search != null){
            if(!prevSearch.equals(search)) {
                query.put("current_page","0");
                currentPage = 0;
                prevSearch = search;
            }
            baseRuleList = searchRules(search,query);
        }
        else{
            baseRuleList = baseRuleDao.getAllRules();
            if(group != null){
              group = URLDecoder.decode(group,"UTF-8");
              baseRuleList = baseRuleDao.getBaseRulesByGroup(group);
            }
            if(jurisdiction != null){
              jurisdiction = URLDecoder.decode(jurisdiction,"UTF-8");
              baseRuleList = baseRuleDao.getBaseRulesByJurisdiction(jurisdiction);
            }
        }
        int index = currentPage * pageSize;
        for(int i=index; i < baseRuleList.size()&&i<index+pageSize;i++){
            BaseRule rule = baseRuleList.get(i);
            Map<String,Object> map = packageRule(rule);
            ruleList.add(map);
        }

            Integer size = baseRuleList.size();
            Integer totalPages = size/pageSize;
            Integer remainder = size%pageSize;
            if(remainder!=0)totalPages++;
            query.put("total_entries",size.toString());
            query.put("total_pages",totalPages.toString());
            Map<String,Object> ret = new HashMap<String, Object>();
            ret.put("state",query);
            ret.put("list",ruleList);
            ret.put("groups",getDistinct("group"));
            ret.put("jurisdictions",getDistinct("jurisdiction"));
            return new ModelAndView(jsonView_i,DATA_FIELD,ret);
    }

    @RequestMapping(value = { "/create" }, method = {RequestMethod.POST})
    public ModelAndView createBaseRule(@RequestBody BaseRule rule) {

        try{
            baseRuleDao.saveOrUpdateRule(rule);
        } catch (Exception ex) {
            String msg = "Error creating new rule. [%1$s]";
            return createErrorResponse(String.format(msg, ex.toString()));
        }

        return new ModelAndView(jsonView_i, "id", rule.getId().toString());
    }

    @RequestMapping(value = { "/update/{id}" }, method = {RequestMethod.PUT})
    public ModelAndView updateBaseRule(@PathVariable String id, @RequestBody BaseRule rule) {
        try{
            ObjectId objectId = new ObjectId(id);
            BaseRule baseRule= baseRuleDao.get(objectId);
            baseRule.setContent(rule.getContent());
            baseRule.setTitle(rule.getTitle());
            baseRule.setGroup(rule.getGroup());
            baseRule.setReference(rule.getReference());
            baseRule.setJurisdiction(rule.getJurisdiction());
            baseRule.setDescription(rule.getDescription());
            baseRule.setVersion(rule.getVersion());
            baseRuleDao.saveOrUpdateRule(baseRule);
        } catch (Exception ex) {
            String msg = "Error updating rule. [%1$s]";
            return createErrorResponse(String.format(msg, ex.toString()));
        }
        return new ModelAndView(jsonView_i, "id", id);

    }



    private ModelAndView createErrorResponse(String sMessage) {
        return new ModelAndView(jsonView_i, ERROR_FIELD, sMessage);
    }


    public BaseRuleDao getBaseRuleDao() {
        return baseRuleDao;
    }

    public void setBaseRuleDao(BaseRuleDao baseRuleDao) {
        this.baseRuleDao = baseRuleDao;
    }
}
