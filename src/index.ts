import build from '~/macros/build' assert { type: 'macro' };
import '@web/registerComponents';
import { Elysia, t } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { context } from '@conf/ctx';
import serverActions from './lib/actionEndpoints'
import { chat } from '@features/chat/chat';

import {ConvexClient} from "convex/browser";
import {api} from "../convex/_generated/api.js";

await build()

const client = new ConvexClient(process.env["CONVEX_URL"]);

const unsubscribe = client.onUpdate(api.tasks.get, {}, async (tasks) => {
  console.log(tasks);
});

await Bun.sleep(1000);
unsubscribe();
await client.close();

const app = new Elysia()
	.use(staticPlugin())
	.use(context)
	.use(chat)
	.use(serverActions)
	.get('/', (ctx) => {
		return ctx.html`
		  <signin-form></signin-form>
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
	.listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
