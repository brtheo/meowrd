import Elysia from 'elysia';
import { collectResult } from '@lit-labs/ssr/lib/render-result';
import { render } from '@lit-labs/ssr';
import { HTMLTemplateResult, html } from 'lit';
import Layout from '@/layout';

// const db = new Database('database.sqlite')
// db.exec("CREATE TABLE IF NOT EXISTS counter('count' INT);")


const lithtml = async (strings: TemplateStringsArray, ...values: unknown[]) => {
	return new Response(
		await collectResult(
			render(
				Layout(
					html(strings, ...values)
				)
			)
		), 
		{
			headers: {
				'Content-Type': 'text/html',
			}
		}
	)
}
const fragment = async (strings: TemplateStringsArray, ...values: unknown[]) => {
	return new Response(
		await collectResult(
			render(
				html(strings, ...values)
			)
		), 
		{
			headers: {
				'Content-Type': 'text/html',
			}
		}
	)
}

export const context = new Elysia({
	name: '@app/ctx',
})
	// .decorate('db', db)
	// .derive((ctx) => {
	// 	function count(): number {
	// 		return (ctx.db.query('select count from counter').get() as { count: number }).count
	// 	}

	// 	function add(amount = 1): number {
	// 		db.prepare('UPDATE counter SET count = ?').run(count() + amount)
	// 		return count()
	// 	}

	// 	return { count, add }
	// })
	.decorate('render', async (template: HTMLTemplateResult) => {
		return new Response(
      await collectResult(
        render(
          Layout(template)
        )
      ), 
      {
        headers: {
          'Content-Type': 'text/html',
        }
		  }
    )
	})
	.decorate('html', lithtml)
	.decorate('fragment', fragment)
	.derive(({ set, headers }) => ({
		redirect: (href: string) => {
			if (headers['hx-request'] === 'true') {
				set.headers['HX-Location'] = href
			} else {
				set.redirect = href
			}
		},
	}))

type HandlerFn = Parameters<typeof context.post>[1]
export type Context = Parameters<HandlerFn>[0]