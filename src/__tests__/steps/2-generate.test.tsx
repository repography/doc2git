import {
	fireEvent,
	render,
	screen,
} from '@/__tests__/__helpers__/testing-library-react';
import { GoogleContext } from '@/contexts/google';
import Step2Generate, { DOC_INVALID_ERROR } from '@/steps/2-generate';

describe('<Step2Generate />', () => {
	it('handles invalid doc URL', async () => {
		const docUrl = 'https://sheets.google.com/document/d/1';
		const setDocUrl = jest.fn();
		const googleReady = Promise.resolve(true);
		const actionLoading = false;
		const setActionLoading = jest.fn();
		const error = '';
		const setError = jest.fn();
		const setDownload = jest.fn();
		const setProgress = jest.fn();
		const tokenClient = {
			requestAccessToken: jest.fn(),
		};
		const tokenCallback = {
			current: jest.fn(),
		};
		const next = jest.fn();
		const back = jest.fn();

		const { user } = render(
			<GoogleContext.Provider value={{ gsiLoaded: true, gapiLoaded: true }}>
				<Step2Generate
					docUrl={docUrl}
					setDocUrl={setDocUrl}
					googleReady={googleReady}
					actionLoading={actionLoading}
					setActionLoading={setActionLoading}
					error={error}
					setError={setError}
					setDownload={setDownload}
					setProgress={setProgress}
					tokenClient={tokenClient}
					tokenCallback={tokenCallback}
					next={next}
					back={back}
				/>
			</GoogleContext.Provider>,
		);

		expect(screen.getAllByRole('textbox')).toHaveLength(1);
		const input = screen.getByRole('textbox');
		expect(input).toHaveValue(docUrl);

		expect(setDocUrl.mock.calls).toHaveLength(0);
		fireEvent.change(input, { target: { value: docUrl + 'foo' } });
		expect(setDocUrl.mock.calls).toHaveLength(1);
		expect(setDocUrl.mock.calls[0]).toEqual([docUrl + 'foo']);

		expect(setError.mock.calls).toHaveLength(0);

		expect(screen.getAllByRole('button')).toHaveLength(2);
		const button = screen.getByRole('button', {
			name: /generate/i,
		});
		expect(button).toBeInTheDocument();
		await user.click(button);

		expect(input).toBeInvalid();
		const docError = screen.getByText(DOC_INVALID_ERROR);
		expect(docError).toBeInTheDocument();
		expect(docError.getAttribute('id')).toEqual(
			input.getAttribute('aria-describedby'),
		);
	});
});
