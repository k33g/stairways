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

class Result {


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