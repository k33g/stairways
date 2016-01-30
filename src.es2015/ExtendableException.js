/**
 * Created by k33g_org on 29/01/16.
 */

export class ExtendableException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name)
  }
}
