const buildFolderTree = require('../../src/utils/buildFolderTree');

describe('buildFolderTree', () => {
  test('should build a folder tree with the correct structure', () => {
    const folders = [
      { id: '1', name: 'Folder 1', parent_folder_id: null },
      { id: '2', name: 'Folder 2', parent_folder_id: '1' },
      { id: '3', name: 'Folder 3', parent_folder_id: '1' },
      { id: '4', name: 'Folder 4', parent_folder_id: '2' }
    ];

    const notes = [
      { id: '1', title: 'Note 1', folder_id: null },
      { id: '2', title: 'Note 2', folder_id: '1' },
      { id: '3', title: 'Note 3', folder_id: '2' },
      { id: '4', title: 'Note 4', folder_id: '3' },
      { id: '5', title: 'Note 5', folder_id: '4' }
    ];

    const expectedTree = {
      id: 0,
      name: 'Root',
      children: [
        {
          id: '1',
          name: 'Folder 1',
          children: [
            {
              id: '2',
              name: 'Folder 2',
              children: [
                {
                  id: '4',
                  name: 'Folder 4',
                  children: [],
                  notes: [{ id: '5', title: 'Note 5', folder_id: '4' }]
                }
              ],
              notes: [{ id: '3', title: 'Note 3', folder_id: '2' }]
            },
            {
              id: '3',
              name: 'Folder 3',
              children: [],
              notes: [{ id: '4', title: 'Note 4', folder_id: '3' }]
            }
          ],
          notes: [{ id: '2', title: 'Note 2', folder_id: '1' }]
        }
      ],
      notes: [{ id: '1', title: 'Note 1', folder_id: null }]
    };

    const result = buildFolderTree(folders, notes);
    expect(result).toEqual(expectedTree);
  });
});