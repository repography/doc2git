import { mockRevisions } from '@/__mocks__/gapi/drive';
import { getAllRevisions } from '@/lib/drive';

describe('getAllRevisions', () => {
	it('throws with an invalid file ID', async () => {
		await expect(getAllRevisions('foobar')).rejects.toThrow(
			'foobar missing or unauthorized',
		);
	});
	it('returns all pages of revisions', async () => {
		for (const [fileId, revisions] of Object.entries(mockRevisions)) {
			await expect(getAllRevisions(fileId)).resolves.toEqual(revisions);
		}
	});
});
