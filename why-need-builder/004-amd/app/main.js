// define(function (require) {
//   const printModule = require('./print');

//   printModule.print('message');
// });

define([
  './print',
], function(printModule) {
  'use strict';
  printModule.print('message');
});