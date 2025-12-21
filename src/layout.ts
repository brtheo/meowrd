import { type HTMLTemplateResult, html } from 'lit'

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

					

            /* Your Palette */
            --c-purple: #AD46FF;
            --c-deep-blurple: #4F39F6;
            --c-bright-blue: #155DFC;
            --c-pink: #FB64B6;
            
            /* Discord-esque Dark Greys */
            --bg-dark-1: #202225; /* Server list strip */
            --bg-dark-2: #2F3136; /* Sidebar */
            --bg-dark-3: #36393F; /* Main chat */
            --bg-dark-4: #40444B; /* Input/Hover */
            
            --text-header: #FFFFFF;
            --text-normal: #DCDDDE;
            --text-muted: #72767D;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
				body {
            background-color: var(--bg-dark-3);
            color: var(--text-normal);
            height: 100vh;
            display: flex;
            overflow: hidden;
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