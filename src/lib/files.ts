import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js';
import { IFs } from 'memfs';

interface Dirent {
	name: string;
	isDirectory(): boolean;
}

async function* getFiles(fs: IFs, dir: string): any {
	const entries = (await fs.promises.readdir(dir, {
		withFileTypes: true,
	})) as Array<Dirent>;
	for (const entry of entries) {
		const path = `${dir}/${entry.name}`;
		if (entry.isDirectory()) {
			yield* getFiles(fs, path);
		} else {
			yield path;
		}
	}
}

function zipFile(
	fs: IFs,
	zipWriter: ZipWriter<Blob>,
	path: string,
): Promise<any> {
	return fs.promises.readFile(path).then((buf) => {
		const blob = new Blob([buf]);
		return zipWriter.add(path, new BlobReader(blob));
	});
}

export async function zipFiles(fs: IFs): Promise<Blob> {
	const blobWriter = new BlobWriter();
	const zipWriter = new ZipWriter(blobWriter);

	const toZip = [];
	for await (const path of getFiles(fs, '/')) {
		toZip.push(zipFile(fs, zipWriter, path));
	}

	await Promise.all(toZip);
	await zipWriter.close();

	return await blobWriter.getData();
}
