const crypto = require('crypto');
const foldersService = require('../../src/services/foldersService');
const foldersQueries = require('../../src/services/queries/foldersQueries');

jest.mock('../../src/services/queries/foldersQueries');

describe('Folders Service Tests', () => {
  const mockUserId = 'test-user-id';
  const mockFolderId = crypto.randomUUID();
  const mockParentFolderId = crypto.randomUUID();
  const mockFolderName = 'Test Folder';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test: Create a new folder
  it('should create a new folder', async () => {
    foldersQueries.createFolder.mockResolvedValue({
      id: mockFolderId,
      name: mockFolderName,
      userId: mockUserId,
      parentFolderId: null,
    });

    const result = await foldersService.createFolder(mockFolderName, null, mockUserId);

    expect(foldersQueries.createFolder).toHaveBeenCalledWith(
      expect.any(String), // folderId
      mockFolderName,
      mockUserId,
      null
    );
    expect(result).toEqual({
      id: mockFolderId,
      name: mockFolderName,
      userId: mockUserId,
      parentFolderId: null,
    });
  });

  // ✅ Test: Create a folder with a parent folder
  it('should create a new folder under a parent folder', async () => {
    foldersQueries.createFolder.mockResolvedValue({
      id: mockFolderId,
      name: mockFolderName,
      userId: mockUserId,
      parentFolderId: mockParentFolderId,
    });

    const result = await foldersService.createFolder(mockFolderName, mockParentFolderId, mockUserId);

    expect(foldersQueries.createFolder).toHaveBeenCalledWith(
      expect.any(String),
      mockFolderName,
      mockUserId,
      mockParentFolderId
    );
    expect(result).toEqual({
      id: mockFolderId,
      name: mockFolderName,
      userId: mockUserId,
      parentFolderId: mockParentFolderId,
    });
  });

  // ✅ Test: Update an existing folder successfully
  it('should update a folder successfully', async () => {
    foldersQueries.updateFolder.mockResolvedValue(1);

    const result = await foldersService.updatefolder(mockFolderId, 'Updated Folder', null, mockUserId);

    expect(foldersQueries.updateFolder).toHaveBeenCalledWith(mockFolderId, 'Updated Folder', mockUserId, null);
    expect(result).toEqual({ message: 'Folder updated successfully' });
  });

  // ❌ Test: Return an error when updating a non-existing folder
  it('should throw an error when folder is not found', async () => {
    foldersQueries.updateFolder.mockResolvedValue(0);

    await expect(
      foldersService.updatefolder(mockFolderId, 'Updated Folder', null, mockUserId)
    ).rejects.toThrow('Folder not found');

    expect(foldersQueries.updateFolder).toHaveBeenCalledWith(mockFolderId, 'Updated Folder', mockUserId, null);
  });

  // ✅ Test: Delete a folder successfully
  it('should delete a folder successfully', async () => {
    foldersQueries.markFolderAndContentsAsDeleted.mockResolvedValue();

    const result = await foldersService.deleteFolder(mockFolderId, mockUserId);

    expect(foldersQueries.markFolderAndContentsAsDeleted).toHaveBeenCalledWith(mockFolderId, mockUserId);
    expect(result).toEqual({ message: 'Folder deleted successfully' });
  });
});
