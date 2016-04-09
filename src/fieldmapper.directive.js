// Usage
// <div field-mapper source="sourceColumns" destination="destinationColumns" mapping="mappingIO"></div>

(function () {
    'use strict';

    angular
        .module('fieldmapper')
        .directive('fieldMapper', fieldMapperDirective);

    fieldMapperDirective.$inject = ['FieldMapper'];

    function fieldMapperDirective(FieldMapper) {

        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                source: '=',
                destination: '=',
                mapping: '='
            }
        };

        return directive;

        function link(scope, element) {

            var svgElement = element.html("<svg>").children()[0],
                fieldMapper = new FieldMapper(svgElement);
			
			element.addClass('fieldmapper');
            scope.$watch('source', draw, true);
            scope.$watch('destination', draw, true);
            scope.$watch('mapping', draw, true);

            function draw() {
                
                fieldMapper
                    .setWidth(element[0].offsetWidth)
                    .setMappingRef(scope.mapping)
                    .draw(scope.source, scope.destination);
            }
        }
    }
})();
