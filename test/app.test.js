
// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../app')
  , assert = require('assert');


module.exports = {
  'GET /': function(){
    assert.response(app,
      { url: '/' },
      { status: 302, headers: { 'Content-Type': 'text/html' }},
      function(res){
        assert.includes(res.body, 'Moved Temporarily');
      });
  }
};
