/**
 * Created by k33g_org on 29/01/16.
 */

import {Optional} from './Optional';
import {RuntimeException} from './RuntimeException';
//import {NullPointerException} from './NullPointerException';
import {NoSuchElementException} from './NoSuchElementException';
import {Objects} from './Objects';

export class Result {


  constructor(value, throwable) {
    this["value"] = value !== undefined ? value : null;
    this["error"] = throwable !== undefined ? throwable : null;
    //this[empty] = new Result();
  }

  static empty() {
    return new Result();
  }

  static ok (value) {
    return (value == null || value == undefined) ? Result.empty() : new Result(value, null);
  }

  static error(throwable) {
    return (throwable == null || throwable == undefined) ? Result.empty() : new Result(null, throwable);
  }

  static option(opt, message) {
    if(message==undefined) {
      if(!(opt instanceof Optional)) {
        throw new TypeError("This is not an Optional");
      }
      return (opt == null || opt == undefined || !opt.isPresent())
        ? Result.empty()
        : new Result(opt.get(), null);
    } else {
      return (opt == null || opt == undefined || !opt.isPresent())
        ? new Result(null, new NoSuchElementException(message))
        : new Result(opt.get(), null);
    }

  }

  static fail(message) {
    return Result.error(new RuntimeException(message));
  }

  get() {
    if(this["value"] !== null || this["value"] !== undefined) {
      return this["value"];
    }
    if(this["error"] !== null || this["error"] !== undefined) {
      throw this["error"];
    }
    throw new NoSuchElementException("Empty result")
  }

  toOptional() {
    if(this["value"] !== null || this["value"] !== undefined) {
      return Optional.of(this["value"]);
    }
    return Optional.empty();
  }

  /**
   * @todo Implement this function
   */
  toList() {

  }

  /**
   * @todo Implement this function
   */
  toErrorList() {

  }

  /**
   * @todo Implement this function
   */
  iterator() {

  }

  toOptionalError() {
    if(this["error"] !== null || this["error"] !== undefined) {
      return Optional.of(this["error"]);
    }
    return Optional.empty();
  }

  orElse(other) {
    return !(this["value"] == null || this["value"] == undefined)
      ? this["value"]
      : other;
  }

  /**
   * @todo to be verified
   * @param supplier
   * @returns {*}
   */
  orElseGet(supplier) {
    Objects.requireNonNull(supplier, "Supplier is null");
    Objects.requireFunction(supplier, "Supplier is not a function");
    return !(this["value"] == null || this["value"] == undefined)
      ? this["value"]
      : Objects.requireNonNull(supplier.apply(null), "Result is null");
  }

  isEmpty() {
    return (this["value"] == null || this["value"] == undefined) &&
      (this["error"] == null || this["error"] == undefined);
  }

  /**
   * @todo isError(Class<?> type)
   * @returns {boolean}
   */
  isError() {
    return (this["value"] == null || this["value"] == undefined) &&
      !(this["error"] == null || this["error"] == undefined);
  }

  isValue(val) {
    if(val == undefined) {
      return !(this["value"] == null || this["value"] == undefined) &&
        (this["error"] == null || this["error"] == undefined);
    } else {
      return this["value"] == val;
    }
  }

  map(mapper) {
    Objects.requireNonNull(mapper, "Mapper is null");
    Objects.requireFunction(mapper, "Mapper is not a function");

    if(this["value"] == null || this["value"] == undefined) {
      return this;
    }

    try {
      return Result.ok(mapper.apply(null, [this["value"]]));
    } catch (e) {
      return Result.error(e);
    }

  }

  /**
   * @todo Implement this function
   * @param mapper
   */
  mapError(mapper) {

  }


  flatMap(mapper) {
    Objects.requireNonNull(mapper, "Mapper is null");
    Objects.requireFunction(mapper, "Mapper is not a function");
    if(this.isEmpty() || this.isError()) {
      return this;
    }
    var res;
    try {
      return Objects.requireNonNull(mapper.apply(null, [this["value"]]), "Result is null");
    } catch (e) {
      return Result.error(e)
    }
  }

  /**
   * @todo Implement this function ... or Not
   */
  flattened() {

  }

  /**
   * @todo Implement this function ... or Not
   */
  andThen(mapper) {

  }

  either(mapping, recover) {
    if(this.isError()) {
      return recover.apply(null, [this["error"]]);
    }
    return mapping.apply(null, [this["value"]]);
  }

  filter(predicate) {
    Objects.requireNonNull(predicate, "Predicate is null");
    if(this.isEmpty() || this.isError()) {
      return this
    } else {
      return predicate.apply(null, [this["value"]])
        ? this
        : Result.empty();

    }
  }

  reduce(init, func) {
    if (this["value"] == null || this["value"] == undefined) {
      return init
    }
    return func.apply(null, [init, this["value"]])
  }

  /**
   * @todo Implement this function ... or Not
   * @param other
   */
  apply(other) {

  }

  /**
   * @param other
   */
  and(other) {
    if(!this.isError()) {
      return other;
    }
    return this;
  }

  /**
   * @param other
   */
  or(other) {
    if(this.isError()) {
      return other;
    }
    return this;
  }

  equals(obj) {
    if(obj == null || obj == undefined) {
      return false;
    }
    if(this == obj) {
      return true
    }
    if(!(obj instanceof Result)) {
      return false;
    }
    return this["value"] == obj["value"]
      && this["error"] == obj["error"];
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
    if(this.isEmpty()) {
      return "Result.empty";
    }
    if(this.isError()) {
      return `Result.error[${this["error"]}]`;
    }
    return `Result.value[${this["value"]}]`;
  }

  destruct() {
    return [this["error"], this["value"]];
  }

}