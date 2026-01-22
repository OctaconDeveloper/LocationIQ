import { LocationIQSDK, AutocompleteResult } from '../index';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    font-family: var(--liq-font-family, system-ui, -apple-system, sans-serif);
    position: relative;
    width: 100%;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  input {
    width: 100%;
    padding: var(--liq-input-padding, 12px 16px);
    font-size: var(--liq-font-size, 16px);
    border: var(--liq-border, 1px solid #ddd);
    border-radius: var(--liq-border-radius, 8px);
    background: var(--liq-bg, #fff);
    color: var(--liq-text-color, #333);
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;
  }

  input:focus {
    border-color: var(--liq-primary-color, #6366f1);
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--liq-bg, #fff);
    border: var(--liq-border, 1px solid #ddd);
    border-top: none;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
  }

  .dropdown.open {
    display: block;
  }

  .item {
    padding: 10px 16px;
    cursor: pointer;
    transition: background 0.1s;
  }

  .item:hover {
    background: var(--liq-hover-bg, #f3f4f6);
  }

  .name {
    font-weight: 600;
    font-size: 0.9em;
  }

  .address {
    font-size: 0.8em;
    color: #666;
  }

  .loader {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border: 2px solid #ddd;
    border-top-color: var(--liq-primary-color, #6366f1);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: none;
  }

  .loading .loader {
    display: block;
  }

  @keyframes spin {
    to { transform: translateY(-50%) rotate(360deg); }
  }
</style>
<div class="input-wrapper">
  <input type="text" placeholder="Search for a location...">
  <div class="loader"></div>
  <div class="dropdown"></div>
</div>
`;

export class LocationAutocomplete extends HTMLElement {
    private sdk?: LocationIQSDK;
    private input?: HTMLInputElement;
    private dropdown?: HTMLDivElement;
    private wrapper?: HTMLDivElement;
    private debounceTimer?: any;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['placeholder', 'token'];
    }

    connectedCallback() {
        this.input = this.shadowRoot!.querySelector('input')!;
        this.dropdown = this.shadowRoot!.querySelector('.dropdown')!;
        this.wrapper = this.shadowRoot!.querySelector('.input-wrapper')!;

        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('blur', () => {
            // Small delay to allow click event to fire on dropdown item
            setTimeout(() => this.dropdown?.classList.remove('open'), 200);
        });

        const token = this.getAttribute('token');
        if (token) {
            this.sdk = new LocationIQSDK(token);
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'placeholder' && this.input) {
            this.input.placeholder = newValue;
        }
        if (name === 'token' && newValue) {
            this.sdk = new LocationIQSDK(newValue);
        }
    }

    /**
     * Externally set the SDK instance if already initialized
     */
    setSDK(sdk: LocationIQSDK) {
        this.sdk = sdk;
    }

    private handleInput(e: Event) {
        const value = (e.target as HTMLInputElement).value;

        if (this.debounceTimer) clearTimeout(this.debounceTimer);

        if (value.length < 3) {
            this.dropdown?.classList.remove('open');
            return;
        }

        this.debounceTimer = setTimeout(async () => {
            if (!this.sdk) return;

            this.wrapper?.classList.add('loading');
            try {
                const results = await this.sdk.autocomplete(value);
                this.renderResults(results);
            } catch (err) {
                console.error('Autocomplete failed:', err);
            } finally {
                this.wrapper?.classList.remove('loading');
            }
        }, 300);
    }

    private renderResults(results: AutocompleteResult[]) {
        if (!this.dropdown) return;

        if (results.length === 0) {
            this.dropdown.classList.remove('open');
            return;
        }

        this.dropdown.innerHTML = '';
        results.forEach(res => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
        <div class="name">${res.display_place}</div>
        <div class="address">${res.display_address}</div>
      `;
            item.addEventListener('click', () => {
                this.selectItem(res);
            });
            this.dropdown?.appendChild(item);
        });

        this.dropdown.classList.add('open');
    }

    private selectItem(result: AutocompleteResult) {
        if (this.input) {
            this.input.value = result.display_name;
        }
        this.dropdown?.classList.remove('open');

        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('location-select', {
            detail: result,
            bubbles: true,
            composed: true
        }));
    }
}
