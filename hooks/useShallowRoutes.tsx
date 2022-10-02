import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useShallowRoutes(base: string, paths: string[], index: number) {
	const router = useRouter();

	useEffect(() => {
		if (index >= paths.length || index < 0) throw new Error('Invalid index');

		router.push(base, paths[index], { shallow: true });
	}, [base, paths, index]);

	return { base, path: paths[index] };
}
