define([
  "jquery",
  "underscore",
  "backbone",
  "router"
  ],function($, _, Backbone, Router){
    var initialize = function(){
        Router.initialize();
    }
    return {
      initialize : initialize
    };
  });
/*
function getRuleByTitle(){
  var title = $("#getRule").val();
  var rule = new Rule();
  rule.set({title: title});
  rule.setGetUrl();
  rule.fetch({
    success : function(rule){
      console.log(rule.attributes.data.title);
      console.log(rule);
      var ruleView = new RuleView({rule:rule});
    }
  });
}

function createRule(){
  var title = $("#title").val();
  var content = $("#content").val();
  var version = $("#version").val();
  var rule = new Rule();
  rule.set({title  : title,
            content: content,
            version: version});
  rule.setPostUrl();
  rule.save({
    success: function(rule){
        console.log(rule);
    }
  });
}
*/
