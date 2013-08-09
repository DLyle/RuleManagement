package altisource.rulesmanagement.dao;

import altisource.rulesmanagement.domain.BaseRule;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.BufferedReader;
import java.io.FileReader;

/**
 * Created with IntelliJ IDEA.
 * User: Richard Gu
 * Date: 6/24/13
 * Time: 5:14 PM
 */


public class TestBaseRuleDao extends DaoTestBase {

    @Autowired
    BaseRuleDao baseRuleDao;

    @Test
    public void testCRUD() throws Exception{
        BufferedReader br = new BufferedReader(
                new FileReader("/home/ubuntu/projects/practice/mongo/lateChargeRules.drl"));
        String line = br.readLine();
        while(line != null){
            String[] words = line.split(" ");
            if(words[0].equals("rule")){
                String title = "";
                String content = "";
                for(int i=1; i<words.length; i++){
                    title+=words[i];
                }
                line = br.readLine();
                if(line==null)break;
                while(!line.startsWith("end")){
                    if(line==null)break;
                    content+=line;
                    line = br.readLine();
                }
                BaseRule baseRule = new BaseRule();
                baseRule.setContent(content);
                baseRule.setTitle(title);
                baseRule.setVersion("1.0");
                baseRuleDao.saveOrUpdateRule(baseRule);
            }
            line = br.readLine();
        }/*
        BaseRule baseRule = new BaseRule();
        baseRule.setTitle("Test Rule By Richard");
        baseRule.setContent("package rsng.rules\n" +
                "\n" +
                "import java.math.BigDecimal;import rsng.services.util.DateUtils;import com.altisource.rsng.dto.LoanWithFee;import java.util.List;import java.util.Arrays;import org.apache.commons.collections.CollectionUtils;\n" +
                "\n" +
                "global org.slf4j.Logger LOGGER;global Boolean testInactive;\n" +
                "\n" +
                "rule \"Freddie AZ OPB <= 5K the Lesser of 5% or $10\" \n" +
                "activation-group \"LateChargeRules\"\n" +
                "salience \"-35\" \n" +
                "when \n" +
                "loanWithFee:LoanWithFee(state == \"AZ\",investorCode in (\"500\", \"501\", \"2697\", \"2692\", \"2737\", \"6692\", \"2656\", \"2693\", \"3481\", \"3482\", \"3483\", \"3886\", \"3888\", \"3944\", \"3945\", \"3946\", \"3954\", \"3955\", \"3887\", \"6697\", \"3959\", \"3960\", \"3953\", \"3968\", \"3964\", \"3965\", \"4499\"),initialPrincipalBal <= new BigDecimal(\"5000.00\"), unpaidAmount != null,unpaidAmount.compareTo(BigDecimal.ZERO) == 1,$payment:unpaidAmount) \n" +
                "then \n" +
                "loanWithFee.setFee((new BigDecimal(\"0.05\").multiply($payment)).min(new BigDecimal(\"10.0\")));\n" +
                "end ");
        baseRule.setVersion("1.0");

        //baseRuleDao.saveOrUpdateRule(baseRule);

        //assertNotNull(baseRule.getId());
        */

    }


}
