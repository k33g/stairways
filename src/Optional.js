import {NullPointerException} from './NullPointerException';
import {NoSuchElementException} from './NoSuchElementException';

import {Objects} from './Objects.js';

/*
 http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8-b132/java/util/Optional.java

 Build:
 traceur --out o.js ../node_modules/traceur/bin/traceur-runtime.js Exceptions.js Objects.js Optional.js --outputLanguage es5


 */
export class Optional {

  constructor(value) {
    this["value"] = value !== undefined ? value : null;
    if(value==null && value!==undefined) { // if undefined then null
      throw new NullPointerException("Null value")
    }
  }

  static empty() {
    return new Optional();
  }

  static of(value) {
    return new Optional(value)
  }

  static ofNullable(value) {
    return value == null || undefined ? Optional.empty() : Optional.of(value);
  }

  get() {
    if (this["value"] == null || undefined) {
      throw new NoSuchElementException("No value present");
    }
    return this["value"];
  }

  isPresent() {
    if(arguments.length!=0) {
      if(!(this["value"] == null || this["value"] == undefined)) {
        let consumer = arguments[0]
        Objects.requireNonNull(consumer, "Consumer is null");
        consumer(this["value"]);
      }
    } else {
      return !(this["value"] == null || this["value"] == undefined)
    }

  }

  filter(predicate) {
    Objects.requireNonNull(predicate, "Predicate is null");
    if(!this.isPresent()) {
      return this
    } else {
      //return predicate(this["value"]) ? this : Optional.empty();
      return predicate.apply(null, [this["value"]]) ? this : Optional.empty();

    }
  }

  map(mapper) {
    Objects.requireNonNull(mapper, "Mapper is null");
    Objects.requireFunction(mapper, "Mapper is not a function");
    if(!this.isPresent()) {
      return Optional.empty();
    } else {
      //return Optional.ofNullable(mapper(this["value"]));
      return Optional.ofNullable(mapper.apply(null, [this["value"]]));
    }
  }

  // mapper must return an optional
  flatMap(mapper) {
    Objects.requireNonNull(mapper, "Mapper is null");
    Objects.requireFunction(mapper, "Mapper is not a function");
    if(!this.isPresent()) {
      return Optional.empty();
    } else {
      let res = Objects.requireNonNull(mapper.apply(null, [this["value"]]), "Result is null");
      
      if(res instanceof Optional) {
        return res;
      } else {
        throw new TypeError("The provided mapper must return an Optional");
      }

    }
  }

  orElse(other) {
    return !(this["value"] == null || this["value"] == undefined) ? this["value"] : other;
  }


  orElseGet(supplier) {
    Objects.requireNonNull(supplier, "Supplier is null");
    Objects.requireFunction(supplier, "Supplier is not a function");
    return !(this["value"] == null || this["value"] == undefined)
      ? this["value"]
      : Objects.requireNonNull(supplier.apply(null, [this["value"]]), "Result is null");
  }

  /**
   * @todo Implement this function
   * @param supplier
   */
  orElseThrow(supplier) {
    // WIP
  }

  /**
   * @override
   * @param obj
   * @returns {boolean}
   */
  equals(obj) {
    if(this==obj) {
      return true;
    }
    if(!(obj instanceof Optional)) {
      return false;
    }
    return this["value"] == obj["value"];
  }

  /**
   * @todo Implement this function ... or Not
   * @override
   */
  hashCode() {
    //WIP
  }

  /**
   * @override
   */
  toString() {
    return !(this["value"] == null || this["value"] == undefined)
      ? `Optional[${this["value"]}]` : "Optional.empty";
  }

}
