import { LitElement, html, css} from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { ref, createRef, type Ref } from 'lit/directives/ref.js';
import {repeat} from 'lit/directives/repeat.js';
import type { ChatApi, Message, ClientMessage } from "@/features/chat/chat";
import { treaty } from "@elysiajs/eden";

const api = treaty<ChatApi>("localhost:3000");
let chat;

const timeFormat = new Intl.DateTimeFormat('fr-FR', {
  hour: 'numeric', minute: 'numeric', second: 'numeric',
});

@customElement('chat-room')
export class ChatRoom extends LitElement {

  @query('#chat-scrollable') chatScrollable: HTMLElement;

  @property({type: String}) message: string = '';
  @property({type: String, reflect: true, }) roomId: string;

  @state() messages: Array<Message> = [];

  messageRef: Ref<HTMLInputElement> = createRef();

  connectedCallback(): void {
    super.connectedCallback();

    chat = api?.chat.subscribe({query: {roomId: this.roomId}});
    chat.subscribe((message) => {
      this.messages = this.messages.concat([message.data])
          
    });

    const config = { attributes: true, childList: true, subtree: true };

    const callback: MutationCallback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if(mutation.type !== 'childList') return;
        if(mutation.addedNodes[0].nodeType !== Node.COMMENT_NODE) {
          this.chatScrollable.scrollTo({
            top: this.chatScrollable.scrollHeight,
            behavior: 'smooth'
          })
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(this.chatScrollable, config);

  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    chat!.close();
  }

  private async newMessage(e: SubmitEvent) {
    e.preventDefault();
    chat!.send({
      user: 'me',
      message: this.message,
      roomId: this.roomId
    })
    this.message = '';
    this.messageRef.value!.value = '';
  }

  timeFormatOf(value: number) {
    return timeFormat.format(value);
  }

    firstUpdated() {
      this.messageRef.value!.focus();
    }

  static styles = css`
  /* --- MAIN CHAT AREA --- */
  :host {
    display: contents;
  }
        .chat-area {
            flex: 1;
            background-color: var(--bg-dark-3);
            display: flex;
            flex-direction: column;
            min-width: 0; /* Prevents flex overflow */
        }

        .chat-header {
            height: 48px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            box-shadow: 0 1px 0 rgba(4,4,5,0.2);
            color: var(--text-header);
            font-weight: bold;
        }
        .chat-header span {
            color: var(--text-muted);
            margin-right: 8px;
            font-size: 20px;
            font-weight: 400;
        }

        .messages-wrapper {
            flex: 1;
            overflow-y: auto;
            padding: 20px 0;
            display: flex;
            flex-direction: column;
        }

        /* Message Row */
        .message-row {
            display: flex;
            padding: 6px 16px; /* No bubbles, just padding */
            margin-top: 10px;
            position: relative;
        }

        .message-row:hover {
            background-color: rgba(4, 4, 5, 0.07);
        }

        .msg-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 16px;
            flex-shrink: 0;
            background-size: cover;
            background-color: #555;
            cursor: pointer;
        }

        .msg-content {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .msg-header {
            display: flex;
            align-items: baseline;
            margin-bottom: 4px;
        }

        .username {
            font-size: 16px;
            font-weight: 500;
            margin-right: 8px;
            cursor: pointer;
        }

        .username:hover { text-decoration: underline; }

        .timestamp {
            font-size: 12px;
            color: var(--text-muted);
        }

        .msg-text {
            font-size: 15px;
            line-height: 1.375rem;
            color: var(--text-normal);
            white-space: pre-wrap;
        }

        /* Specific Role Colors from your palette */
        .role-admin { color: var(--c-pink); }
        .role-mod { color: var(--c-purple); }
        .role-user { color: var(--c-bright-blue); }

        /* Mention Highlight */
        .mention {
            background-color: rgba(21, 93, 252, 0.1); /* Bright Blue low opacity */
            color: #AAB9FF;
            border-radius: 3px;
            padding: 0 2px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.1s;
        }
        .mention:hover {
            background-color: rgba(21, 93, 252, 0.3);
            color: white;
        }

        /* Full Message Highlight (e.g. when mentioned) */
        .message-row.mentioned {
            background-color: rgba(251, 100, 182, 0.1); /* Pink tint */
            border-left: 2px solid var(--c-pink);
            padding-left: 14px; /* Adjust for border */
        }

        /* New Message Divider */
        .divider {
            margin: 20px 16px;
            border-top: 1px solid var(--c-pink);
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .divider span {
            background-color: var(--bg-dark-3);
            color: var(--text-muted);
            font-size: 12px;
            padding: 0 10px;
            font-weight: 700;
            color: var(--c-pink);
            position: absolute;
            top: -9px;
        }

        /* --- INPUT AREA --- */
        .input-container {
            padding: 0 16px 24px 16px;
            background-color: var(--bg-dark-3);
        }

        .input-box {
            background-color: var(--bg-dark-4);
            border-radius: 8px;
            padding: 12px 16px;
            display: flex;
            align-items: center;
        }

        .plus-icon {
            color: var(--text-muted);
            margin-right: 16px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--text-muted);
            color: var(--bg-dark-4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
        }
        .plus-icon:hover { color: var(--text-header); }

        .chat-input {
            background: transparent;
            border: none;
            color: var(--text-normal);
            flex: 1;
            outline: none;
            font-size: 15px;
        }

        /* Icons on right of input */
        .input-icons {
            display: flex;
            gap: 12px;
            color: var(--text-muted);
            font-size: 20px;
        }
        .input-icons span { cursor: pointer; }
        .input-icons span:hover { color: var(--text-header); }
  `

  render() {
    return html`
      <main class="chat-area">
        <div class="chat-header">
            <span>#</span> ${this.roomId}
        </div>

        <div class="messages-wrapper" id="chat-scrollable">
          ${repeat(this.messages,item => item.message, item => html`
            <div class="message-row">
              <div class="msg-avatar" style="background-color: orange;"></div>
              <div class="msg-content">
                <div class="msg-header">
                  <span class="username role-admin">${item.user}</span>
                  <span class="timestamp">Today at ${this.timeFormatOf(item?.sentAt)}</span>
                </div>
                <div class="msg-text">${item.message}</div>
              </div>
            </div>
          `)}
        </div>

        <form @submit=${this.newMessage} class="input-container">
          <div class="input-box">
            <input 
              ${ref(this.messageRef)} 
              @change=${e => this.message = e.target.value}
              type="text" class="chat-input" placeholder="Message #general">
            <div class="input-icons">
              <button type='submit' @click=${this.newMessage}>🚀</button>
              <span>🤯</span>
              <span>💀</span>
            </div>
          </div>
        </form>
    </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room': ChatRoom
  }
}

/**
 * 
      <ul id="messages">
      ${repeat(this.messages,item => item.message, item => html`
        <li>${item.user} said : ${item.message}</li>
      `)}
      </ul>
      <form @submit=${this.newMessage}>
        <input 
          ${ref(this.messageRef)} 
          type="text" 
          @change=${e => this.message = e.target.value}>
        <button type='submit' @click=${this.newMessage}>send</button>
      </form>
 */
