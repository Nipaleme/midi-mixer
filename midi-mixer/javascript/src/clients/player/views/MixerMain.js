import { LitElement, html, css } from 'lit';
import JSON5 from 'json5';

import '@ircam/sc-components/sc-text.js';
import '@ircam/sc-components/sc-select.js';
import '@ircam/sc-components/sc-editor.js';
import '@ircam/sc-components/sc-file-tree.js';

class MixerMain extends LitElement {
  static styles = css`
    :host {
      display: flex;
    }

    :host > div {
      width: 50%;
    }

    .midi-select h1 {
      margin: 4px 0 74px 0;
    }

    .midi-select > div {
      margin-bottom: 4px;
    }

    .config {
      display: flex;
    }

    sc-editor {
      width: calc(100% - 200px);
    }

    sc-file-tree {
      /* cannot do that for now, needs update */
      /* width: 200px; */
    }
  `;

  constructor() {
    super();

    this.globals = null;
    this.filesystem = null;
    this.midi = null;
  }

  render() {
    super.render();

    return html`
      <div class="midi-select">
        <h1>Midi Mixer</h1>
        <div>
          <sc-text readonly>midi input device</sc-text>
          <sc-select
            value=${this.midi.get('midiInName')}
            .options=${this.midi.get('selectMidiIn')}
            @change=${e => this.midi.set({midiInName: e.target.value}, { source:'web' })}
          ></sc-select>
        </div>
        <div>
          <sc-text readonly>midi output device</sc-text>
          <sc-select
            value=${this.midi.get('midiOutName')}
            .options=${this.midi.get('selectMidiOut')}
            @change=${e => this.midi.set({midiOutName: e.target.value}, { source:'web' })}
          ></sc-select>
        </div>
        <div>
          <sc-text readonly>controller</sc-text>
          <sc-select
            value=${this.globals.get('controllerName')}
            .options=${this.globals.get('selectControllers')}
            @change=${e => this.globals.set({controllerName: e.target.value}, { source: 'web' })}
          ></sc-select>
        </div>
      </div>
      <div class="config">
        <sc-editor
          .value="${JSON5.stringify(this.globals.get('config'), null, 2)}"
          @change=${e => this.filesystem.writeFile(this.globals.get('configFilename').name, e.detail.value)}
        ></sc-editor>
        <sc-file-tree
          width="200"
          .value="${this.filesystem.getTree()}"
          @input=${e => this.globals.set({ configFilename: e.detail.value })}
        ></sc-file-tree>
      </div>
    `
  }

  connectedCallback() {
    super.connectedCallback();

    this.globals.onUpdate(() => this.requestUpdate());
  }
}

customElements.define('mixer-main', MixerMain);
