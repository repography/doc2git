class Revisions {
	async list(
		_request?: gapi.client.Request<gapi.client.drive.RevisionList>,
	): Promise<gapi.client.drive.RevisionList> {
		const revisions: gapi.client.drive.Revision[] = [];
		return {
			kind: 'drive#revisionList',
			revisions,
		};
	}
}

export class Drive {
	revisions: Revisions = new Revisions();
}
