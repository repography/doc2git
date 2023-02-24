import jwtDecode, { JwtPayload } from 'jwt-decode';
import {
	createRef,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react';

import { GoogleContext, GoogleContextType } from '@/contexts/google';

export interface AuthInfo {
	email: string;
	name: string;
	picture: string;
}

interface GoogleCredentialResponse {
	credential: string;
}

interface GsiButtonParams {
	onAuthInfo: (info: AuthInfo) => void;
}

const GsiButton: FunctionComponent<GsiButtonParams> = ({ onAuthInfo }) => {
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
