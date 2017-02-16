'use strict';

const Lucid = use('Lucid')

class AudioRecording extends Lucid {

  /**
   * Get the image directory path
   *
   * @returns {string}
   */
  static getImageDirectory() {
    return `audio/recordings`;
  }
}

module.exports = AudioRecording;
