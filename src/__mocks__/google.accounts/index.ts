import { AccountsId, ACCOUNTS_ID_SCRIPT } from '@/__mocks__/google.accounts/id';

import {
	AccountsOAuth2,
	ACCOUNTS_OAUTH2_SCRIPT,
} from '@/__mocks__/google.accounts/oauth2';

const ACCOUNTS_ID = new AccountsId();
const ACCOUNTS_OAUTH2 = new AccountsOAuth2();
const ACCOUNTS_SCRIPT = ACCOUNTS_ID_SCRIPT + ACCOUNTS_OAUTH2_SCRIPT;

export { ACCOUNTS_ID, ACCOUNTS_OAUTH2, ACCOUNTS_SCRIPT };
