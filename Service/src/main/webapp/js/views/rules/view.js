define([
  'jquery',
  'underscore',
  'backbone',
  'models/rules',
  'text!/templates/rules/view.html'
  ],function($, _, Backbone,Rule,ruleTemplate){
    var RuleView = Backbone.View.extend({
        el: "#view",
        initialize: function(options){
        if(typeof options != "undefined"){
        this.rule = options.rule;
        this.groups = options.groups;
        this.juris = options.juris;
            this.render();
            }
        },
        render : function(){
            $(this.el).html("");
            if(typeof this.rule != 'undefined'){
            var variables = {};
            var template = _.template(ruleTemplate,variables);
            this.$el.append(template);
            var ghtml = "";
            var jhtml = "";
            for(var i = 0; i < this.groups.length; i++){
                ghtml+="<li><a class='agroup'>"+this.groups[i]+"</a></li>";
            }
            for(var i = 0; i < this.juris.length; i++){
                jhtml+="<li><a class='ajuris'>"+this.juris[i]+"</a></li>";
            }
            $("#currentGroups").html(ghtml);
            $("#currentJuris").html(jhtml);
            ghtml+="<li class='divider'></li>";
            ghtml+="<li><a id='addGroup'>+ Add Group</a></li>";
            jhtml+="<li class='divider'></li>";
            jhtml+="<li><a id='addJuris'>+ Add Jurisdiction</a></li>";
            $("#groups").html(ghtml);
            $("#jurisdictions").html(jhtml);
                $("#gdrop").hide();
                $("#jdrop").hide();
                $("#title").val(this.rule.get("title"));
                $("#title").prop("readonly",true);
                $("#description").val(this.rule.get("description"));
                $("#description").prop("readonly",true);
                $("#content").val(this.rule.get("content"));
                $("#content").prop("readonly",true);
                $("#group").val(this.rule.get("group"));
                $("#jurisdiction").val(this.rule.get("jurisdiction"));
                $("#reference").val(this.rule.get("reference"));
                $("#reference").prop("readonly",true);
                $("#version").val(this.rule.get("version"));
                $("#version").prop("readonly",true);
            }
        },
        events: {
            "click input[value=Edit]": "editRule",
            "click input[value=Save]": "saveRule",
            "click  li a[class=agroup]" : "setGroup",
            "click  li a[class=ajuris]" : "setJuris",
            "click  li a[id=addGroup]" : "addGroup",
            "click  li a[id=addJuris]" : "addJuris",
            "click  input[id=saveGroup]" : "saveGroup",
            "click  input[id=saveJuris]" : "saveJuris"
        },
        editRule: function(event){
            $("#gdrop").show();
            $("#jdrop").show();
            $("#title").prop("readonly",false);
            $("#description").prop("readonly",false);
            $("#content").prop("readonly",false);
            $("#reference").prop("readonly",false);
            $("#version").prop("readonly",false);
            if(typeof $("#save").val() == 'undefined'){
                $(this.el).append("<input type='button' value='Save' id='save'>");
            }
        },
        saveRule: function(event){
            this.rule.set({title: $("#title").val(),
                           description: $("#description").val(),
                           content: $("#content").val(),
                           group: $("#group").val(),
                           jurisdiction: $("#jurisdiction").val(),
                           reference: $("#reference").val(),
                           version: $("#version").val()});
            if(this.groups.length > listView.collection._groups.length){
                listView.collection._groups.push($("#group").val());
            }
            if(this.juris.length > listView.collection._juris.length){
                listView.collection._juris.push($("#jurisdiction").val());
            }
        },
         setGroup: function(event){
          $("#GroupModal").modal('hide');
          var group = event.target.firstChild.data;
          if(group!="+ Add Group"){
            $("#group").val(group);
          }
        },
        setJuris: function(event){
          $("#JurisModal").modal('hide');
          var juris = event.target.firstChild.data;
          if(juris!="+ Add Jurisdiction"){
            $("#jurisdiction").val(juris);
          }
        },
        addGroup: function(event){
          $("#GroupModal").modal();
        },
        addJuris: function(event){
          $("#JurisModal").modal();
        },
        saveGroup: function(event){
          var newGroup = $("#newGroup").val();
          this.groups.push(newGroup);
          $("#currentGroups").prepend("<li><a class='agroup'>"+newGroup+"</a></li>");
          $("#groups").prepend("<li><a class='agroup'>"+newGroup+"</a></li>");
        },
        saveJuris: function(event){
          var newJuris = $("#newJuris").val();
          this.juris.push(newJuris);
          $("#currentJuris").prepend("<li><a class='ajuris'>"+newJuris+"</a></li>");
          $("#jurisdictions").prepend("<li><a class='ajuris'>"+newJuris+"</a></li>");
        }
  });
  return RuleView;
});