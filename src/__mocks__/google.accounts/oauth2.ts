const ACCOUNTS_TOKEN_RESPONSE = {
	access_token: 'foo',
	expires_in: '10',
	hd: 'gmail.com',
	prompt: '',
	token_type: 'access',
	scope: 'drive.readonly',
	state: '',
	error: '',
	error_description: '',
	error_uri: '',
};

export class AccountsOAuth2 {
	callback?: (response: google.accounts.oauth2.TokenResponse) => void;
	initCodeClient(
		config: google.accounts.oauth2.CodeClientConfig,
	): google.accounts.oauth2.CodeClient {
		return {
			requestCode: () => {},
		};
	}
	initTokenClient(
		config: google.accounts.oauth2.TokenClientConfig,
	): google.accounts.oauth2.TokenClient {
		return {
			requestAccessToken: (
				overrideConfig?: google.accounts.oauth2.OverridableTokenClientConfig,
			) => {
				if (this.callback !== undefined) {
					this.callback(ACCOUNTS_TOKEN_RESPONSE);
				}
			},
		};
	}
	hasGrantedAllScopes(
		tokenResponse: google.accounts.oauth2.TokenResponse,
		firstScope: string,
		...restScopes: string[]
	): boolean {
		return true;
	}
	hasGrantedAnyScope(
		tokenResponse: google.accounts.oauth2.TokenResponse,
		firstScope: string,
		...restScopes: string[]
	): boolean {
		return true;
	}
	revoke(accessToken: string, done: () => void): void {}
}

export const ACCOUNTS_OAUTH2_SCRIPT = `
if (typeof(globalThis.google) === 'undefined') {
	globalThis.google = {};
}
if (typeof(globalThis.google.accounts) === 'undefined') {
	globalThis.google.accounts = {};
}
let callback;
globalThis.google.accounts.oauth2 = {
	initTokenClient: (config) => {
		callback = config.callback;
		return {
			requestAccessToken: (overrideConfig) => {
				callback(${ACCOUNTS_TOKEN_RESPONSE});
			},
		};
	},
};
`;
