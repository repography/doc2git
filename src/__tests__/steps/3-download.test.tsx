import { render, screen } from '@/__tests__/__helpers__/testing-library-react';
import { Progress } from '@/components/Step';
import Step3Download from '@/steps/3-download';

describe('<Step3Download />', () => {
	it('shows progress until 100%', async () => {
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

		let rerender;
		for (const progress of progresses) {
			const { percent, status } = progress;
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
			const step3 = (
				<Step3Download
					download={download}
					progress={progress}
					error={error}
					setError={setError}
					back={back}
				/>
			);

			if (rerender === undefined) {
				const { rerender: r } = render(step3);
				rerender = r;
			} else {
				rerender(step3);
			}

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
		}
	});
});
