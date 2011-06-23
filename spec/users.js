var vows = require('vows'),
    assert = require('assert');

vows.describe('User Authentication').addBatch({
  'when signing up': {
    topic: function () { return 42 / 0 },

    'we get Infinity': function (topic) {
      assert.equal (topic, Infinity);
    }
  },
  'when logging in': {
    topic: function () { return 0 / 0 },

    'we get a value which': {
      'is not a number': function (topic) {
        assert.isNaN (topic);
      },
      'is not equal to itself': function (topic) {
        assert.notEqual (topic, topic);
      }
    }
  }
}).export(module);
