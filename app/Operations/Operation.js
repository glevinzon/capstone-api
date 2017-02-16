'use strict'

const Validator = use('Validator')

class Operation {

  constructor() {
    this.errors = []
    this.validator = Validator
  }

  get rules() {
    return {}
  }

  * validate() {
    this.errors = []

    let validation = yield this.validator.validate(this, this.rules)

    if (!validation.fails()) {
      return true
    }

    validation.messages().map(err => {
      this.addError(400, err.message)
    });

    return false
  }

  /**
   * Adds an error code and message to the array of errors
   *
   * @author glen
   * @param {Integer} errorCode
   * @param {String} errorMessage
   */
  addError(code, message) {
    this.errors.push({code, message})
  }

  /**
   * Gets the first error in the list
   *
   * @author glen
   * @return {Array}
   */
  getFirstError() {
    return this.errors[0]
  }

  /**
   * Gets all the errors
   *
   * @author glen
   * @return {Array}
   */
  getErrors() {
    return this.errors
  }
}

module.exports = Operation
