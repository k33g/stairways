/**
 * Created by k33g_org on 29/01/16.
 *
 */

class ExtendableException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name)
  }
}

class NullPointerException extends ExtendableException {
  constructor(message) {
    super(message);
  }
}

class NoSuchElementException extends ExtendableException {
  constructor(message) {
    super(message);
  }
}

class RuntimeException extends ExtendableException {
  constructor(message) {
    super(message);
  }
}

class Objects {

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

/*
 http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8-b132/java/util/Optional.java

 Build:
 traceur --out o.js ../node_modules/traceur/bin/traceur-runtime.js Exceptions.js Objects.js Optional.js --outputLanguage es5


 */
class Optional {

  constructor(value) {
    let private_value = value !== undefined ? value : null;

    if(value==null && value!==undefined) { // if undefined then null
      throw new NullPointerException("Null value")
    }

    this.get = () => {
      /*
      if (private_value == null || undefined) {
        throw new NoSuchElementException("No value present");
      }
      */
      return private_value;
    }
    /*
    this.getValue = () => { // with no Exception
      return private_value;
    }
    */
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

  /*
  get() {
    if (this["value"] == null || undefined) {
      throw new NoSuchElementException("No value present");
    }
    return this["value"];
  }
  */

  isPresent() {
    if(arguments.length!=0) {
      if(!(this.get() == null || this.get() == undefined)) {
        let consumer = arguments[0]
        Objects.requireNonNull(consumer, "Consumer is null");
        consumer(this.get());
      }
    } else {
      return !(this.get() == null || this.get() == undefined)
    }

  }

  filter(predicate) {
    Objects.requireNonNull(predicate, "Predicate is null");
    if(!this.isPresent()) {
      return this
    } else {
      //return predicate(this["value"]) ? this : Optional.empty();
      return predicate.apply(null, [this.get()]) ? this : Optional.empty();

    }
  }

  map(mapper) {
    Objects.requireNonNull(mapper, "Mapper is null");
    Objects.requireFunction(mapper, "Mapper is not a function");
    if(!this.isPresent()) {
      return Optional.empty();
    } else {
      //return Optional.ofNullable(mapper(this["value"]));
      return Optional.ofNullable(mapper.apply(null, [this.get()]));
    }
  }

  // mapper must return an optional
  flatMap(mapper) {
    Objects.requireNonNull(mapper, "Mapper is null");
    Objects.requireFunction(mapper, "Mapper is not a function");
    if(!this.isPresent()) {
      return Optional.empty();
    } else {
      let res = Objects.requireNonNull(mapper.apply(null, [this.get()]), "Result is null");
      
      if(res instanceof Optional) {
        return res;
      } else {
        throw new TypeError("The provided mapper must return an Optional");
      }

    }
  }

  orElse(other) {
    return !(this.get() == null || this.get() == undefined) ? this.get() : other;
  }


  orElseGet(supplier) {
    Objects.requireNonNull(supplier, "Supplier is null");
    Objects.requireFunction(supplier, "Supplier is not a function");
    return !(this.get() == null || this.get() == undefined)
      ? this.get()
      : Objects.requireNonNull(supplier.apply(null, [this.get()]), "Result is null");
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
    return this.get() == obj.get();
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
    return !(this.get() == null || this.get() == undefined)
      ? `Optional[${this.get()}]` : "Optional.empty";
  }

}

class Result {
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
class Identity {
  
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

/**
 * Created by k33g_org on 04/02/16.
 */

class Version {
  static number() {
    return [0,0,0];
  }
}

export { ExtendableException, NullPointerException, NoSuchElementException, RuntimeException, Objects, Optional, Result, Identity, Version };