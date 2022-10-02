import { FC, useRef, useEffect, useState } from 'react';
import { Project } from '../../utils/supabase/projects';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './ProjectsView.module.css';

type ProjectsViewProps = {
	projects: Project[];
	newProject: number;
};

const ProjectsView: FC<ProjectsViewProps> = ({ projects, newProject }) => {
	const projectsListRef = useRef<HTMLDivElement>(null);
	const [openMenuIndex, setOpenMenuIndex] = useState<number>(-1);
	const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

	useEffect(() => {
		if (projectsListRef.current && newProject !== -1) {
			projectsListRef.current.children[newProject]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [projectsListRef, newProject]);

	function closeMenu() {
		setOpenMenuIndex(-1);
	}

	function openMenu(index: number) {
		return (e: React.MouseEvent<HTMLButtonElement>) => {
			setAnchor(e.currentTarget);
			setOpenMenuIndex(index);
		};
	}

	return (
		<Grid container spacing={4} ref={projectsListRef} sx={{ mb: 4 }}>
			{projects.map((project, index) => (
				<Grid item xs={12} sm={6} md={4} key={project.id}>
					<Card variant="outlined" className={index === newProject ? styles.projectViewNew : ''}>
						<CardHeader
							title={project.name}
							subheader={new Date(project.created_at).toLocaleString()}
							action={
								<IconButton onClick={openMenu(index)}>
									<MoreVertIcon />
								</IconButton>
							}
						/>
						<Menu open={index === openMenuIndex} onClose={closeMenu} anchorEl={anchor}>
							<MenuItem onClick={closeMenu}>Delete</MenuItem>
							<MenuItem onClick={closeMenu}>View</MenuItem>
						</Menu>
						<CardContent>
							<Typography variant="body2" className={styles.projectViewCutText}>
								{project.description}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};

export default ProjectsView;
