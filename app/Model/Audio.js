'use strict';

const Lucid = use('Lucid')

class Audio extends Lucid {

  /**
   * Get the audio directory path
   *
   * @returns {string}
   */
  static getAudioDirectory() {
    return `uploads/audios`;
  }
}

module.exports = Audio;
