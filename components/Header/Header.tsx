import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import ButtonGroup from '@mui/material/ButtonGroup';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useHeaderController } from '../../hooks/useHeaderController';
import { useUser } from '../../hooks/useUser';
import { cn } from '../../utils/general';
import { logOut } from '../../utils/supabase/auth';
import LogoSvg from '../LogoSvg/LogoSvg';
import styles from './Header.module.css';

const Header: FC = () => {
	const { isLoading, user } = useUser();
	const router = useRouter();
	const theme = useTheme();
	const isVisible = useHeaderController();
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
		router.events.on('routeChangeComplete', onRouteChangeHandler);

		document.body.style.overflow = isSmallScreen && isOpen ? 'hidden' : 'initial';

		return () => {
			document.body.style.overflow = 'initial';
			router.events.off('routeChangeStart', onRouteChangeHandler);
		};
	}, [isSmallScreen, router, isOpen, setOpen]);

	return (
		<AppBar position="sticky" className={cn(styles.header, (!isVisible || isLoading) && styles.headerInvisible)}>
			<Toolbar sx={{ p: 1 }}>
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
								<MenuIcon style={{ transition: 'all 0.2s', opacity: isOpen ? 0 : 1, width: isOpen ? 0 : '' }} htmlColor="white" />
								<CloseIcon style={{ transition: 'all 0.2s', opacity: isOpen ? 1 : 0, width: isOpen ? '' : 0 }} htmlColor="white" />
							</IconButton>
						</Box>
					</>
				) : (
					<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'end' }}>
						<ButtonGroup>{contents}</ButtonGroup>
					</Box>
				)}
			</Toolbar>
			<div className={cn(styles.headerOpeningMenu, isOpen && styles.headerOpeningMenuOpen)}>{contents}</div>
		</AppBar>
	);
};
export default Header;
