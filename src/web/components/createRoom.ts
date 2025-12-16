import { LitElement, css, html, adoptStyles, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('create-room')
export class CreateRoom extends LitElement {
  @state() roomName: string = "";
  get chatURL()  {
    return `/chat/${this.roomName}`
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if(window?.htmx) {
      window.htmx.process(this.renderRoot);
    }
  }

  handleChange(e){
    console.log(e.target.value)
    this.roomName = e.currentTarget.value
  }

  render() {
    return html`
      <form hx-post="/create-room" hx-swap="innerHTML" hx-target="body" hx-replace-url=${this.chatURL}>
        <input type="text" name="roomId" @change=${this.handleChange} .value=${this.roomName} placeholder="Enter a room name">
      </form>
    `
  }
  connectedCallback(): void {
      super.connectedCallback();

  }
}

declare global {
  interface HTMLElementTagNameMap {
    'create-room': CreateRoom
  }
  interface Window {
    htmx: {
      process: (arg: HTMLElement | DocumentFragment) => void
    }
  }
}
