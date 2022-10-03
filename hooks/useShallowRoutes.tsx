import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useShallowRoutes<ValidPaths extends string>(base: ValidPaths) {
	const router = useRouter();
	const [location, setLocation] = useState<ValidPaths>(base);

	useEffect(() => {
		const handler = (events: ValidPaths) => {
			setLocation(events);
		};
		router.events.on('routeChangeComplete', handler);

		return () => {
			router.events.off('routeChangeComplete', handler);
		};
	}, [router, setLocation]);

	return { location, setLocation: (newLocation: ValidPaths) => router.push(base, newLocation, { shallow: true }) };
}
