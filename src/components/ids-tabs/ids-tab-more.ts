import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, buildClassAttrib, removeNewLines } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-tab-more-base';
import '../ids-popup-menu/ids-popup-menu';
import '../ids-text/ids-text';

const MORE_ACTIONS_SELECTOR = `[${attributes.MORE_ACTIONS}]`;

/**
 * IDS Tab Component
 * @type {IdsTab}
 * @inherits IdsElement
 * @part container - the tab container itself
 * @mixes IdsEventsMixin
 * @private
 */
@customElement('ids-tab-more')
export default class IdsTabMore extends Base {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.OVERFLOW
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.#attachMoreMenuEvents();

    // Connect the menu items to their Toolbar items after everything is rendered
    requestAnimationFrame(() => {
      this.#configureMenu();
      this.#connectOverflowedItems();
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template(): string {
    const count = 4;
    const cssClassAttr = buildClassAttrib(
      'ids-tab',
      'more',
      this.selected,
      this.orientation
    );
    const selectedAttr = this.selected ? ' font-weight="bold"' : '';

    return `<div id="tab-more" ${cssClassAttr} tabindex="-1" part="container">
      <ids-text overflow="ellipsis" size="22"${selectedAttr}>${count} More</ids-text>
      <ids-popup-menu id="tab-more-menu" target="#tab-more">
        <slot></slot>
      </ids-popup-menu>
    </div>`;
  }

  /**
   * @readonly
   * @returns {HTMLElement} the inner popup menu
   */
  get menu(): any {
    return this.shadowRoot.querySelector('ids-popup-menu');
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of manually-defined menu items
   */
  get predefinedMenuItems(): Array<any> {
    return [...this.querySelectorAll(`:scope > ids-menu-group:not(${MORE_ACTIONS_SELECTOR}) > ids-menu-item`)];
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of menu items that mirror Tabs
   */
  get overflowMenuItems(): Array<any> {
    const moreActionsMenu = this.querySelector(MORE_ACTIONS_SELECTOR);
    if (moreActionsMenu) {
      return [...this.querySelector(MORE_ACTIONS_SELECTOR).children];
    }
    return [];
  }

  /**
   * @readonly
   * @returns {Array<any>} array of IdsTab elements that can be placed in Overflow
   */
  get availableOverflowTabs() {
    return [...this.parentElement.querySelectorAll('ids-tab')];
  }

  /**
   * @private
   * @returns {string} the template for the More Actions Menu Group
   */
  #moreActionsMenuTemplate(): string {
    const childTabs: Array<any> = [...this.parentElement.querySelectorAll('ids-tab')];
    const renderedTabItems = childTabs?.map((i: HTMLElement) => this.#moreActionsItemTemplate(i)).join('') || '';

    // Cycle through toolbar items, if present, and render a menu item that represents them
    return `<ids-menu-group ${attributes.MORE_ACTIONS}>
      ${renderedTabItems}
    </ids-menu-group>`;
  }

  /**
   *
   */
  #moreActionsItemTemplate(item: HTMLElement, isSubmenuItem = false): string {
    let text: any = '';
    let icon = '';
    let hidden = '';
    let disabled = '';
    let submenu = '';
    let overflowed = '';
    let value = '';

    if (!isSubmenuItem) {
      overflowed = this.isOverflowed(item) ? '' : ' hidden';
    }

    // Handles regular tabs
    const handleTab = (thisItem: any) => {
      text = thisItem.textContent;
      if (thisItem.disabled) disabled = ' disabled';
      if (thisItem.value) value = ` value="${thisItem.value}"`;

      const tabIcon = thisItem.querySelector('ids-icon');
      if (tabIcon) {
        icon = ` icon="${tabIcon.icon}"`;
      }
    };

    // Top-level Menus/Submenus are handled by this same method
    const handleSubmenu = (thisItem: any) => {
      const menuProp = isSubmenuItem ? 'submenu' : 'menuEl';

      if (thisItem[menuProp]) {
        const thisSubItems = thisItem[menuProp].items;
        submenu = `<ids-popup-menu slot="submenu">
          ${thisSubItems.map((subItem: any) => this.#moreActionsItemTemplate(subItem, true)).join('') || ''}
        </ids-popup-menu>`;
      }
    };

    // These represent menu items in Dropdown Tabs, which can be hidden.
    const handleMenuItem = (thisItem: any) => {
      if (thisItem.disabled) disabled = ' disabled';
      if (thisItem.icon) icon = ` icon="${thisItem.icon}"`;
      if (thisItem.hidden) hidden = ` hidden`;
      text = thisItem.text;

      if (thisItem.submenu) {
        handleSubmenu(thisItem);
      }
    };

    switch (item.tagName) {
      case 'IDS-TAB-DROPDOWN':
        handleTab(item);
        handleSubmenu(item);
        break;
      case 'IDS-MENU-ITEM':
        handleMenuItem(item);
        break;
      case 'IDS-TAB':
        handleTab(item);
        break;
      default:
        text = item.textContent;
        break;
    }

    // Sanitize text from Toolbar elements to fit menu items
    text = removeNewLines(text)?.trim();

    return `<ids-menu-item${disabled}${icon}${hidden || overflowed}${value}>
      ${text}
      ${submenu}
    </ids-menu-item>`;
  }

  /**
   * Refreshes the visible state of menu items representing "overflowed" elements
   * @returns {void}
   */
  refreshOverflowedItems(): void {
    this.overflowMenuItems.forEach((item) => {
      const doHide = !this.isOverflowed(item.overflowTarget);
      item.hidden = doHide;
      if (doHide) {
        item.overflowTarget.removeAttribute(attributes.OVERFLOWED);
      } else {
        item.overflowTarget.setAttribute(attributes.OVERFLOWED, '');
      }
    });

    this.hidden = !this.hasVisibleActions();
    this.disabled = !this.hasEnabledActions();
  }

  /**
   *
   */
  #connectOverflowedItems() {
    // Render the "More Actions" area if it doesn't exist
    const el = this.querySelector(MORE_ACTIONS_SELECTOR);
    if (!el && this.overflow) {
      this.insertAdjacentHTML('afterbegin', this.#moreActionsMenuTemplate());
    }
    if (el && !this.overflow) {
      el.remove();
    }

    // Connects Overflow Menu subitems with corresponding menu items in the Toolbar
    // (generally by way of IdsMenuButtons or other menu-driven components)
    const handleSubmenu = (thisItem: any, overflowTargetMenu: any) => {
      if (!overflowTargetMenu) return;
      [...thisItem.submenu.children].forEach((item: any, i: number) => {
        item.overflowTarget = overflowTargetMenu.items[i];
        if (item.submenu) {
          handleSubmenu(item, item.overflowTarget.submenu);
        }
      });
    };

    // Connect all "More Action" items generated from Toolbar Elements to their
    // real counterparts in the Toolbar
    const parentTabs = this.availableOverflowTabs;
    this.overflowMenuItems.forEach((item: any, i: number) => {
      item.overflowTarget = parentTabs[i];
      if (item.submenu) {
        handleSubmenu(item, item.overflowTarget.menuEl);
      }
    });
  }

  /**
   * @param {boolean | string} val truthy if this More Actions menu should display overflowed items from the toolbar
   */
  set overflow(val: boolean | string) {
    const newValue = stringToBool(val);
    const currentValue = this.overflow;
    if (newValue !== currentValue) {
      if (newValue) {
        this.setAttribute(attributes.OVERFLOW, '');
      } else {
        this.removeAttribute(attributes.OVERFLOW);
      }
    }
  }

  /**
   * @returns {boolean} true if this More Actions menu will display overflowed items from the toolbar
   */
  get overflow(): boolean {
    return this.hasAttribute(attributes.OVERFLOW);
  }

  /**
   * @returns {boolean} true if there are currently visible actions in this menu
   */
  hasVisibleActions(): boolean {
    return this.querySelectorAll(':scope > ids-menu-group > ids-menu-item:not([hidden])').length > 0;
  }

  /**
   * @returns {boolean} true if there are currently enabled (read: not disabled) actions in this menu
   */
  hasEnabledActions(): boolean {
    return this.querySelectorAll(':scope > ids-menu-group > ids-menu-item:not([disabled])').length > 0;
  }

  /**
   * @param {HTMLElement} item reference to the toolbar item to be checked for overflow
   * @returns {boolean} true if the item is a toolbar member and should be displayed by overflow
   */
  isOverflowed(item: any): boolean {
    if (!this.parentElement.contains(item)) {
      return false;
    }
    if (item.isEqualNode(this)) {
      return false;
    }
    if (item.hidden) {
      return false;
    }

    const itemRect = item.getBoundingClientRect();
    const moreTabRect = this.getBoundingClientRect();

    if (this.locale?.isRTL()) {
      // Beyond left edge
      return itemRect.left < moreTabRect.right;
    }
    // Beyond right edge
    return itemRect.right > moreTabRect.left;
  }

  #configureMenu() {
    this.menu.width = '100%';
    this.menu.popup.align = 'bottom, left';
    this.menu.popup.y = 0;
  }

  #attachMoreMenuEvents(): void {
    this.onEvent('beforeshow', this.menu, (e: any) => {
      // Reflect this event to the host element
      this.triggerEvent('beforeshow', this, {
        bubbles: e.bubbles,
        detail: e.detail
      });

      this.refreshOverflowedItems();
    });

    this.onEvent('click', this, () => {
      if (!this.menu.visible) {
        this.menu.show();
      } else {
        this.menu.hide();
      }
    });
  }
}
