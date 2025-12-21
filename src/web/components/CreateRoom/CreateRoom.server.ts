
export type CreateActionParams = {roomName: String}
export const create = (ctx) => {
  const {query}: {query: CreateActionParams} = ctx;
  console.log(Bun.randomUUIDv7())
  return ctx.fragment`
    <chat-room .roomId=${query.roomName}>
		</chat-room>
  `
}