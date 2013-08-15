//Treegrid
(function($) {

  var methods = {
    initTree: function(options) {
      return this.each(function() {

        var settings = $.extend({
          treegridContainer: $(this)
        }, options);
        $(this).data('treegridOptions', settings);
        $(this).find('tr.root').each(function() {
          $(this).treegrid('initNode', settings);
        });
      });
    },
    initNode: function(options) {
      var settings = $.extend({
        getTreegridId: function(element) {
          var template = /treegrid-([0-9]+)/;
          if (template.test($(this).attr('class'))) {
            return template.exec($(this).attr('class'))[1];
          }
          return null;
        }, getTreegridParentId: function(element) {
          var template = /treegrid-parent-([0-9]+)/;
          if (template.test($(this).attr('class'))) {
            return template.exec($(this).attr('class'))[1];
          }
          return null;
        }, getParent: function(id) {
          var templateClass = "treegrid-" + id;
          return options.treegridContainer.find('tr.' + templateClass);
        }, getChild: function(id) {
          var templateClass = "treegrid-parent-" + id;
          return options.treegridContainer.find('tr.' + templateClass);
        }
      }, options);
      return this.each(function() {
        $(this).data('treegrid', settings.treegridContainer);
        $(this).data('treegrid-id', settings.getTreegridId.apply(this, [this]));
        $(this).data('treegrid-parent-id', settings.getTreegridParentId.apply(this, [this]));
        $(this).data('treegrid-parent', settings.getParent.apply(this, [$(this).data('treegrid-parent-id')]));
        $(this).data('treegrid-child', settings.getChild.apply(this, [$(this).data('treegrid-id')]));
        $(this).data('treegrid-child').treegrid('initNode', settings);
        $(this).treegrid('initExpander', settings);
        $(this).treegrid('initIndent', settings);
        $(this).treegrid('initState', settings);
        $(this).treegrid('render');
      });
    },
    initState: function(options) {
      $(this).treegrid('expand');
    },
    initExpander: function(options) {
      var cell = $(this).find('td').get(0);
      $(cell).find('.treegrid-expander').remove();
      $('<span class="treegrid-expander"></span>').prependTo(cell).click(function() {
        $($(this).parents('tr')).treegrid('toggle');
      });
    },
    initIndent: function(options) {
      $(this).find('.treegrid-indent').remove();
      for (var i = 0; i < $(this).treegrid('getTreeGridDepth'); i++) {
        $('<span class="treegrid-indent"></span>').insertBefore($(this).find('.treegrid-expander'));
      }
    },
    toggle: function() {
      if ($(this).treegrid('isExpanded')) {
        $(this).treegrid('collapse');
      } else {
        $(this).treegrid('expand');
      }
    },
    expand: function() {
      if (!$(this).treegrid('isLeaf')) {
        $(this).removeClass('treegrid-collapsed');
        $(this).addClass('treegrid-expanded');
        $(this).treegrid('render');
      }
      return $(this);
    },
    collapse: function() {
      if (!$(this).treegrid('isLeaf')) {
        $(this).removeClass('treegrid-expanded');
        $(this).addClass('treegrid-collapsed');
        $(this).treegrid('render');
      }
      return $(this);
    },
    render: function() {
      $(this).each(function() {
        if ($(this).treegrid('isOneOfParentCollapsed')) {
          $(this).hide();
        } else {
          $(this).show();
        }
        if (!$(this).treegrid('isLeaf')) {
          $(this).data('treegrid-child').treegrid('render');
        }
      });
    },
    isOneOfParentCollapsed: function() {
      if ($(this).treegrid('getTreegridParent') === null || $(this).treegrid('getTreegridParent') === 0) {
        return false;
      } else {
        if ($(this).treegrid('getTreegridParent').treegrid('isCollapsed')) {
          return true;
        } else {
          return $(this).treegrid('getTreegridParent').treegrid('isOneOfParentCollapsed');
        }
      }
    },
    isLeaf: function() {
      return $(this).data('treegrid-child').length === 0;
    },
    isLast: function() {
      var current_parent_id=$(this).treegrid('getTreegridParentId');
      if($(this).next()){
        if($(this).next().treegrid('getTreegridParentId')===current_parent_id){
          return false;
        }else{
          return true;
        }
      }else{
        return true;
      }
    },
    getTreegridId: function() {
      return $(this).data('treegrid-id');
    },
    getTreegridParentId: function() {
      return $(this).data('treegrid-parent-id');
    },
    getTreegridChild: function() {
      return $(this).data('treegrid-child');
    },
    getTreegridParent: function() {
      return $(this).data('treegrid-parent');
    },
    getTreeGridDepth: function() {
      if ($(this).treegrid('getTreegridParent').length === 0) {
        return 0;
      }
      return $(this).treegrid('getTreegridParent').treegrid('getTreeGridDepth') + 1;
    },
    isExpanded: function() {
      return $(this).hasClass('treegrid-expanded');
    },
    isCollapsed: function() {
      return $(this).hasClass('treegrid-collapsed');
    }
  };
  $.fn.treegrid = function(method) {
    if (methods[method]) {
      return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.initTree.apply(this, arguments);
    } else {
      $.error('Метод с именем ' + method + ' не существует для jQuery.treegrid');
    }
  };
})(jQuery);