import { rest } from 'msw';

import { ACCOUNTS_SCRIPT } from '../../__mocks__/google.accounts';

export const HANDLERS_GSI = [
	rest.get(/^https:\/\/accounts.google.com\/gsi\/client/, (_req, res, ctx) => {
		ctx.set('Content-Type', 'application/javascript');
		return res(ctx.body(ACCOUNTS_SCRIPT));
	}),
];
