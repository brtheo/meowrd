import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { action, type ActionResult } from '@/lib/action';
import type { CreateActionParams } from './CreateRoom.server';

@customElement('create-room')
export class CreateRoom extends LitElement {

  @state() roomName: string = "";

  @action({returnType: 'HTML'})
  create: ActionResult<CreateActionParams, string>;
  
  get chatURL()  { return `/chat/${this.roomName}` }
  get pageDetail() { return `chatRoom#${this.roomName}` }

  async roomCreation(e: SubmitEvent) {
    e.preventDefault()
    await this.create({roomName: this.roomName});
    location.assign(this.chatURL)
  }

  render() {
    return html`
      <form @submit=${this.roomCreation}>
        <input 
          type="text" 
          @change=${({currentTarget: {value}}: InputEvent) => this.roomName = value} 
          .value=${this.roomName} 
          placeholder="Enter a room name" />
          <button type="submit">test</button>
      </form>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'create-room': CreateRoom
  }
}
