require.config({
  paths: {
    'jquery': 'libs/jquery/jquery-1.10.1.min',
    'underscore': 'libs/underscore/underscore',
    'backbone': 'libs/backbone/backbone-amd',
    'pageable': 'libs/backbone/backbone-pageable',
    'bootstrap': 'libs/bootstrap/bootstrap',
    'backgrid':'libs/backgrid/backgrid',
    'select-all':'libs/backgrid/lib/extensions/select-all/backgrid-select-all',
    'filter':'libs/backgrid/lib/extensions/filter/backgrid-filter',
    'text-cell':'libs/backgrid/lib/extensions/text-cell/backgrid-text-cell',
    'paginator':'libs/backgrid/lib/extensions/paginator/backgrid-paginator',
    'select2Cell':'libs/backgrid/lib/extensions/select2-cell/backgrid-select2-cell'
  },
  shim: {
    'backbone': {
        deps: ['underscore','jquery'],
        exports: 'Backbone'
    },
    'underscore':{
        exports:'_'
    },
    'backgrid':{
        deps: ['backbone'],
        exports:'Backgrid'
    },
    'select-all':{
        deps:['backgrid'],
        exports: 'SelectAll'
    },
    'filter':{
        deps:['backgrid','lunr'],
        exports: 'ServerSideFilter'
    },
    'text-cell':{
        deps:['backgrid','bootstrap'],
        exports: 'TextCell'
    },
    'paginator':{
        deps:['backgrid','pageable'],
        exports: 'Paginator'
    },
    'select2Cell':{
        deps:['backgrid'],
        exports: 'select2Cell'
    }
  }
});

require(['app'],function(App){
    App.initialize();
});