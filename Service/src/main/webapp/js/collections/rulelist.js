define([
  'underscore',
  'backbone',
  'pageable',
  'models/rules'
  ],function(_,Backbone,pageable, RuleModel){
    Backbone.PageableCollection = pageable;
    var RuleList = Backbone.PageableCollection.extend({
    url: "/rest/rule/",
    model: RuleModel,
    state: {
        firstPage: 0,
        currentPage: 0,
        pageSize: 15,
        totalRecords: 173,
    },
    initialize: function(){
        this._groups = [];
        this._juris = [];
    },
    parse: function(response){
      this.state.totalRecords = parseInt(response.data.state.total_entries);
      this.state.totalPages = parseInt(response.data.state.total_pages);
      this.state.lastPage = this.state.totalPages-1;
      this._groups = response.data.groups;
      this._juris = response.data.jurisdictions;
      if(this.state.currentPage > this.state.lastPage){
        this.state.currentPage = 0;
      }
      return response.data.list;
    }
  });
  return RuleList;
});
