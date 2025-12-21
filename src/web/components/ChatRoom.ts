import { LitElement, html} from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ref, createRef, type Ref } from 'lit/directives/ref.js';
import {repeat} from 'lit/directives/repeat.js';
import type { App, Message } from "~/src";
import { treaty } from "@elysiajs/eden";

const api = treaty<App>("localhost:3000");
let chat;


@customElement('chat-room')
export class ChatRoom extends LitElement {

  @property({type: String}) message: string = '';
  @property({type: String, reflect: true}) roomId: string;

  @state() messages: Array<Message> = [];

  messageRef: Ref<HTMLInputElement> = createRef();

  connectedCallback(): void {
    super.connectedCallback();

    chat = api?.chat.subscribe({query: {roomId: this.roomId}});
    chat.subscribe((message) => {
      this.messages = this.messages.concat([message.data])
    });
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

  render() {
    return html`
    ${this.message}
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
      
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room': ChatRoom
  }
}
