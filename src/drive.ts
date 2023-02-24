export const driveDiscoveryUrl =
	'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
export const driveScope = 'https://www.googleapis.com/auth/drive.readonly';

const listRevisionsPageSize = 100;

export async function getAllRevisions(
	fileId: string,
): Promise<gapi.client.drive.Revision[]> {
	const revisions = [];
	let pageToken;
	while (true) {
		const page: gapi.client.Response<gapi.client.drive.RevisionList> =
			await gapi.client.drive.revisions.list({
				fileId,
				fields: 'revisions(id,exportLinks,modifiedTime,lastModifyingUser)',
				pageSize: listRevisionsPageSize,
				pageToken,
			});
		if (page.result.revisions !== undefined) {
			revisions.push(...page.result.revisions);
		}
		if (page.result.nextPageToken === undefined) {
			break;
		}
		pageToken = page.result.nextPageToken;
	}
	return revisions;
}
