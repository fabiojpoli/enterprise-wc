/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import waitFor from '../helpers/wait-for';
import IdsColorPicker from '../../src/components/ids-color-picker/ids-color-picker';
import '../../src/components/ids-color/ids-color';

describe('Ids Color Picker Component', () => {
  let colorpicker: any;

  const createFromTemplate = (innerHTML: any) => {
    colorpicker?.remove();
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    colorpicker = template.content.childNodes[0];
    document.body.appendChild(colorpicker);
    return colorpicker;
  };

  beforeEach(async () => {
    colorpicker = new IdsColorPicker();
    document.body.appendChild(colorpicker);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    colorpicker = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    colorpicker.remove();
    const elem: any = new IdsColorPicker();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-color-picker').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  it('renders with readonly', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" readonly="true" value="#941E1E" label="Readonly Color Picker"></ids-color-picker>`);
    expect(colorpicker.readonly).toBeTruthy();
  });

  it('renders with disabled', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" disabled="true" value="#941E1E" label="Readonly Color Picker"></ids-color-picker>`);
    expect(colorpicker.disabled).toBeTruthy();
  });

  it('renders with advanced', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" advanced="true" value="#941E1E" label="Readonly Color Picker"></ids-color-picker>`);
    expect(colorpicker.advanced).toBeTruthy();
    colorpicker.advanced = false;
    expect(colorpicker.getAttribute('advanced')).toBeFalsy();
  });

  it('has a value attribute', () => {
    colorpicker.value = '#000000';
    expect(colorpicker.getAttribute('value')).toEqual('#000000');
    colorpicker.value = '';
    expect(colorpicker.getAttribute('value')).toEqual('');
  });

  it('has a disabled attribute', () => {
    colorpicker.disabled = false;
    expect(colorpicker.getAttribute('disabled')).toEqual(null);

    colorpicker.disabled = true;
    expect(colorpicker.getAttribute('disabled')).toEqual('true');
  });

  it('has a readonly attribute', () => {
    colorpicker.readonly = false;
    expect(colorpicker.getAttribute('readonly')).toBeFalsy();

    colorpicker.readonly = true;
    expect(colorpicker.getAttribute('readonly')).toEqual('true');
  });

  it('has a label attribute', () => {
    colorpicker.label = 'Ids Color Picker';
    expect(colorpicker.getAttribute('label')).toEqual('Ids Color Picker');
  });

  it('should close on outside click', () => {
    expect(colorpicker.popup.visible).toEqual(false);
    colorpicker.triggerEvent('click', colorpicker.container);
    waitFor(() => expect(colorpicker.popup.visible).toBeTruthy());
    colorpicker.onOutsideClick();
    waitFor(() => expect(colorpicker.popup.visible).toBeFalsy());
  });

  it('should not close on click outside if no onOutsideClick', () => {
    expect(colorpicker.popup.visible).toEqual(false);
    colorpicker.triggerEvent('click', colorpicker.container);
    waitFor(() => expect(colorpicker.popup.visible).toBeTruthy());
    colorpicker.addOpenEvents();
    colorpicker.onOutsideClick = null;
    colorpicker.triggerEvent('click', document.body);
    waitFor(() => expect(colorpicker.popup.visible).toBeTruthy());
  });

  it('should not open if readnly', () => {
    colorpicker.readonly = true;
    expect(colorpicker.popup.visible).toEqual(false);
    colorpicker.triggerEvent('click', colorpicker.container);
    expect(colorpicker.popup.visible).toEqual(false);
  });

  it('should be able to open with show', () => {
    colorpicker.show();
    expect(colorpicker.popup.visible).toEqual(true);
    expect(colorpicker.swatches).toBeTruthy();
  });

  it('should select on enter', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" readonly="true" value="#941E1E" label="Readonly Color Picker"><ids-color hex="#383838"></ids-color></ids-color-picker>`);
    colorpicker.popup.visible = true;
    (document.querySelector('#color-picker-1 > ids-color[hex="#383838"]') as any).focus();
    const hex: any = document.querySelector('#color-picker-1 > ids-color[hex="#383838"]');

    const enterKeyEvent = new KeyboardEvent('keydown', ({ key: 'Enter', target: hex, bubbles: true } as any));
    hex.dispatchEvent(enterKeyEvent);
    expect(colorpicker.value).toEqual('#383838');
  });

  it('should select on enter when checked', () => {
    colorpicker = createFromTemplate(`<ids-color-picker id="color-picker-1" readonly="true" value="#941E1E" label="Readonly Color Picker"><ids-color hex="#999999" checked="true"></ids-color></ids-color-picker>`);
    colorpicker.popup.visible = true;
    (document.querySelector('#color-picker-1 > ids-color[hex="#999999"]') as any).focus();
    const hex: any = document.querySelector('#color-picker-1 > ids-color[hex="#999999"]');

    const enterKeyEvent = new KeyboardEvent('keydown', ({ key: 'Enter', target: hex, bubbles: true } as any));
    hex.dispatchEvent(enterKeyEvent);
    expect(colorpicker.value).toEqual('#999999');
  });
});