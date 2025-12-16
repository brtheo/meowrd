import build from '~/macros/build' assert { type: 'macro' }
import { Elysia, t, type Static } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
// import { SWCRouter } from '~/lib/lit-server-components'
import { html } from 'lit'
import { map } from 'lit/directives/map.js'
import { context } from './ctx'

const MessagePayload = t.Object({
  user: t.String(),
  message: t.String(),
});

// Define the outgoing message structure (for type safety on the client)
const RoomMessage = t.Object({
  user: t.String(),
  message: t.String(),
  roomId: t.String(),
});
export type Message = Static<typeof RoomMessage>
import '@/web/registerComponents'

await build()



const app = new Elysia()
	.use(staticPlugin())
	.use(context)
	// .use(context)
	.get('/', (ctx) => {
		return ctx.html`
			<h1>hello world oui je fais</h1>
			<create-room></create-room>
		`
	})
	.post('/create-room', ctx => {
		const {roomName} = ctx.body
		console.log(ctx)
		return ctx.redirect(`/chat/${roomName}`)
	})
	.get('/chat/:roomId', ctx => ctx.html`
		<chat-room .roomId=${ctx.params.roomId}>
		</chat-room>
		
	`)
  .ws('/chat', {
		query: t.Object({
			roomId: t.String()
		}),
		body: RoomMessage,
		response: RoomMessage,
    open(ws) {
			const {roomId} = ws.data.query;
			ws.subscribe(roomId)
			ws.send({
				user:'ADMIN',
				message: 'hello world',
				roomId
			})
    },
    message(ws, message) {
      const {roomId} = ws.data.query;
			console.log(message, roomId)
			ws.send(message)
			ws.publish(roomId, message)
    }
  })
	.listen(3000)

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)