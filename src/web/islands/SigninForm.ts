import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
//https://developers.google.com/identity/gsi/web/reference/js-reference?hl=fr

@customElement('signin-form')
export class SigninForm extends LitElement {
  @query('#social-google')
  socialGoogle: HTMLButtonElement;
  @property({type:Object})
  auth2: object;

  connectedCallback()  {
    super.connectedCallback();
    window.onGoogleLibraryLoad = () => {
      this.setupGoogleAuth();
    };
    // const initGoogle = () => {
    //   if (globalThis.google)
    //     this.setupGoogleAuth();
    //    else
    //     setTimeout(initGoogle, 100);
    // };
    // initGoogle();
  }

  setupGoogleAuth() {
   globalThis.google.accounts.id.initialize({
      client_id: "936754708086-4motrn01ufkc2fh5c90hkavvlobj9b71.apps.googleusercontent.com",
      callback: this.handleCredentialResponse.bind(this), // Callback for the JWT token
      auto_select: true,
      cancel_on_tap_outside: true,
      color_scheme: "dark"
    });
   globalThis.google.accounts.id.renderButton(
        this.socialGoogle,
        { theme: "outline", size: "large", shape:"pill"}  // customization attributes
      );

      // Optional: Display the One Tap prompt
      globalThis.google.accounts.id.prompt();
  }
  handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // You would typically send this token to your backend for verification
  }
  override render() {
    return html`
      <div id="social-google"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'signin-form': SigninForm;
  }
}
