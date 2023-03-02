import { type AuthInfo } from '@/lib/gsi';

const ACCOUNTS_AUTH_RESPONSE = {
	// Encoded example payload as per ACCOUNTS_AUTH_INFO
	credential:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2MTgwMzM5ODg3NCwiYXVkIjoiMzE0MTU5MjY1LXBpLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMzE0MTU5MjY1MzU4OTc5MzIzOCIsImhkIjoiZ21haWwuY29tIiwiZW1haWwiOiJlbGlzYS5nLmJlY2tldHRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjMxNDE1OTI2NS1waS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJFbGlzYSBCZWNrZXR0IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9lMjcxODI4MTgyODQ1OTA0NTIzNTM2MHVsZXIiLCJnaXZlbl9uYW1lIjoiRWxpc2EiLCJmYW1pbHlfbmFtZSI6IkJlY2tldHQiLCJpYXQiOjE1OTY0NzQwMDAsImV4cCI6MTU5NjQ3NzYwMCwianRpIjoiYWJjMTYxODAzMzk4ODc0ZGVmIn0.1l6P7-I_lskfAI7areXgEwjwD54LnNo-PjEoLrwnvkk',
	select_by: 'btn_confirm',
};

// Example payload from https://developers.google.com/identity/gsi/web/reference/js-reference
const ACCOUNTS_AUTH_INFO: AuthInfo = {
	name: 'Elisa Beckett',
	email: 'elisa.g.beckett@gmail.com',
	picture: 'https://lh3.googleusercontent.com/a-/e2718281828459045235360uler',
};

export class AccountsId {
	callback?: (response: google.accounts.id.CredentialResponse) => void;
	initialize(idConfig: google.accounts.id.IdConfiguration): void {
		this.callback = idConfig.callback;
	}
	prompt(
		momentListener?: (
			promptMomentNotification: google.accounts.id.PromptMomentNotification,
		) => void,
	): void {}
	renderButton(
		parent: HTMLElement,
		options: google.accounts.id.GsiButtonConfiguration,
	): void {
		const button = document.createElement('button');
		button.textContent = 'Sign in with Google';
		button.addEventListener('click', () => {
			if (this.callback !== undefined) {
				this.callback(ACCOUNTS_AUTH_RESPONSE);
			}
		});
		parent.appendChild(button);
	}
	disableAutoSelect(): void {}
	storeCredential(
		credential: google.accounts.id.Credential,
		callback?: () => void,
	): void {}
	cancel(): void {}
	revoke(
		hint: string,
		callback?: (response: google.accounts.id.RevocationResponse) => void,
	): void {}
}

export const ACCOUNTS_ID_SCRIPT = `
if (typeof(globalThis.google) === 'undefined') {
	globalThis.google = {};
}
if (typeof(globalThis.google.accounts) === 'undefined') {
	globalThis.google.accounts = {};
}
let callback;
globalThis.google.accounts.id = {
	initialize: (idConfig) => {
		callback = idConfig.callback;
	},
	renderButton: (parent, options) => {
		const buttton = document.createElement('button');
		button.textContent = 'Sign in with Google';
		button.addEventListener('click', () => callback(${JSON.stringify(
			ACCOUNTS_AUTH_RESPONSE,
		)}));
		parent.appendChild(button);
	},
};
`;
