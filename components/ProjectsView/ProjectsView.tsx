import MoreVertIcon from '@mui/icons-material/MoreVert';
import Badge from '@mui/material/Badge';
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
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { sortByImportance } from '../../hooks/useQueryProject';
import { useUser } from '../../hooks/useUser';
import { cn } from '../../utils/general';
import { PublicUser } from '../../utils/supabase/auth';
import { FullProject, getProjectById, ProjectWithHistory } from '../../utils/supabase/projects';
import styles from './ProjectsView.module.css';

type ProjectsViewProps<T extends ProjectWithHistory & { user?: PublicUser }> = {
	projects: T[];
	newProject: number;
	updateProjects: (projects: T[]) => void;
	deleteProject: (projectId: number) => Promise<boolean>;
};

const ProjectsView = <T extends ProjectWithHistory & { user?: PublicUser }>(props: ProjectsViewProps<T>) => {
	const { projects, newProject, updateProjects, deleteProject } = props;
	const projectsListRef = useRef<HTMLDivElement>(null);
	const [menuProject, setMenuProject] = useState<FullProject | null>(null);
	const [menuProjectPlaceHolder, setMenuProjectPlaceHolder] = useState<T | null>(null);
	const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const { user } = useUser();

	const deleteProjectMutation = useMutation(deleteProject);

	useEffect(() => {
		if (projectsListRef.current && newProject !== -1) {
			projectsListRef.current.children[newProject]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [projectsListRef, newProject]);

	function closeMenu() {
		setShowDeleteDialog(false);
		setMenuProject(null);
		setMenuProjectPlaceHolder(null);
	}

	function openMenu(index: number) {
		return (e: React.MouseEvent<HTMLButtonElement>) => {
			setAnchor(e.currentTarget);

			setMenuProjectPlaceHolder(projects[index]);
			getProjectById(projects[index].id).then((proj) => {
				proj.columns = sortByImportance(proj.columns!);
				for (const col of proj.columns) {
					col.tasks = sortByImportance(col.tasks!);
				}

				queryClient.setQueryData(['project', projects[index].id], proj);

				setMenuProject(proj);
			});
		};
	}

	function openDeleteDialog() {
		setShowDeleteDialog(true);
	}

	function onDeleteProject() {
		if (!menuProject) return;
		deleteProjectMutation.mutateAsync(menuProject.id).then((result) => {
			if (result) {
				updateProjects(projects.filter((proj) => proj.id !== menuProject.id));
				setShowDeleteDialog(false);
			} else {
				console.log('can not delete project for some reason');
			}
		});
	}

	return (
		<Grid container spacing={4} ref={projectsListRef} sx={{ mb: 4 }}>
			{menuProject && (
				<Dialog open={showDeleteDialog} onClose={closeMenu}>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogContent>
						Click &apos;DELETE&apos; to delete <b>{menuProject.name}</b>
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
							<Card variant="outlined" style={{ overflow: 'visible' }} className={cn(index === newProject && styles.projectViewNew, project.id === menuProject?.id && deleteProjectMutation.isLoading && styles.projectViewDeleted)}>
								<Badge badgeContent={project.history?.length === 0 ? 'new' : undefined} color="secondary">
									<CardHeader
										title={project.name}
										subheader={new Date(project.created_at!).toLocaleString()}
										action={
											<IconButton onClick={openMenu(index)}>
												<MoreVertIcon />
											</IconButton>
										}
									/>
								</Badge>
								<CardContent>
									<Typography variant="body2" className={styles.projectViewCutText}>
										{project.description}
									</Typography>
								</CardContent>
								{project.user && project.user_id !== user?.id && (
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

				<Menu open={menuProjectPlaceHolder !== null} onClose={closeMenu} anchorEl={anchor}>
					<MenuItem onClick={openDeleteDialog}>Delete</MenuItem>
					<Link href={{ pathname: `/projects/[id]`, query: menuProject ? { project: JSON.stringify(menuProject) } : { id: menuProjectPlaceHolder?.id } }} as={`/projects/${menuProject?.id || menuProjectPlaceHolder?.id}`} shallow>
						<MenuItem onClick={closeMenu}>View</MenuItem>
					</Link>
				</Menu>
			</AnimatePresence>
		</Grid>
	);
};

export default ProjectsView;
