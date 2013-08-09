define([
  'jquery',
  'underscore',
  'backbone',
  'models/rules',
  'collections/rulelist',
  'backgrid',
  'text!/templates/rules/list.html',
  'select-all',
  'filter',
  'text-cell',
  'paginator',
  'select2Cell'
  ],function($, _, Backbone,Rule,RuleList,Backgrid,listTemplate){
    var ListView = Backbone.View.extend({
        el: "#body",
        initialize: function(){
            this.collection = new RuleList([],{
                state:{
                    firstPage: 0,
                    currentPage: 0
                },
                queryParams: {
                    currentPage: "current_page",
                    pageSize: "page_size",
                }
            });
            this.collection.fetch({
              reset: true,
              success: function(col){
              var ContentCell = Backgrid.Cell.extend({
                className: "text-cell",
                editor: Backgrid.Extension.TextareaEditor.extend({cols:80}),
                render: function(){
                    this.$el.html("<button>Examine</button>");
                    this.delegateEvents();
                    return this;
                }
              });
              var columns = [{
                name:"title",
                label:"Title",
                cell:"string"
                },{
                name:"description",
                label:"Description",
                cell:"text"
                },{
                name:"group",
                label:"Type",
                editable:false,
                cell: "string"
                },{
                name:"jurisdiction",
                label:"Jurisdiction",
                cell:"string"
                },{
                name:"reference",
                label:"Reference",
                cell:"uri"
                },{
                name:"version",
                label:"Version",
                cell:"string"
                },{
                name:"content",
                label:"Content",
                cell: ContentCell
                }];
            listView.grid = new Backgrid.Grid({
                columns: [{
                    name: "",
                    cell: "select-row",
                    headerCell: "select-all",
                    }].concat(columns),
                collection: listView.collection
            });
            listView.paginator = new Backgrid.Extension.Paginator({
                collection: listView.collection
            });
            listView.serverSideFilter = new Backgrid.Extension.ServerSideFilter({
                collection: listView.collection,
                name: "search",
                placeholder:"Search"
            });
            listView.render();
            }
            });
        },
        render: function(){
        $(this.el).html("");
        var ghtml = "";
        var jhtml = "";
        for(var i = 0; i < this.collection._groups.length; i++){
            ghtml+="<li><a class='GroupLink'>"+this.collection._groups[i]+"</a></li>";
        }
        for(var i = 0; i < this.collection._juris.length; i++){
            jhtml+="<li><a class='JurisLink'>"+this.collection._juris[i]+"</a></li>";
        }
        var variables = {};
        var template = _.template(listTemplate,variables);
        $(this.el).append("<div id='pull-left' class='pull-left'>");
        $("#pull-left").append(this.serverSideFilter.render().el);
        $(this.el).append(template);
        $(this.el).append("</div>");
        $("#groups").html(ghtml);
        $("#jurisdictions").html(jhtml);
        $(this.el).append(this.grid.render().$el);
        $(this.el).append(this.paginator.render().$el);
        },
        events: {
          "click input[id=Delete]": "deleteSelected",
          "click li a[class=GroupLink]": "viewGroup",
          "click li a[class=JurisLink]": "viewJuris"
        },
        deleteSelected: function(event){
            var selectedModels = this.grid.getSelectedModels();
            _.each(selectedModels, function(model){
                model.trigger("backgrid:select",model,false);
                model.destroy();
            });
        },
        viewGroup: function(event){
          var group = event.target.firstChild.data;
          this.collection.fetch({data: {group:group}});
        },
        viewJuris: function(event){
          var juris = event.target.firstChild.data;
          this.collection.fetch({data: {jurisdiction:juris}});
        }
  });
  return ListView;
});