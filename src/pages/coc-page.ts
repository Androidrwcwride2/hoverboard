import { customElement, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import '../components/hero-block';
import '../components/markdown/remote-markdown';
import '../elements/footer-block';
import '../elements/polymer-helmet';

@customElement('coc-page')
export class CocPage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <polymer-helmet
        title="{$ heroSettings.coc.title $} | {$ title $}"
        description="{$ heroSettings.coc.metaDescription $}"
      ></polymer-helmet>

      <hero-block
        background-image="{$ heroSettings.coc.background.image $}"
        background-color="{$ heroSettings.coc.background.color $}"
        font-color="{$ heroSettings.coc.fontColor $}"
      >
        <div class="hero-title">{$ heroSettings.coc.title $}</div>
        <p class="hero-description">{$ heroSettings.coc.description $}</p>
      </hero-block>

      <remote-markdown toc path="[[source]]"></remote-markdown>

      <footer-block></footer-block>
    `;
  }

  @property({ type: String })
  source = '{$ coc $}';
}
