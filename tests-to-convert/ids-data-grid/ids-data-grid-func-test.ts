/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/canvas-mock';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../src/assets/data/books.json';
import productsDataset from '../../src/assets/data/products.json';
import datasetTree from '../../src/assets/data/tree-buildings.json';
import IdsGlobal from '../../src/components/ids-global/ids-global';

import createFromTemplate from '../helpers/create-from-template';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';
import IdsPager from '../../src/components/ids-pager/ids-pager';
import '../../src/components/ids-checkbox/ids-checkbox';

import arMessages from '../../src/components/ids-locale/data/ar-messages.json';
import deMessages from '../../src/components/ids-locale/data/de-messages.json';
import deDELocale from '../../src/components/ids-locale/data/de-DE.json';

describe('IdsDataGrid Component', () => {

  // test('supports column resize', async () => {
    //   (window as any).getComputedStyle = () => ({ width: 200 });

    //   dataGrid.columns = [{
    //     id: 'price',
    //     name: 'Price',
    //     field: 'price',
    //     align: 'center',
    //     resizable: true,
    //     minWidth: 100,
    //     width: 200,
    //     maxWidth: 300
    //   },
    //   {
    //     id: 'bookCurrency',
    //     name: 'Currency',
    //     field: 'bookCurrency',
    //     align: 'right',
    //     minWidth: 100,
    //     resizable: true,
    //     maxWidth: 300
    //   }];

    //   const nodes = dataGrid.container.querySelectorAll('.resizer');
    //   expect(nodes.length).toEqual(2);

    //   // Fake a resize
    //   const mousedown = new MouseEvent('mousedown', { clientX: 224, bubbles: true });
    //   // Wrong target
    //   nodes[0].parentNode.dispatchEvent(mousedown);
    //   nodes[0].dispatchEvent(mousedown);
    //   expect(dataGrid.isResizing).toBeTruthy();
    //   expect(dataGrid.columns[0].width).toBe(200);

    //   let mousemove = new MouseEvent('mousemove', { clientX: 200, bubbles: true });
    //   document.dispatchEvent(mousemove);
    //   expect(dataGrid.columns[0].width).toBe(176);

    //   mousemove = new MouseEvent('mouseup', { clientX: 190, bubbles: true });
    //   document.dispatchEvent(mousemove);
    //   expect(dataGrid.columns[0].width).toBe(176);
    // });

    // test('supports column resize on RTL', async () => {
    //   (window as any).getComputedStyle = () => ({ width: 200 });
    //   await processAnimFrame();

    //   await IdsGlobal.getLocale().setLanguage('ar');
    //   await processAnimFrame();

    //   expect(IdsGlobal.getLocale().isRTL()).toBe(true);

    //   dataGrid.columns = [{
    //     id: 'price',
    //     name: 'Price',
    //     field: 'price',
    //     align: 'center',
    //     resizable: true,
    //     minWidth: 100,
    //     width: 200,
    //     maxWidth: 300
    //   },
    //   {
    //     id: 'bookCurrency',
    //     name: 'Currency',
    //     field: 'bookCurrency',
    //     align: 'right',
    //     minWidth: 100,
    //     resizable: true,
    //     maxWidth: 300
    //   }];

    //   await processAnimFrame();
    //   const nodes = dataGrid.container.querySelectorAll('.resizer');
    //   expect(nodes.length).toEqual(2);

    //   // Fake a resize
    //   const mousedown = new MouseEvent('mousedown', { clientX: 224, bubbles: true });
    //   // Wrong target
    //   nodes[0].parentNode.dispatchEvent(mousedown);
    //   nodes[0].dispatchEvent(mousedown);
    //   expect(dataGrid.isResizing).toBeTruthy();
    //   expect(dataGrid.columns[0].width).toBe(200);

    //   let mousemove = new MouseEvent('mousemove', { clientX: 200, bubbles: true });
    //   document.dispatchEvent(mousemove);
    //   expect(dataGrid.columns[0].width).toBe(224);

    //   // Stop Moving
    //   mousemove = new MouseEvent('mouseup', { clientX: 190, bubbles: true });
    //   document.dispatchEvent(mousemove);
    //   expect(dataGrid.columns[0].width).toBe(224);
    // });

  describe('Virtual Scrolling Tests', () => {
    test('renders with virtualScroll option', () => {
      document.body.innerHTML = '';
      dataGrid = new IdsDataGrid();
      dataGrid.virtualScroll = true;
      document.body.appendChild(dataGrid);
      dataGrid.columns = columns();
      dataGrid.data = dataset;
      dataGrid.virtualScroll = false;

      expect(dataGrid.shadowRoot.querySelectorAll('ids-virtual-scroll').length).toEqual(0);
      expect(dataGrid.getAttribute('virtual-scroll')).toEqual(null);
    });

    test('renders can sort with the virtualScroll option', async () => {
      dataGrid.virtualScroll = true;
      dataGrid.redraw();
      await processAnimFrame();
      // Height is zero...
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
      dataGrid.setSortColumn('description', true);
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
    });

    test('can reset the virtualScroll option', async () => {
      document.body.innerHTML = '';
      dataGrid = new IdsDataGrid();
      dataGrid.virtualScroll = true;
      document.body.appendChild(dataGrid);
      dataGrid.columns = columns();
      dataGrid.data = dataset;
      await processAnimFrame();
      expect(dataGrid.shadowRoot.querySelectorAll('ids-virtual-scroll').length).toEqual(0);
    });

    test('has the right row height for each rowHeight value', () => {
      dataGrid.virtualScroll = true;
      expect(dataGrid.rowPixelHeight).toEqual(51);

      dataGrid.rowHeight = 'md';
      expect(dataGrid.rowPixelHeight).toEqual(41);

      dataGrid.rowHeight = 'sm';
      expect(dataGrid.rowPixelHeight).toEqual(36);

      dataGrid.rowHeight = 'xs';
      expect(dataGrid.rowPixelHeight).toEqual(31);

      dataGrid.redrawBody();
      expect(dataGrid.rowPixelHeight).toEqual(31);
    });

    it.skip('contains virtualScrollSettings', () => {
      const BUFFER_ROWS = 52;
      const MAX_ROWS = 150;
      const DEFAULT_SETTINGS = {
        BUFFER_ROWS,
        MAX_ROWS,
        BODY_HEIGHT: 7500,
        BUFFER_HEIGHT: 2500,
        DEBOUNCE_RATE: 10,
        ENABLED: false,
        RAF_DELAY: 60,
        ROW_HEIGHT: 50,
      };

      expect(dataGrid.virtualScrollSettings).toEqual(DEFAULT_SETTINGS);

      dataGrid.virtualScroll = true;
      expect(dataGrid.virtualScrollSettings).toEqual({
        ...DEFAULT_SETTINGS,
        ENABLED: true,
      });

      dataGrid.rowHeight = 'md';
      expect(dataGrid.virtualScrollSettings).toEqual({
        ...DEFAULT_SETTINGS,
        ENABLED: true,
        ROW_HEIGHT: 40,
        BODY_HEIGHT: DEFAULT_SETTINGS.MAX_ROWS * 40,
        BUFFER_HEIGHT: DEFAULT_SETTINGS.BUFFER_ROWS * 40,
      });

      dataGrid.rowHeight = 'sm';
      expect(dataGrid.virtualScrollSettings).toEqual({
        ...DEFAULT_SETTINGS,
        ENABLED: true,
        ROW_HEIGHT: 35,
        BODY_HEIGHT: DEFAULT_SETTINGS.MAX_ROWS * 35,
        BUFFER_HEIGHT: DEFAULT_SETTINGS.BUFFER_ROWS * 35,
      });

      dataGrid.rowHeight = 'xs';
      expect(dataGrid.virtualScrollSettings).toEqual({
        ...DEFAULT_SETTINGS,
        ENABLED: true,
        ROW_HEIGHT: 30,
        BODY_HEIGHT: DEFAULT_SETTINGS.MAX_ROWS * 30,
        BUFFER_HEIGHT: DEFAULT_SETTINGS.BUFFER_ROWS * 30,
      });

      dataGrid.redrawBody();
      expect(dataGrid.virtualScrollSettings).toEqual({
        ...DEFAULT_SETTINGS,
        ENABLED: true,
        ROW_HEIGHT: 30,
        BODY_HEIGHT: DEFAULT_SETTINGS.MAX_ROWS * 30,
        BUFFER_HEIGHT: DEFAULT_SETTINGS.BUFFER_ROWS * 30,
      });
    });

    test('attaches scroll event handler', async () => {
      expect(dataGrid.virtualScroll).toBeFalsy();

      const listener = jest.spyOn(dataGrid.container, 'addEventListener');
      expect(listener).toBeCalledTimes(0);

      dataGrid.virtualScroll = true;
      expect(dataGrid.virtualScroll).toBeTruthy();

      expect(listener).toBeCalledWith('scroll', expect.any(Function), { capture: true, passive: true });
    });

    test('renders additional rows when IdsDataGrid.appendData() used', () => {
      document.body.innerHTML = '';
      dataGrid = new IdsDataGrid();
      document.body.appendChild(dataGrid);
      dataGrid.columns = columns();

      expect(dataGrid.virtualScroll).toBeFalsy();
      dataGrid.virtualScroll = true;
      expect(dataGrid.virtualScroll).toBeTruthy();

      dataGrid.data = dataset;
      expect(dataGrid.rows.length).toBe(dataset.length);
      dataGrid.appendData(dataset.concat(dataset));
      expect(dataGrid.rows.length).toBe(dataset.length * 3);
    });

    it.skip('can recycle cells down', async () => {
      expect(dataGrid.data).toEqual(dataset);

      dataGrid.virtualScroll = true;
      dataGrid.data = productsDataset;
      expect(dataGrid.data).toEqual(productsDataset);

      const { MAX_ROWS, BUFFER_ROWS, ROW_HEIGHT } = dataGrid.virtualScrollSettings;

      expect(dataGrid.rows.length).toBe(MAX_ROWS);
      expect(dataGrid.rows[0].rowIndex).toBe(0);
      expect(dataGrid.rows[dataGrid.rows.length - 1].rowIndex).toBe(MAX_ROWS - 1);

      expect(dataGrid.container.scrollTop).toBe(0);
      // dataGrid.container.scrollTop = BUFFER_ROWS * ROW_HEIGHT;
      dataGrid.scrollRowIntoView(BUFFER_ROWS * ROW_HEIGHT);
      await processAnimFrame();
      expect(dataGrid.container.scrollTop).toBeGreaterThan(100);

      expect(dataGrid.rows[0].rowIndex).toBe(0);
      expect(dataGrid.rows[dataGrid.rows.length - 1].rowIndex).toBe(MAX_ROWS - 1);
    });

    it.skip('can recycle cells up', async () => {
      expect(dataGrid.data).toEqual(dataset);

      dataGrid.virtualScroll = true;
      dataGrid.data = productsDataset;
      expect(dataGrid.data).toEqual(productsDataset);

      const { MAX_ROWS, BUFFER_ROWS, ROW_HEIGHT } = dataGrid.virtualScrollSettings;

      expect(dataGrid.rows.length).toBe(MAX_ROWS);
      expect(dataGrid.rows[0].rowIndex).toBe(0);
      expect(dataGrid.rows[dataGrid.rows.length - 1].rowIndex).toBe(MAX_ROWS - 1);

      expect(dataGrid.container.scrollTop).toBe(0);
      dataGrid.scrollRowIntoView(BUFFER_ROWS * ROW_HEIGHT);
      await processAnimFrame();
      expect(dataGrid.container.scrollTop).toBeGreaterThan(100);

      expect(dataGrid.rows[0].rowIndex).toBe(0);
      expect(dataGrid.rows[dataGrid.rows.length - 1].rowIndex).toBe(MAX_ROWS - 1);
    });
  });

  describe('Reordering Tests', () => {
    test('supports column reorder', async () => {
      dataGrid.columns = [{
        id: 'price',
        name: 'Price',
        field: 'price',
        reorderable: true,
        width: 200,
      },
      {
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        minWidth: 100,
        reorderable: true,
      },
      {
        id: 'other',
        name: 'ledger',
        field: 'ledger',
        minWidth: 100,
        reorderable: false,
      }];

      const cols = (dataGrid).columns;
      const nodes = dataGrid.container.querySelectorAll('.reorderer');
      expect(nodes.length).toEqual(2);

      // Fake a Drag
      const dragstart = new MouseEvent('dragstart', { bubbles: true });
      nodes[0].parentNode.dispatchEvent(dragstart);
      expect(nodes[0].parentNode.classList.contains('active-drag-column')).toBeTruthy();
      const dragover: any = new CustomEvent('dragover', { bubbles: true, dataTransfer: { } } as any);
      dragover.pageY = '1';
      Object.assign(dragover, {
        dataTransfer: { setData: jest.fn(), effectAllowed: 'move' }
      });
      nodes[1].dispatchEvent(dragover);

      // simulate dragging
      const dragenter = new MouseEvent('dragenter', { bubbles: true });
      nodes[1].parentNode.dispatchEvent(dragenter);
      nodes[0].parentNode.dispatchEvent(dragenter);
      nodes[1].parentNode.dispatchEvent(dragstart);

      const dragstart2 = new MouseEvent('dragstart', { bubbles: true });
      nodes[1].parentNode.dispatchEvent(dragstart2);
      nodes[0].parentNode.dispatchEvent(dragenter);
      nodes[1].parentNode.dispatchEvent(dragenter);
      nodes[0].parentNode.dispatchEvent(dragenter);

      dataGrid.localeAPI.isRTL = () => true;
      nodes[1].parentNode.dispatchEvent(dragenter);
      nodes[0].parentNode.dispatchEvent(dragenter);
      expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('block');

      const dragend = new MouseEvent('dragend', { bubbles: true });
      nodes[1].parentNode.dispatchEvent(dragend);
      expect(nodes[0].parentNode.classList.contains('active-drag-column')).toBeFalsy();
      expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('none');

      const drop = new MouseEvent('drop', { bubbles: true });
      dataGrid.dragInitiated = true;
      nodes[1].parentNode.dispatchEvent(drop);

      // Overall success
      expect(cols[0].id).toBe('price');
      expect(cols[1].id).toBe('bookCurrency');
      expect(cols[2].id).toBe('other');
    });

    test('supports dragging right', async () => {
      dataGrid.columns = [{
        id: 'price',
        name: 'Price',
        field: 'price',
        reorderable: true,
        width: 200,
      },
      {
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        minWidth: 100,
        reorderable: true,
      },
      {
        id: 'other',
        name: 'ledger',
        field: 'ledger',
        minWidth: 100,
        reorderable: true,
      }];

      const cols = (dataGrid).columns;
      const nodes = dataGrid.container.querySelectorAll('.reorderer');

      // Fake a Drag
      const dragstart = new MouseEvent('dragstart', { bubbles: true });
      nodes[2].dispatchEvent(dragstart);
      dataGrid.dragInitiated = true;

      // simulate dragging
      const dragenter = new MouseEvent('dragenter', { bubbles: true });
      nodes[1].dispatchEvent(dragenter);
      nodes[0].dispatchEvent(dragenter);
      expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('block');

      const dragend = new MouseEvent('dragend', { bubbles: true });
      nodes[0].dispatchEvent(dragend);

      dataGrid.dragInitiated = true;
      const drop = new MouseEvent('drop', { bubbles: true });
      nodes[0].dispatchEvent(drop);

      // Overall success
      expect(cols[0].id).toBe('price');
      expect(cols[1].id).toBe('bookCurrency');
      expect(cols[2].id).toBe('other');
    });

    test('supports dragging when right to left', async () => {
      dataGrid.columns = [{
        id: 'price',
        name: 'Price',
        field: 'price',
        reorderable: true,
        width: 200,
      },
      {
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        minWidth: 100,
        reorderable: true,
      },
      {
        id: 'other',
        name: 'ledger',
        field: 'ledger',
        minWidth: 100,
        reorderable: true,
      }];
      await processAnimFrame();

      await IdsGlobal.getLocale().setLanguage('ar');
      await processAnimFrame();

      const cols = (dataGrid).columns;
      const nodes = dataGrid.container.querySelectorAll('.reorderer');

      // Fake a Drag
      const dragstart = new MouseEvent('dragstart', { bubbles: true });
      nodes[2].dispatchEvent(dragstart);

      // simulate dragging
      const dragenter = new MouseEvent('dragenter', { bubbles: true });
      nodes[1].dispatchEvent(dragenter);
      nodes[0].dispatchEvent(dragenter);
      expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('block');

      const dragend = new MouseEvent('dragend', { bubbles: true });
      nodes[0].dispatchEvent(dragend);

      const drop = new MouseEvent('drop', { bubbles: true });
      nodes[0].dispatchEvent(drop);

      // Overall success
      expect(cols[0].id).toBe('price');
      expect(cols[1].id).toBe('bookCurrency');
      expect(cols[2].id).toBe('other');
    });

    test('supports moveColumn', async () => {
      dataGrid.columns = [{
        id: 'price',
        name: 'Price',
        field: 'price',
        reorderable: true,
        width: 200,
      },
      {
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        minWidth: 100,
        reorderable: true,
      },
      {
        id: 'other',
        name: 'ledger',
        field: 'ledger',
        minWidth: 100,
        reorderable: false,
      }];

      const cols = (dataGrid).columns;
      dataGrid.data[1].dirtyCells = [];
      dataGrid.data[1].dirtyCells.push({
        row: 1, cell: 0, columnId: 'price', originalValue: '12.99'
      });
      dataGrid.data[2].dirtyCells = [];
      dataGrid.data[2].dirtyCells.push({
        row: 2, cell: 0, columnId: 'price', originalValue: '13.99'
      });

      expect(cols[0].id).toBe('price');
      expect(cols[1].id).toBe('bookCurrency');
      expect(cols[2].id).toBe('other');
      dataGrid.moveColumn(0, 1);
      expect(cols[0].id).toBe('bookCurrency');
      expect(cols[1].id).toBe('price');
      expect(cols[2].id).toBe('other');

      (dataset[1] as any).dirtyCells = undefined;
      (dataset[2] as any).dirtyCells = undefined;
      dataGrid.resetDirtyCells();
    });
  });
});
