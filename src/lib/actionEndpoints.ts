import { actionEndpoints, SERVER_ACTIONS_PREFIX } from "./action";
import { Elysia } from 'elysia';


const serverActions = new Elysia({name: '@app/serverActions', prefix: SERVER_ACTIONS_PREFIX});
actionEndpoints.forEach((route) => {
  //@ts-ignore
  serverActions[route.httpVerb](
    `/${route.componentName}/${route.actionName}`,
    async (ctx: any) => { 
      switch(route.returnType) {
        default:
        case 'HTML': return await route.res(ctx);
        case 'JSON': return new Response(JSON.stringify(await route.res(ctx)));
      }
    }
  )
})

export default serverActions;