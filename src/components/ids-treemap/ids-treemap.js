import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes,
  IdsDataSource
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../../mixins';

import styles from './ids-treemap.scss';

/**
 * IDS Tree Component
 * @type {IdsTreeMap}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part tree - the tree element
 */
@customElement('ids-treemap')
@scss(styles)
class IdsTreeMap extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsThemeMixin,
    IdsLocaleMixin
  ) {
  constructor() {
    super();
    // eslint-disable-next-line no-underscore-dangle
    this._result = [];
    this.width = '';
    this.height = '';
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.WIDTH,
      attributes.HEIGHT,
      'result'
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    let svg = `<svg></svg>`;
    if (this.result !== undefined) {
      svg = `
        <svg width='${this.width}' height='${this.height}'>
          ${this.result.map((rect) => this.renderGroups(rect)).join('')}
        </svg>
      `;
    }

    return svg;
  }

  renderGroups(rect) {
    return `
      <g
        fill=${rect.data.color}
      >
        <rect
          x=${rect.x}
          y=${rect.y}
          width=${rect.width}
          height=${rect.height}
        ></rect>
      </g>
    `;
  }

  set result(value) {
    // eslint-disable-next-line no-underscore-dangle
    this._result = value;
    this.render(true);
  }

  get result() {
    // eslint-disable-next-line no-underscore-dangle
    return this._result;
  }

  /**
   * Render the treemap by applying the template
   * @private
   */
  render() {
    super.render();
  }

  getMaximum = (array) => Math.max(...array);

  getMinimum = (array) => Math.min(...array);

  sumReducer = (acc, cur) => acc + cur;

  roundValue = (number) => Math.max(Math.round(number * 100) / 100, 0);

  validateArguments = ({ data, width, height }) => {
    if (!width || typeof width !== 'number' || width < 0) {
      throw new Error('You need to specify the width of your treemap');
    }
    if (!height || typeof height !== 'number' || height < 0) {
      throw new Error('You need to specify the height of your treemap');
    }
    if (!data || !Array.isArray(data) || data.length === 0 || !data.every((dataPoint) => Object.prototype.hasOwnProperty.call(dataPoint, 'value') && typeof dataPoint.value === 'number' && dataPoint.value >= 0 && !Number.isNaN(dataPoint.value))) {
      throw new Error('Your data must be in this format [{ value: 1 }, { value: 2 }], \'value\' being a positive number');
    }
  };

  worstRatio = (row, width) => {
    const sum = row.reduce(this.sumReducer, 0);
    const rowMax = this.getMaximum(row);
    const rowMin = this.getMinimum(row);
    return Math.max(((width ** 2) * rowMax) / (sum ** 2), (sum ** 2) / ((width ** 2) * rowMin));
  }

  getMinWidth = () => {
    if (this.Rectangle.totalHeight ** 2 > this.Rectangle.totalWidth ** 2) {
      return { value: this.Rectangle.totalWidth, vertical: false };
    }
    return { value: this.Rectangle.totalHeight, vertical: true };
  };

  layoutRow = (row, width, vertical) => {
    const rowHeight = row.reduce(this.sumReducer, 0) / width;

    row.forEach((rowItem) => {
      const rowWidth = rowItem / rowHeight;
      const { xBeginning } = this.Rectangle;
      const { yBeginning } = this.Rectangle;
      let data;

      if (vertical) {
        data = {
          x: xBeginning,
          y: yBeginning,
          width: rowHeight,
          height: rowWidth,
          data: this.initialData[this.Rectangle.data.length],
        };

        this.Rectangle.yBeginning += rowWidth;
      } else {
        data = {
          x: xBeginning,
          y: yBeginning,
          width: rowWidth,
          height: rowHeight,
          data: this.initialData[this.Rectangle.data.length],
        };

        this.Rectangle.xBeginning += rowWidth;
      }

      this.Rectangle.data.push(data);
    });

    if (vertical) {
      this.Rectangle.xBeginning += rowHeight;
      this.Rectangle.yBeginning -= width;
      this.Rectangle.totalWidth -= rowHeight;
    } else {
      this.Rectangle.xBeginning -= width;
      this.Rectangle.yBeginning += rowHeight;
      this.Rectangle.totalHeight -= rowHeight;
    }
  };

  layoutLastRow = (rows, children, width) => {
    const { vertical } = this.getMinWidth();
    this.layoutRow(rows, width, vertical);
    this.layoutRow(children, width, vertical);
  };

  squarify = (children, row, width) => {
    if (children.length === 1) {
      return this.layoutLastRow(row, children, width);
    }

    const rowWithChild = [...row, children[0]];

    if (row.length === 0 || this.worstRatio(row, width) >= this.worstRatio(rowWithChild, width)) {
      children.shift();
      return this.squarify(children, rowWithChild, width);
    }

    this.layoutRow(row, width, this.getMinWidth().vertical);
    return this.squarify(children, [], this.getMinWidth().value);
  };

  treeMap({ data, width, height }) {
    this.validateArguments({ data, width, height });
    this.width = width;
    this.height = height;

    this.Rectangle = {
      data: [],
      xBeginning: 0,
      yBeginning: 0,
      totalWidth: width,
      totalHeight: height,
    };

    this.initialData = data;
    const totalValue = data.map((dataPoint) => dataPoint.value).reduce(this.sumReducer, 0);
    const dataScaled = data.map((dataPoint) => (dataPoint.value * height * width) / totalValue);

    this.squarify(dataScaled, [], this.getMinWidth().value);

    return this.Rectangle.data.map((dataPoint) => ({
      ...dataPoint,
      x: this.roundValue(dataPoint.x),
      y: this.roundValue(dataPoint.y),
      width: this.roundValue(dataPoint.width),
      height: this.roundValue(dataPoint.height),
    }));
  }
}

export default IdsTreeMap;
