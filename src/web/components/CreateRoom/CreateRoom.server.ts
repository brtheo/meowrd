export type CreateActionParams = {roomName: String}
export const create = (ctx) => {
  const {query}: {query: CreateActionParams} = ctx;
  return ctx.fragment`
    <chat-room .roomId=${query.roomName}>
		</chat-room>
  `
}