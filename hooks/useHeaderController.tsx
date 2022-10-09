import { useEffect, useState } from 'react';

export const useHeaderController = () => {
	const [isVisible, setVisible] = useState<boolean>(true);
	const [prevHeight, setPrevHeight] = useState<number>(0);

	useEffect(() => {
		const listener = (e: Event) => {
			const newHeight = document.scrollingElement?.scrollTop || 0;
			setVisible(newHeight <= prevHeight);
			setPrevHeight(newHeight);
		};
		document.addEventListener('scroll', listener);

		return () => {
			document.removeEventListener('scroll', listener);
		};
	}, [prevHeight, setPrevHeight, setVisible]);

	return isVisible;
};
