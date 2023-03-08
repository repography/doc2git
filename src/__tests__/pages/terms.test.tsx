import { axe } from 'jest-axe';

import { act, render } from '@/__tests__/__helpers__/testing-library-react';

import Terms from '../../pages/terms';

describe('Terms', () => {
	it('renders without a11y issues', async () => {
		const { container } = render(<Terms />);

		await act(async () => {
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	});
});
