import { LitElement, css, html, adoptStyles, type PropertyValues } from 'lit'
import { customElement, query, property, state } from 'lit/decorators.js'
import {repeat} from 'lit/directives/repeat.js';
import type { App, Message } from "~/src";
import { treaty } from "@elysiajs/eden";

@customElement('chat-room')
export class ChatRoom extends LitElement {

  @property({type: String}) message: string = '';
  @property({type: String, reflect: true}) roomId: string;
  chat: any

  @state() messages: Array<Message> = [];

  connectedCallback(): void {
    super.connectedCallback()
    const api = treaty<App>("localhost:3000");
    this.chat = api?.chat.subscribe({query: {roomId: this.roomId}});
    console.log(this.roomId)

    this.chat.subscribe((message) => {
      console.log(message.data)
      this.messages = this.messages.concat([message.data])
    });
    this.chat.on('message',e => {
      console.log(e,'hello')
    })

  }

  newMessage(e) {
    return this.chat.send({
      user: 'me',
      message: this.message,
      roomId: this.roomId
    })
  }

  render() {
    return html`
      <ul id="messages">
      ${repeat(this.messages,item => item.message, item => html`
        <li>${item.user} said : ${item.message}</li>
      `)}
      </ul>
      <input type="text" @change=${e => this.message = e.target.value}>
      <button @click=${this.newMessage}>send</button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-room': ChatRoom
  }
  interface Window {
    htmx: {
      process: (arg: HTMLElement | DocumentFragment) => void
    }
  }
}
