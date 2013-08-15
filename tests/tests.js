test( "isLast() test", function() {
  ok($('#last-test-1').treegrid('isLast')===true,"Last test!");
  ok($('#last-test-2').treegrid('isLast')===false,"Not Last test!");

});