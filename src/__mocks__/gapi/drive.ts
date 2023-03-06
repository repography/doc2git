const kindList = 'drive#revisionList';
const kindRevision = 'drive#revision';

const mockUsers: Record<string, gapi.client.drive.User> = {
	john: {
		displayName: 'John Doe',
		emailAddress: 'johndoe@example.com',
	},
	jane: {
		displayName: 'Jane Doe',
		emailAddress: 'janedoe@example.com',
	},
	alice: {
		displayName: 'Alice Doe',
		emailAddress: 'alicedoe@example.com',
	},
	bob: {
		displayName: 'Bob Doe',
		emailAddress: 'bobdoe@example.com',
	},
};

interface MockRevision {
	content: string;
}

export const mockRevisions: Record<
	string,
	(MockRevision & gapi.client.drive.Revision)[]
> = {
	'one-empty-revision': [
		{
			id: '0',
			lastModifyingUser: mockUsers.john,
			modifiedTime: '2023-01-01T08:00:00Z',
			content: '',
			exportLinks: {
				'text/plain': 'https://export.google.com/one-empty-revision/0',
			},
		},
	],
	'several-revisions': [
		{
			id: '0',
			lastModifyingUser: mockUsers.john,
			modifiedTime: '2023-01-01T08:00:00Z',
			content: '',
			exportLinks: {
				'text/plain': 'https://export.google.com/several-revisions/0',
			},
		},
		{
			id: '1',
			lastModifyingUser: mockUsers.john,
			modifiedTime: '2023-01-01T08:00:01Z',
			content: 'hello world',
			exportLinks: {
				'text/plain': 'https://export.google.com/several-revisions/1',
			},
		},
		{
			id: '2',
			lastModifyingUser: mockUsers.john,
			modifiedTime: '2023-01-01T08:00:02Z',
			content: 'hello world this is a test',
			exportLinks: {
				'text/plain': 'https://export.google.com/several-revisions/2',
			},
		},
		{
			id: '10',
			lastModifyingUser: mockUsers.john,
			modifiedTime: '2023-01-01T08:01:02Z',
			content: 'goodbye world',
			exportLinks: {
				'text/plain': 'https://export.google.com/several-revisions/10',
			},
		},
	],
	'multiple-authors': [
		{
			id: '0',
			lastModifyingUser: mockUsers.bob,
			modifiedTime: '2023-01-01T08:00:00Z',
			content: '',
			exportLinks: {
				'text/plain': 'https://export.google.com/multiple-authors/0',
			},
		},
		{
			id: '1',
			lastModifyingUser: mockUsers.bob,
			modifiedTime: '2023-01-01T08:01:00Z',
			content: `Pasta Carbonara

Ingredients:
Method:`,
			exportLinks: {
				'text/plain': 'https://export.google.com/multiple-authors/10',
			},
		},
		{
			id: '2',
			lastModifyingUser: mockUsers.alice,
			modifiedTime: '2023-01-01T08:02:00Z',
			content: `Pasta Carbonara

Ingredients:
* Bacon 

Method:`,
			exportLinks: {
				'text/plain': 'https://export.google.com/multiple-authors/2',
			},
		},
		{
			id: '3',
			lastModifyingUser: mockUsers.john,
			modifiedTime: '2023-01-01T08:04:00Z',
			content: `Pasta Carbonara

Ingredients:
* Bacon 
* Pasta
* Cream

Method:
* Mix all the ingredients together
* Cook
`,
			exportLinks: {
				'text/plain': 'https://export.google.com/multiple-authors/3',
			},
		},
	],
};

const mockPageSize = 2;

class Revisions {
	async list(request: {
		fileId: string;
		_pageSize?: number;
		pageToken?: string;
	}): Promise<gapi.client.Response<gapi.client.drive.RevisionList>> {
		if (!(request.fileId in mockRevisions)) {
			throw new Error(`${request.fileId} missing or unauthorized`);
		}
		let offset =
			request.pageToken === undefined ? 0 : parseInt(request.pageToken);
		const result: gapi.client.drive.RevisionList = {
			kind: kindList,
			revisions: mockRevisions[request.fileId].slice(
				offset,
				offset + mockPageSize,
			),
		};
		offset += mockPageSize;
		if (offset < mockRevisions[request.fileId].length - 1) {
			result.nextPageToken = offset.toString();
		}
		return { body: '', result };
	}
}

export class Drive {
	revisions: Revisions = new Revisions();
}
