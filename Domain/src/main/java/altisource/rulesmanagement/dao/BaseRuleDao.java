package altisource.rulesmanagement.dao;

import altisource.rulesmanagement.domain.BaseRule;
import com.google.code.morphia.Morphia;
import com.google.code.morphia.dao.BasicDAO;
import com.google.code.morphia.query.Query;
import com.mongodb.Mongo;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Richard Gu
 * Date: 6/24/13
 * Time: 4:30 PM
 */

public class BaseRuleDao extends BasicDAO<BaseRule, ObjectId> {

    public BaseRuleDao(Morphia morphia, Mongo mongo) {
        super(mongo, morphia, "altisource-dev");
    }

    public BaseRule getRuleByTitle(String title) {
        List<BaseRule> baseRuleList = createQuery().field("title").equal(title).order("version").asList();
        if (baseRuleList.isEmpty())
            return null;
        else
            return baseRuleList.get(baseRuleList.size() - 1);
    }

    public List<BaseRule> getAllRules(){
        List<BaseRule> baseRuleList = createQuery().order("group").asList();
        if(baseRuleList.isEmpty())
            return null;
        else
            return baseRuleList;
    }

    public List<BaseRule> getBaseRulesByGroup(String group){
        List<BaseRule> baseRuleList = createQuery().field("group").equal(group).order("version").asList();
        if(baseRuleList.isEmpty())
            return null;
        else
            return baseRuleList;
    }

    public List<BaseRule> getBaseRulesByJurisdiction(String jurisdiction){
        List<BaseRule> baseRuleList = createQuery().field("jurisdiction").equal(jurisdiction).order("version").asList();
        if(baseRuleList.isEmpty())
            return null;
        else
            return baseRuleList;
    }
    public void removeRule(String id){
        ObjectId objectId = new ObjectId(id);
        BaseRule baseRule = createQuery().field("id").equal(objectId).get();
        ds.delete(baseRule);
        /*
        List<BaseRule> baseRuleList = createQuery().field("id").equal(JSON.parse(id)).order("version").asList();
        BaseRule baseRule = baseRuleList.get(baseRuleList.size()-1);
        Query<BaseRule> q = createQuery();
        q.and(
                q.criteria("id").equal(id)
        );

        Iterable<BaseRule> founds = q.fetch();

        if (founds != null) {
            Iterator<BaseRule> iter = founds.iterator();

            if (iter.hasNext()) {
                BaseRule existing = iter.next();
                baseRule.setId(existing.getId());
            }
        }
        delete(baseRule);
        */
    }

    public void saveOrUpdateRule(BaseRule baseRule) {

        Query<BaseRule> q = createQuery();
        q.and(
                q.criteria("version").equal(baseRule.getVersion()),
                q.criteria("title").equal(baseRule.getTitle())
        );

        Iterable<BaseRule> founds = q.fetch();

        if (founds != null) {
            Iterator<BaseRule> iter = founds.iterator();

            if (iter.hasNext()) {
                BaseRule existing = iter.next();
                baseRule.setId(existing.getId());
            }
        }

        save(baseRule);
    }

}
