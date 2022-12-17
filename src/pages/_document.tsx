// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
				<link
					href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Quicksand:wght@500&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<body>
				<Main />
				<div id='portal' />
				<NextScript />
			</body>
		</Html>
	);
}
