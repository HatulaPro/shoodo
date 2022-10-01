import { FC } from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import LogoSvg from '../LogoSvg/LogoSvg';
import Link from 'next/link';
import styles from './Header.module.css';
import { useUser } from '../../hooks/useUser';
import { logOut } from '../../utils/supabase/auth';

const Header: FC = () => {
	const user = useUser();

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
					{user && (
						<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
							<IconButton>
								<AccountCircleIcon fontSize="large" />
							</IconButton>
							{user.email}
						</Box>
					)}
					<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'end' }}>
						<ButtonGroup>
							{user ? (
								<Button sx={{ color: 'white' }} onClick={logOut}>
									Log Out
								</Button>
							) : (
								<Link href="/auth">
									<Button sx={{ color: 'white' }}>Log In</Button>
								</Link>
							)}
							<Link href="/">
								<Button sx={{ color: 'white' }}>Home</Button>
							</Link>
						</ButtonGroup>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default Header;
