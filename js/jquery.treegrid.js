/*
 * jQuery treegrid Plugin 0.1
 * https://github.com/maxazan/jquery-treegrid
 * 
 * Copyright 2013, Pomazan Max
 * Licensed under the MIT licenses.
 */
(function($) {

  var methods = {
    /**
     * Initialize tree
     * 
     * @param {Object} options
     * @returns {Object[]}
     */
    initTree: function(options) {
      var settings = $.extend(this.treegrid.defaults, options);
      return this.each(function() {
        $(this).data('treegrid', $(this));
        $(this).data('settings', settings);
        settings.getRootNodes.apply(this, [$(this)]).treegrid('initNode', settings);
      });
    },
    /**
     * Initialize node
     * 
     * @param {Object} settings
     * @returns {Object[]}
     */
    initNode: function(settings) {
      return this.each(function() {
        $(this).data('treegrid', settings.getTreeGridContainer.apply(this));
        $(this).treegrid('getChildNodes').treegrid('initNode', settings);
        $(this).treegrid('initExpander').treegrid('initIndent').treegrid('initState');
      });
    },
    /**
     * Initialize expander for node
     * 
     * @returns {Node}
     */
    initExpander: function() {
      var $this = $(this);
      var options = $this.data('treegrid').data('settings');
      var cell = $this.find('td').get(0);
      $(cell).find('.treegrid-expander').remove();
      $(options.expanderTemplate).prependTo(cell).click(function() {
        $($(this).parents('tr')).treegrid('toggle');
      });
      return $this;
    },
    /**
     * Initialize indent for node
     * 
     * @returns {Node}
     */
    initIndent: function() {
      var $this = $(this);
      var options = $this.data('treegrid').data('settings');
      $this.find('.treegrid-indent').remove();
      for (var i = 0; i < $(this).treegrid('getDepth'); i++) {
        $(options.indentTemplate).insertBefore($this.find('.treegrid-expander'));
      }
      return $this;
    },
    /**
     * Initialise state of node
     * 
     * @returns {Node}
     */
    initState: function() {
      $this = $(this);
      if ($this.data('treegrid').data('settings').initialState === "expanded") {
        $this.treegrid('expand');
      } else {
        $this.treegrid('collapse');
      }
      return $this;
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
    /*
     * Method return true if node is root
     * 
     * @returns {Boolean}
     */
    isRoot: function() {
      return $(this).treegrid('getDepth') === 0;
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
    /**
     * Return true if node expanded
     * 
     * @returns {Boolean}
     */
    isExpanded: function() {
      return $(this).hasClass('treegrid-expanded');
    },
    /**
     * Return true if node collapsed
     * 
     * @returns {Boolean}
     */
    isCollapsed: function() {
      return $(this).hasClass('treegrid-collapsed');
    },
    /**
     * Return true if at least one of parent node is collapsed
     * 
     * @returns {Boolean}
     */
    isOneOfParentCollapsed: function() {
      var $this = $(this);
      if ($this.treegrid('isRoot')) {
        return false;
      } else {
        if ($this.treegrid('getParentNode').treegrid('isCollapsed')) {
          return true;
        } else {
          return $this.treegrid('getParentNode').treegrid('isOneOfParentCollapsed');
        }
      }
    },
    /**
     * Expand node
     * 
     * @returns {Node}
     */
    expand: function() {
      return $(this).each(function() {
        var $this = $(this);
        if (!$this.treegrid('isLeaf')) {
          $this.removeClass('treegrid-collapsed');
          $this.addClass('treegrid-expanded');
          $this.treegrid('render');
        }
      });
    },
    /**
     * Expand all nodes
     * 
     * @returns {Node}
     */
    expandAll: function() {
      $this = $(this);
      $this.data('treegrid').treegrid('getRootNodes').treegrid('expandRecursive');
      return $this;
    },
    /**
     * Expand current node and all child nodes begin from current
     * 
     * @returns {Node}
     */
    expandRecursive: function() {
      return $(this).each(function() {
        var $this = $(this);
        $this.treegrid('expand');
        if (!$this.treegrid('isLeaf')) {
          $this.treegrid('getChildNodes').treegrid('expandRecursive');
        }
      });
    },
    /**
     * Collapse node
     * 
     * @returns {Node}
     */
    collapse: function() {
      return $(this).each(function() {
        var $this = $(this);
        if (!$this.treegrid('isLeaf')) {
          $this.removeClass('treegrid-expanded');
          $this.addClass('treegrid-collapsed');
          $this.treegrid('render');
        }
      });
    },
    /**
     * Collapse all nodes
     * 
     * @returns {Node}
     */
    collapseAll: function() {
      $this = $(this);
      $this.data('treegrid').treegrid('getRootNodes').treegrid('collapseRecursive');
      return $this;
    },
    /**
     * Collapse current node and all child nodes begin from current
     * 
     * @returns {Node}
     */
    collapseRecursive: function() {
      return $(this).each(function() {
        var $this = $(this);
        $this.treegrid('collapse');
        if (!$this.treegrid('isLeaf')) {
          $this.treegrid('getChildNodes').treegrid('collapseRecursive');
        }
      });
    },
    /**
     * Expand if collapsed, Collapse if expanded
     * 
     * @returns {Node}
     */
    toggle: function() {
      var $this = $(this);
      if ($this.treegrid('isExpanded')) {
        $this.treegrid('collapse');
      } else {
        $this.treegrid('expand');
      }
      return $this;
    },
    /**
     * Rendering node
     * 
     * @returns {Node}
     */
    render: function() {
      $(this).each(function() {
        var $this = $(this);
        if ($this.treegrid('isOneOfParentCollapsed')) {
          $this.hide();
        } else {
          $this.show();
        }
        if (!$this.treegrid('isLeaf')) {
          $this.treegrid('getChildNodes').treegrid('render');
        }
      });
      return $this;
    }
  };
  $.fn.treegrid = function(method) {
    if (methods[method]) {
      return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.initTree.apply(this, arguments);
    } else {
      $.error('Method with name ' + method + ' does not exists for jQuery.treegrid');
    }
  };
// plugin's default options
  $.fn.treegrid.defaults = {
    initialState: 'expanded',
    expanderTemplate: '<span class="treegrid-expander"></span>',
    indentTemplate: '<span class="treegrid-indent"></span>',
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
})(jQuery);