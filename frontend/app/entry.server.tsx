import { PassThrough } from "node:stream";

import { resolve } from "node:path";
import { createReadableStreamFromReadable } from "@react-router/node";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { isbot } from "isbot";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import { initReactI18next } from "react-i18next";
import type {
	AppLoadContext,
	EntryContext,
	HandleDataRequestFunction,
} from "react-router";
import { ServerRouter } from "react-router";
import i18n from "~/i18n";
import { sessionCookie } from "~/shared/services/session.server";
import i18next from "./i18next.server";

export const streamTimeout = 7_000;

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
	loadContext: AppLoadContext,
) {
	const instance = createInstance();
	const lng = await i18next.getLocale(request);
	const ns = i18next.getRouteNamespaces(routerContext);

	let cookieValue = await sessionCookie.parse(
		responseHeaders.get("set-cookie"), // check if some router module is trying to set a cookie
	);
	if (!cookieValue) {
		// if it tries, we do nothing, or else
		cookieValue = await sessionCookie.parse(request.headers.get("cookie"));
		responseHeaders.append(
			"Set-Cookie",
			await sessionCookie.serialize(cookieValue),
		); // we reset the cookie
	}

	await instance
		.use(initReactI18next) // Tell our instance to use react-i18next
		.use(Backend) // Setup our backend
		.init({
			...i18n, // spread the configuration
			lng, // The locale we detected above
			ns, // The namespaces the routes about to render wants to use
			backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
			saveMissingTo: "current",
		});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const userAgent = request.headers.get("user-agent");

		// Ensure requests from bots and SPA Mode renders wait for all content to load before responding
		// https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
		const readyOption: keyof RenderToPipeableStreamOptions =
			(userAgent && isbot(userAgent)) || routerContext.isSpaMode
				? "onAllReady"
				: "onShellReady";

		const { pipe, abort } = renderToPipeableStream(
			<ServerRouter context={routerContext} url={request.url} />,
			{
				[readyOption]() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					// responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			},
		);

		// Abort the rendering stream after the `streamTimeout` so it has time to
		// flush down the rejected boundaries
		setTimeout(abort, streamTimeout + 1000);
	});
}

export const handleDataRequest: HandleDataRequestFunction = async (
	response: Response,
	{ request },
) => {
	// Add handling for rolling session cookies
	const responseHeaders = new Headers(response.headers);
	let cookieValue = await sessionCookie.parse(
		responseHeaders.get("set-cookie"),
	);
	if (!cookieValue) {
		cookieValue = await sessionCookie.parse(request.headers.get("cookie"));
		responseHeaders.append(
			"Set-Cookie",
			await sessionCookie.serialize(cookieValue),
		);
	}

	return response;
};
