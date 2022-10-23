import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import CheckListItem from '../components/CheckListItem/CheckListItem';
import { useRecentProjects } from '../hooks/useRecentProjects';
import { useUser } from '../hooks/useUser';
import styles from '../styles/Home.module.css';
import { cn } from '../utils/general';

const Home: NextPage = () => {
	const { user } = useUser();
	const { data: recentProjects } = useRecentProjects(user);

	return (
		<div>
			<Head>
				<title>Shoodo</title>
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
				{recentProjects && user && (
					<Grid item container className={cn(styles.section, styles.quickAccessSection)}>
						<Typography className={styles.sectionHeading} variant="h3" component="h3">
							Quick Access
						</Typography>
						<Grid item container>
							{recentProjects.length > 0 ? (
								recentProjects.map((project) =>
									project === null ? null : (
										<Grid item container key={project.id} xs={12} sm={6} md={4}>
											<motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ width: '100%' }}>
												<Card variant="outlined" style={{ margin: '4px' }}>
													<Link href={{ pathname: `/projects/[id]` }} as={`/projects/${project.id}`} shallow>
														<CardActionArea>
															<CardHeader title={project.name} subheader={new Date(project.created_at!).toLocaleString()} />

															<CardContent>
																<Typography variant="body2" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
																	{project.description}
																</Typography>
															</CardContent>
														</CardActionArea>
													</Link>
												</Card>
											</motion.div>
										</Grid>
									)
								)
							) : (
								<Link href="/projects">
									<Button color="primary" variant="contained" sx={{ mt: 8 }}>
										Start Creating Projects
									</Button>
								</Link>
							)}
						</Grid>
					</Grid>
				)}
				<motion.div initial={{ x: -300, opacity: 0, scaleX: 0 }} whileInView={{ x: 0, opacity: 1, scaleX: 1 }} transition={{ duration: 0.6, delay: 0.25 }} viewport={{ once: true }}>
					<Grid container className={styles.section}>
						<Grid item sm={5} xs={12} display="flex" flexDirection="column" justifyContent="center">
							<Container style={{ position: 'relative', minHeight: '300px' }}>
								<Image alt="share your work" src="/sharing.png" layout="fill" objectFit="contain" />
							</Container>
						</Grid>
						<Grid item sm={7} xs={12} display="flex" flexDirection="column" justifyContent="center">
							<Typography variant="h3" component="h3" className={styles.sectionHeading}>
								Share with your friends!
							</Typography>
							<Typography variant="body1" component="p">
								Shoodo allows you to edit your to do lists with your friends, colleagues and whoever else you want. Create a project, share it with your buddies and have fun!
								<br />
								Teamwork makes the dream work!
							</Typography>
						</Grid>
					</Grid>
				</motion.div>
				<motion.div initial={{ x: 300, opacity: 0, scaleX: 0 }} whileInView={{ x: 0, opacity: 1, scaleX: 1 }} transition={{ duration: 0.6, delay: 0.25 }} viewport={{ once: true }}>
					<Grid container className={styles.section} sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
						<Grid item sm={1} xs={12} />
						<Grid item sm={6} xs={12} display="flex" flexDirection="column" justifyContent="center">
							<Typography variant="h3" component="h3" className={styles.sectionHeading}>
								Anywhere, Anytime!
							</Typography>
							<Typography variant="body1" component="p">
								From your phone, personal computer or even your Samsung smart fridge. Work on your project with anyone you wish in <u>realtime</u> from all over the globe. Performence is guaranteed!
							</Typography>
						</Grid>
						<Grid item sm={5} xs={12} display="flex" flexDirection="column" justifyContent="center">
							<Container style={{ position: 'relative', minHeight: '300px' }}>
								<Image alt="work online" src="/online.png" layout="fill" objectFit="contain" />
							</Container>
						</Grid>
					</Grid>
				</motion.div>
				<motion.div initial={{ x: -300, opacity: 0, scaleX: 0 }} whileInView={{ x: 0, opacity: 1, scaleX: 1 }} transition={{ duration: 0.6, delay: 0.25 }} viewport={{ once: true }}>
					<Grid container className={styles.section}>
						<Grid item sm={5} xs={12} display="flex" flexDirection="column" justifyContent="center">
							<Container style={{ position: 'relative', minHeight: '300px' }}>
								<Image alt="keep your data safe" src="/security.png" layout="fill" objectFit="contain" />
							</Container>
						</Grid>
						<Grid item sm={7} xs={12} display="flex" flexDirection="column" justifyContent="center">
							<Typography variant="h3" component="h3" className={styles.sectionHeading}>
								Your data is safe with us!
							</Typography>
							<Typography variant="body1" component="p">
								Shoodo uses modern technologies to make sure your information is kept safe. No passwords are required, so you can keep your mind focused on the real issues.
							</Typography>
						</Grid>
					</Grid>
				</motion.div>
			</div>
		</div>
	);
};

export default Home;
