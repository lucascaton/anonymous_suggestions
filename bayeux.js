'use strict';

var faye   = require('faye');

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

module.exports = bayeux;