(function () {
    'use strict';

    angular
        .module('fieldmapper')
        .factory('FieldMapper', fieldMapperFactory);

    fieldMapperFactory.$inject = ['d3'];

    function fieldMapperFactory(d3) {

        function FieldMapper(svgElement) {
            this.base = d3.select(svgElement);

            this.itemHeight = 32;

            this.plotTitle = this.base.append('g')
                .attr('class', 'plotTitle')
                .attr('transform', 'translate(0, 0)');

            this.plotSource = this.base.append('g')
                .attr('class', 'plotSource')
                .attr('transform', 'translate(0, 0)');

            this.plotDestination = this.base.append('g')
                .attr('class', 'plotDestination')
                .attr('transform', 'translate(0, 0)');
                
            this.plotConnect = this.base.append('g')
                .attr('class', 'plotConnect')
                .attr('transform', 'translate(0, 0)');

            this.y = d3.scale.ordinal();
        }
        
        FieldMapper.prototype.setWidth = function(width) {
         
            if(width < 350)
                width = 350;
            
            this.rect_width = Math.round(width * 40 / 100);
            this.gap = width - (this.rect_width * 2);
            
            
            this.base.attr('width', width);
            return this;
        }
        
        FieldMapper.prototype.setMappingRef = function(mapping) {
            this.mapping = mapping;
            return this;
        }
 
        FieldMapper.prototype.draw = function(source, destination) {

            var self = this;
            this.source = source;
            this.destination = destination;
            var height = this.itemHeight * (source.length + 1);

            this.base.attr('height', height);
            this.y.domain(d3.range(source.length));
            this.y.rangeBands([this.itemHeight, height]);
            
            this.plotTitle.selectAll('*').remove();

            this.plotTitle
                .append('rect')
                .attr({
                    'class': 'box_title',
                    'x': 0,
                    'y': 0,
                    'height': this.itemHeight,
                    'width': this.rect_width
                });
                
            this.plotTitle
                .append('text')
                .attr({
                    'x': 10,
                    'y': (this.itemHeight / 2),
                    'class': 'box_title'
                })
                .text('Source System');

            this.plotTitle
                .append('rect')
                .attr({
                    'class': 'box_title',
                    'x': this.rect_width + this.gap,
                    'y': 0,
                    'height': this.itemHeight,
                    'width': this.rect_width
                });
            this.plotTitle
                .append('text')
                .attr({
                    'x': this.rect_width + this.gap + 10,
                    'y': (this.itemHeight / 2),
                    'class': 'box_title'
                })
                .text('Destination System');

            var updateSelectionSource = this.plotSource.selectAll('.bar')
                .data(source);

            updateSelectionSource.exit()
                .remove();

            var enterSelectionSource = updateSelectionSource.enter();

            var barsEnterSource = enterSelectionSource
                .append('g')
                .attr('class', 'bar')
                .attr('x', 0);

            barsEnterSource
                .append('rect')
                .attr({
                    'class': 'box',
                    'x': 0,
                    'y': function(d, index) { return self.y(index); },
                    'height': this.y.rangeBand(),
                    'width': this.rect_width,
                    'data-ref': function(d) { return d.columnName; },
                    'id': function(d) { return "s-rect-" + d.columnName; }
                })
                .on('click', function() {
                    self.selection(d3.event.target);
                });
                        
            barsEnterSource
                .append('text')
                .attr({
                    'class': 'field',
                    'x': 10,
                    'y': function(d, index) { return self.y(index) + self.y.rangeBand() / 2; },
                    'style': 'text-anchor: start; dominant-baseline: middle',
                    'id': function(d) { return "s-text-" + d.columnName; }
                })
                .text(function(d) { return d.columnName; })
                .on('click', function() {
                    self.selection(d3.event.target.previousSibling);
                });
                
            barsEnterSource
                .append('circle')
                .attr({
                    'cx': this.rect_width - 10,
                    'cy': function(d, index) { return self.y(index) + self.y.rangeBand() / 2; },
                    'r': 5,
                    'data-ref': function(d) { return d.columnName; },
                    'id': function(d) { return "s-circle-" + d.columnName; } 
                })
                .on('click', function() {
                    self.selection(d3.event.target.previousSibling.previousSibling);
                });
               
            var updateSelectionDestination = this.plotDestination.selectAll('.bar')
                .data(destination);
            
            if (source.length < destination.length) {
                height = this.itemHeight * (destination.length + 1);
                this.base.attr('height', height);
            }
            this.y.domain(d3.range(destination.length));
            this.y.rangeBands([this.itemHeight, height]);

            updateSelectionDestination.exit()
                .remove();

            var enterSelectionDestination = updateSelectionDestination.enter();

            var barsEnterDestination = enterSelectionDestination
                .append('g')
                .attr('class', 'bar')
                .attr('x', this.rect_width + this.gap);

            barsEnterDestination
                .append('rect')
                .attr({
                    'class': 'box',
                    'x': this.rect_width + this.gap,
                    'y': function(d, index) { return self.y(index); },
                    'height': this.y.rangeBand(),
                    'width': this.rect_width,
                    'data-ref': function(d) { return d.columnName; },
                    'id': function(d) { return "d-rect-" + d.columnName; }
                })
                .on('click', function() {
                    self.linkage(d3.event.target);
                });
                        
            barsEnterDestination
                .append('text')
                .attr({
                    'class': 'field',
                    'x': this.rect_width + this.gap + 20,
                    'y': function(d, index) { return self.y(index) + self.y.rangeBand() / 2; },
                    'style': 'text-anchor: start; dominant-baseline: middle',
                    'id': function(d) { return "d-text-" + d.columnName; }
                })
                .text(function(d) { return d.columnName; })
                .on('click', function() {
                    self.linkage(d3.event.target.previousSibling);
                });

            barsEnterDestination
                .append('circle')
                .attr({
                    'cx': this.rect_width + this.gap + 10,
                    'cy': function(d, index) { return self.y(index) + self.y.rangeBand() / 2; },
                    'r': 5,
                    'id': function(d) { return "d-circle-" + d.columnName; }
                })
                .on('click', function() {
                    self.linkage(d3.event.target.previousSibling.previousSibling);
                });

                function wrap() {
                    var self = d3.select(this),
                        text = self.text(),
                        textLength = text.length;
                    if (textLength > 15 && text.length > 0) {
                        text = text.slice(0, 15);
                        self.text(text + '...');
                    }
                }

                this.base.selectAll('text.field').each(wrap);
                
                this.drawMapping();
                
        }
        
        FieldMapper.prototype.drawMapping = function() {

            var self = this,
                validMapping = [];
            
            validMapping = this.mapping.filter(function(item) {
                var foundSource = false,
                    foundDestination = false;
                self.source.forEach(function(sitem) {
                    if (sitem.id == item.source) {
                        foundSource = true;
                    }
                });
                self.destination.forEach(function(ditem) {
                    if (ditem.id == item.destination) {
                        foundDestination = true;
                    }
                });
                if (foundSource && foundDestination) {
                    return true;
                } else {
                    return false;
                }
            });

            validMapping.forEach(function(item){
                self.mapping.push(item);
            });

            var updateMapping = this.plotConnect.selectAll('.connect')
                    .data(this.mapping);
                
            updateMapping.exit().remove();
            var enterMapping = updateMapping.enter();
            
            var connectEntersMapping = enterMapping
                                            .append('g')
                                            .attr({
                                                'class': 'connect',
                                                'id': function(d) { return 'connect-' + d.source}
                                            });
            connectEntersMapping
                .append('line')
                .attr({
                    'x1': function(item) {
                                return d3.select('#s-circle-' + item.source).attr('cx');
                          },
                    'y1': function(item) {
                                return d3.select('#s-circle-' + item.source).attr('cy');
                          },
                    'x2': function(item) {
                                return d3.select('#d-circle-' + item.destination).attr('cx');
                          },
                    'y2': function(item) {
                                return d3.select('#d-circle-' + item.destination).attr('cy');
                          },
                    's-ref': function(item) { 
                            return item.source;
                          },
                    'd-ref': function(item) { 
                            return item.destination;
                          }
                })
                .style({
                    'stroke': 'black',
                    'stroke-width': '4px'
                })
                .on('dblclick', function() {
                    var element = d3.select(d3.event.target),
                        parent = element.parentNode;
                    
                    d3.select('#s-circle-' + element.attr('s-ref')).attr('data-linked', '');
                    d3.select('#s-circle-' + element.attr('s-ref')).classed('linked', false);
                    d3.select('#s-rect-' + element.attr('s-ref')).classed('linked', false);
                    d3.select('#s-text-' + element.attr('s-ref')).classed('linked', false);
                    
                    d3.select('#d-circle-' + element.attr('d-ref')).attr('data-linked', '');
                    d3.select('#d-circle-' + element.attr('d-ref')).classed('linked', false);
                    d3.select('#d-rect-' + element.attr('d-ref')).classed('linked', false);
                    d3.select('#d-text-' + element.attr('d-ref')).classed('linked', false);
                    
                    d3.select('#connect-' + element.attr('s-ref')).remove();
                    
                    self.mapping.forEach(function(item, index) {
                        if (item.source == element.attr('s-ref')) {
                            setTimeout(function() {
                                self.mapping.splice(index, 1);
                            }, 0);
                            
                            return;
                        }
                    });
                })
                .each(function(item) {
                    d3.select('#s-circle-' + item.source).attr('data-linked', 'true');
                    
                    d3.select('#s-circle-' + item.source).classed('linked', true);
                    d3.select('#s-rect-' + item.source).classed('linked', true);
                    d3.select('#s-text-' + item.source).classed('linked', true);
                
                    d3.select('#d-circle-' + item.destination).attr('data-linked', 'true');
                    d3.select('#d-circle-' + item.destination).classed('linked', true);
                    d3.select('#d-rect-' + item.destination).classed('linked', true);
                    d3.select('#d-text-' + item.destination).classed('linked', true);
                });
        }
        
        FieldMapper.prototype.selection = function(target) {
            var element = d3.select(target),
                ref = element.attr('data-ref');
            if (d3.select('#s-circle-'+ref).attr('data-linked') != 'true') {
                
                d3.selectAll('.plotSource circle').classed("selected", false);
                d3.select('#s-circle-'+ref).classed("selected", true);
                
                d3.selectAll('.plotSource rect').classed('selected', false);
                d3.select('#s-rect-'+ref).classed('selected', true);
                
                d3.selectAll('.plotSource text').classed('selected', false);
                d3.select('#s-text-'+ref).classed('selected', true);
            }
        }
        
        FieldMapper.prototype.linkage = function(target) {
            var d_element = d3.select(target),
                d_ref = d_element.attr('data-ref');

            if (d3.select('#d-circle-' + d_ref).attr('data-linked') != 'true') {

                var s_element = d3.select('.plotSource circle.selected'),
                    s_ref = s_element.attr('data-ref');
                if (s_element[0][0] == null) return;
                
                this.mapping.push({
                    source: s_element.attr('data-ref'),
                    destination: d_ref
                });

                s_element.classed('selected', false);
                d3.select('#s-rect-' + s_ref).classed('selected', false);
                d3.select('#s-text-' + s_ref).classed('selected', false);

                this.drawMapping();
            }
        }

        return FieldMapper;
    }
})();
