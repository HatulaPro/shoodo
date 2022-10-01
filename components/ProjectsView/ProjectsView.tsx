import { FC } from 'react';
import { Project } from '../../utils/supabase/projects';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActionArea from '@mui/material/CardActionArea';
import styles from './ProjectsView.module.css';

type ProjectsViewProps = {
	projects: Project[];
};

const ProjectsView: FC<ProjectsViewProps> = ({ projects }) => {
	return (
		<Grid container spacing={4}>
			{projects.map((project) => (
				<Grid item xs={12} sm={6} md={4} key={project.id}>
					<Card variant="outlined">
						<CardActionArea>
							<CardHeader title={project.name} subheader={new Date(project.created_at).toLocaleString()} />
							<CardContent>
								<Typography variant="body2" className={styles.projectViewCutText}>
									{project.description}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

export default ProjectsView;