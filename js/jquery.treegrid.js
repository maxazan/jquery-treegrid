//Treegrid
(function($) {

  //defaults for using tree in table with class
  var defaults = {
    getNodeId: function() {
      var template = /treegrid-([0-9]+)/;
      if (template.test($(this).attr('class'))) {
        return template.exec($(this).attr('class'))[1];
      }
      return null;
    },
    getParentNodeId: function() {
      var template = /treegrid-parent-([0-9]+)/;
      if (template.test($(this).attr('class'))) {
        return template.exec($(this).attr('class'))[1];
      }
      return null;
    },
    getNodeById: function(id, treegridContainer) {
      var templateClass = "treegrid-" + id;
      return treegridContainer.find('tr.' + templateClass);
    },
    getChildNodes: function(id, treegridContainer) {
      var templateClass = "treegrid-parent-" + id;
      return treegridContainer.find('tr.' + templateClass);
    },
    getTreeGridContainer: function() {
      return $(this).parents('table');
    },
    getRootNodes: function(treegridContainer) {
      var result = $.grep(treegridContainer.find('tr'), function(element) {
        var classNames = $(element).attr('class');
        var templateClass = /treegrid-([0-9]+)/;
        var templateParentClass = /treegrid-parent-([0-9]+)/;
        return templateClass.test(classNames) && !templateParentClass.test(classNames);
      });
      return $(result);
    }
  };

  var methods = {
    initTree: function(options) {
      var settings = $.extend(defaults, options);
      return this.each(function() {
        $(this).data('treegrid', $(this));
        $(this).data('settings', settings);
        settings.getRootNodes.apply(this, [$(this)]).treegrid('initNode', settings);
      });
    },
    initNode: function(settings) {
      return this.each(function() {
        $(this).data('treegrid', settings.getTreeGridContainer.apply(this));
        $(this).treegrid('getChildNodes').treegrid('initNode', settings);
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
      for (var i = 0; i < $(this).treegrid('getDepth'); i++) {
        $('<span class="treegrid-indent"></span>').insertBefore($(this).find('.treegrid-expander'));
      }
    },
    /**
     * Method return all root nodes of tree. 
     * 
     * Start init all child nodes from it.
     * 
     * @returns {Array}
     */
    getRootNodes: function() {
      return $(this).data('treegrid').data('settings').getRootNodes.apply(this, [$(this).data('treegrid')]);
    },
    /**
     * Mthod return id of node
     * 
     * @returns {String}
     */
    getNodeId: function() {
      return $(this).data('treegrid').data('settings').getNodeId.apply(this);
    },
    /**
     * Method return parent id of node or null if root node
     * 
     * @returns {String}
     */
    getParentNodeId: function() {
      return $(this).data('treegrid').data('settings').getParentNodeId.apply(this);
    },
    /**
     * Method return parent node or null if root node
     * 
     * @returns {Object[]}
     */
    getParentNode: function() {
      if ($(this).treegrid('getParentNodeId') === null) {
        return null;
      } else {
        return $(this).data('treegrid').data('settings').getNodeById.apply(this, [$(this).treegrid('getParentNodeId'), $(this).data('treegrid')]);
      }
    },
    /**
     * Method return array of child nodes or null if node is leaf
     * 
     * @returns {Object[]}
     */
    getChildNodes: function() {
      return $(this).data('treegrid').data('settings').getChildNodes.apply(this, [$(this).treegrid('getNodeId'), $(this).data('treegrid')]);
    },
    /**
     * Method return depth of tree.
     * 
     * This method is needs for calculate indent
     * 
     * @returns {Number}
     */
    getDepth: function() {
      if ($(this).treegrid('getParentNode') === null) {
        return 0;
      }
      return $(this).treegrid('getParentNode').treegrid('getDepth') + 1;
    },
    /**
     * Method return true if node has no child nodes
     * 
     * @returns {Boolean}
     */
    isLeaf: function() {
      return $(this).treegrid('getChildNodes').length === 0;
    },
    /**
     * Method return true if node last in branch
     * 
     * @returns {Boolean}
     */
    isLast: function() {
      var current_parent_id = $(this).treegrid('getParentNodeId');
      if ($(this).next()) {
        if ($(this).next().treegrid('getParentNodeId') === current_parent_id) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    isExpanded: function() {
      return $(this).hasClass('treegrid-expanded');
    },
    isCollapsed: function() {
      return $(this).hasClass('treegrid-collapsed');
    },
    isOneOfParentCollapsed: function() {
      if ($(this).treegrid('getParentNode') === null || $(this).treegrid('getParentNode') === 0) {
        return false;
      } else {
        if ($(this).treegrid('getParentNode').treegrid('isCollapsed')) {
          return true;
        } else {
          return $(this).treegrid('getParentNode').treegrid('isOneOfParentCollapsed');
        }
      }
    }, toggle: function() {
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
          $(this).treegrid('getChildNodes').treegrid('render');
        }
      });
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