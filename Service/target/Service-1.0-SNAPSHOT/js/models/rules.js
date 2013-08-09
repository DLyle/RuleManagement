define([
  'underscore',
  'backbone'
  ],function(_,Backbone){
    var RuleModel = Backbone.Model.extend({
      url: "/rest/rule/",
      defaults: {
        "title" : "",
        "content": "",
        "version":"",
        "group":"",
        "jurisdiction":"",
        "description":""
      },
      initialize: function(){
        this.on("change",function(model,options){
        if(!this.hasChanged("id")&&!this.hasChanged("data")){
          if(options && options.save === false) return;
          model.save();
          }
        })
      },
      methodToUrl: {
        'read':'http://localhost:8080/rest/rule/',
        'create':'http://localhost:8080/rest/rule/create',
        'update':'http://localhost:8080/rest/rule/update/',
        'delete':'http://localhost:8080/rest/rule/delete/'
      },
      sync : function(method, model, options){
        options = options || {};
            options.url = this.methodToUrl[method.toLowerCase()];
        if(method.toLowerCase() == 'read'){
          options.url += options.data["title"];
        }
        if(method.toLowerCase() == 'delete' || method.toLowerCase() == 'update'){
          options.url += this.id;
        }
        Backbone.sync(method,model,options);
      }
  });
  return RuleModel;
});