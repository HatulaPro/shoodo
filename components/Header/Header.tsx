import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { cn } from '../../utils/general';
import { logOut } from '../../utils/supabase/auth';
import LogoSvg from '../LogoSvg/LogoSvg';
import styles from './Header.module.css';

const Header: FC = () => {
	const { user } = useUser();
	const router = useRouter();
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const [isOpen, setOpen] = useState<boolean>(false);

	const contentStyles = isSmallScreen ? { color: 'primary' } : { color: 'white' };

	const contents = (
		<>
			<Link href="/">
				<Button sx={contentStyles}>Home</Button>
			</Link>
			{user ? (
				<>
					<Link href="/projects">
						<Button sx={contentStyles}>Projects</Button>
					</Link>
					<Button sx={contentStyles} onClick={logOut}>
						Log Out
					</Button>
				</>
			) : (
				<Link href="/auth">
					<Button sx={contentStyles}>Log In</Button>
				</Link>
			)}
		</>
	);

	useEffect(() => {
		const onRouteChangeHandler = () => {
			if (isOpen) {
				setOpen(false);
			}
		};
		router.events.on('routeChangeStart', onRouteChangeHandler);

		document.body.style.overflow = isSmallScreen && isOpen ? 'hidden' : 'initial';

		return () => {
			document.body.style.overflow = 'initial';
			router.events.off('routeChangeStart', onRouteChangeHandler);
		};
	}, [isSmallScreen, router, isOpen, setOpen]);

	return (
		<AppBar position="sticky">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Link href="/">
						<ButtonBase className={styles.headerIconBase}>
							<LogoSvg />
							Shoodo
						</ButtonBase>
					</Link>
					{isSmallScreen ? (
						<>
							<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'end' }}>
								<IconButton onClick={() => setOpen(!isOpen)}>
									<MenuIcon htmlColor="white" />
								</IconButton>
							</Box>
						</>
					) : (
						<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'end' }}>
							<ButtonGroup>{contents}</ButtonGroup>
						</Box>
					)}
				</Toolbar>
			</Container>
			<div className={cn(styles.headerOpeningMenu, isOpen && styles.headerOpeningMenuOpen)}>{contents}</div>
		</AppBar>
	);
};
export default Header;
