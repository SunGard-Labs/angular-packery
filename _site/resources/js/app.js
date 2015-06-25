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
        id: 'draggable',
        dropdown: [ 'true', 'false' ],
        selected: 'true',
        compile: [
          '<packery draggable="{!{item.selected}!}">',
            '<random-objects></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery draggable=\'REPLACE\'>\n',
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
      },
      {
        id: 'isOriginLeft',
        dropdown: [ 'true', 'false' ],
        selected: 'true',
        compile: [
          '<packery is-origin-left="{!{item.selected}!}">',
            '<random-objects></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery is-origin-left=\'REPLACE\'>\n',
            '  <!-- packery-object elements -->\n',
            '</packery>'
          ].join('')
        }
      },
      {
        id: 'isOriginTop',
        dropdown: [ 'true', 'false' ],
        selected: 'true',
        compile: [
          '<packery is-origin-top="{!{item.selected}!}">',
            '<random-objects></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery is-origin-top=\'REPLACE\'>\n',
            '  <!-- packery-object elements -->\n',
            '</packery>'
          ].join('')
        }
      },
      {
        id: 'isResizeBound',
        dropdown: [ 'true', 'false' ],
        selected: 'true',
        compile: [
          '<packery is-resize-bound="{!{item.selected}!}">',
            '<random-objects></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery is-resize-bound=\'REPLACE\'>\n',
            '  <!-- packery-object elements -->\n',
            '</packery>'
          ].join('')
        }
      },
      {
        id: 'rowHeight',
        dropdown: [ '30', '60', '90', '120' ],
        selected: '30',
        compile: [
          '<packery row-height="{!{item.selected}!}">',
            '<random-objects></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery row-height=\'REPLACE\'>\n',
              '  <!-- packery-object elements -->\n',
            '</packery>'
          ].join('')
        }
      },
      {
        id: 'transitionDuration',
        dropdown: [ '0.4s', '1s', '2s' ],
        selected: '0.4s',
        compile: [
          '<packery transition-duration="{!{item.selected}!}">',
            '<random-objects></random-objects>',
          '</packery>'
        ].join(''),
        render: {
          html: [
            '<packery transition-duration=\'REPLACE\'>\n',
              '  <!-- packery-object elements -->\n',
            '</packery>'
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
