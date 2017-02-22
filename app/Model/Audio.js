'use strict';

const Lucid = use('Lucid')

class Audio extends Lucid {

  /**
   * Get the image directory path
   *
   * @returns {string}
   */
  static getImageDirectory() {
    return `audios/recordings`;
  }
}

module.exports = Audio;
