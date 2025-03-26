const BlobStorageService = require("../services/BlobStorageService");
const TransactionService = require("../services/TransactionService");
const FileRepository = require("../repositories/FileRepository");
const FileJobStatuses = require("../constants/enums/FileJobStatuses");
const { concatFileParts } = require("../helpers/concatFileParts");

module.exports = {
  /**
   * Upload multiple files to Blob Storage
   *
   * @param {Object} req - Fastify request object
   * @param {Object} reply - Fastify reply object
   */
  uploadFiles: async function (req, reply) {
    let transaction;
    try {
      const parts = req.parts();
      const user = req.user;
      const environmentId = user.activeEnvironment;

      console.log({ user, environmentId });

      let { files } = await concatFileParts(parts);

      if (files.length === 0) {
        return reply.code(400).send({
          success: false,
          result: "No files were uploaded",
        });
      }

      console.log({ files });

      // Start a transaction
      transaction = await TransactionService.start();

      // Create file entries for each file with file_uri set to null to being upload
      const fileJobs = await Promise.all(
        files.map(async (file) => {
          const fileJob = await FileRepository.create(
            {
              file_uri: null, // Initially set to null
              status: FileJobStatuses.PENDING,
              file_name: file.filename,
              uploader_id: user.id,
              environment_id: environmentId,
            },
            transaction
          );

          const fileName = `${file.filename}`;

          // Upload the file via the adapter - currently Azure Blob adapter
          const uploadResult = await BlobStorageService.uploadFile(
            user,
            file,
            fileJob.id
          );

          // @TODO - Build recovery and failure mechanisms if the file upload fails 

          console.log('=========>', { id: fileJob.id, uploadResult });

          // Update the file with the file URL and the status
          await FileRepository.update(
            {
              data: {
                status: FileJobStatuses.SUCCESS,
                // file_uri: uploadResult.uri,
              },
              where: { id: fileJob.id },
            },
            transaction
          );

          return { ...fileJob.toJSON(), file: fileName };
        })
      );

      console.log({ fileJobs });

      // Commit the transaction
      await TransactionService.commit(transaction);

      return reply.code(200).send({
        success: true,
        result: fileJobs,
      });
    } catch (error) {
      if (transaction) await TransactionService.rollback(transaction);

      return reply.code(500).send({
        success: false,
        result: error.message,
      });
    }
  },
};
