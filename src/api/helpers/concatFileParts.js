const FileJobStatuses = require("../constants/enums/FileJobStatuses");
const FileRepository = require("../repositories/FileRepository");
const TransactionService = require("../services/TransactionService");

/**
 * Concatenate file parts into a buffer.
 * We're doing this here because this helps with - 
 *
 * - Memory Efficiency
 * - Ease of Processing
 * - Compatibility with Storage Services
 *
 * @param {Object} parts - The parts from the multipart request.
 * @returns {Promise<Array>} - An array of file objects with buffer data.
 */
async function concatFileParts(parts) {
  const files = [];

  for await (const part of parts) {
    if (part.file) {
      // Accumulate the file data
      const chunks = [];
      for await (const chunk of part.file) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);
      files.push({
        filename: part.filename,
        mimetype: part.mimetype,
        buffer: buffer,
        originalname: part.filename,
      });
    }
  }

  return { files };
}

module.exports = { concatFileParts };
