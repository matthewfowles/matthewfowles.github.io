module('JSHint - .');
test('app.js should pass jshint', function() { 
  ok(false, 'app.js should pass jshint.\napp.js: line 9, col 72, Missing semicolon.\napp.js: line 34, col 23, \'scrollTargetY\' is already defined.\napp.js: line 35, col 15, \'speed\' is already defined.\napp.js: line 36, col 16, \'easing\' is already defined.\napp.js: line 40, col 27, A leading decimal point can be confused with a dot: \'.1\'.\napp.js: line 40, col 83, A leading decimal point can be confused with a dot: \'.8\'.\napp.js: line 77, col 2, Missing semicolon.\n\n7 errors'); 
});
