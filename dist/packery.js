/*!
 * angular-packery
 * http://github.com/sungard-labs/angular-packery
 * Version: 1.0.4
 * License: MIT
 */

'use strict';

(function (){

  var moduleDependencies = [
    'packeryTemplates'
  ];

  var moduleConfig = {
    columnWidth: '.packery-sizer',
    itemSelector: '.packery-object',
    rowHeight: '.packery-sizer',
    draggable: true,
    handle: '*',
    timeout: 2000,
    acceptedAttributes: [
      'containerStyle',
      'columnWidth',
      'gutter',
      'isHorizontal',
      'isInitLayout',
      'isOriginLeft',
      'isOriginTop',
      'isResizeBound',
      'itemSelector',
      'rowHeight',
      'transitionDuration'
    ]
  };

  var packeryService = function($rootScope, $q, $interval, $timeout, config) {
    var created = [],
        packeryObj;

    var uniqueId = function(obj, list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === obj) {
          return false;
        }
      }
      return true;
    };

    return {
      Packery: function (hash, el, opts) {
        var deferred = $q.defer();

        el = el || undefined;
        opts = opts || {};

        if (uniqueId(hash, created) && el !== undefined) {
          packeryObj = new Packery(el[0], opts);
          created.push({
            id: hash,
            packery: packeryObj
          });
          el.data('Packery', packeryObj);
          $rootScope.$emit('packeryInstantiated', packeryObj);
          return packeryObj;
        } else {
          var interval = $interval(function(){
            if (packeryObj !== undefined) {
              $interval.cancel(interval);
              deferred.resolve(packeryObj);
            }
          }, config.timeout / 10);

          $timeout(function() {
            $interval.cancel(interval);
            deferred.reject(false);
          }, config.timeout);

          return deferred.promise;
        }
      }
    };
  };

  var packeryController = function ($rootScope, config, service) {

    var self = this;

    self.packeryInstantiated = false;
    self.packeryDraggable = false;
    self.dragHandle = undefined;
    self.uniqueId = new Date().getTime();
    self.packery = {};

    this.bindDragEvents = function(el) {
      var handleSelector, handle, draggabilly;

      handleSelector = self.dragHandle;

      if (handleSelector === '*') {
        draggabilly = new Draggabilly(el[0]);
        handle = el;
      } else {
        draggabilly = new Draggabilly(el[0], {
          handle: handleSelector
        });
        handle = el[0].querySelectorAll(handleSelector);
      }

      // Init Draggabilly events
      self.packery.bindDraggabillyEvents(draggabilly);

      // Bind animate events for touch
      angular.element(handle).on('mouseenter', function(){
        el.addClass('hovered');
      }).
      on('mouseleave', function(){
        el.removeClass('hovered');
      });
    };

    this.createAttrObj = function (scope) {
      var obj = {},
          attrs = config.acceptedAttributes;

      for (var i = 0; i < attrs.length; i++) {
        var attr = scope[attrs[i]];
        if (attr !== undefined) {

          if (attr === 'null') { // check for 'null' values
            obj[attrs[i]] = null;
          } else if (isNaN(attr) === false) { // check for numeric values
            obj[attrs[i]] = +scope[attrs[i]];
          } else { // all other values should be strings
            obj[attrs[i]] = scope[attrs[i]];
          }
        }
      }

      return obj;
    };

    this.packObject = function (el) {
      var promise = service.Packery(self.uniqueId);

      promise.then(function () {
        var packeryEls = self.packery.getItemElements();

        if (packeryEls.indexOf(el[0]) === -1) {
          self.packery.appended(el[0]);
        }

        if (self.packeryDraggable === true) {
          self.bindDragEvents(el);
        }

        el.css('visibility','visible');
        $rootScope.$emit('packeryObjectPacked', el[0]);
      });
    };

    this.setDraggable = function (handle) {
      self.packeryDraggable = true;
      self.dragHandle = handle;
    };
  };

  var packeryDirective = function (config, service) {

    return {
      restrict: 'EAC',
      controller: 'PackeryController',
      transclude: true,
      replace: true,
      templateUrl: 'template/packery/packery.html',
      scope: {
        containerStyle: '=?', // Type: Object, null
        columnWidth: '@?', // Type: Number, Selector String
        gutter: '@?', // Type: Number, Selector String
        isHorizontal: '@?', // Type: Boolean
        isInitLayout: '@?', // Type: Boolean
        isOriginLeft: '@?', // Type: Boolean
        isOriginTop: '@?', // Type: Boolean
        isResizeBound: '@?', // Type: Boolean
        itemSelector: '@?', // Type: Selector String
        rowHeight: '@?', // Type: Number, Selector String
        transitionDuration: '@?', // Type: String

        draggable: '@?', // Type: Boolean
        handle: '@?' // Type: Boolean

        // Let's come back to this one...
        // stamp: '@?',
      },
      link: function (scope, element, attrs, controller) {

        var packeryObj, packeryId, packery;

        // If empty, use defaults from config
        scope.columnWidth = scope.columnWidth || config.columnWidth;
        scope.itemSelector = scope.itemSelector || config.itemSelector;
        scope.rowHeight = scope.rowHeight || config.rowHeight;
        scope.draggable = scope.draggable || config.draggable;
        scope.handle = scope.handle || config.handle;

        // Quick fix so 'false' strings don't evaluate to true
        // @TODO: Check for attribute itself, not value of attribute
        if (scope.draggable === 'false') { scope.draggable = false; }
        if (scope.isHorizontal === 'false') { scope.isHorizontal = false; }
        if (scope.isInitLayout === 'false') { scope.isInitLayout = false; }
        if (scope.isOriginLeft === 'false') { scope.isOriginLeft = false; }
        if (scope.isOriginTop === 'false') { scope.isOriginTop = false; }
        if (scope.isResizeBound === 'false') { scope.isResizeBound = false; }

        // Creates JS Object for passing CSS styles into Packery
        if (scope.containerStyle && (typeof scope.containerStyle === 'object' )) { scope.containerStyle = scope.containerStyle; }

        // Set global draggability
        if (scope.draggable) { controller.setDraggable(scope.handle); }

        // Create object for Packery instantiation
        packeryObj = controller.createAttrObj(scope);
        packeryId = controller.uniqueId;

        // Instantiate Packery and broadcast event
        packery = service.Packery(packeryId, element, packeryObj);
        if (packery instanceof Packery) {
          controller.packeryInstantiated = true;
          controller.packery = packery;
        }

      }
    };
  };

  var packeryObjectTemplateDirective = function () {
    return {
      restrict: 'EA',
      templateUrl: 'template/packery/packery-object.html',
      transclude: true,
      replace: true
    };
  };

  var packeryObjectDirective = function () {
    return {
      require: '^packery',
      restrict: 'C',
      link: function (scope, element, attrs, controller) {
        // Prevents a FOUC on dynamically added objects
        element.css('visibility','hidden');

        // Packs individual objects
        controller.packObject(element);
      }
    };
  };

  var packeryTemplates = function ($templateCache) {
    $templateCache
      .put('template/packery/packery.html', [
        '<div class="packery-wrapper">',
          '<div class="packery-sizer"></div>',
          '<div class="packery-container" ng-transclude></div>',
        '</div>'
      ].join(''));

    $templateCache
      .put('template/packery/packery-object.html',
        '<div class="packery-object" ng-transclude></div>'
      );
  };

  angular
    .module('angular-packery', moduleDependencies)
    .constant('packeryConfig', moduleConfig)
    .service('packeryService', [ '$rootScope', '$q', '$interval', '$timeout', 'packeryConfig', packeryService ])
    .controller('PackeryController', [ '$rootScope', 'packeryConfig', 'packeryService', packeryController ])
    .directive('packery', [ 'packeryConfig', 'packeryService', packeryDirective ])
    .directive('packeryObject', [ packeryObjectTemplateDirective ])
    .directive('packeryObject', [ packeryObjectDirective ]);

  angular
    .module('packeryTemplates', []).run([ '$templateCache', packeryTemplates ]);

})();
