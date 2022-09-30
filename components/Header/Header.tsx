import { FC } from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LogoSvg from '../LogoSvg/LogoSvg';
import Link from 'next/link';

import { useUser } from '../../hooks/useUser';
import { logOut } from '../../utils/supabase/auth';

const Header: FC = () => {
	const user = useUser();

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Link href="/">
						<span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
							<LogoSvg />
							<Typography variant="h6" noWrap>
								Shoodo
							</Typography>
						</span>
					</Link>
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
