import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useShallowRoutes<ValidPath extends string>(base: string) {
	const router = useRouter();
	const [location, setLocation] = useState<ValidPath | null>();

	useEffect(() => {
		const handler = (asPath: string) => {
			const newPath = asPath.substring(base.length) as ValidPath;
			setLocation(newPath);
		};
		router.events.on('routeChangeComplete', handler);
		return () => {
			router.events.off('routeChangeComplete', handler);
		};
	}, [router, location, setLocation, base]);

	return {
		location,
		setLocation: (newLocation: ValidPath | null) => {
			if (newLocation === null) {
				router.push({ pathname: router.pathname, query: router.query }, base, { shallow: true });
			} else {
				router.push({ pathname: router.pathname, query: router.query }, base + newLocation, { shallow: true });
			}
			setLocation(newLocation);
		},
	};
}
