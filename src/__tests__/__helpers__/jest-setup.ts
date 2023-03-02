import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { ACCOUNTS_ID, ACCOUNTS_OAUTH2 } from '@/__mocks__/google.accounts';
import { server } from '@/mocks/server';

global.google = {
	accounts: {
		id: ACCOUNTS_ID,
		oauth2: ACCOUNTS_OAUTH2,
	},
};

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
