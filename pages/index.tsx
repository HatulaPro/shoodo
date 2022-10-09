import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import CheckListItem from '../components/CheckListItem/CheckListItem';
import { useUser } from '../hooks/useUser';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
	const { user } = useUser();

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
					<Grid item container xs={12} md={5} sx={{ flexDirection: { xs: 'row', md: 'column' } }} style={{ alignItems: 'center' }}>
						<Grid item container md={7} xs={5}>
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
