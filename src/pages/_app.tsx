import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { trpc } from '../utils/trpc';

import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />

			{/* Toaster initializes and configures Toast Notifications */}
			<Toaster
				position='top-center'
				toastOptions={{
					error: {
						style: {
							background: '#FEFBFC',
							color: '#DA2F58',
							border: '1px solid rgba(218, 47, 88, .7)',
						},
						iconTheme: {
							primary: '#DA2F58',
							secondary: '#fff',
						},
					},
					success: {
						style: {
							background: '#FBFDFC',
							color: '#20B6AC',
							border: '1px solid rgba(32, 182, 172, .7)',
						},
						iconTheme: {
							primary: '#20B6AC',
							secondary: '#fff',
						},
					},
				}}
			/>
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
