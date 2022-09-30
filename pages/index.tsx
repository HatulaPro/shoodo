import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import CheckListItem from '../components/CheckListItem/CheckListItem';
import Image from 'next/image';
import { Container } from '@mui/system';
import Link from 'next/link';
import { useUser } from '../hooks/useUser';
import Header from '../components/Header/Header';

const Home: NextPage = () => {
	const user = useUser();

	return (
		<div>
			<Head>
				<title>Shoodo</title>
				<meta name="description" content="An app to help you manage your to do lists" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles.homePage}>
				<Grid container className={styles.main} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
					<Grid item xs={6} md={7} className={styles.mainContent}>
						<Typography variant="h2" component="h1" className={styles.homeTitle}>
							Manage <span className={styles.homeTitleEffect}>Tasks</span> For Your Projects
						</Typography>
						<Typography variant="subtitle1" mt={4}>
							<b>Shoodo</b> is an online management tool that will help you manage your projects, from anywhere, anytime and for absolutely free.
						</Typography>
						<div style={{ display: 'flex', justifyContent: 'end' }}>
							{!user && (
								<Link href="/auth">
									<Button color="primary" variant="contained" sx={{ mt: 8 }}>
										Start Now!
									</Button>
								</Link>
							)}
						</div>
					</Grid>
					<Grid container xs={12} md={5} sx={{ flexDirection: { xs: 'row', md: 'column' } }} style={{ alignItems: 'center' }}>
						<Grid container md={7} xs={5}>
							<Container style={{ position: 'relative', minHeight: '160px' }}>
								<Image src="/student.png" alt="A student doing technology things" layout="fill" objectFit="contain" className={styles.mainImage} />
							</Container>
						</Grid>
						<Grid item md={5} xs={7} pr={4}>
							<List component={'div'}>
								{['Quick', 'Simple', 'Interactive', 'Free'].map((word, index) => (
									<CheckListItem key={word} text={word} index={index} />
								))}
							</List>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default Home;
