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

test("expand(), collapse(), isExpanded(), isCollapsed()", function() {
  $('#node-1').treegrid('expand');
  ok($('#node-1').treegrid('isExpanded') === true, "Expanded");
  ok($('#node-1').hasClass('treegrid-expanded'), "Expanded class");
  $('#node-1').treegrid('collapse');
  ok($('#node-1').treegrid('isCollapsed') === true, "Collapsed");
  ok($('#node-1').hasClass('treegrid-collapsed'), "Collapsed class");
  $('#node-1').find('.treegrid-expander').click();
  ok($('#node-1').treegrid('isExpanded') === true, "Expanded after click simulate");
});