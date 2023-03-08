import { axe } from 'jest-axe';

import { act, render } from '@/__tests__/__helpers__/testing-library-react';

import Privacy from '../../pages/privacy';

describe('Privacy', () => {
	it('renders without a11y issues', async () => {
		const { container } = render(<Privacy />);

		await act(async () => {
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	});
});
