import build from '~/macros/build' assert { type: 'macro' }
import { Elysia, t, type Static } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { context } from './ctx'
import '@/web/registerComponents'
import serverActions from './lib/actionEndpoints'

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

await build()

const app = new Elysia()
	.use(staticPlugin())
	.use(serverActions)
	.use(context)
	.get('/', (ctx) => {
		return ctx.html`
			<h1>hello world oui je fais</h1>
			<create-room></create-room>
		`
	})
	.post('/create-room', ctx => {
		const {roomId} = ctx.body
		return ctx.redirect(`/chat/${roomId}`)
	}, {
		body: t.Object({
			roomId: t.String()
		})
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