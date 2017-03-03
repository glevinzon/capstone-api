'use strict';

const Lucid = use('Lucid')

class Audio extends Lucid {

  /**
   * Get the audio directory path
   *
   * @returns {string}
   */
  static getAudioDirectory() {
    return `audios/recordings`;
  }
}

module.exports = Audio;
