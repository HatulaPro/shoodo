import { NextPage } from 'next';
import Head from 'next/head';
import { signInWithEmail } from '../utils/supabase/auth';
import { useState } from 'react';

const AuthPage: NextPage = () => {
	const [email, setEmail] = useState<string>('');

	return (
		<div>
			<Head>
				<title>Shoodo</title>
				<meta name="description" content="An app to help you manage your to do lists" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					signInWithEmail(email).then(console.log);
				}}
			>
				<input type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default AuthPage;
