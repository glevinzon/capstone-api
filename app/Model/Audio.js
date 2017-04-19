'use strict';

const Lucid = use('Lucid')

class Audio extends Lucid {

  /**
   * Get the audio directory path
   *
   * @returns {string}
   */
  static getAudioDirectory() {
    return `assets/audios/recordings`;
  }
}

module.exports = Audio;
