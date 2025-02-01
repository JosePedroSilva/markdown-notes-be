const crypto = require('crypto');
const notesService = require('../../src/services/notesService');
const notesQueries = require('../../src/services/queries/notesQueries');
const foldersQueries = require('../../src/services/queries/foldersQueries');
const buildFolderTree = require('../../src/utils/buildFolderTree');

jest.mock('../../src/services/queries/notesQueries');
jest.mock('../../src/services/queries/foldersQueries');
jest.mock('../../src/utils/buildFolderTree');

describe('Notes Service Tests', () => {
  const mockUserId = 'test-user-id';
  const mockNoteId = crypto.randomUUID();
  const mockFolderId = crypto.randomUUID();
  const mockTitle = 'Test Note';
  const mockContent = 'This is a test note';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test: Create a new note
  it('should create a note successfully', async () => {
    notesQueries.createNote.mockResolvedValue({
      id: mockNoteId,
      title: mockTitle,
      content: mockContent,
      userId: mockUserId,
      folderId: null,
    });

    const result = await notesService.createNote(mockTitle, mockContent, null, mockUserId);

    expect(notesQueries.createNote).toHaveBeenCalledWith(expect.any(String), mockTitle, mockContent, mockUserId, null);
    expect(result).toEqual({
      id: mockNoteId,
      title: mockTitle,
      content: mockContent,
      userId: mockUserId,
      folderId: null,
    });
  });

  // ✅ Test: Fetch a note by ID
  it('should fetch a note by ID', async () => {
    notesQueries.getNoteById.mockResolvedValue({
      id: mockNoteId,
      title: mockTitle,
      content: mockContent,
      userId: mockUserId,
      folderId: null,
    });

    const result = await notesService.getNoteById(mockNoteId, mockUserId);

    expect(notesQueries.getNoteById).toHaveBeenCalledWith(mockNoteId, mockUserId);
    expect(result).toEqual({
      id: mockNoteId,
      title: mockTitle,
      content: mockContent,
      userId: mockUserId,
      folderId: null,
    });
  });

  // ❌ Test: Fetch a non-existing note (should return null)
  it('should return null if note does not exist', async () => {
    notesQueries.getNoteById.mockResolvedValue(null);

    const result = await notesService.getNoteById(mockNoteId, mockUserId);

    expect(notesQueries.getNoteById).toHaveBeenCalledWith(mockNoteId, mockUserId);
    expect(result).toBeNull();
  });

  // ✅ Test: Update an existing note
  it('should update a note successfully', async () => {
    notesQueries.getNoteById.mockResolvedValue({
      id: mockNoteId,
      title: mockTitle,
      content: mockContent,
      userId: mockUserId,
      folderId: null,
    });

    notesQueries.updateNote.mockResolvedValue(1);

    const result = await notesService.updateNote(mockNoteId, 'Updated Title', 'Updated Content', null, mockUserId);

    expect(notesQueries.getNoteById).toHaveBeenCalledWith(mockNoteId, mockUserId);
    expect(notesQueries.updateNote).toHaveBeenCalledWith(mockNoteId, 'Updated Title', 'Updated Content', null, mockUserId);
    expect(result).toEqual({ message: 'Note updated' });
  });

  // ❌ Test: Update a non-existing note (should throw an error)
  it('should throw an error when updating a non-existing note', async () => {
    notesQueries.getNoteById.mockResolvedValue(null);

    await expect(
      notesService.updateNote(mockNoteId, 'Updated Title', 'Updated Content', null, mockUserId)
    ).rejects.toThrow('Note not found');

    expect(notesQueries.getNoteById).toHaveBeenCalledWith(mockNoteId, mockUserId);
  });

  // ✅ Test: Delete an existing note
  it('should delete a note successfully', async () => {
    notesQueries.getNoteById.mockResolvedValue({
      id: mockNoteId,
      title: mockTitle,
      content: mockContent,
      userId: mockUserId,
      folderId: null,
    });

    notesQueries.deleteNoteById.mockResolvedValue(1);

    const result = await notesService.deleteNote(mockNoteId, mockUserId);

    expect(notesQueries.getNoteById).toHaveBeenCalledWith(mockNoteId, mockUserId);
    expect(notesQueries.deleteNoteById).toHaveBeenCalledWith(mockNoteId, mockUserId);
    expect(result).toEqual({ message: 'Note deleted' });
  });

  // ❌ Test: Delete a non-existing note (should throw an error)
  it('should throw an error when deleting a non-existing note', async () => {
    notesQueries.getNoteById.mockResolvedValue(null);

    await expect(notesService.deleteNote(mockNoteId, mockUserId)).rejects.toThrow('Note not found');

    expect(notesQueries.getNoteById).toHaveBeenCalledWith(mockNoteId, mockUserId);
  });

  // ✅ Test: Get all notes and folders as a tree
  it('should fetch all notes and folders and return a folder tree', async () => {
    const mockNotes = [
      { id: mockNoteId, title: mockTitle, content: mockContent, userId: mockUserId, folderId: null },
    ];
    const mockFolders = [
      { id: mockFolderId, name: 'Test Folder', userId: mockUserId, parentFolderId: null },
    ];
    const mockFolderTree = { folders: mockFolders, notes: mockNotes };

    notesQueries.getAllNotesByUserId.mockResolvedValue(mockNotes);
    foldersQueries.getFoldersByUserId.mockResolvedValue(mockFolders);
    buildFolderTree.mockReturnValue(mockFolderTree);

    const result = await notesService.getAllNotesAndFoldersTree(mockUserId);

    expect(notesQueries.getAllNotesByUserId).toHaveBeenCalledWith(mockUserId);
    expect(foldersQueries.getFoldersByUserId).toHaveBeenCalledWith(mockUserId);
    expect(buildFolderTree).toHaveBeenCalledWith(mockFolders, mockNotes);
    expect(result).toEqual(mockFolderTree);
  });
});
