define([
  'jquery',
  'underscore',
  'backbone',
  'models/rules',
  'text!/templates/rules/create.html'
  ],function($, _, Backbone,Rule,createTemplate){
    var createView = Backbone.View.extend({
        el: "#create",
        initialize: function(options){
          this.model = new Rule();
          if(typeof options.groups != "undefined"){
          this.groups = options.groups;
          this.juris = options.juris;
          this.render();
          }
        },
        render: function(){
            $(this.el).html("");
            var variables = {};
            var template = _.template(createTemplate,variables);
            $(this.el).html(template);
            var ghtml = "";
            for(var i = 0; i < this.groups.length; i++){
                ghtml+="<li><a class='agroup'>"+this.groups[i]+"</a></li>";
            }
            $("#currentGroups").html(ghtml);
            ghtml+="<li class='divider'></li>";
            ghtml+="<li><a id='addGroup'>+ Add Group</a></li>";
            $("#groups").html(ghtml);

            var jhtml = "";
            for(var i = 0; i < this.juris.length; i++){
                jhtml+="<li><a class='ajuris'>"+this.juris[i]+"</a></li>";
            }
            $("#currentJuris").html(jhtml);
            jhtml+="<li class='divider'></li>";
            jhtml+="<li><a id='addJuris'>+ Add Jurisdiction</a></li>";
            $("#jurisdictions").html(jhtml);

        },
        events: {
          "click input[value=Create]": "createRule",
          "click  li a[class=agroup]" : "setGroup",
          "click  li a[class=ajuris]" : "setJuris",
          "click  li a[id=addGroup]" : "addGroup",
          "click  li a[id=addJuris]" : "addJuris",
          "click  input[id=saveGroup]" : "saveGroup",
          "click  input[id=saveJuris]" : "saveJuris"
        },
        createRule: function(event){
          var title = $("#title").val();
          var description = $("#description").val();
          var content = $("#content").val();
          var reference = $("#reference").val();
          var version = $("#version").val();
          var group = $("#group").val();
          var juris = $("#jurisdiction").val();
          if(this.groups.length > listView.collection._groups.length){
            listView.collection._groups.push(group);
          }
          if(this.juris.length > listView.collection._juris.length){
            listView.collection._juris.push(juris);
          }
          this.model.set({title  : title,
                          description: description,
                          content: content,
                          reference: reference,
                          group: group,
                          jurisdiction: juris,
                          version: version});
          this.remove();
          window.location = '/';
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
  return createView;
});