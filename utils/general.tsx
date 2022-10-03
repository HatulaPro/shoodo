type ClassName = string | boolean;

export function cn(...classNames: ClassName[]): string {
	return classNames.filter((name) => typeof name === 'string').join(' ');
}
