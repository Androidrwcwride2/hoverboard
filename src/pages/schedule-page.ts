import { Initialized, Pending, Success } from '@abraham/remotedata';
import { computed, customElement, observe, property } from '@polymer/decorators';
import '@polymer/paper-progress';
import { html, PolymerElement } from '@polymer/polymer';
import { RouterLocation } from '@vaadin/router';
import '../elements/content-loader';
import '../elements/filter-menu';
import '../elements/header-bottom-toolbar';
import '../elements/shared-styles';
import '../elements/sticky-element';
import { ReduxMixin } from '../mixins/redux-mixin';
import { SessionsMixin } from '../mixins/sessions-mixin';
import { SpeakersMixin } from '../mixins/speakers-mixin';
import { Filter } from '../models/filter';
import { FilterGroup } from '../models/filter-group';
import { RootState, store } from '../store';
import { selectFilters } from '../store/filters/selectors';
import { fetchSchedule } from '../store/schedule/actions';
import { initialScheduleState } from '../store/schedule/state';
import { selectFilterGroups } from '../store/sessions/selectors';
import { SessionsState } from '../store/sessions/state';
import { SpeakersState } from '../store/speakers/state';
import { updateMetadata } from '../utils/metadata';

@customElement('schedule-page')
export class SchedulePage extends SessionsMixin(SpeakersMixin(ReduxMixin(PolymerElement))) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: block;
          height: 100%;
        }

        .container {
          min-height: 80%;
        }

        paper-progress {
          width: 100%;
          --paper-progress-active-color: var(--default-primary-color);
          --paper-progress-secondary-color: var(--default-primary-color);
        }

        @media (max-width: 640px) {
          .container {
            padding: 0 0 32px;
          }
        }

        @media (min-width: 640px) {
          :host {
            background-color: #fff;
          }
        }
      </style>

      <hero-block
        background-image="{$ heroSettings.schedule.background.image $}"
        background-color="{$ heroSettings.schedule.background.color $}"
        font-color="{$ heroSettings.schedule.fontColor $}"
      >
        <div class="hero-title">{$ heroSettings.schedule.title $}</div>
        <p class="hero-description">{$ heroSettings.schedule.description $}</p>
        <sticky-element slot="bottom">
          <header-bottom-toolbar location="[[location]]"></header-bottom-toolbar>
        </sticky-element>
      </hero-block>

      <paper-progress indeterminate hidden$="[[!pending]]"></paper-progress>

      <filter-menu
        filter-groups="[[filterGroups]]"
        selected-filters="[[selectedFilters]]"
      ></filter-menu>

      <div class="container">
        <content-loader
          card-padding="15px"
          card-margin="16px 0"
          card-height="140px"
          avatar-size="0"
          avatar-circle="0"
          title-top-position="20px"
          title-height="42px"
          title-width="70%"
          load-from="-20%"
          load-to="80%"
          blur-width="300px"
          items-count="{$ contentLoaders.schedule.itemsCount $}"
          hidden$="[[!pending]]"
          layout
        >
        </content-loader>

        <slot></slot>
      </div>

      <footer-block></footer-block>
    `;
  }

  @property({ type: Object })
  schedule = initialScheduleState;

  @property({ type: Array })
  private filterGroups: FilterGroup[] = [];
  @property({ type: Array })
  private selectedFilters: Filter[] = [];
  @property({ type: Object })
  private location: RouterLocation | undefined;

  override connectedCallback() {
    super.connectedCallback();
    updateMetadata(
      '{$ heroSettings.schedule.title $} | {$ title $}',
      '{$ heroSettings.schedule.metaDescription $}'
    );
  }

  override stateChanged(state: RootState) {
    super.stateChanged(state);
    this.schedule = state.schedule;
    this.filterGroups = selectFilterGroups(state);
    this.selectedFilters = selectFilters(state);
  }

  onAfterEnter(location: RouterLocation) {
    this.location = location;
  }

  @observe('sessions', 'speakers')
  private onSessionsAndSpeakersChanged(sessions: SessionsState, speakers: SpeakersState) {
    if (
      this.schedule instanceof Initialized &&
      sessions instanceof Success &&
      speakers instanceof Success
    ) {
      store.dispatch(fetchSchedule);
    }
  }

  @computed('schedule')
  get pending() {
    return this.schedule instanceof Pending;
  }
}
