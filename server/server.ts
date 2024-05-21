import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";
import { app, httpServer, io } from "./socket.server";
import { exec } from "child_process";

installGlobals();

const viteDevServer =
	process.env.NODE_ENV === "production"
		? undefined
		: await import("vite").then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
		  );

const remix = viteDevServer
	? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
	: () => import("../build/server/index.js" as any);

const remixHandler = createRequestHandler({
	build: remix,
	getLoadContext: () => {
		return {
			io,
		};
	},
});


// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
	app.use(viteDevServer.middlewares);
} else {
	// Vite fingerprints its assets so we can cache forever.
	app.use(
		"/assets",
		express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
	);
}

app.use(
	"/build",
	express.static("public/build", { immutable: true, maxAge: "1y" }),
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));


// handle SSR requests
app.all("*", (req, res, next) => {
	// Pass the custom variable to the request handler
	if (req.body) req.body.io = "Custom value";
	remixHandler(req, res, next); // Call the Remix request handler
});

const port = process.env.PORT || 3000;

// Start the HTTP server
httpServer.listen(port, () => {
	const url = `http://localhost:${port}/dashboard/clients`
	console.log(`App running at ${url}`)
	
	if(process.env.NODE_ENV === 'development') {
		exec(`open ${url}`);
	}
});

// function purgeRequireCache() {
//   // purge require cache on requests for "server side HMR" this won't let
//   // you have in-memory objects between requests in development,
//   // alternatively you can set up nodemon/pm2-dev to restart the server on
//   // file changes, we prefer the DX of this though, so we've included it
//   // for you by default
//   for (const key in require.cache) {
//     if (key.startsWith(BUILD_DIR)) {
//       // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//       delete require.cache[key];
//     }
//   }
// }
