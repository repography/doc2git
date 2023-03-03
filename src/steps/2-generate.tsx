import TextField from '@mui/material/TextField';
import { add, commit, init } from 'isomorphic-git';
import { createFsFromVolume, IFs, Volume } from 'memfs';
import { MutableRefObject, useState } from 'react';

import Step, { Download, Progress } from '@/components/Step';
import { getAllRevisions } from '@/lib/drive';

let zipFiles = (_fs: IFs): Promise<Blob> => Promise.resolve(new Blob([]));
if (process.browser) {
	// https://github.com/gildas-lormeau/zip.js/issues/376
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { zipFiles: z } = require('@/lib/files');
	zipFiles = z;
}

const downloadMimeTypes: Record<string, string> = {
	// 'text/html': 'html',
	'text/plain': 'txt',
};

const docIdPattern = /^\s*[\w-]+\s*$/;
const docUrlPattern = /docs.google.com\/(?:u\/\d+\/)?document\/d\/([\w-]+)/i;

export const DOC_INVALID_ERROR = `This doesn't appear to be a valid Google Doc URL or ID`;
export const DOC_FETCH_ERROR = `Failed to list the revisions for this doc. Are you sure that it's a valid doc URL or ID, and that the account you've signed in with has access?`;

export interface Step2GenerateProps {
	docUrl: string;
	setDocUrl: (docUrl: string) => void;
	googleReady: Promise<boolean>;
	actionLoading: boolean;
	setActionLoading: (actionLoading: boolean) => void;
	error: string;
	setError: (error: string) => void;
	setDownload: (download: Download) => void;
	setProgress: (progress: Progress) => void;
	tokenClient?: google.accounts.oauth2.TokenClient;
	tokenCallback: MutableRefObject<
		undefined | ((resp: google.accounts.oauth2.TokenResponse) => void)
	>;
	next: () => Promise<void>;
	back: () => void;
}

const Step2Generate = ({
	docUrl,
	setDocUrl,
	googleReady,
	actionLoading,
	setActionLoading,
	error,
	setError,
	setDownload,
	setProgress,
	tokenCallback,
	tokenClient,
	next,
	back,
}: Step2GenerateProps): JSX.Element => {
	const [docUrlError, setDocUrlError] = useState('');

	const action = async (): Promise<void> => {
		let docId: string;
		const m = docUrlPattern.exec(docUrl);
		if (m && m[1].length > 0) {
			docId = m[1];
		} else if (docIdPattern.test(docUrl)) {
			docId = docUrl.trim();
		} else {
			setDocUrlError(DOC_INVALID_ERROR);
			return;
		}

		setDocUrlError('');
		setActionLoading(true);
		if (!(await googleReady)) {
			setActionLoading(false);
			return;
		}

		const revisions = await getAllRevisions(docId)
			.catch((error_: any) => {
				if (
					error_.result.error.code !== 401 &&
					(error_.result.error.code !== 403 ||
						error_.result.error.status !== 'PERMISSION_DENIED')
				) {
					throw new Error(error_);
				}
				if (tokenClient === undefined) {
					throw new Error('tokenClient is undefined');
				}
				return new Promise((resolve, reject) => {
					tokenCallback.current = (
						resp: google.accounts.oauth2.TokenResponse,
					): void => {
						if (resp.error !== undefined) {
							return reject(resp);
						}
						resolve(resp);
					};

					tokenClient.requestAccessToken();
				});
			})
			.then((_retry: any) => getAllRevisions(docId))
			.catch((error_: any) => {
				setError(`Google API error: ${error_}`);
			});

		if (!revisions) {
			setActionLoading(false);
			setError(DOC_FETCH_ERROR);
			return;
		}

		next();
		setProgress({ percent: 0, status: 'Creating Git repo...' });

		const vol = new Volume();
		const fs = createFsFromVolume(vol);
		await init({ fs, dir: '/' });

		const fetchParams = {
			headers: {
				Authorization: `Bearer ${gapi.client.getToken().access_token}`,
			},
		};

		let i = 0;
		for (const rev of revisions) {
			++i;
			if (rev.id === undefined || !rev.exportLinks) {
				continue;
			}

			const downloads = [];
			for (const [mimeType, url] of Object.entries(rev.exportLinks)) {
				if (mimeType in downloadMimeTypes) {
					const filepath = `doc.${downloadMimeTypes[mimeType]}`;
					downloads.push(
						fetch(url, fetchParams)
							.then((resp) => resp.arrayBuffer())
							.then((buf) => fs.writeFileSync(filepath, Buffer.from(buf)))
							.then(() => add({ fs, dir: '/', filepath })),
					);
				}
			}

			await Promise.all(downloads);
			await commit({
				fs,
				dir: '/',
				message: `Revision #${rev.id}`,
				author: {
					name: rev.lastModifyingUser?.displayName,
					email: rev.lastModifyingUser?.emailAddress,
					timestamp:
						rev.modifiedTime !== undefined
							? Math.floor(Date.parse(rev.modifiedTime) / 1000)
							: 0,
				},
			});

			setProgress({
				percent: (100 * i) / revisions.length,
				status: `Adding revision ${i} of ${revisions.length}`,
			});
		}

		setProgress({ percent: 100, status: 'Done' });

		const zipBlob = await zipFiles(fs);
		setDownload({
			download: `doc2git-${docId}.zip`,
			href: URL.createObjectURL(zipBlob),
		});
		setActionLoading(false);
	};

	return (
		<Step
			actionLoading={actionLoading}
			action={action}
			actionLabel="Generate"
			error={error}
			setError={setError}
			back={back}>
			<TextField
				label="URL or ID"
				value={docUrl}
				onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
					setDocUrl(event.target.value);
				}}
				error={docUrlError !== ''}
				helperText={docUrlError}
			/>
			,
		</Step>
	);
};

export default Step2Generate;
