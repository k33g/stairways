/**
 * Created by k33g_org on 29/01/16.
 */
import {ExtendableException} from './ExtendableException';

export class NullPointerException extends ExtendableException {
  constructor(message) {
    super(message);
  }
}
