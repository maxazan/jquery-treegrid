test("getRootNodes()", function() {
  var rootNodes = $('#tree-1').treegrid('getRootNodes');
  ok(rootNodes.length === 2, "Length need to be 2");
  equal($(rootNodes.get(0)).attr('id'), 'node-1', 'Test node 1');
  equal($(rootNodes.get(1)).attr('id'), 'node-2', 'Test node 2');
  var rootNodes2 = $('#node-1-1-2-1').treegrid('getRootNodes');
  equal(rootNodes.length, rootNodes2.length, "Length need to be equal");
});

test("getNodeId()", function() {
  equal($('#node-1-1-2-1').treegrid('getNodeId'), 10, "Return 10");
  equal($('#node-1-1-2').treegrid('getNodeId'), 9, "Return 9");
});

test("getParentNodeId()", function() {
  equal($('#node-1-1-2-1').treegrid('getParentNodeId'), 9, "Return 9");
  equal($('#node-1-1-2').treegrid('getParentNodeId'), 2, "Return 2");
  equal($('#node-1-1-2').treegrid('getParentNodeId'), $('#node-1-1').treegrid('getNodeId'), "Equal id");
});

test("getParentNode()", function() {
  equal($('#node-1-1-2-1').treegrid('getParentNode').treegrid('getNodeId'), 9, "Return 9");
  equal($('#node-1').treegrid('getParentNode'), null, "Return null");
});

test("getChildNodes()", function() {
  equal($('#node-1').treegrid('getChildNodes').length, 4, "Return 4");
  equal($('#node-1-1-2-1').treegrid('getChildNodes').length, [], "Return []");
});
test("getDepth()", function() {
  equal($('#node-1').treegrid('getDepth'), 0, "Return 0");
  equal($('#node-1-1-2-1').treegrid('getDepth'), 3, "Return 3");
});

test("isLeaf()", function() {
  ok($('#node-1-1-2-1').treegrid('isLeaf') === true, "true");
  ok($('#node-1').treegrid('isLeaf') === false, "false");
});

test("isLast()", function() {
  ok($('#node-1-1-2-1').treegrid('isLast') === true, "Last test!");
  ok($('#node-1-2').treegrid('isLast') === false, "Not Last test!");
});
test("isRoot()", function() {
  ok($('#node-1').treegrid('isRoot') === true, "Root test!");
  ok($('#node-1-2').treegrid('isRoot') === false, "Not Root test!");
  ok($('#node-2').treegrid('isRoot') === true, "Other root test!");
});

test("expand(), collapse(), isExpanded(), isCollapsed()", function() {
  $('#node-1').treegrid('expand');
  ok($('#node-1').treegrid('isExpanded') === true, "Expanded");
  ok($('#node-1').hasClass('treegrid-expanded'), "Expanded class");
  $('#node-1').treegrid('collapse');
  ok($('#node-1').treegrid('isCollapsed') === true, "Collapsed");
  ok($('#node-1').hasClass('treegrid-collapsed'), "Collapsed class");
  $('#node-1').find('.treegrid-expander').click();
  ok($('#node-1').treegrid('isExpanded') === true, "Expanded after click simulate");
  $('#node-1').treegrid('collapse');
  ok($('#node-1-1').is(':visible') === false, "hidden child node 1-1");
  ok($('#node-1-1-2').is(':visible') === false, "hidden child node 1-1-2");
  ok($('#node-1-1-2-1').is(':visible') === false, "hidden child node 1-1-2-1");

});


test("expandAll()", function() {
  $('#tree-1').treegrid('expandAll');
  ok($('#node-1').treegrid('isExpanded') === true, "Expanded");
  ok($('#node-1-1').treegrid('isExpanded') === true, "Expanded 1-1");
  ok($('#node-1-1-2').treegrid('isExpanded') === true, "Expanded 1-1-2");
});


test("collapseAll()", function() {
  $('#tree-1').treegrid('collapseAll');
  ok($('#node-1').treegrid('isExpanded') === false, "Collapsed");
  ok($('#node-1-1').treegrid('isExpanded') === false, "Collapsed 1-1");
  ok($('#node-1-1-2').treegrid('isExpanded') === false, "Collapsed 1-1-2");
  $('#node-1-1-2').treegrid('expandAll');
  ok($('#node-1-1').treegrid('isExpanded') === true, "Expanded 1-1");
});

test("Save state (cookie method)", function() {

  ok($.cookie(saveStateName)!==undefined, "Cookie set");
  $.cookie(saveStateName,'1,5');
  $('#tnode-1').treegrid('restoreState');
  $('#tnode-1-3').treegrid('restoreState');
  ok($('#tnode-1').treegrid('isExpanded'), "tnode-1 expanded");
  ok($('#tnode-1-3').treegrid('isExpanded'), "tnode-1-3 expanded");
  $.cookie(saveStateName,'2');
  $('#tnode-1').treegrid('restoreState');
  $('#tnode-1-3').treegrid('restoreState');
  $('#tnode-1-1').treegrid('restoreState');
  ok($('#tnode-1').treegrid('isCollapsed'), "tnode-1 collapsed");
  ok($('#tnode-1-3').treegrid('isCollapsed'), "tnode-1-3 collpased");
  ok($('#tnode-1-1').treegrid('isExpanded'), "tnode-1-1 expanded");
  
});
