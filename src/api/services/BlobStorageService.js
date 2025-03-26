const { AzureStorageAdapter } = require('../adapters/AzureStorageAdapter');

module.exports = {
  // Adapters could be changed out for different storages and implement their own
  // handling of ACL mappings or be selected as per client.
  adapter: new AzureStorageAdapter(),

  /**
   * Get the file URI
   * 
   * @param {Object} user 
   * @param {Number} fileId 
   * @param {String} containerName 
   * @param {Number} environmentId 
   *
   * @returns File URI
   */
  getFileURI: function (fileId, containerName, environmentId) {
    return this.adapter.getFileURI(fileId, containerName, environmentId);
  },

  /**
   * Get the storage container for the environment
   *
   * @param {Number} environmentId
   */
  getStorageContainer: async function (environmentId) {
    return this.adapter.getStorageContainer(environmentId);
  },

  /**
   * Delete a file from a container
   * 
   * @param {String} container 
   * @param {String} fileName 
   */
  deleteFile: async function (container, fileName) {
    return this.adapter.deleteFile(container, fileName);
  },

  /**
   * Upload a single file to Azure Blob Storage
   *
   * @param {Object} file - The file to upload
   * @returns {Promise<Object>} - The uploaded file details
   */
  uploadFile: async function (user, file, fileId) {
    const container = this.getStorageContainer(user.activeEnvironment);
    return this.adapter.uploadFile(user, file, fileId, container);
  }
};
