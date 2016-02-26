(function (exports) {
  'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  babelHelpers;

  /**
   * Created by k33g_org on 29/01/16.
   *
   */

  var ExtendableException = function (_Error) {
    babelHelpers.inherits(ExtendableException, _Error);

    function ExtendableException(message) {
      babelHelpers.classCallCheck(this, ExtendableException);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ExtendableException).call(this, message));

      _this.name = _this.constructor.name;
      _this.message = message;
      Error.captureStackTrace(_this, _this.constructor.name);
      return _this;
    }

    return ExtendableException;
  }(Error);

  var NullPointerException = function (_ExtendableException) {
    babelHelpers.inherits(NullPointerException, _ExtendableException);

    function NullPointerException(message) {
      babelHelpers.classCallCheck(this, NullPointerException);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(NullPointerException).call(this, message));
    }

    return NullPointerException;
  }(ExtendableException);

  var NoSuchElementException = function (_ExtendableException2) {
    babelHelpers.inherits(NoSuchElementException, _ExtendableException2);

    function NoSuchElementException(message) {
      babelHelpers.classCallCheck(this, NoSuchElementException);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(NoSuchElementException).call(this, message));
    }

    return NoSuchElementException;
  }(ExtendableException);

  var RuntimeException = function (_ExtendableException3) {
    babelHelpers.inherits(RuntimeException, _ExtendableException3);

    function RuntimeException(message) {
      babelHelpers.classCallCheck(this, RuntimeException);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(RuntimeException).call(this, message));
    }

    return RuntimeException;
  }(ExtendableException);

  var Objects = function () {
    function Objects() {
      babelHelpers.classCallCheck(this, Objects);
    }

    babelHelpers.createClass(Objects, null, [{
      key: "requireNonNull",
      value: function requireNonNull(obj, message) {
        if (obj == null) {
          throw new NullPointerException(message);
        }
        return obj;
      }
    }, {
      key: "requireFunction",
      value: function requireFunction(obj, message) {
        if (typeof obj !== 'function') {
          throw new TypeError(message);
        }
        return obj;
      }
    }]);
    return Objects;
  }();

  /*
   http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8-b132/java/util/Optional.java

   Build:
   traceur --out o.js ../node_modules/traceur/bin/traceur-runtime.js Exceptions.js Objects.js Optional.js --outputLanguage es5


   */

  var Optional = function () {
    function Optional(value) {
      babelHelpers.classCallCheck(this, Optional);

      var private_value = value !== undefined ? value : null;

      if (value == null && value !== undefined) {
        // if undefined then null
        throw new NullPointerException("Null value");
      }

      this.get = function () {
        /*
        if (private_value == null || undefined) {
          throw new NoSuchElementException("No value present");
        }
        */
        return private_value;
      };
      /*
      this.getValue = () => { // with no Exception
        return private_value;
      }
      */
    }

    babelHelpers.createClass(Optional, [{
      key: "isPresent",

      /*
      get() {
        if (this["value"] == null || undefined) {
          throw new NoSuchElementException("No value present");
        }
        return this["value"];
      }
      */

      value: function isPresent() {
        if (arguments.length != 0) {
          if (!(this.get() == null || this.get() == undefined)) {
            var consumer = arguments[0];
            Objects.requireNonNull(consumer, "Consumer is null");
            consumer(this.get());
          }
        } else {
          return !(this.get() == null || this.get() == undefined);
        }
      }
    }, {
      key: "filter",
      value: function filter(predicate) {
        Objects.requireNonNull(predicate, "Predicate is null");
        if (!this.isPresent()) {
          return this;
        } else {
          //return predicate(this["value"]) ? this : Optional.empty();
          return predicate.apply(null, [this.get()]) ? this : Optional.empty();
        }
      }
    }, {
      key: "map",
      value: function map(mapper) {
        Objects.requireNonNull(mapper, "Mapper is null");
        Objects.requireFunction(mapper, "Mapper is not a function");
        if (!this.isPresent()) {
          return Optional.empty();
        } else {
          //return Optional.ofNullable(mapper(this["value"]));
          return Optional.ofNullable(mapper.apply(null, [this.get()]));
        }
      }

      // mapper must return an optional

    }, {
      key: "flatMap",
      value: function flatMap(mapper) {
        Objects.requireNonNull(mapper, "Mapper is null");
        Objects.requireFunction(mapper, "Mapper is not a function");
        if (!this.isPresent()) {
          return Optional.empty();
        } else {
          var res = Objects.requireNonNull(mapper.apply(null, [this.get()]), "Result is null");

          if (res instanceof Optional) {
            return res;
          } else {
            throw new TypeError("The provided mapper must return an Optional");
          }
        }
      }
    }, {
      key: "orElse",
      value: function orElse(other) {
        return !(this.get() == null || this.get() == undefined) ? this.get() : other;
      }
    }, {
      key: "orElseGet",
      value: function orElseGet(supplier) {
        Objects.requireNonNull(supplier, "Supplier is null");
        Objects.requireFunction(supplier, "Supplier is not a function");
        return !(this.get() == null || this.get() == undefined) ? this.get() : Objects.requireNonNull(supplier.apply(null, [this.get()]), "Result is null");
      }

      /**
       * @todo Implement this function
       * @param supplier
       */

    }, {
      key: "orElseThrow",
      value: function orElseThrow(supplier) {}
      // WIP

      /**
       * @override
       * @param obj
       * @returns {boolean}
       */

    }, {
      key: "equals",
      value: function equals(obj) {
        if (this == obj) {
          return true;
        }
        if (!(obj instanceof Optional)) {
          return false;
        }
        return this.get() == obj.get();
      }

      /**
       * @todo Implement this function ... or Not
       * @override
       */

    }, {
      key: "hashCode",
      value: function hashCode() {}
      //WIP

      /**
       * @override
       */

    }, {
      key: "toString",
      value: function toString() {
        return !(this.get() == null || this.get() == undefined) ? "Optional[" + this.get() + "]" : "Optional.empty";
      }
    }], [{
      key: "empty",
      value: function empty() {
        return new Optional();
      }
    }, {
      key: "of",
      value: function of(value) {
        return new Optional(value);
      }
    }, {
      key: "ofNullable",
      value: function ofNullable(value) {
        return value == null || undefined ? Optional.empty() : Optional.of(value);
      }
    }]);
    return Optional;
  }();

  var Result = function () {
    /*
      TODO: About privacy, see Symbol or WeakMap
     */

    function Result(value, throwable) {
      babelHelpers.classCallCheck(this, Result);

      var private_value = value !== undefined ? value : null;
      var private_error = throwable !== undefined ? throwable : null;

      this._value = function () {
        return private_value;
      };
      this._error = function () {
        return private_error;
      };
    }

    babelHelpers.createClass(Result, [{
      key: "get",
      value: function get() {
        if (this._value() !== null || this._value() !== undefined) {
          return this._value();
        }
        if (this._error() !== null || this._error() !== undefined) {
          throw this._error();
        }
        throw new NoSuchElementException("Empty result");
      }
    }, {
      key: "toOptional",
      value: function toOptional() {
        if (this._value() !== null || this._value() !== undefined) {
          return Optional.of(this._value());
        }
        return Optional.empty();
      }

      /**
       * @todo Implement this function
       */

    }, {
      key: "toList",
      value: function toList() {}

      /**
       * @todo Implement this function
       */

    }, {
      key: "toErrorList",
      value: function toErrorList() {}

      /**
       * @todo Implement this function
       */

    }, {
      key: "iterator",
      value: function iterator() {}
    }, {
      key: "toOptionalError",
      value: function toOptionalError() {
        if (this._error() !== null || this._error() !== undefined) {
          return Optional.of(this._error());
        }
        return Optional.empty();
      }
    }, {
      key: "orElse",
      value: function orElse(other) {
        return !(this._value() == null || this._value() == undefined) ? this._value() : other;
      }

      /**
       * @todo to be verified
       * @param supplier
       * @returns {*}
       */

    }, {
      key: "orElseGet",
      value: function orElseGet(supplier) {
        Objects.requireNonNull(supplier, "Supplier is null");
        Objects.requireFunction(supplier, "Supplier is not a function");
        return !(this._value() == null || this._value() == undefined) ? this._value() : Objects.requireNonNull(supplier.apply(null), "Result is null");
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        return (this._value() == null || this._value() == undefined) && (this._error() == null || this._error() == undefined);
      }

      /**
       * @todo isError(Class<?> type)
       * @returns {boolean}
       */

    }, {
      key: "isError",
      value: function isError() {
        return (this._value() == null || this._value() == undefined) && !(this._error() == null || this._error() == undefined);
      }
    }, {
      key: "isValue",
      value: function isValue(val) {
        if (val == undefined) {
          return !(this._value() == null || this._value() == undefined) && (this._error() == null || this._error() == undefined);
        } else {
          return this._value() == val;
        }
      }
    }, {
      key: "map",
      value: function map(mapper) {
        Objects.requireNonNull(mapper, "Mapper is null");
        Objects.requireFunction(mapper, "Mapper is not a function");

        if (this._value() == null || this._value() == undefined) {
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

    }, {
      key: "mapError",
      value: function mapError(mapper) {}
    }, {
      key: "flatMap",
      value: function flatMap(mapper) {
        Objects.requireNonNull(mapper, "Mapper is null");
        Objects.requireFunction(mapper, "Mapper is not a function");
        if (this.isEmpty() || this.isError()) {
          return this;
        }
        var res;
        try {
          return Objects.requireNonNull(mapper.apply(null, [this._value()]), "Result is null");
        } catch (e) {
          return Result.error(e);
        }
      }

      /**
       * @todo Implement this function ... or Not
       */

    }, {
      key: "flattened",
      value: function flattened() {}

      /**
       * @todo Implement this function ... or Not
       */

    }, {
      key: "andThen",
      value: function andThen(mapper) {}
    }, {
      key: "either",
      value: function either(mapping, recover) {
        if (this.isError()) {
          return recover.apply(null, [this._error()]);
        }
        return mapping.apply(null, [this._value()]);
      }
    }, {
      key: "filter",
      value: function filter(predicate) {
        Objects.requireNonNull(predicate, "Predicate is null");
        if (this.isEmpty() || this.isError()) {
          return this;
        } else {
          return predicate.apply(null, [this._value()]) ? this : Result.empty();
        }
      }
    }, {
      key: "reduce",
      value: function reduce(init, func) {
        if (this._value() == null || this._value() == undefined) {
          return init;
        }
        return func.apply(null, [init, this._value()]);
      }

      /**
       * @todo Implement this function ... or Not
       * @param other
       */

    }, {
      key: "apply",
      value: function apply(other) {}

      /**
       * @param other
       */

    }, {
      key: "and",
      value: function and(other) {
        if (!this.isError()) {
          return other;
        }
        return this;
      }

      /**
       * @param other
       */

    }, {
      key: "or",
      value: function or(other) {
        if (this.isError()) {
          return other;
        }
        return this;
      }
    }, {
      key: "equals",
      value: function equals(obj) {
        if (obj == null || obj == undefined) {
          return false;
        }
        if (this == obj) {
          return true;
        }
        if (!(obj instanceof Result)) {
          return false;
        }
        return this._value() == obj["value"] && this._error() == obj["error"];
      }

      /**
       * @todo Implement this function ... or Not
       * @override
       */

    }, {
      key: "hashCode",
      value: function hashCode() {}
      //WIP

      /**
       * @override
       */

    }, {
      key: "toString",
      value: function toString() {
        if (this.isEmpty()) {
          return "Result.empty";
        }
        if (this.isError()) {
          return "Result.error[" + this._error() + "]";
        }
        return "Result.value[" + this._value() + "]";
      }
    }, {
      key: "destruct",
      value: function destruct() {
        return [this._error(), this._value()];
      }
    }], [{
      key: "empty",
      value: function empty() {
        return new Result();
      }
    }, {
      key: "ok",
      value: function ok(value) {
        return value == null || value == undefined ? Result.empty() : new Result(value, null);
      }
    }, {
      key: "error",
      value: function error(throwable) {
        return throwable == null || throwable == undefined ? Result.empty() : new Result(null, throwable);
      }
    }, {
      key: "option",
      value: function option(opt, message) {
        if (message == undefined) {
          if (!(opt instanceof Optional)) {
            throw new TypeError("This is not an Optional");
          }
          return opt == null || opt == undefined || !opt.isPresent() ? Result.empty() : new Result(opt.get(), null);
        } else {
          return opt == null || opt == undefined || !opt.isPresent() ? new Result(null, new NoSuchElementException(message)) : new Result(opt.get(), null);
        }
      }
    }, {
      key: "fail",
      value: function fail(message) {
        return Result.error(new RuntimeException(message));
      }
    }]);
    return Result;
  }();

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

  var Identity = function () {
    function Identity(value) {
      babelHelpers.classCallCheck(this, Identity);

      var private_value = value !== undefined ? value : null;
      this.get = function () {
        return private_value;
      };
    }

    babelHelpers.createClass(Identity, [{
      key: "bind",
      value: function bind(callBack) {
        return callBack(this.get());
      }
    }, {
      key: "map",
      value: function map(callBack) {
        return new Identity(callBack(this.get()));
      }
    }, {
      key: "toString",

      /**
       * @override
       */
      value: function toString() {
        return "Identity.value[" + this.get() + "]";
      }
    }], [{
      key: "of",
      value: function of(value) {
        return new Identity(value);
      }
    }]);
    return Identity;
  }();

  /**
   * Created by k33g_org on 04/02/16.
   */

  var Version = function () {
    function Version() {
      babelHelpers.classCallCheck(this, Version);
    }

    babelHelpers.createClass(Version, null, [{
      key: "number",
      value: function number() {
        return [0, 0, 0];
      }
    }]);
    return Version;
  }();

  exports.ExtendableException = ExtendableException;
  exports.NullPointerException = NullPointerException;
  exports.NoSuchElementException = NoSuchElementException;
  exports.RuntimeException = RuntimeException;
  exports.Objects = Objects;
  exports.Optional = Optional;
  exports.Result = Result;
  exports.Identity = Identity;
  exports.Version = Version;

}((this.stairways = {})));
//# sourceMappingURL=stairways.es5.browser.js.map