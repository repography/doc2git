import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Index from '../../pages/index';

describe('Index', () => {
	it('links to github', () => {
		render(<Index />);

		const link = screen.getByRole('link', {
			name: /doc2git on github/i,
		});

		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute(
			'href',
			'https://github.com/repography/doc2git',
		);
	});
});
