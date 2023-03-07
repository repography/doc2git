import { createFsFromVolume, Volume } from 'memfs';

import { getFiles, unzipFiles, zipFiles } from '@/lib/files';

describe('getFiles', () => {
	it('throws on unknown dir', async () => {
		const vol = new Volume();
		const fs = createFsFromVolume(vol);
		const listing = getFiles(fs, 'foobar');
		await expect(listing.next).rejects.toThrow();
	});
	it('returns complete listing', async () => {
		const files = {
			'/a/b/c/d/nested.txt': 'hi',
			'/a/b/c/d/other.txt': 'yo',
			'/root.txt': 'hello world',
		};
		const vol = Volume.fromJSON(files);
		const fs = createFsFromVolume(vol);
		const listing = [];
		for await (const path of getFiles(fs, '/')) {
			listing.push(path);
		}
		expect(listing).toEqual(Object.keys(files));
	});
});
describe('zipFiles/unzipFiles', () => {
	it('returns files after round trip', async () => {
		const files = {
			'/a/b/c/d/nested.txt': 'hi',
			'/a/b/c/d/other.txt': 'yo',
			'/root.txt': 'hello world',
		};
		const vol = Volume.fromJSON(files);
		const fs = createFsFromVolume(vol);

		const zipBlob = await zipFiles(fs);

		const vol2 = new Volume();
		const fs2 = createFsFromVolume(vol2);
		await unzipFiles(fs2, zipBlob);

		for (const [path, content] of Object.entries(files)) {
			await expect(fs2.promises.readFile(path, 'utf8')).resolves.toBe(content);
		}
	});
});
