import JSZip from 'jszip';
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

export async function zipFiles(fs: IFs): Promise<Blob> {
	const zip = new JSZip();

	const toZip = [];
	for await (const path of getFiles(fs, '/')) {
		toZip.push(
			fs.promises.readFile(path).then((buf) => {
				zip.file(path, buf);
			}),
		);
	}

	await Promise.all(toZip);
	return await zip.generateAsync({ type: 'blob' });
}

export async function unzipFiles(fs: IFs, zipBlob: Blob): Promise<void> {
	const zip = await JSZip.loadAsync(zipBlob);
	// eslint-disable-next-line unicorn/no-array-for-each
	zip.forEach(async (path, file) => {
		if (file.dir) {
			fs.mkdirSync(path, { recursive: true });
		} else {
			const data = await file.async('nodebuffer');
			fs.writeFileSync(path, data);
		}
	});
}
