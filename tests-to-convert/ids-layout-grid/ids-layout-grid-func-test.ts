/**
 * @jest-environment jsdom
 */
import IdsGrid from '../../src/components/ids-layout-grid/ids-layout-grid';
import { ALIGN_ITEMS } from '../../src/components/ids-layout-grid/ids-layout-grid-common';

describe('IdsLayoutGrid Component', () => {
  let gridElem: any;

  beforeEach(() => {
    const grid: any = new IdsGrid();
    document.body.appendChild(grid);
    gridElem = document.querySelector('ids-layout-grid');
  });

  afterEach(() => {
    // Clean up the component instance after each test
    document.body.removeChild(gridElem);
  });

  test('should set autoFit when value is truthy', () => {
    gridElem.autoFit = 'true';
    expect(gridElem.getAttribute('auto-fit')).toBe('');
  });

  test('should remove autoFit when value is falsy', () => {
    gridElem.autoFit = 'false';
    expect(gridElem.hasAttribute('auto-fit')).toBe(false);
  });

  test('should remove autoFit when value is null', () => {
    gridElem.autoFit = null;
    expect(gridElem.hasAttribute('auto-fit')).toBe(false);
  });

  test('should return true when autoFit is set to an empty string', () => {
    gridElem.setAttribute('auto-fit', '');
    expect(gridElem.autoFit).toBe(true);
  });

  test('should return false when autoFit is not set', () => {
    expect(gridElem.autoFit).toBe(false);
  });

  test('should set autoFill when value is truthy', () => {
    gridElem.autoFill = 'true';
    expect(gridElem.getAttribute('auto-fill')).toBe('');
  });

  test('should remove autoFill when value is falsy', () => {
    gridElem.autoFill = 'false';
    expect(gridElem.hasAttribute('auto-fill')).toBe(false);
  });

  test('should remove autoFill when value is null', () => {
    gridElem.autoFill = null;
    expect(gridElem.hasAttribute('auto-fill')).toBe(false);
  });

  test('should return true when autoFill is set to an empty string', () => {
    gridElem.setAttribute('auto-fill', '');
    expect(gridElem.autoFill).toBe(true);
  });

  test('should return false when autoFill is not set', () => {
    expect(gridElem.autoFill).toBe(false);
  });

  describe('cols attribute', () => {
    test('sets the attribute value correctly', () => {
      gridElem.cols = '2';
      expect(gridElem.getAttribute('cols')).toBe('2');
    });

    test('removes the attribute when null is passed', () => {
      gridElem.cols = null;
      expect(gridElem.hasAttribute('cols')).toBe(false);
    });

    test('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols', '3');
      expect(gridElem.cols).toBe('3');
    });
  });

  describe('colsXs attribute', () => {
    test('sets the attribute value correctly', () => {
      gridElem.colsXs = '1';
      expect(gridElem.getAttribute('cols-xs')).toBe('1');
    });

    test('removes the attribute when null is passed', () => {
      gridElem.colsXs = null;
      expect(gridElem.hasAttribute('cols-xs')).toBe(false);
    });

    test('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-xs', '2');
      expect(gridElem.colsXs).toBe('2');
    });
  });

  describe('colsSm attribute', () => {
    test('sets the attribute value correctly', () => {
      gridElem.colsSm = '3';
      expect(gridElem.getAttribute('cols-sm')).toBe('3');
    });

    test('removes the attribute when null is passed', () => {
      gridElem.colsSm = null;
      expect(gridElem.hasAttribute('cols-sm')).toBe(false);
    });

    test('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-sm', '4');
      expect(gridElem.colsSm).toBe('4');
    });
  });

  describe('colsMd attribute', () => {
    test('sets the attribute value correctly', () => {
      gridElem.colsMd = '4';
      expect(gridElem.getAttribute('cols-md')).toBe('4');
    });

    test('removes the attribute when null is passed', () => {
      gridElem.colsMd = null;
      expect(gridElem.hasAttribute('cols-md')).toBe(false);
    });

    test('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-md', '5');
      expect(gridElem.colsMd).toBe('5');
    });
  });

  describe('colsLg attribute', () => {
    test('sets the attribute value correctly', () => {
      gridElem.colsLg = '5';
      expect(gridElem.getAttribute('cols-lg')).toBe('5');
    });

    test('removes the attribute when null is passed', () => {
      gridElem.colsLg = null;
      expect(gridElem.hasAttribute('cols-lg')).toBe(false);
    });

    test('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-lg', '6');
      expect(gridElem.colsLg).toBe('6');
    });
  });

  describe('colsXl attribute', () => {
    test('sets the attribute value correctly', () => {
      gridElem.colsXl = '6';
      expect(gridElem.getAttribute('cols-xl')).toBe('6');
    });

    test('removes the attribute when null is passed', () => {
      gridElem.colsXl = null;
      expect(gridElem.hasAttribute('cols-xl')).toBe(false);
    });

    test('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-xl', '6');
      expect(gridElem.colsXl).toBe('6');
    });
  });

  describe('colsXxl attribute', () => {
    test('sets the attribute value correctly', () => {
      gridElem.colsXxl = '6';
      expect(gridElem.getAttribute('cols-xxl')).toBe('6');
    });

    test('removes the attribute when null is passed', () => {
      gridElem.colsXxl = null;
      expect(gridElem.hasAttribute('cols-xxl')).toBe(false);
    });

    test('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-xxl', '6');
      expect(gridElem.colsXxl).toBe('6');
    });
  });

  test('should set minColWidth correctly when a non-null value is provided', () => {
    gridElem.minColWidth = '200px';
    expect(gridElem.getAttribute('min-col-width')).toEqual('200px');
  });

  test('should remove minColWidth when a null value is provided', () => {
    gridElem.minColWidth = '200px';
    gridElem.minColWidth = null;
    expect(gridElem.hasAttribute('min-col-width')).toBeFalsy();
  });

  test('should return the correct value when minColWidth get function is called', () => {
    gridElem.minColWidth = '200px';
    expect(gridElem.minColWidth).toEqual('200px');
  });

  test('should set maxColWidth correctly when a non-null value is provided', () => {
    gridElem.maxColWidth = '200px';
    expect(gridElem.getAttribute('max-col-width')).toEqual('200px');
  });

  test('should remove maxColWidth when a null value is provided', () => {
    gridElem.maxColWidth = '200px';
    gridElem.maxColWidth = null;
    expect(gridElem.hasAttribute('max-col-width')).toBeFalsy();
  });

  test('should return the correct value when maxColWidth get function is called', () => {
    gridElem.maxColWidth = '200px';
    expect(gridElem.maxColWidth).toEqual('200px');
  });

  test('should set minRowHeight correctly when a non-null value is provided', () => {
    gridElem.minRowHeight = '200px';
    expect(gridElem.getAttribute('min-row-height')).toEqual('200px');
  });

  test('should remove minRowHeight when a null value is provided', () => {
    gridElem.minRowHeight = '200px';
    gridElem.minRowHeight = null;
    expect(gridElem.hasAttribute('min-row-height')).toBeFalsy();
  });

  test('should return the correct value when minRowHeight get function is called', () => {
    gridElem.minRowHeight = '200px';
    expect(gridElem.minRowHeight).toEqual('200px');
  });

  test('should set maxRowHeight correctly when a non-null value is provided', () => {
    gridElem.maxRowHeight = '200px';
    expect(gridElem.getAttribute('max-row-height')).toEqual('200px');
  });

  test('should remove maxRowHeight when a null value is provided', () => {
    gridElem.maxRowHeight = '200px';
    gridElem.maxRowHeight = null;
    expect(gridElem.hasAttribute('max-row-height')).toBeFalsy();
  });

  test('should return the correct value when maxRowHeight get function is called', () => {
    gridElem.maxRowHeight = '200px';
    expect(gridElem.maxRowHeight).toEqual('200px');
  });

  describe('should correctly set the gap attribute', () => {
    test('setting valid gap value', () => {
      gridElem.gap = 'md';
      expect(gridElem.getAttribute('gap')).toBe('md');
    });

    test('setting null gap value', () => {
      gridElem.gap = null;
      expect(gridElem.getAttribute('gap')).toBe(null);
    });

    test('setting invalid gap value', () => {
      gridElem.gap = 'xxl';
      expect(gridElem.getAttribute('gap')).toBe(null);
    });

    test('getting gap value', () => {
      gridElem.setAttribute('gap', 'sm');
      expect(gridElem.gap).toBe('sm');
    });
  });

  test('should set margin attribute', () => {
    gridElem.margin = 'md';
    expect(gridElem.getAttribute('margin')).toBe('md');
  });

  test('should remove margin attribute when value is null', () => {
    gridElem.margin = null;
    expect(gridElem.getAttribute('margin')).toBeNull();
  });

  test('should remove margin attribute when value is not one of the allowed values', () => {
    gridElem.margin = 'invalid-value';
    expect(gridElem.getAttribute('margin')).toBeNull();
  });

  test('should set padding attribute', () => {
    gridElem.padding = 'md';
    expect(gridElem.getAttribute('padding')).toBe('md');
  });

  test('should remove padding attribute when value is null', () => {
    gridElem.padding = null;
    expect(gridElem.getAttribute('padding')).toBeNull();
  });

  test('should remove padding attribute when value is not one of the allowed values', () => {
    gridElem.padding = 'invalid-value';
    expect(gridElem.getAttribute('padding')).toBeNull();
  });

  test('should set grid align items', () => {
    const attrName = 'align-items';
    const defaultVal = null;
    const check = (applyVal: string, checkVal: string | null) => {
      gridElem.alignItems = applyVal;
      expect(gridElem.alignItems).toEqual(checkVal);
      expect(gridElem.getAttribute(attrName)).toEqual(checkVal);
    };

    expect(gridElem.alignItems).toEqual(defaultVal);
    expect(gridElem.getAttribute(attrName)).toEqual(defaultVal);
    ALIGN_ITEMS.forEach((val) => check(val, val));
    check('test', defaultVal);
  });

  describe('should correctly set the flow attribute', () => {
    test('setting valid flow-xs value', () => {
      gridElem.flowXs = 'row';
      expect(gridElem.getAttribute('flow-xs')).toBe('row');
    });
    test('setting valid flow-sm value', () => {
      gridElem.flowSm = 'column';
      expect(gridElem.getAttribute('flow-sm')).toBe('column');
    });
    test('setting valid flow-md value', () => {
      gridElem.flowMd = 'row';
      expect(gridElem.getAttribute('flow-md')).toBe('row');
    });
    test('setting valid flow-lg value', () => {
      gridElem.flowLg = 'row';
      expect(gridElem.getAttribute('flow-lg')).toBe('row');
    });
    test('setting valid flow-xl value', () => {
      gridElem.flowXl = 'row';
      expect(gridElem.getAttribute('flow-xl')).toBe('row');
    });
    test('setting valid flow-xxl value', () => {
      gridElem.flowXxl = 'row';
      expect(gridElem.getAttribute('flow-xxl')).toBe('row');
    });
  });
});
