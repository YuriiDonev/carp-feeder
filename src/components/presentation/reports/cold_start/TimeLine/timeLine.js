import * as d3 from 'd3';
import { event as currentEvent } from 'd3';
import moment from 'moment';
import { Initial_chart } from '../../../common/d3_Chart';

let flagForAllowClick = true;
const line_types = ['unknown', 'manual', 'online', 'cold-start', 'offline'];
let dragEvent = false;
class TimeLine extends Initial_chart {
  constructor({ chartId }) {
    super({ chartId, width: 3600, height: 25 });

    /* Define scales */
    this.xScale = d3.time.scale().range([0, this.width]);
    this.yScale = d3.scale.linear().range([this.height, 0]);
    this.yScale.domain([0, 100]);
    /* Define axes */
    const timeFormat = d3.time.format('%H:%M');
    this.xAxis = d3.svg.axis().scale(this.xScale).orient('bottom').tickFormat(timeFormat);
    this.yAxis = d3.svg.axis().scale(this.yScale).orient('left');

        /* Render x-axes */
    this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${this.height})`)
            .call(this.xAxis);
        /* Block group */
    this.timeSection = this.svg.append('g')
            .attr('class', 'time-section');
        /* Axis lines group */
    this.axisLines = this.svg.append('g')
            .attr('class', 'axis-lines');
        /* Brush */
    this.brush = d3.svg.brush()
            .x(this.xScale)
            .on('brushstart', this.brushstart)
            .on('brush', this.brushmove)
            .on('brushend', this.brushend);
    this.brushg = this.svg.append('g')
            .attr('class', 'brush-background')
            .call(this.brush);
    this.brushg.selectAll('rect')
            .attr('height', this.height)
            .style('fill', '#1991eb')
            .style('opacity', '0.4');

        /* Delete default event handler level and add new */
    const background = this.svg.select('.background')[0][0];
    background.remove();

    this.svg.on('mousedown', () => {
      const new_click_event = new Event('mousedown');
      new_click_event.pageX = currentEvent.pageX;
      new_click_event.clientX = currentEvent.clientX;
      new_click_event.pageY = currentEvent.pageY;
      new_click_event.clientY = currentEvent.clientY;
      if (this.brush.empty()) {
        this.brushg.node().dispatchEvent(new_click_event);
      }
    });

        /* Create patterns for lines */
    line_types.forEach(type => {
      this.svg
            .append('defs')
            .append('pattern')
                .attr('id', type)
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('width', 8)
                .attr('height', 10)
                .attr('patternTransform', 'rotate(-45 50 50)')
            .append('line')
                .attr('class', `time-lines ${type}`)
                .attr('y2', 10);
    });

        /* Handlers styles */
    this.brushResizePath = d => {
      const e = +(d === 'e'),
        x = e ? 1 : -1,
        y = this.height;
      return `M${0.5 * x},${y}A6,6 0 0 ${e} ${6.5 * x},${y}V${2 * y}A6,6 0 0 ${e} ${0.5 * x},${2 * y}Z` + `M${2.5 * x},${y + 8}V${2 * y - 8}M${4.5 * x},${y + 8}V${2 * y - 8}`;
    };
    this.handlers = this.svg
            .selectAll('.resize')
            .append('path')
            .attr('fill', '#eff1f6')
            .attr('stroke', '#1991eb')
            .attr('transform', `translate(0,-${this.height})`)
            .attr('d', this.brushResizePath);

    this.handlers
            .on('mouseover', d => {
              this.lightHandler(d);
            })
            .on('mousedown', d => {
              dragEvent = true;
              this.lightHandler(d);
            })
            .on('mouseout', d => {
              if (!dragEvent) {
                this.unLightHadlers();
              }
            });

    d3.select(window)
            .on('mouseup', d => {
              if (dragEvent) {
                dragEvent = false;
                this.unLightHadlers();
              }
            });
  }

  unmount() {
    d3.select(window).on('resize', null);
  }

  lightHandler = d => {
    this.svg
        .selectAll(`.${d}`)
        .selectAll('path')
        .transition()
        .duration(200)
        .attr('fill', '#1991eb')
        .attr('stroke', '#282f36')
        .style('opacity', '0.7');
  };

  unLightHadlers = () => {
    this.handlers.transition()
        .duration(200)
        .attr('fill', '#eff1f6')
        .attr('stroke', '#1991eb')
        .style('opacity', '1');
  };


    /* Append new data */
  draw(productivities) {
    this.productivities = productivities;
    this.update();
  }

    /**
     *
     * @param {function} method
     */
  receiveHandleViewSegmentInfoMethod(method) {
    this.viewSegmentInfo = method;
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
        /* Draw spend time sections */
    this.updateTimeBlocks();
  };

  updateDateLine = () => {
    this.xScale.range([0, this.width]);
    const dates = this.productivities.reduce((sum, el) => {
      sum.push(el.from);
      sum.push(el.to);
      return sum;
    }, []);
    this.xScale.domain(d3.extent(dates));
    this.xAxis.ticks(24);
    this.svg.select('.x.axis')
            .attr('transform', `translate(0,${this.height})`)
            .call(this.xAxis);
  };

  updateTimeBlocks = () => {
    const blocks = this.timeSection.selectAll('.time-blocks').data(this.productivities);
    blocks.exit().remove();
    blocks.enter()
            .append('line');
    blocks
            .attr('stroke', d => `url(#${d.key.toLowerCase()})`)
            .attr('class', d => `time-blocks time-block-${d.from}`)
            .attr('x1', d => this.xScale(d.from))
            .attr('x2', d => this.xScale(d.to))
            .attr('y1', d => 13)
            .attr('y2', d => 13)
            .on('mouseover', d => {
              if (d.key !== 'unknown') {
                this.viewSegmentInfo(d, currentEvent);
                this.svg
                        .select(`.time-block-${d.from}`)
                        .transition()
                        .duration(300)
                        .style('stroke-width', '10px');
              }
            })
            .on('mouseout', d => {
              this.viewSegmentInfo(null);
              this.svg
                    .select(`.time-block-${d.from}`)
                    .transition()
                    .duration(300)
                    .style('stroke-width', '8px');
            });
  };

  click = () => {
    if (flagForAllowClick) {
      if (this.brush.empty()) {
        const extent = this.brush.extent();
        const online_productivities = this.productivities
                    .filter(s => s.key === 'cold-start')
                    .reduce((result, segment) => {
                      const segment_start_overlap = result.find(s => s.to === segment.from);
                      const segment_end_overlap = result.find(s => s.from === segment.to);

                      if (segment_start_overlap || segment_end_overlap) {
                        if (segment_start_overlap) {
                          const newResult = result.filter(s => s.to !== segment.from);
                          const newConcatedEl = Object.assign({}, segment, { from: segment_start_overlap.from });
                          newResult.push(newConcatedEl);
                          return newResult;
                        }

                        if (segment_end_overlap) {
                          const newResult = result.filter(s => s.from !== segment.to);
                          const newConcatedEl = Object.assign({}, segment, { to: segment_end_overlap.to });
                          newResult.push(newConcatedEl);
                          return newResult;
                        }
                      }
                      result.push(segment);
                      return result;
                    }, []);

        let timesection = online_productivities.find(timesection => moment(extent[0]).isBetween(timesection.from, timesection.to));

                // Check if click on unknown segment
        if (!timesection) {
          timesection = this.productivities
                        .filter(s => s.key === 'unknown')
                        .find(timesection => moment(extent[0]).isBetween(timesection.from, timesection.to));
          if (timesection) {
            const start = moment(timesection.from);
            const end = moment(timesection.to);
            const minutes = moment.duration(end.diff(start)).asMinutes();
            if (minutes > 20) {
              const getUTC = option => {
                if (option === 'start') {
                  return parseInt(moment(extent[0]).startOf('day').format('x'));
                }
                if (option === 'end') {
                  return parseInt(moment(extent[0]).endOf('day').format('x'));
                }
                return parseInt(moment(extent[0]).format('x'));
              };

              let imagine_start,
                imagine_end;

              if (getUTC() - 600000 < getUTC('start')) {
                imagine_start = getUTC();
                imagine_end = getUTC() + 1200000;
              } else if (getUTC() + 600000 > getUTC('end')) {
                imagine_start = getUTC() - 1200000;
                imagine_end = getUTC();
              } else {
                imagine_start = getUTC() - 600000;
                imagine_end = getUTC() + 600000;
              }

              this.brushg.call(this.brush.extent([imagine_start, imagine_end]));
              this.setDataForModal({ from: imagine_start, to: imagine_end }, currentEvent);
            } else {
              this.brushg.call(this.brush.extent([new Date(timesection.from), new Date(timesection.to)]));
              this.setDataForModal(timesection, currentEvent);
            }
            return;
          }
        }

        if (timesection) {
          this.brushg.call(this.brush.extent([new Date(timesection.from), new Date(timesection.to)]));
          this.setDataForModal(timesection, currentEvent);
        } else {
          this.brushg.call(this.brush.clear());
          this.setDataForModal(null);
        }
      } else {
        this.brushg.call(this.brush.clear());
        this.setDataForModal(null);
      }
    }
  };

    /**
     *
     * @param {function} method
     */
  handleSetDataForModal = method => {
    this.setDataForModal = method;
  };

  cancelSelection = () => {
    this.brushg.call(this.brush.clear());
  };

    /**
     *
     * @param {Object} timesheet
     */
  changeSelection = timesheet => {
    this.brushg.call(this.brush.extent([new Date(timesheet.from), new Date(timesheet.to)]));
  };

  brushstart = () => {
        // console.log('brushstart -- d3.event',  currentEvent);
  };

  brushmove = () => {
    const leftFringle = window.screen.availWidth / 20;
    const rightFringle = window.screen.availWidth - leftFringle;
        // leftFringle tree sizes because  of a navbar
    if (leftFringle * 3 > currentEvent.sourceEvent.pageX) {
      const node = document.getElementById('cold-start-block');
      if (node) {
        node.scrollLeft -= 40;
      }
    }
    if (rightFringle < currentEvent.sourceEvent.pageX) {
      const node = document.getElementById('cold-start-block');
      if (node) {
        node.scrollLeft += 40;
      }
    }
  };

  brushend = () => {
    const timesection = {
      from: this.brush.extent()[0],
      to: this.brush.extent()[1],
    };

        /* Flag to skip click  / TODO / */
    if (!moment(timesection.from).isSame(timesection.to)) {
      flagForAllowClick = false;
      setTimeout(() => {
        flagForAllowClick = true;
      }, 1500);
    }
    this.setDataForModal(timesection, currentEvent);
  };
}

export default TimeLine;
