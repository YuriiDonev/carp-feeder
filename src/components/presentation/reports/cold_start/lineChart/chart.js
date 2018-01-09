import * as d3 from 'd3';
import { event as currentEvent } from 'd3';
import { Initial_chart } from '../../../common/d3_Chart';

class ChangesChart extends Initial_chart {
  constructor({ chartId }) {
    super({ chartId, width: 3600, height: 200 });

    this.xScale = d3.time.scale().range([0, this.width]);
    this.yScale = d3.scale.linear().range([this.height, 0]);
    this.yScale.domain([0, 100]);
    /* Define axes */
    this.xAxis = d3.svg.axis().scale(this.xScale).orient('bottom');
    this.yAxis = d3.svg.axis().scale(this.yScale).orient('left');
    /* Line Function */
    this.lineFunction = d3.svg.line()
      .defined(d => d)
      .interpolate('linear')
      .x(d => this.xScale(d.date))
      .y(d => this.yScale(d.value));

    /* Axis lines group */
    this.axisLines = this.svg.append('g')
      .attr('class', 'axis-lines');
    /* Lines group */
    this.linesG = this.svg.append('g')
      .attr('class', 'productivity-l');

    /* Pop up block */
    this.div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('display', 'none');
    /* Pop up content */
    this.popupContent = '<div></div>';
  }

  unmount() {
    d3.select(window).on('resize', null);
    /* remove tooltip block */
    d3.select('.tooltip').remove();
  }

  /**
   *
   * @param {Array} productivities
   */
  draw(productivities) {
    this.productivities = productivities;
    this.update();
  }

  /**
   *
   * @param {Function} method
   */
  receiveHandlePopUpContentMethod(method) {
    this.askForPopUpData = method;
  }

  /**
   *
   * @param {String} content
   */
  updatePopUpContent(content) {
    this.popupContent = content;
  }

  /* Update chart */
  update = () => {
    /* Draw date line */
    this.updateDateLine();
    /* Draw lines */
    this.updateLines();
    /* Draw axis lines */
    this.updateAxisLines();
    /* Draw datapoints */
    this.updateDataPoints();
  }

  updateDateLine = () => {
    this.xScale.range([0, this.width]);
    const dates = [];
    if (this.productivities.length !== 0) {
      for (let i = 0; i < this.productivities.length; i += 1) {
        for (let j = 0; j < this.productivities[i].items.length; j += 1) {
          if (this.productivities[i] && this.productivities[i].items[j]) {
            dates.push(this.productivities[i].items[j].date);
          }
        }
      }
    }
    this.xScale.domain(d3.extent(dates));
    this.xAxis.ticks(24);
  }

  updateLines() {
    const lines = this.linesG.selectAll('.p-line').data(this.productivities, d => d.key);
    lines.exit().remove();
    lines.enter()
        .append('path')
        .attr('class', d => `p-line ${d.key.toLowerCase()}`)
        .style('stroke-width', '2px')
        .style('fill', 'none');
    lines.attr('d', d => this.lineFunction(d.items));
  }

  updateAxisLines() {
    const ticks = this.xAxis.scale().ticks(this.xAxis.ticks()[0]);
    const lines = this.axisLines.selectAll('.a-line').data(ticks, d => d);
    lines.exit().remove();
    lines.enter()
      .append('line')
      .attr('class', d => `a-line line-${new Date(d).getTime()}`)
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('stroke', '#eff1f6')
      .attr('stroke-width', '1.3px');
    lines
      .attr('x1', d => this.xScale(d))
      .attr('x2', d => this.xScale(d));
  }

  updateDataPoints() {
    const data = [];
    this.productivities.map(typeBlock => {
      if (typeBlock.items !== 0) {
        const key = typeBlock.key;
        return typeBlock.items.filter(el => el !== null && el.value !== 0).map(item => (
          {
            x: item.date,
            y: item.value,
            key,
          }
          ));
      }
    }).forEach(arr => data.push(...arr));

    const dotes = this.svg.selectAll('.dot').data(data);
    dotes.exit().remove();
    dotes.enter()
      .append('circle')
      .attr('r', 2);

    dotes
      .attr('class', d => `dot ${d.key.toLowerCase()} dot-${d.key.toLowerCase()}-${d.x}`)
      .attr('cx', d => this.xScale(d.x))
      .attr('cy', d => this.yScale(d.y));

    dotes
    .on('mouseover', d => {
      this.svg
        .select(`.dot-${d.key.toLowerCase()}-${d.x}`)
        .transition()
        .duration(200)
        .attr('r', 5);

      this.svg
        .select(`.line-${d.x}`)
        .attr('stroke', '#1991eb');
      this.askForPopUpData({ timestamp: d.x, key: d.key });

      this.div.transition()
        .duration(200)
        .style('opacity', 1)
        .style('display', 'block');

      this.div.html(this.popupContent)
        .style('left', `${currentEvent.pageX + 20}px`)
        .style('top', `${currentEvent.pageY - 175}px`); // Minus height of block
    })
    .on('mouseout', d => {
      this.svg
        .select(`.dot-${d.key.toLowerCase()}-${d.x}`)
        .transition()
        .duration(500)
        .attr('r', 2);

      this.svg
        .select(`.line-${d.x}`)
        .attr('stroke', '#eff1f6');

      this.div.transition()
        .duration(500)
        .style('opacity', 0)
        .style('display', 'none');
    });
  }

}

export default ChangesChart;
