import { ACCOUNTS_AUTH_INFO } from '@/__mocks__/google.accounts';
import { render, screen } from '@/__tests__/__helpers__/testing-library-react';
import GsiButton from '@/components/GsiButton';
import { GoogleContext } from '@/contexts/google';

describe('<GsiButton />', () => {
	it('renders container with loading placeholder', () => {
		const onAuthInfo = jest.fn();
		const { container } = render(<GsiButton onAuthInfo={onAuthInfo} />);

		expect(container.textContent).toBe('Loading...');
		expect(screen.queryAllByRole('button')).toHaveLength(0);
		expect(onAuthInfo.mock.calls).toHaveLength(0);
	});

	it('renders working GSI button', async () => {
		const onAuthInfo = jest.fn();

		const { user } = render(
			<GoogleContext.Provider value={{ gsiLoaded: true, gapiLoaded: false }}>
				<GsiButton onAuthInfo={onAuthInfo} />
			</GoogleContext.Provider>,
		);

		expect(screen.getAllByRole('button')).toHaveLength(1);

		const button = screen.getByRole('button', {
			name: /sign in with google/i,
		});
		expect(button).toBeInTheDocument();

		await user.click(button);

		expect(onAuthInfo.mock.calls).toHaveLength(1);
		const [authInfo] = onAuthInfo.mock.calls[0];
		expect(authInfo.name).toBe(ACCOUNTS_AUTH_INFO.name);
		expect(authInfo.email).toBe(ACCOUNTS_AUTH_INFO.email);
		expect(authInfo.picture).toBe(ACCOUNTS_AUTH_INFO.picture);
	});
});
