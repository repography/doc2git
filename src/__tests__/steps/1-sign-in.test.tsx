import { ACCOUNTS_AUTH_INFO } from '@/__mocks__/google.accounts';
import { render, screen } from '@/__tests__/__helpers__/testing-library-react';
import { GoogleContext } from '@/contexts/google';
import Step1SignIn from '@/steps/1-sign-in';

describe('<Step1SignIn />', () => {
	it('shows GSI button when not signed in; sign in works', async () => {
		const setAuthInfo = jest.fn();
		const setGoogleReady = jest.fn();
		const error = '';
		const setError = jest.fn();
		const setTokenClient = jest.fn();
		const tokenCallback = {
			current: jest.fn(),
		};
		const next = jest.fn();

		const { user } = render(
			<GoogleContext.Provider value={{ gsiLoaded: true, gapiLoaded: false }}>
				<Step1SignIn
					authInfo={undefined}
					setAuthInfo={setAuthInfo}
					setGoogleReady={setGoogleReady}
					error={error}
					setError={setError}
					setTokenClient={setTokenClient}
					tokenCallback={tokenCallback}
					next={next}
				/>
			</GoogleContext.Provider>,
		);

		expect(screen.getAllByRole('button')).toHaveLength(1);

		const button = screen.getByRole('button', {
			name: /sign in with google/i,
		});
		expect(button).toBeInTheDocument();

		await user.click(button);

		expect(setError.mock.calls).toHaveLength(0);
		expect(setGoogleReady.mock.calls).toHaveLength(1);

		expect(setAuthInfo.mock.calls).toHaveLength(1);
		const [authInfo] = setAuthInfo.mock.calls[0];
		expect(authInfo.name).toBe(ACCOUNTS_AUTH_INFO.name);
		expect(authInfo.email).toBe(ACCOUNTS_AUTH_INFO.email);
		expect(authInfo.picture).toBe(ACCOUNTS_AUTH_INFO.picture);
	});
	it('shows user info when signed in; delete works', async () => {
		const authInfo = ACCOUNTS_AUTH_INFO;
		const setAuthInfo = jest.fn();
		const setGoogleReady = jest.fn();
		const error = '';
		const setError = jest.fn();
		const setTokenClient = jest.fn();
		const tokenCallback = {
			current: jest.fn(),
		};
		const next = jest.fn();

		const { user } = render(
			<GoogleContext.Provider value={{ gsiLoaded: true, gapiLoaded: false }}>
				<Step1SignIn
					authInfo={authInfo}
					setAuthInfo={setAuthInfo}
					setGoogleReady={setGoogleReady}
					error={error}
					setError={setError}
					setTokenClient={setTokenClient}
					tokenCallback={tokenCallback}
					next={next}
				/>
			</GoogleContext.Provider>,
		);

		const nextButton = screen.getByRole('button', {
			name: /next/i,
		});
		expect(nextButton).toBeInTheDocument();
		expect(nextButton).not.toBeDisabled();

		await user.click(nextButton);

		expect(next.mock.calls).toHaveLength(1);
		expect(setError.mock.calls).toHaveLength(1);
		expect(setError.mock.calls[0]).toEqual(['']);
		expect(setGoogleReady.mock.calls).toHaveLength(0);

		const deleteButton = screen.getByTestId('CancelIcon');
		expect(deleteButton).toBeInTheDocument();
		expect(deleteButton).not.toBeDisabled();

		await user.click(deleteButton);

		expect(setAuthInfo.mock.calls).toHaveLength(1);
		const [newAuthInfo] = setAuthInfo.mock.calls[0];
		expect(newAuthInfo).toBeUndefined();

		expect(setGoogleReady.mock.calls).toHaveLength(1);
		expect(setGoogleReady.mock.calls[0]).toEqual([Promise.resolve(false)]);
	});
});
