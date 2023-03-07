import { axe } from 'jest-axe';

import {
	act,
	render,
	screen,
} from '@/__tests__/__helpers__/testing-library-react';
import { Progress } from '@/components/Step';
import Step3Download from '@/steps/3-download';

describe('<Step3Download />', () => {
	const progresses: Array<Progress> = [
		{
			percent: 0,
			status: 'Starting',
		},
		{
			percent: 25,
			status: 'Adding revision 1/4',
		},
		{
			percent: 50,
			status: 'Adding revision 2/4',
		},
		{
			percent: 100,
			status: 'Done',
		},
	];
	for (const progress of progresses) {
		const { percent, status } = progress;
		it(`shows progress until 100%: ${percent}%`, async () => {
			const download =
				percent === 100
					? {
							download: 'foo.zip',
							href: 'data:foobar',
					  }
					: undefined;
			const error = '';
			const setError = jest.fn();
			const back = jest.fn();
			const { container } = render(
				<Step3Download
					download={download}
					progress={progress}
					error={error}
					setError={setError}
					back={back}
				/>,
			);

			const bar = screen.getAllByRole('progressbar')[0];
			expect(bar).toHaveAttribute('aria-valuenow', percent.toString());

			if (percent === 100) {
				const button = screen.getByRole('link', {
					name: /download/i,
				});
				/* eslint-disable jest/no-conditional-expect */
				expect(button).toBeInTheDocument();
				expect(button).not.toBeDisabled();
				expect(button).toHaveAttribute('href', 'data:foobar');
			}

			expect(screen.getByText(status)).toBeInTheDocument();

			await act(async () => {
				const results = await axe(container);
				expect(results).toHaveNoViolations();
			});
		});
	}
});
