const { StorageAdapter } = require('./StorageAdapter');

/**
 * Azure storage adapter
 */
class AzureStorageAdapter extends StorageAdapter {
  getFileURI(fileId, containerName, environmentId) {
    const container = this.getStorageContainer(environmentId);
    return `https://aptible.blob.core.windows.net/${container}/${fileId}`;
  }

  getStorageContainer(environmentId) {
    return `${app.config.azure.storage.containers.iris}/${environmentId}`;
  }

  async deleteFile(container, fileName) {
    return Promise.resolve(true);
  }

  async uploadFile(user, file, fileId, containerName) {
    const fakeUpload = {
      status: 'success',
      uri: this.getFileURI(fileId, containerName, user.activeEnvironment)
    };

    return Promise.resolve(fakeUpload);
  }
}

module.exports = { AzureStorageAdapter };
