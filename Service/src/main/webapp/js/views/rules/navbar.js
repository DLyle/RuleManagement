define([
  'jquery',
  'underscore',
  'backbone',
  'models/rules',
  'text!/templates/rules/navbar.html'
  ],function($, _, Backbone,Rule,navTemplate){
    var navView = Backbone.View.extend({
        el: "#header",
        initialize: function(){
            this.render();
        },
        render: function(){
            var variables = {};
            var template = _.template(navTemplate,variables);
            $(this.el).html(template);
        },
        events: {}
  });
  return navView;
});