import { axe } from 'jest-axe';

import {
	act,
	render,
	screen,
} from '@/__tests__/__helpers__/testing-library-react';

import Index from '../../pages/index';

describe('Index', () => {
	it('renders without a11y issues and links to github', async () => {
		const { container } = render(<Index />);

		const link = screen.getByRole('link', {
			name: /doc2git on github/i,
		});

		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute(
			'href',
			'https://github.com/repography/doc2git',
		);

		await act(async () => {
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	});
});
