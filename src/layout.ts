import type { HTMLTemplateResult } from 'lit'
import { html } from 'lit'

export default (body: HTMLTemplateResult) =>
	html`<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Document</title>
			<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>
			<script defer type="module" src="/public/app.js"></script>
			<style>
				:root{
					background-color: #323232;
					color: #fefefe;
				}
			</style>
			<!-- <script>
        const socket = new WebSocket("ws://localhost:3000");
        socket.addEventListener("open", (event) => {
          //console.log(event)
          socket.send("Hello Server!");
        });

        // Listen for messages
        socket.addEventListener("message", (event) => {
          console.log("Message from server ", event);
        });
			</script>-->

		</head>
		<body>
			${body}
		</body>
	</html>`