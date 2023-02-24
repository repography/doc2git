import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { FunctionComponent, MutableRefObject } from 'react';

import GsiButton, { AuthInfo } from '@/components/gsi-button';
import { driveDiscoveryUrl, driveScope, getAllRevisions } from '@/drive';
import Step from '@/components/step';

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

const Step1SignIn: FunctionComponent<Step1SignInProps> = ({
	authInfo,
	setAuthInfo,
	setGoogleReady,
	error,
	setError,
	setTokenClient,
	tokenCallback,
	next,
}) => {
	const onAuthInfo = async (info: AuthInfo) => {
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
						callback: (resp: google.accounts.oauth2.TokenResponse) => {
							if (tokenCallback.current === undefined) {
								console.error('tokenCallback is undefined', resp);
								return;
							}
							tokenCallback.current(resp);
						},
					}),
				);

				await new Promise((resolve, reject) => {
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
			actionShow={() => !!authInfo}
			error={error}
			setError={setError}>
			{authInfo ? (
				<Chip
					avatar={<Avatar alt={authInfo.name} src={authInfo.picture} />}
					label={authInfo.name}
					onDelete={() => {
						setAuthInfo(undefined);
						setGoogleReady(Promise.reject());
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
