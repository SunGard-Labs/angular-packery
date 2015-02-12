---
---

{% include bower/angular-packery/dist/packery.min.js %}

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

  var demosController = function ($scope, $sce) {

    $scope.parameters = [
      {
        id: 'columnWidth',
        dropdown: [ '30', '40', '50', '75' ],
        selected: '40',
        code: {
          compile: '<packery column-width="{!{item.selected}!}" class="demo-wrapper"><random-objects no-width num-objects="40"></random-objects></packery>',
          render: '<packery column-width="REPLACE">\n  <!-- packery-object elements -->\n</packery>'
        }
      },
      {
        id: 'gutter',
        dropdown: [ '0', '5', '10', '25' ],
        selected: '5',
        code: {
          compile: '<packery gutter="{!{item.selected}!}" class="demo-wrapper"><random-objects no-width></random-objects></packery>',
          render: '<packery gutter="REPLACE">\n  <!-- packery-object elements -->\n</packery>'
        }
      },
      {
        id: 'isHorizontal',
        dropdown: [ 'true', 'false' ],
        selected: 'true',
        code: {
          compile: '<packery is-horizontal="{!{item.selected}!}" class="demo-wrapper"><random-objects></random-objects></packery>',
          render: '<packery is-horizontal="REPLACE">\n  <!-- packery-object elements -->\n</packery>'
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
      template: '<div class="highlight" style="display:none;"><pre><code class="html" ng-transclude></code></pre></div>',
      transclude: true,
      replace: true,
      link: function (scope, element) {
        $timeout(function () {
          var interpolated = $interpolate('{!{item.selected}!}')(scope),
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
        var htmlRender = $compile('<div render>{!{item.code.render}!}</div>')(scope),
            htmlCompile = $compile('<div compile="item.code.compile"></div>')(scope);

        $(element).parents('.demo').find('div[render]').replaceWith(htmlRender);
        $(element).parents('.demo').find('div[compile]').replaceWith(htmlCompile);
      });
    };
  };

  angular
    .module( 'demos', moduleDependencies )
    .config( [ '$interpolateProvider', moduleConfiguration ] )
    .controller( 'DemosController', [ '$scope', '$sce', demosController ] )
    .directive ( 'compile', [ '$compile', compileDirective ] )
    .directive( 'randomObjects', [ randomObjectsDirective ] )
    .directive( 'render', [ '$interpolate', '$timeout', renderDirective ] )
    .directive( 'updateCode', [ '$compile', updateCodeDirective ] );

})();