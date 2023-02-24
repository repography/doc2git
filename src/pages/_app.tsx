import clsx from 'clsx';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { AppProps } from 'next/app';
import { Fredoka_One } from '@next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useState } from 'react';

import theme from '../theme';
import { GoogleContext } from '@/contexts/google';

import '@/styles/globals.css';
import styles from '@/styles/app.module.css';

const titleFont = Fredoka_One({ weight: '400', subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
	const hasGoogle =
		typeof window !== 'undefined' && typeof window.google !== 'undefined';
	const [scriptGsiLoaded, setScriptGsiLoaded] = useState(hasGoogle);

	const hasGapi =
		typeof window !== 'undefined' && typeof window.gapi !== 'undefined';
	const [scriptGapiLoaded, setScriptGapiLoaded] = useState(hasGapi);

	return (
		<>
			<Head>
				<title>doc2git</title>
				<meta
					name="description"
					content="Create a Git repo from your Google Doc revision history"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/d2g.png" />
			</Head>
			<GoogleContext.Provider
				value={{
					gsiLoaded: scriptGsiLoaded,
					gapiLoaded: scriptGapiLoaded,
				}}>
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={theme}>
						<main className={styles.main}>
							<Typography
								variant="h1"
								className={clsx(styles.title, titleFont.className)}>
								<Link href="/">doc2git</Link>
							</Typography>
							<Typography className={styles.subtitle}>
								by{' '}
								<Link href="https://repography.com" target="_blank">
									<Image
										src="/logo-wordmark.png"
										alt="Repography"
										width="180"
										height="27"
									/>
								</Link>
							</Typography>
							<Component {...pageProps} />
						</main>
						<footer className={styles.footer}>
							<Typography>&copy; Repography 2023</Typography>
							<Typography component="nav" className={styles.nav}>
								<Link href="/terms">Terms of use</Link>
								<Link href="/privacy">Privacy</Link>
							</Typography>
						</footer>
					</ThemeProvider>
				</StyledEngineProvider>
			</GoogleContext.Provider>
			<Script
				src="https://accounts.google.com/gsi/client"
				strategy="afterInteractive"
				onLoad={() => setScriptGsiLoaded(true)}
			/>
			<Script
				src="https://apis.google.com/js/api.js"
				strategy="afterInteractive"
				onLoad={() => setScriptGapiLoaded(true)}
			/>
		</>
	);
}
