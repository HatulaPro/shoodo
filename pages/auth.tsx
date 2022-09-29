import { NextPage } from 'next';
import Head from 'next/head';
import { signInWithEmail } from '../client';
import { useState } from 'react';

const Auth: NextPage = () => {
	const [email, setEmail] = useState<string>('');
	// const [password, setPassword] = useState<string>('');

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
				{/* <input type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} /> */}
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default Auth;
