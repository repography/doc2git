import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { MutableRefObject } from 'react';

import GsiButton from '@/components/GsiButton';
import Step from '@/components/Step';
import { driveDiscoveryUrl, driveScope } from '@/lib/drive';
import { type AuthInfo } from '@/lib/gsi';

export interface Step1SignInProps {
	authInfo: AuthInfo | undefined;
	setAuthInfo: (authInfo: AuthInfo | undefined) => void;
	setGoogleReady: (googleReady: Promise<boolean>) => void;
	error?: string;
	setError: (error: string) => void;
	setTokenClient: (tokenClient: google.accounts.oauth2.TokenClient) => void;
	tokenCallback: MutableRefObject<
		undefined | ((resp: google.accounts.oauth2.TokenResponse) => void)
	>;
	next: () => Promise<void>;
}

const Step1SignIn = ({
	authInfo,
	setAuthInfo,
	setGoogleReady,
	error,
	setError,
	setTokenClient,
	tokenCallback,
	next,
}: Step1SignInProps): JSX.Element => {
	const onAuthInfo = async (info: AuthInfo): Promise<void> => {
		setAuthInfo(info);
		setGoogleReady(
			new Promise(async (gResolve, gReject) => {
				setTokenClient(
					google.accounts.oauth2.initTokenClient({
						// https://developers.google.com/identity/oauth2/web/reference/js-reference#TokenClientConfig
						prompt: '',
						hint: info.email,
						client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
						scope: driveScope,
						callback: (resp: google.accounts.oauth2.TokenResponse): void => {
							if (tokenCallback.current === undefined) {
								gReject();
								return;
							}
							tokenCallback.current(resp);
						},
					}),
				);

				await new Promise((resolve, reject): void => {
					gapi.load('client', { callback: resolve, onerror: reject });
				});

				await gapi.client.init({});
				gapi.client.load(driveDiscoveryUrl);
				gResolve(true);
			}),
		);

		next();
	};

	return (
		<Step
			action={next}
			actionLabel="Next"
			actionShow={(): boolean => !!authInfo}
			error={error}
			setError={setError}>
			{authInfo ? (
				<Chip
					avatar={<Avatar alt={authInfo.name} src={authInfo.picture} />}
					label={authInfo.name}
					onDelete={(): void => {
						setAuthInfo(undefined);
						setGoogleReady(Promise.resolve(false));
					}}
				/>
			) : (
				<>
					<Typography>
						First sign in with a Google account which has access to the Google
						Doc:
					</Typography>
					<GsiButton onAuthInfo={onAuthInfo} />
				</>
			)}
		</Step>
	);
};

export default Step1SignIn;
