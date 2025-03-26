/**
 * Storage Adapter base class
 */
class StorageAdapter {
  getFileURI(fileId, containerName, environmentId) {
    throw new Error('StorageAdapter~getFileURI method not implemented');
  }

  getStorageContainer(environmentId) {
    throw new Error('StorageAdapter~getStorageContainer method not implemented');
  }

  deleteFile(container, fileName) {
    throw new Error('StorageAdapter~deleteFile method not implemented');
  }

  uploadFile(user, file, fileId, containerName) {
    throw new Error('StorageAdapter~uploadFile method not implemented');
  }
}

module.exports = { StorageAdapter };
