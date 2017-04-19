'use strict';

const Operation = use('App/Operations/Operation');
const Helpers = use('Helpers');
const mkdirp = use('mkdirp');
const { HttpException } = use('node-exceptions');
const Env = use('Env');
const HTTPResponse = use('App/HTTPResponse');
const moment = use('moment');

/**
 * Operations related to Audios
 *
 * @author glen
 */
class AudioOperation extends Operation {
  constructor (args) {
    super(args);

    this.model = null;
    this.audioFile = null;
  }

  * attachUrlFromAudioFile(model) {
    this.model = model;

    if (!this.audioFile || !this.audioFile.exists) {
      return this.model;
    }

    const audioDir = this.model.getAudioDirectory(this.model.id);
    const fileName = this.model.getAudioFileName(this.audioFile.extension());
    const publicPath = `../${audioDir}`;

    mkdirp.sync(publicPath);

    yield this.audioFile.move(publicPath, fileName);

    if (!this.audioFile.moved()) {
      throw new HttpException(this.audioFile.errors());
    }

    this.model.setAudioUrl(`/${audioDir}/${fileName}`);

    return this.model;
  }

  static * getAudioUrlFromFile(audioFile, directory, filename) {
    if (!audioFile.exists) {
      throw new HttpException('Audio file not found.', HttpResponse.STATUS_NOT_FOUND);
    }

    const fileName = `${filename}.${audioFile.extension()}`;
    const publicPath = `${Helpers.publicPath()}/${directory}`;

    mkdirp.sync(publicPath);

    yield audioFile.move(publicPath, fileName);

    if (!audioFile.moved()) {
      throw new HttpException(audioFile.errors());
    }

    return `/${directory}/${fileName}`;
  }
}

module.exports = AudioOperation;
