/**
 * Created by k33g_org on 29/01/16.
 */

import {NullPointerException} from './NullPointerException';

export class Objects {

  static requireNonNull(obj, message) {
    if(obj==null) {
      throw new NullPointerException(message)
    }
    return obj;
  }

  static requireFunction(obj, message) {
    if(typeof obj !== 'function') {
      throw new TypeError(message)
    }
    return obj;
  }

}