import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { sortByImportance } from '../../hooks/useQueryProject';
import { cn } from '../../utils/general';
import type { Project } from '../../utils/supabase/projects';
import { getProjectById } from '../../utils/supabase/projects';
import styles from './ProjectsView.module.css';

type ProjectsViewProps = {
	projects: Project[];
	newProject: number;
	updateProjects: (projects: Project[]) => void;
	deleteProject: (projectId: number) => Promise<boolean>;
};

const ProjectsView: FC<ProjectsViewProps> = ({ projects, newProject, updateProjects, deleteProject }) => {
	const projectsListRef = useRef<HTMLDivElement>(null);
	const [openMenuIndex, setOpenMenuIndex] = useState<number>(-1);
	const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const deleteProjectMutation = useMutation((index: number) => deleteProject(projects[index].id));

	useEffect(() => {
		if (projectsListRef.current && newProject !== -1) {
			projectsListRef.current.children[newProject]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [projectsListRef, newProject]);

	function closeMenu() {
		setOpenMenuIndex(-1);
		setShowDeleteDialog(false);
	}

	function openMenu(index: number) {
		return (e: React.MouseEvent<HTMLButtonElement>) => {
			setAnchor(e.currentTarget);
			setOpenMenuIndex(index);

			getProjectById(projects[index].id).then((proj) => {
				proj.columns = sortByImportance(proj.columns!);
				for (const col of proj.columns) {
					col.tasks = sortByImportance(col.tasks!);
				}

				queryClient.setQueryData(['project', projects[index].id], proj);

				const newProjectArray = [...projects];
				newProjectArray[index] = proj;
				updateProjects(newProjectArray);
			});
		};
	}

	function openDeleteDialog() {
		setShowDeleteDialog(true);
	}

	function onDeleteProject() {
		deleteProjectMutation.mutateAsync(openMenuIndex).then((result) => {
			if (result) {
				updateProjects(projects.filter((proj) => proj.id !== projects[openMenuIndex].id));
				setShowDeleteDialog(false);
				setOpenMenuIndex(-1);
			} else {
				console.log('can not delete project for some reason');
			}
		});
	}

	return (
		<Grid container spacing={4} ref={projectsListRef} sx={{ mb: 4 }}>
			{openMenuIndex !== -1 && (
				<Dialog open={showDeleteDialog} onClose={closeMenu}>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogContent>
						Click &apos;DELETE&apos; to delete <b>{projects[openMenuIndex]?.name}</b>
						<br />
						This action can not be undone!
						{deleteProjectMutation.isLoading && <LinearProgress color="secondary" />}
					</DialogContent>
					<DialogActions>
						<Button onClick={closeMenu} disabled={deleteProjectMutation.isLoading}>
							Cancel
						</Button>
						<Button onClick={onDeleteProject} disabled={deleteProjectMutation.isLoading} variant="contained" color="error">
							DELETE
						</Button>
					</DialogActions>
				</Dialog>
			)}
			<AnimatePresence>
				{projects.map((project, index) => (
					<Grid item key={project.id} xs={12} sm={6} md={4}>
						<motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
							<Card variant="outlined" className={cn(index === newProject && styles.projectViewNew, openMenuIndex === index && deleteProjectMutation.isLoading && styles.projectViewDeleted)}>
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
									<MenuItem onClick={openDeleteDialog}>Delete</MenuItem>
									<Link href={{ pathname: `/projects/[id]`, query: { project: JSON.stringify(project) } }} as={`/projects/${project.id}`} shallow>
										<MenuItem onClick={closeMenu}>View</MenuItem>
									</Link>
								</Menu>
								<CardContent>
									<Typography variant="body2" className={styles.projectViewCutText}>
										{project.description}
									</Typography>
								</CardContent>
								{project.user && (
									<CardActions>
										<Typography variant="caption" color="GrayText" className={styles.projectViewCutText}>
											By {project.user.email}
										</Typography>
									</CardActions>
								)}
							</Card>
						</motion.div>
					</Grid>
				))}
			</AnimatePresence>
		</Grid>
	);
};

export default ProjectsView;
