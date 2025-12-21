
import { isServer, type ReactiveControllerHost} from "lit";
import {Task} from '@lit/task';
import { HTTPMethod } from "elysia";

type HTTPVerb = 'get' | 'post' | 'put' | 'patch';
type ActionReturnType = 'JSON' | 'HTML';

type ActionOptions = {
  httpVerb?: HTTPVerb,
  returnType?: ActionReturnType
}
type ActionDecorator = (options?: ActionOptions) => PropertyDecorator;
type ActionEndpoint = {
  httpVerb: HTTPVerb,
  componentName: string,
  actionName: string,
  returnType: ActionReturnType
  res: (ctx?: any) => Promise<any>
};
export type ActionResult<T extends Object,K> = (args?: T) => Promise<K>;

export const actionEndpoints: ActionEndpoint[] = [];

export const action: ActionDecorator = ({ httpVerb = 'get', returnType = 'JSON'} = {}) => 
  (proto: Object, actionName: PropertyKey, descriptor?: PropertyDescriptor) => {
    actionName = actionName.toString();
    const privateKey = `#${actionName}`;
    const componentName = proto.constructor.name;

    //@ts-ignore
    proto[privateKey] = proto[actionName];

    if(isServer) 
      createActionEndpoint(httpVerb as HTTPVerb, componentName, actionName, returnType as ActionReturnType);

    Object.defineProperty(proto, actionName, {
      get: () => async (args) => {
        const query = parseArgs(args ?? {});
        const response = await fetch(`/servercomponents/${componentName}/${actionName.toLowerCase()}${query}`, {
          method: httpVerb
        });
        switch(returnType) {
          default    : 
          case 'HTML': return response.text();
          case 'JSON': return response.json();
        }
      }
    } as { get: () => ActionResult<never> })
  }

function parseArgs(args: {[key:string]:any}) {
  const url = new URL('http://a.com');
  Object.entries(args).forEach(([k,v]) => url.searchParams.set(k,v));
  return url.search; 
}

function createActionEndpoint(
  httpVerb: HTTPVerb, 
  componentName: string, 
  actionName: string,
  returnType: ActionReturnType
) {
  actionEndpoints.push({
    httpVerb,
    returnType,
    componentName,
    actionName: actionName.toLowerCase(),
    res: async (ctx) => {
      const mod = await import(`../web/components/${componentName}/${componentName}.server.ts`).catch(e => console.error(e));
      return mod[actionName.toLowerCase()](ctx);
    }
  });
}
