import jwtDecode from 'jwt-decode';
import { createRef, useContext, useEffect } from 'react';

import { type GoogleContextType, GoogleContext } from '@/contexts/google';
import { type AuthInfo, type GoogleCredentialResponse } from '@/lib/gsi';

type OnAuthInfo = (info: AuthInfo) => void;

interface GsiButtonParams {
	onAuthInfo: OnAuthInfo;
}

const GsiButton = ({ onAuthInfo }: GsiButtonParams): JSX.Element => {
	const { gsiLoaded } = useContext(GoogleContext) as GoogleContextType;
	const buttonRef = createRef<HTMLDivElement>();

	useEffect(() => {
		if (gsiLoaded && buttonRef.current) {
			google.accounts.id.initialize({
				client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
				callback: (response: GoogleCredentialResponse) => {
					const authInfo: AuthInfo = jwtDecode<AuthInfo>(response.credential);
					onAuthInfo(authInfo);
				},
			});
			google.accounts.id.renderButton(buttonRef.current, {
				type: 'standard',
				theme: 'outline',
				size: 'large',
			});
		}
	}, [gsiLoaded, buttonRef, onAuthInfo]);

	return <div ref={buttonRef}>Loading...</div>;
};

export default GsiButton;
