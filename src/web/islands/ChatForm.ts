import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

@customElement('chat-form')
export class ChatForm extends LitElement {

  @query('#new-message') private $newMessage: HTMLInputElement;

  @property({type: String, reflect: true, attribute: true}) message: string = '';
  @property({type: String}) roomId: string;

  private async sendNewMessage(e: SubmitEvent) {
    if(this.message === '') {
      e.stopImmediatePropagation();
      return;
    }
    e.preventDefault();
    this.$newMessage.value = '';
  }

  override render() {
    return html`<form @submit=${this.sendNewMessage} class="input-container">
      <div class="input-area">
          <div class="input-wrapper" id="main-input-box">
              <input type="text" class="message-input" id="msg-input" placeholder="Message #nightfox-theme">
              <div class="input-icons">
                  <span>GIF</span>
                  <span>☺</span>
              </div>
          </div>
      </div>
      <!--<div class="input-box">
        <input id="new-message"
          @change=${e => this.message = e.target.value}
          type="text" class="chat-input" placeholder="Message #general">
        <div class="input-icons">
          <button type='submit' @click=${this.sendNewMessage}>🚀</button>
          <span>🤯</span>
          <span>💀</span>
        </div>
      </div>-->
    </form>`;
  }
  static styles = css`
    /* --- Input Area --- */
    .input-area {
        padding: 20px 25px 30px 25px;
        background-color: var(--theme-bg);
        flex-shrink: 0;
        /* SEPARATOR LINE REQUESTED */
        border-top: 1px solid var(--theme-border);
    }

    .input-wrapper {
        position: relative;
        background-color: var(--theme-surface); /* Darker block */
        border-radius: 8px;
        padding: 0 15px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }

    .message-input {
        width: 100%;
        background: transparent;
        border: none;
        padding: 15px 0;
        color: var(--theme-text-header);
        font-family: var(--font-content);
        font-size: 1rem;
        outline: none;
    }

    .message-input::placeholder {
        color: var(--theme-text-muted);
    }

    /* Input Interactions */
    .input-wrapper:hover {
        border-color: rgba(209, 105, 131, 0.5); /* Pinkish alpha */
        box-shadow: 0 0 10px rgba(209, 105, 131, 0.1);
    }

    .input-wrapper:focus-within {
        border-color: var(--accent-cyan);
        box-shadow: 0 0 15px rgba(99, 205, 207, 0.2);
        background-color: var(--theme-surface-hover);
    }

    @keyframes urgentPulse {
        0% { box-shadow: 0 0 0 rgba(0,0,0,0); border-color: transparent; }
        50% { box-shadow: 0 0 15px var(--accent-pink); border-color: var(--accent-pink); }
        100% { box-shadow: 0 0 0 rgba(0,0,0,0); border-color: transparent; }
    }

    .input-wrapper.pulse-active {
        animation: urgentPulse 2s infinite;
    }

    .input-icons {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        gap: 15px;
        color: var(--theme-text-muted);
        cursor: pointer;
    }

    .input-icons span:hover {
        color: var(--accent-yellow);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-form': ChatForm;
  }
}
