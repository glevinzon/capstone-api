'use strict';

const Lucid = use('Lucid')

class Audio extends Lucid {

  /**
   * Get the audio directory path
   *
   * @returns {string}
   */
  static getAudioDirectory() {
    return `assets/uploads/audios`;
  }
}

module.exports = Audio;
