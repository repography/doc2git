export class Auth {
	authorize(
		_params: {
			client_id?: string | undefined;
			immediate?: boolean | undefined;
			response_type?: string | undefined;
			scope?: any;
			authuser?: number | undefined;
		},
		_callback: (token: GoogleApiOAuth2TokenObject) => any,
	): void {}
	init(_callback: () => any): void {}
	getToken(): GoogleApiOAuth2TokenObject {
		return {
			access_token: '',
			error: '',
			expires_in: '10',
			state: '',
		};
	}
	setToken(_token: GoogleApiOAuth2TokenObject): void {}
	signIn(params: {
		clientid?: string | undefined;
		cookiepolicy?: string | undefined;
		callback?: (() => void) | undefined;
		includegrantedscopes?: boolean | undefined;
		requestvisibleactions?: any;
		scope?: any;
		apppackagename?: string | undefined;
	}): void {}
	signOut(): void {}
}
