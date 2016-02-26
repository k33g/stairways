/**
 * Created by k33g_org on 26/02/16.
 */

/**
 * Classs representing Identity type
 * 
 * example:
 * let compute = (a,b) => Identity.of(100)
 *      .map(value => value + a)
 *      .map(value => value * b)
 *      .get();
 * 
 */
export class Identity {
  
  constructor(value) {
    let private_value = value !== undefined ? value : null;
    this.get = () => private_value;
  }
  
  bind(callBack) {
    return callBack(this.get());
  }
  
  map(callBack) {
    return new Identity(callBack(this.get()));
  }

  static of(value) {
    return new Identity(value);
  }

  /**
   * @override
   */
  toString() {
    return `Identity.value[${this.get()}]`;
  }
}