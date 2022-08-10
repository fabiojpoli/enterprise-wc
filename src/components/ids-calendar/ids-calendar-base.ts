import IdsElement from '../../core/ids-element';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsCalendarEventsMixin from '../../mixins/ids-calendar-events-mixin/ids-calendar-events-mixin';

const Base = IdsThemeMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsCalendarEventsMixin(
        IdsElement
      )
    )
  )
);

export default Base;
