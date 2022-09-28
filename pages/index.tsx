import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import CheckListItem from '../components/CheckListItem/CheckListItem';
import Image from 'next/image';

const Home: NextPage = () => {
	return (
		<div className={styles.homePage}>
			<Head>
				<title>Shoodo</title>
				<meta name="description" content="An app to help you manage your to do lists" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Grid container className={styles.main}>
				<Grid item xs={12} md={7} className={styles.mainContent}>
					<Typography variant="h2" component="h1" sx={{ maxWidth: 0.8 }}>
						Manage <span className={styles.homeTitleEffect}>Tasks</span> For Your Projects
					</Typography>
					<Typography variant="subtitle1" mt={4}>
						<b>Shoodo</b> is an online management tool that will help you manage your projects, from anywhere, anytime and for absolutely free.
					</Typography>
					<div style={{ display: 'flex', justifyContent: 'end' }}>
						<Button color="primary" variant="contained" sx={{ mt: 8 }}>
							Start Now!
						</Button>
					</div>
				</Grid>
				<Grid container xs={12} md={5}>
					{/* <Grid container sx={{ m: 'auto' }}> */}
					<Grid container md={12} sm={7} xs={5}>
						<div className={styles.mainImage} style={{ margin: 'auto' }}></div>
					</Grid>
					<Grid item md={4} sm={5} xs={7}>
						<List component={'div'}>
							{['Quick', 'Simple', 'Interactive', 'Free'].map((word, index) => (
								<CheckListItem key={word} text={word} index={index} />
							))}
						</List>
					</Grid>
					{/* </Grid> */}
				</Grid>
			</Grid>
		</div>
	);
};

export default Home;
