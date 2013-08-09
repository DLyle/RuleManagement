define([
  "jquery",
  "underscore",
  "backbone",
  "views/rules/navbar",
  "views/rules/create",
  "views/rules/list",
  "views/rules/view"
  ],function($,_,Backbone,NavView,CreateView,ListView, RuleView){
    var AppRouter = Backbone.Router.extend({
      routes: {
      "create" : "create",
      "read" :  "read",
      "view" : "view",
      "*actions": "showRules"
      },
      showRules: function(){
      if(typeof createView !=  'undefined') createView.remove();
      if(typeof ruleView !=  'undefined') ruleView.remove();
      if(typeof navView ==  'undefined') navView = new NavView();
      else navView.render();

      if(typeof listView == 'undefined') listView = new ListView();
      else {
        listView.collection.fetch({reset:true});
        listView.render();
        }
      },

      create: function(){
      if(typeof listView == 'undefined') window.location="/";
      if(typeof ruleView !=  'undefined') ruleView.remove();
      $("#body").html("");
      $("#body").append("<div id='create'></div>");
      if(typeof navView ==  'undefined') navView = new NavView();
      else navView.render();
        createView = new CreateView({
            groups:listView.collection._groups,
            juris:listView.collection._juris
            });
      },

      view: function(){
      if(typeof listView == 'undefined') window.location="/";
      $("#body").html("");
      $("#body").append("<div id='view'></div>");
        if(typeof navView ==  'undefined') navView = new NavView();
        else navView.render();
        var selectedModels = listView.grid.getSelectedModels();
        var rule = selectedModels[0];
         _.each(selectedModels,function(model){
            model.trigger("backgrid:select",model,false);
        });
          ruleView = new RuleView({
            rule: rule,
            groups: listView.collection._groups,
            juris: listView.collection._juris
          });
      }
    });
  var initialize = function(){
    var app_router = new AppRouter;
    Backbone.history.start();
  };
  return {
    initialize : initialize
  };
  });