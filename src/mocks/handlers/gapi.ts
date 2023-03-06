import { rest } from 'msw';

import { mockRevisions } from '@/__mocks__/gapi/drive';

export const HANDLERS_GAPI = [
	rest.get('https://apis.google.com/js/api.js', (_req, res, ctx) => {
		ctx.set('Content-Type', 'application/javascript');
		return res(ctx.body(''));
	}),
	rest.get('https://export.google.com/:docId/:revId', (req, res, ctx) => {
		const docId: string = req.params.docId as string;
		const revId: string = req.params.revId as string;
		if (docId in mockRevisions) {
			const rev = mockRevisions[docId].find((r) => r.id === revId);
			if (rev) {
				ctx.set('Content-Type', 'text/plain');
				return res(ctx.body(rev.content));
			}
		}
		return res(ctx.status(404));
	}),
];
