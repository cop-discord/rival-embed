import "../styles/globals.scss";

import type { AppProps } from "next/app";
import Head from "next/head";

export default function MyApp({ Component, pageProps }: AppProps) {
	const title = "Rival Embed Creator";
	const description =
		"A webtool to create embeds for discord";

	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=0.5, minimal-ui, viewport-fit=cover, width=device-width"></meta>
				<meta name="theme-color" content="#303135" />

				<title>{title}</title>
				<meta property="og:title" content={title} />
				<meta name="description" content={description} />
				<meta property="og:description" content={description} />
			</Head>
			<Component {...pageProps} />
		</>
	);
}
