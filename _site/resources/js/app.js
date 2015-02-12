/*!
 * angular-packery
 * http://github.com/sungard-labs/angular-packery
 * Version: 1.0.2
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
        handle = el.querySelectorAll(handleSelector);
      }

      // Init Draggabilly events
      self.packery.bindDraggabillyEvents(draggabilly);

      // Bind animate events for touch
      handle.on('mouseenter', function(){
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
    
    var createObject = function (str) {
      try {
        var obj = JSON.parse(JSON.stringify(eval('('+str+')')));
        if (obj && typeof obj === "object") {
          return obj;
        }
      }
      catch (e) {}
      return false;
    };

    return {
      restrict: 'EAC',
      controller: 'PackeryController',
      transclude: true,
      replace: true,
      templateUrl: 'template/packery/packery.html',
      scope: {
        containerStyle: '@?', // Type: Object, null
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
        if (scope.containerStyle) { scope.containerStyle = createObject(scope.containerStyle) };

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


/*!
 * angular-packery-demos
 * http://github.com/sungard-labs/angular-packery
 * Version: 1.0.0
 * License: MIT
 */

'use strict';

(function (){

  var moduleDependencies = [
    'angular-packery'
  ];

  var moduleConfiguration = function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{!{').endSymbol('}!}');
  };

  var demosController = function ($rootScope, $scope, $sce, $timeout) {

    $scope.initDemo = function () {
      var container = $('#isInitLayout .packery-wrapper'),
          packeryObj = container.data('Packery');

      if (container.attr('is-init-layout') === "true") { return; } else { container.show(); }

      /* Adding 1 second delay to show unpacked items */
      $timeout( function () { packeryObj.layout() }, 1000 );
    };

    $scope.parameters = [
      {
        id: 'containerStyle',
        dropdown: [ '{ position: "relative" }', '{ position: "relative", border: "5px solid #fff" }', '{ display: "none" }', '{ position: "relative", background: "#fff" }', 'null' ],
        selected: '{ position: "relative" }',
        compile: [
          '<packery container-style="{!{item.selected}!}">', 
            '<random-objects></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery container-style=\'REPLACE\'>\n',
            '  <!-- packery-object elements -->\n',
            '</packery>'
          ].join('')
        }
      },
      {
        id: 'columnWidth',
        dropdown: [ '30', '40', '50', '75' ],
        selected: '40',
        compile: [
          '<packery column-width="{!{item.selected}!}">',
            '<random-objects no-width num-objects="40"></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery column-width=\'REPLACE\'>\n',
            '  <!-- packery-object elements -->\n',
            '</packery>'
          ].join('')
        }
      },
      {
        id: 'gutter',
        dropdown: [ '0', '5', '10', '25' ],
        selected: '5',
        compile: [
          '<packery gutter="{!{item.selected}!}">',
            '<random-objects no-width></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery gutter=\'REPLACE\'>\n',
              '  <!-- packery-object elements -->\n',
            '</packery>'
          ].join(''),
          css: [
            '/*\n',
            '  Adding height to account for 5px gutter\n',
            '  (baseline * n) + (gutter * (n - 1)), n = multiple of baseline\n',
            '*/\n',
            '.packery-object.h-double { height: 65px; }\n',
            '.packery-object.h-triple { height: 100px; }\n',
            '/*\n',
            '  Using other gutter sizes with this CSS will look... funny...\n',
            '*/'
          ].join('')
        }
      },
      {
        id: 'isHorizontal',
        dropdown: [ 'true', 'false' ],
        selected: 'true',
        compile: [
          '<packery is-horizontal="{!{item.selected}!}">',
            '<random-objects></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery is-horizontal=\'REPLACE\'>\n',
            '  <!-- packery-object elements -->\n',
            '</packery>'
          ].join(''),
          css: [
            '.packery-container {\n',
            '  height: 210px;\n',
            '}'
          ].join('')
        }
      },
      {
        id: 'isInitLayout',
        dropdown: [ 'false', 'true' ],
        selected: 'false',
        compile: [
          '<a ng-click="initDemo()">Click to init layout</a>',
          '<packery is-init-layout="{!{item.selected}!}">',
            '<random-objects></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<a ng-click=\'initDemo()\'>Click me!</a>\n',
            '<packery is-init-layout=\'REPLACE\'>\n',
            '  <!-- packery-object elements -->\n',
            '</packery>'
          ].join(''),
          js: [
            '$scope.initDemo = function () {\n',
            '  var container = $(\'#isInitLayout .packery-wrapper\'),\n',
            '      packeryObj = container.data(\'Packery\');\n',
            '\n',
            '  container.show();\n',
            '\n',
            '  /* Adding 1 second delay to show laying out of items */\n',
            '  $timeout( function () { packeryObj.layout() }, 1000 );\n',
            '};'
          ].join(''),
          css: [
            '.packery-wrapper[is-init-layout="false"] {\n',
            '  display: none;\n',
            '}'
          ].join('')
        }
      }
    ];

  };

  var compileDirective = function ($compile) {
    return function (scope, element, attrs) {
      scope.$watch(
        function (scope) {
          return scope.$eval(attrs.compile);
        },
        function (value) {
          element.html(value);
          $compile(element.contents())(scope);
        }
      );
    };
  };

  var randomObjectsDirective = function () {
    return {
      restrict: 'E',
      template: function (tElem, tAttrs) {

        var numObjects = tAttrs.numObjects || 30,
            sizes = [ 'single', 'double', 'triple' ],
            colors = [ 'a', 'b', 'c', 'd' ],
            html = "";

        var randomize = function (array) {
          return array[ Math.floor( Math.random() * array.length ) ];
        } 

        for (var i = 0; i < numObjects; i++) {
          html += "<packery-object class='";
          tAttrs.extraClasses === undefined ? html += "" : html += tAttrs.extraClasses; // added classes
          tAttrs.noHeight === undefined ? html += " h-" + randomize(sizes) : angular.noop(); // height
          tAttrs.noWidth === undefined ? html += " w-" + randomize(sizes) : angular.noop(); // width
          html += " color-" + randomize(colors); // color
          html += "'></packery-object>";
        }

        return html;
      }
    };
  };

  var compileDirective = function ($compile) {
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          return scope.$eval(attrs.compile);
        },
        function(value) {
          element.html(value);
          $compile(element.contents())(scope);
        }
      );
    };
  };

  var renderDirective = function ($interpolate, $timeout) {
    return {
      restrict: 'A',
      scope: {
        lang: '@'
      },
      template: '<div class="highlight" style="display:none;"><pre><code class="{!{ lang }!}" ng-transclude></code></pre></div>',
      transclude: true,
      replace: true,
      link: function (scope, element) {
        $timeout(function () {
          var interpolated = $interpolate('{!{$parent.item.selected}!}')(scope),
              wrapper = element.find('span'),
              oldText = wrapper.text(),
              newText = oldText.replace(/REPLACE/i, interpolated);

          wrapper.text(newText);
          hljs.highlightBlock(element.find('pre code')[0]);
          element.show();
        });
      }
    };
  };

  var updateCodeDirective = function ($compile) {
    return function (scope, element) {
      element.bind('change', function () {
        var htmlRender = $compile('<div render lang="html">{!{item.render.html}!}</div>')(scope),
            cssRender = $compile('<div render lang="css">{!{item.render.css}!}</div>')(scope),
            htmlCompile = $compile('<div compile="item.compile"></div>')(scope);

        $(element).parents('.demo').find('div[lang="html"]').replaceWith(htmlRender);
        $(element).parents('.demo').find('div[lang="css"]').replaceWith(cssRender);
        $(element).parents('.demo').find('div[compile]').replaceWith(htmlCompile);
      });
    };
  };

  angular
    .module( 'demos', moduleDependencies )
    .config( [ '$interpolateProvider', moduleConfiguration ] )
    .controller( 'DemosController', [ '$rootScope', '$scope', '$sce', '$timeout', demosController ] )
    .directive ( 'compile', [ '$compile', compileDirective ] )
    .directive( 'randomObjects', [ randomObjectsDirective ] )
    .directive( 'render', [ '$interpolate', '$timeout', renderDirective ] )
    .directive( 'updateCode', [ '$compile', updateCodeDirective ] );

})();