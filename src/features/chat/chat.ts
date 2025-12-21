import { context } from '@conf/ctx';
import { Elysia, t, type Static } from 'elysia';
import SERVER_MESSAGES from './serverMessages';

const _Message = {
  user: t.String(),
  message: t.String(),
  roomId: t.String(),
};
const ClientMessage = t.Object(_Message);
const Message = t.Object({
	..._Message,
	sentAt: t.Integer()
})

export type ClientMessage = Static<typeof ClientMessage>
export type Message = Static<typeof Message>

export const chat = new Elysia({name: "@app/chat", prefix:'chat'})
  .use(context)
  .get('/:roomId', ctx => ctx.html`
		<chat-room .roomId=${ctx.params.roomId}>
		</chat-room>
	`)
  .ws('/', {
		query: t.Object({
			roomId: t.String()
		}),
		body: ClientMessage,
		response: Message,
    open(ws) {
			const {roomId} = ws.data.query;
			ws.subscribe(roomId)
			ws.send(withSentTimestamp(SERVER_MESSAGES.WELCOME(roomId)))
    },
    message(ws, message) {
      const {roomId} = ws.data.query;
			ws.send(withSentTimestamp(message))
			ws.publish(roomId, withSentTimestamp(message))
    }
  })

export type ChatApi = typeof chat;

function withSentTimestamp(ReceivedMessage: ClientMessage): Message {
	return {
		...ReceivedMessage,
		sentAt: new Date().getTime()
	}
}