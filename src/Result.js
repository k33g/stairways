/**
 * Created by k33g_org on 29/01/16.
 */

import {Optional} from './Optional';
import {RuntimeException} from './RuntimeException';
//import {NullPointerException} from './NullPointerException';
import {NoSuchElementException} from './NoSuchElementException';
import {Objects} from './Objects';

export class Result {
  /*
    TODO: About privacy, see Symbol or WeakMap
   */

  constructor(value, throwable) {

    let private_value = value !== undefined ? value : null;
    let private_error = throwable !== undefined ? throwable : null;
    
    this._value = () => private_value;
    this._error = () => private_error;
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
    if(this._value() !== null || this._value() !== undefined) {
      return this._value();
    }
    if(this._error() !== null || this._error() !== undefined) {
      throw this._error();
    }
    throw new NoSuchElementException("Empty result")
  }

  toOptional() {
    if(this._value() !== null || this._value() !== undefined) {
      return Optional.of(this._value());
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
    if(this._error() !== null || this._error() !== undefined) {
      return Optional.of(this._error());
    }
    return Optional.empty();
  }

  orElse(other) {
    return !(this._value() == null || this._value() == undefined)
      ? this._value()
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
    return !(this._value() == null || this._value() == undefined)
      ? this._value()
      : Objects.requireNonNull(supplier.apply(null), "Result is null");
  }

  isEmpty() {
    return (this._value() == null || this._value() == undefined) &&
      (this._error() == null || this._error() == undefined);
  }

  /**
   * @todo isError(Class<?> type)
   * @returns {boolean}
   */
  isError() {
    return (this._value() == null || this._value() == undefined) &&
      !(this._error() == null || this._error() == undefined);
  }

  isValue(val) {
    if(val == undefined) {
      return !(this._value() == null || this._value() == undefined) &&
        (this._error() == null || this._error() == undefined);
    } else {
      return this._value() == val;
    }
  }

  map(mapper) {
    Objects.requireNonNull(mapper, "Mapper is null");
    Objects.requireFunction(mapper, "Mapper is not a function");

    if(this._value() == null || this._value() == undefined) {
      return this;
    }

    try {
      return Result.ok(mapper.apply(null, [this._value()]));
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
      return Objects.requireNonNull(mapper.apply(null, [this._value()]), "Result is null");
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
      return recover.apply(null, [this._error()]);
    }
    return mapping.apply(null, [this._value()]);
  }

  filter(predicate) {
    Objects.requireNonNull(predicate, "Predicate is null");
    if(this.isEmpty() || this.isError()) {
      return this
    } else {
      return predicate.apply(null, [this._value()])
        ? this
        : Result.empty();

    }
  }

  reduce(init, func) {
    if (this._value() == null || this._value() == undefined) {
      return init
    }
    return func.apply(null, [init, this._value()])
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
    return this._value() == obj["value"]
      && this._error() == obj["error"];
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
      return `Result.error[${this._error()}]`;
    }
    return `Result.value[${this._value()}]`;
  }

  destruct() {
    return [this._error(), this._value()];
  }

}