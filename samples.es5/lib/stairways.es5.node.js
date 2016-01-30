"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by k33g_org on 29/01/16.
 */

var ExtendableException = (function (_Error) {
  _inherits(ExtendableException, _Error);

  function ExtendableException(message) {
    _classCallCheck(this, ExtendableException);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExtendableException).call(this, message));

    _this.name = _this.constructor.name;
    _this.message = message;
    Error.captureStackTrace(_this, _this.constructor.name);
    return _this;
  }

  return ExtendableException;
})(Error);

var NullPointerException = (function (_ExtendableException) {
  _inherits(NullPointerException, _ExtendableException);

  function NullPointerException(message) {
    _classCallCheck(this, NullPointerException);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(NullPointerException).call(this, message));
  }

  return NullPointerException;
})(ExtendableException);

var NoSuchElementException = (function (_ExtendableException2) {
  _inherits(NoSuchElementException, _ExtendableException2);

  function NoSuchElementException(message) {
    _classCallCheck(this, NoSuchElementException);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(NoSuchElementException).call(this, message));
  }

  return NoSuchElementException;
})(ExtendableException);

var RuntimeException = (function (_ExtendableException3) {
  _inherits(RuntimeException, _ExtendableException3);

  function RuntimeException(message) {
    _classCallCheck(this, RuntimeException);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RuntimeException).call(this, message));
  }

  return RuntimeException;
})(ExtendableException);

var Objects = (function () {
  function Objects() {
    _classCallCheck(this, Objects);
  }

  _createClass(Objects, null, [{
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
})();

/*
 http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8-b132/java/util/Optional.java

 Build:
 traceur --out o.js ../node_modules/traceur/bin/traceur-runtime.js Exceptions.js Objects.js Optional.js --outputLanguage es5


 */

var Optional = (function () {
  function Optional(value) {
    _classCallCheck(this, Optional);

    this["value"] = value !== undefined ? value : null;
    if (value == null && value !== undefined) {
      // if undefined then null
      throw new NullPointerException("Null value");
    }
  }

  _createClass(Optional, [{
    key: "get",
    value: function get() {
      if (this["value"] == null || undefined) {
        throw new NoSuchElementException("No value present");
      }
      return this["value"];
    }
  }, {
    key: "isPresent",
    value: function isPresent() {
      if (arguments.length != 0) {
        if (!(this["value"] == null || this["value"] == undefined)) {
          var consumer = arguments[0];
          Objects.requireNonNull(consumer, "Consumer is null");
          consumer(this["value"]);
        }
      } else {
        return !(this["value"] == null || this["value"] == undefined);
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
        return predicate.apply(null, [this["value"]]) ? this : Optional.empty();
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
        return Optional.ofNullable(mapper.apply(null, [this["value"]]));
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
        var res = Objects.requireNonNull(mapper.apply(null, [this["value"]]), "Result is null");

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
      return !(this["value"] == null || this["value"] == undefined) ? this["value"] : other;
    }
  }, {
    key: "orElseGet",
    value: function orElseGet(supplier) {
      Objects.requireNonNull(supplier, "Supplier is null");
      Objects.requireFunction(supplier, "Supplier is not a function");
      return !(this["value"] == null || this["value"] == undefined) ? this["value"] : Objects.requireNonNull(supplier.apply(null, [this["value"]]), "Result is null");
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
      return this["value"] == obj["value"];
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
      return !(this["value"] == null || this["value"] == undefined) ? "Optional[" + this["value"] + "]" : "Optional.empty";
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
})();

var Result = (function () {
  function Result(value, throwable) {
    _classCallCheck(this, Result);

    this["value"] = value !== undefined ? value : null;
    this["error"] = throwable !== undefined ? throwable : null;
    //this[empty] = new Result();
  }

  _createClass(Result, [{
    key: "get",
    value: function get() {
      if (this["value"] !== null || this["value"] !== undefined) {
        return this["value"];
      }
      if (this["error"] !== null || this["error"] !== undefined) {
        throw this["error"];
      }
      throw new NoSuchElementException("Empty result");
    }
  }, {
    key: "toOptional",
    value: function toOptional() {
      if (this["value"] !== null || this["value"] !== undefined) {
        return Optional.of(this["value"]);
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
      if (this["error"] !== null || this["error"] !== undefined) {
        return Optional.of(this["error"]);
      }
      return Optional.empty();
    }
  }, {
    key: "orElse",
    value: function orElse(other) {
      return !(this["value"] == null || this["value"] == undefined) ? this["value"] : other;
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
      return !(this["value"] == null || this["value"] == undefined) ? this["value"] : Objects.requireNonNull(supplier.apply(null), "Result is null");
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return (this["value"] == null || this["value"] == undefined) && (this["error"] == null || this["error"] == undefined);
    }

    /**
     * @todo isError(Class<?> type)
     * @returns {boolean}
     */

  }, {
    key: "isError",
    value: function isError() {
      return (this["value"] == null || this["value"] == undefined) && !(this["error"] == null || this["error"] == undefined);
    }
  }, {
    key: "isValue",
    value: function isValue(val) {
      if (val == undefined) {
        return !(this["value"] == null || this["value"] == undefined) && (this["error"] == null || this["error"] == undefined);
      } else {
        return this["value"] == val;
      }
    }
  }, {
    key: "map",
    value: function map(mapper) {
      Objects.requireNonNull(mapper, "Mapper is null");
      Objects.requireFunction(mapper, "Mapper is not a function");

      if (this["value"] == null || this["value"] == undefined) {
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
        return Objects.requireNonNull(mapper.apply(null, [this["value"]]), "Result is null");
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
        return recover.apply(null, [this["error"]]);
      }
      return mapping.apply(null, [this["value"]]);
    }
  }, {
    key: "filter",
    value: function filter(predicate) {
      Objects.requireNonNull(predicate, "Predicate is null");
      if (this.isEmpty() || this.isError()) {
        return this;
      } else {
        return predicate.apply(null, [this["value"]]) ? this : Result.empty();
      }
    }
  }, {
    key: "reduce",
    value: function reduce(init, func) {
      if (this["value"] == null || this["value"] == undefined) {
        return init;
      }
      return func.apply(null, [init, this["value"]]);
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
      return this["value"] == obj["value"] && this["error"] == obj["error"];
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
        return "Result.error[" + this["error"] + "]";
      }
      return "Result.value[" + this["value"] + "]";
    }
  }, {
    key: "destruct",
    value: function destruct() {
      return [this["error"], this["value"]];
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
})();

exports.ExtendableException = ExtendableException;
exports.NullPointerException = NullPointerException;
exports.NoSuchElementException = NoSuchElementException;
exports.RuntimeException = RuntimeException;
exports.Objects = Objects;
exports.Optional = Optional;
exports.Result = Result;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YWlyd2F5cy5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSU0sbUJBQW1CO1lBQW5CLG1CQUFtQjs7QUFDdkIsV0FESSxtQkFBbUIsQ0FDWCxPQUFPLEVBQUU7MEJBRGpCLG1CQUFtQjs7dUVBQW5CLG1CQUFtQixhQUVmLE9BQU87O0FBQ2IsVUFBSyxJQUFJLEdBQUcsTUFBSyxXQUFXLENBQUMsSUFBSSxDQUFDO0FBQ2xDLFVBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixTQUFLLENBQUMsaUJBQWlCLFFBQU8sTUFBSyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7O0dBQ3JEOztTQU5HLG1CQUFtQjtHQUFTLEtBQUs7O0lBU2pDLG9CQUFvQjtZQUFwQixvQkFBb0I7O0FBQ3hCLFdBREksb0JBQW9CLENBQ1osT0FBTyxFQUFFOzBCQURqQixvQkFBb0I7O2tFQUFwQixvQkFBb0IsYUFFaEIsT0FBTztHQUNkOztTQUhHLG9CQUFvQjtHQUFTLG1CQUFtQjs7SUFNaEQsc0JBQXNCO1lBQXRCLHNCQUFzQjs7QUFDMUIsV0FESSxzQkFBc0IsQ0FDZCxPQUFPLEVBQUU7MEJBRGpCLHNCQUFzQjs7a0VBQXRCLHNCQUFzQixhQUVsQixPQUFPO0dBQ2Q7O1NBSEcsc0JBQXNCO0dBQVMsbUJBQW1COztJQU1sRCxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztBQUNwQixXQURJLGdCQUFnQixDQUNSLE9BQU8sRUFBRTswQkFEakIsZ0JBQWdCOztrRUFBaEIsZ0JBQWdCLGFBRVosT0FBTztHQUNkOztTQUhHLGdCQUFnQjtHQUFTLG1CQUFtQjs7SUFNNUMsT0FBTztXQUFQLE9BQU87MEJBQVAsT0FBTzs7O2VBQVAsT0FBTzs7bUNBRVcsR0FBRyxFQUFFLE9BQU8sRUFBRTtBQUNsQyxVQUFHLEdBQUcsSUFBRSxJQUFJLEVBQUU7QUFDWixjQUFNLElBQUksb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDeEM7QUFDRCxhQUFPLEdBQUcsQ0FBQztLQUNaOzs7b0NBRXNCLEdBQUcsRUFBRSxPQUFPLEVBQUU7QUFDbkMsVUFBRyxPQUFPLEdBQUcsS0FBSyxVQUFVLEVBQUU7QUFDNUIsY0FBTSxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtPQUM3QjtBQUNELGFBQU8sR0FBRyxDQUFDO0tBQ1o7OztTQWRHLE9BQU87Ozs7Ozs7Ozs7OztJQTJCUCxRQUFRO0FBRVosV0FGSSxRQUFRLENBRUEsS0FBSyxFQUFFOzBCQUZmLFFBQVE7O0FBR1YsUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssS0FBSyxTQUFTLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNuRCxRQUFHLEtBQUssSUFBRSxJQUFJLElBQUksS0FBSyxLQUFHLFNBQVMsRUFBRTs7QUFDbkMsWUFBTSxJQUFJLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxDQUFBO0tBQzdDO0dBQ0Y7O2VBUEcsUUFBUTs7MEJBcUJOO0FBQ0osVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLFNBQVMsRUFBRTtBQUN0QyxjQUFNLElBQUksc0JBQXNCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztPQUN0RDtBQUNELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3RCOzs7Z0NBRVc7QUFDVixVQUFHLFNBQVMsQ0FBQyxNQUFNLElBQUUsQ0FBQyxFQUFFO0FBQ3RCLFlBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxTQUFTLENBQUEsQUFBQyxFQUFFO0FBQ3pELGNBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMzQixpQkFBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUNyRCxrQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ3pCO09BQ0YsTUFBTTtBQUNMLGVBQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxTQUFTLENBQUEsQUFBQyxDQUFBO09BQzlEO0tBRUY7OzsyQkFFTSxTQUFTLEVBQUU7QUFDaEIsYUFBTyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUN2RCxVQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQ3BCLGVBQU8sSUFBSSxDQUFBO09BQ1osTUFBTTs7QUFFTCxlQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO09BRXpFO0tBQ0Y7Ozt3QkFFRyxNQUFNLEVBQUU7QUFDVixhQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pELGFBQU8sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFDNUQsVUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUNwQixlQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUN6QixNQUFNOztBQUVMLGVBQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNqRTtLQUNGOzs7Ozs7NEJBR08sTUFBTSxFQUFFO0FBQ2QsYUFBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUNqRCxhQUFPLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0FBQzVELFVBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDcEIsZUFBTyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDekIsTUFBTTtBQUNMLFlBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7O0FBR3hGLFlBQUcsR0FBRyxZQUFZLFFBQVEsRUFBRTtBQUMxQixpQkFBTyxHQUFHLENBQUM7U0FDWixNQUFNO0FBQ0wsZ0JBQU0sSUFBSSxTQUFTLENBQUMsNkNBQTZDLENBQUMsQ0FBQztTQUNwRTtPQUVGO0tBQ0Y7OzsyQkFFTSxLQUFLLEVBQUU7QUFDWixhQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksU0FBUyxDQUFBLEFBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ3ZGOzs7OEJBR1MsUUFBUSxFQUFFO0FBQ2xCLGFBQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDckQsYUFBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztBQUNoRSxhQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksU0FBUyxDQUFBLEFBQUMsR0FDekQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUNiLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7S0FDckY7Ozs7Ozs7OztnQ0FNVyxRQUFRLEVBQUU7Ozs7Ozs7O0FBRXJCOzs7MkJBT00sR0FBRyxFQUFFO0FBQ1YsVUFBRyxJQUFJLElBQUUsR0FBRyxFQUFFO0FBQ1osZUFBTyxJQUFJLENBQUM7T0FDYjtBQUNELFVBQUcsRUFBRSxHQUFHLFlBQVksUUFBUSxDQUFBLEFBQUMsRUFBRTtBQUM3QixlQUFPLEtBQUssQ0FBQztPQUNkO0FBQ0QsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3RDOzs7Ozs7Ozs7K0JBTVU7Ozs7OztBQUVWOzs7K0JBS1U7QUFDVCxhQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksU0FBUyxDQUFBLEFBQUMsaUJBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBTSxnQkFBZ0IsQ0FBQztLQUNyRDs7OzRCQTNIYztBQUNiLGFBQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztLQUN2Qjs7O3VCQUVTLEtBQUssRUFBRTtBQUNmLGFBQU8sSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDM0I7OzsrQkFFaUIsS0FBSyxFQUFFO0FBQ3ZCLGFBQU8sS0FBSyxJQUFJLElBQUksSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0U7OztTQW5CRyxRQUFROzs7SUF3SVIsTUFBTTtBQUdWLFdBSEksTUFBTSxDQUdFLEtBQUssRUFBRSxTQUFTLEVBQUU7MEJBSDFCLE1BQU07O0FBSVIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssS0FBSyxTQUFTLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNuRCxRQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsU0FBUyxLQUFLLFNBQVMsR0FBRyxTQUFTLEdBQUcsSUFBSTs7QUFBQyxHQUU1RDs7ZUFQRyxNQUFNOzswQkF5Q0o7QUFDSixVQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsRUFBRTtBQUN4RCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUN0QjtBQUNELFVBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQ3hELGNBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ3JCO0FBQ0QsWUFBTSxJQUFJLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxDQUFBO0tBQ2pEOzs7aUNBRVk7QUFDWCxVQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsRUFBRTtBQUN4RCxlQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7T0FDbkM7QUFDRCxhQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN6Qjs7Ozs7Ozs7NkJBS1EsRUFFUjs7Ozs7Ozs7a0NBS2EsRUFFYjs7Ozs7Ozs7K0JBS1UsRUFFVjs7O3NDQUVpQjtBQUNoQixVQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsRUFBRTtBQUN4RCxlQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7T0FDbkM7QUFDRCxhQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN6Qjs7OzJCQUVNLEtBQUssRUFBRTtBQUNaLGFBQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxTQUFTLENBQUEsQUFBQyxHQUN6RCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQ2IsS0FBSyxDQUFDO0tBQ1g7Ozs7Ozs7Ozs7OEJBT1MsUUFBUSxFQUFFO0FBQ2xCLGFBQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDckQsYUFBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztBQUNoRSxhQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksU0FBUyxDQUFBLEFBQUMsR0FDekQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUNiLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ3BFOzs7OEJBRVM7QUFDUixhQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksU0FBUyxDQUFBLEtBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFNBQVMsQ0FBQSxBQUFDLENBQUM7S0FDekQ7Ozs7Ozs7Ozs4QkFNUztBQUNSLGFBQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxTQUFTLENBQUEsSUFDekQsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxTQUFTLENBQUEsQUFBQyxDQUFDO0tBQzFEOzs7NEJBRU8sR0FBRyxFQUFFO0FBQ1gsVUFBRyxHQUFHLElBQUksU0FBUyxFQUFFO0FBQ25CLGVBQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxTQUFTLENBQUEsQUFBQyxLQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxTQUFTLENBQUEsQUFBQyxDQUFDO09BQ3pELE1BQU07QUFDTCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUM7T0FDN0I7S0FDRjs7O3dCQUVHLE1BQU0sRUFBRTtBQUNWLGFBQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDakQsYUFBTyxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsMEJBQTBCLENBQUMsQ0FBQzs7QUFFNUQsVUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxTQUFTLEVBQUU7QUFDdEQsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxVQUFJO0FBQ0YsZUFBTyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3ZELENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixlQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDeEI7S0FFRjs7Ozs7Ozs7OzZCQU1RLE1BQU0sRUFBRSxFQUVoQjs7OzRCQUdPLE1BQU0sRUFBRTtBQUNkLGFBQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDakQsYUFBTyxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztBQUM1RCxVQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDbkMsZUFBTyxJQUFJLENBQUM7T0FDYjtBQUNELFVBQUksR0FBRyxDQUFDO0FBQ1IsVUFBSTtBQUNGLGVBQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztPQUN0RixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsZUFBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQ3ZCO0tBQ0Y7Ozs7Ozs7O2dDQUtXLEVBRVg7Ozs7Ozs7OzRCQUtPLE1BQU0sRUFBRSxFQUVmOzs7MkJBRU0sT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN2QixVQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUNqQixlQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUM3QztBQUNELGFBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdDOzs7MkJBRU0sU0FBUyxFQUFFO0FBQ2hCLGFBQU8sQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDdkQsVUFBRyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO0FBQ25DLGVBQU8sSUFBSSxDQUFBO09BQ1osTUFBTTtBQUNMLGVBQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUN6QyxJQUFJLEdBQ0osTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO09BRXBCO0tBQ0Y7OzsyQkFFTSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2pCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksU0FBUyxFQUFFO0FBQ3ZELGVBQU8sSUFBSSxDQUFBO09BQ1o7QUFDRCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDL0M7Ozs7Ozs7OzswQkFNSyxLQUFLLEVBQUUsRUFFWjs7Ozs7Ozs7d0JBS0csS0FBSyxFQUFFO0FBQ1QsVUFBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUNsQixlQUFPLEtBQUssQ0FBQztPQUNkO0FBQ0QsYUFBTyxJQUFJLENBQUM7S0FDYjs7Ozs7Ozs7dUJBS0UsS0FBSyxFQUFFO0FBQ1IsVUFBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDakIsZUFBTyxLQUFLLENBQUM7T0FDZDtBQUNELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OzsyQkFFTSxHQUFHLEVBQUU7QUFDVixVQUFHLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLFNBQVMsRUFBRTtBQUNsQyxlQUFPLEtBQUssQ0FBQztPQUNkO0FBQ0QsVUFBRyxJQUFJLElBQUksR0FBRyxFQUFFO0FBQ2QsZUFBTyxJQUFJLENBQUE7T0FDWjtBQUNELFVBQUcsRUFBRSxHQUFHLFlBQVksTUFBTSxDQUFBLEFBQUMsRUFBRTtBQUMzQixlQUFPLEtBQUssQ0FBQztPQUNkO0FBQ0QsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3BDOzs7Ozs7Ozs7K0JBTVU7Ozs7OztBQUVWOzs7K0JBS1U7QUFDVCxVQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUNqQixlQUFPLGNBQWMsQ0FBQztPQUN2QjtBQUNELFVBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO0FBQ2pCLGlDQUF1QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQUk7T0FDekM7QUFDRCwrQkFBdUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFJO0tBQ3pDOzs7K0JBRVU7QUFDVCxhQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDOzs7NEJBdlFjO0FBQ2IsYUFBTyxJQUFJLE1BQU0sRUFBRSxDQUFDO0tBQ3JCOzs7dUJBRVUsS0FBSyxFQUFFO0FBQ2hCLGFBQU8sQUFBQyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxTQUFTLEdBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN6Rjs7OzBCQUVZLFNBQVMsRUFBRTtBQUN0QixhQUFPLEFBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxTQUFTLElBQUksU0FBUyxHQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDckc7OzsyQkFFYSxHQUFHLEVBQUUsT0FBTyxFQUFFO0FBQzFCLFVBQUcsT0FBTyxJQUFFLFNBQVMsRUFBRTtBQUNyQixZQUFHLEVBQUUsR0FBRyxZQUFZLFFBQVEsQ0FBQSxBQUFDLEVBQUU7QUFDN0IsZ0JBQU0sSUFBSSxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNoRDtBQUNELGVBQU8sQUFBQyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFTLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQ3ZELE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FDZCxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDakMsTUFBTTtBQUNMLGVBQU8sQUFBQyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFTLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQ3ZELElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQ3JELElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNqQztLQUVGOzs7eUJBRVcsT0FBTyxFQUFFO0FBQ25CLGFBQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDcEQ7OztTQXZDRyxNQUFNOzs7UUFvUkgsbUJBQW1CLEdBQW5CLG1CQUFtQjtRQUFFLG9CQUFvQixHQUFwQixvQkFBb0I7UUFBRSxzQkFBc0IsR0FBdEIsc0JBQXNCO1FBQUUsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQUFFLE9BQU8sR0FBUCxPQUFPO1FBQUUsUUFBUSxHQUFSLFFBQVE7UUFBRSxNQUFNLEdBQU4sTUFBTSIsImZpbGUiOiJzdGFpcndheXMuZXM1Lm5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgazMzZ19vcmcgb24gMjkvMDEvMTYuXG4gKi9cblxuY2xhc3MgRXh0ZW5kYWJsZUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IubmFtZSlcbiAgfVxufVxuXG5jbGFzcyBOdWxsUG9pbnRlckV4Y2VwdGlvbiBleHRlbmRzIEV4dGVuZGFibGVFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gIH1cbn1cblxuY2xhc3MgTm9TdWNoRWxlbWVudEV4Y2VwdGlvbiBleHRlbmRzIEV4dGVuZGFibGVFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gIH1cbn1cblxuY2xhc3MgUnVudGltZUV4Y2VwdGlvbiBleHRlbmRzIEV4dGVuZGFibGVFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gIH1cbn1cblxuY2xhc3MgT2JqZWN0cyB7XG5cbiAgc3RhdGljIHJlcXVpcmVOb25OdWxsKG9iaiwgbWVzc2FnZSkge1xuICAgIGlmKG9iaj09bnVsbCkge1xuICAgICAgdGhyb3cgbmV3IE51bGxQb2ludGVyRXhjZXB0aW9uKG1lc3NhZ2UpXG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBzdGF0aWMgcmVxdWlyZUZ1bmN0aW9uKG9iaiwgbWVzc2FnZSkge1xuICAgIGlmKHR5cGVvZiBvYmogIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IobWVzc2FnZSlcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG5cbn1cblxuLypcbiBodHRwOi8vZ3JlcGNvZGUuY29tL2ZpbGUvcmVwb3NpdG9yeS5ncmVwY29kZS5jb20vamF2YS9yb290L2pkay9vcGVuamRrLzgtYjEzMi9qYXZhL3V0aWwvT3B0aW9uYWwuamF2YVxuXG4gQnVpbGQ6XG4gdHJhY2V1ciAtLW91dCBvLmpzIC4uL25vZGVfbW9kdWxlcy90cmFjZXVyL2Jpbi90cmFjZXVyLXJ1bnRpbWUuanMgRXhjZXB0aW9ucy5qcyBPYmplY3RzLmpzIE9wdGlvbmFsLmpzIC0tb3V0cHV0TGFuZ3VhZ2UgZXM1XG5cblxuICovXG5jbGFzcyBPcHRpb25hbCB7XG5cbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICB0aGlzW1widmFsdWVcIl0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiBudWxsO1xuICAgIGlmKHZhbHVlPT1udWxsICYmIHZhbHVlIT09dW5kZWZpbmVkKSB7IC8vIGlmIHVuZGVmaW5lZCB0aGVuIG51bGxcbiAgICAgIHRocm93IG5ldyBOdWxsUG9pbnRlckV4Y2VwdGlvbihcIk51bGwgdmFsdWVcIilcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZW1wdHkoKSB7XG4gICAgcmV0dXJuIG5ldyBPcHRpb25hbCgpO1xuICB9XG5cbiAgc3RhdGljIG9mKHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBPcHRpb25hbCh2YWx1ZSlcbiAgfVxuXG4gIHN0YXRpYyBvZk51bGxhYmxlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgfHwgdW5kZWZpbmVkID8gT3B0aW9uYWwuZW1wdHkoKSA6IE9wdGlvbmFsLm9mKHZhbHVlKTtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICBpZiAodGhpc1tcInZhbHVlXCJdID09IG51bGwgfHwgdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgTm9TdWNoRWxlbWVudEV4Y2VwdGlvbihcIk5vIHZhbHVlIHByZXNlbnRcIik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzW1widmFsdWVcIl07XG4gIH1cblxuICBpc1ByZXNlbnQoKSB7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCE9MCkge1xuICAgICAgaWYoISh0aGlzW1widmFsdWVcIl0gPT0gbnVsbCB8fCB0aGlzW1widmFsdWVcIl0gPT0gdW5kZWZpbmVkKSkge1xuICAgICAgICBsZXQgY29uc3VtZXIgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgT2JqZWN0cy5yZXF1aXJlTm9uTnVsbChjb25zdW1lciwgXCJDb25zdW1lciBpcyBudWxsXCIpO1xuICAgICAgICBjb25zdW1lcih0aGlzW1widmFsdWVcIl0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gISh0aGlzW1widmFsdWVcIl0gPT0gbnVsbCB8fCB0aGlzW1widmFsdWVcIl0gPT0gdW5kZWZpbmVkKVxuICAgIH1cblxuICB9XG5cbiAgZmlsdGVyKHByZWRpY2F0ZSkge1xuICAgIE9iamVjdHMucmVxdWlyZU5vbk51bGwocHJlZGljYXRlLCBcIlByZWRpY2F0ZSBpcyBudWxsXCIpO1xuICAgIGlmKCF0aGlzLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0gZWxzZSB7XG4gICAgICAvL3JldHVybiBwcmVkaWNhdGUodGhpc1tcInZhbHVlXCJdKSA/IHRoaXMgOiBPcHRpb25hbC5lbXB0eSgpO1xuICAgICAgcmV0dXJuIHByZWRpY2F0ZS5hcHBseShudWxsLCBbdGhpc1tcInZhbHVlXCJdXSkgPyB0aGlzIDogT3B0aW9uYWwuZW1wdHkoKTtcblxuICAgIH1cbiAgfVxuXG4gIG1hcChtYXBwZXIpIHtcbiAgICBPYmplY3RzLnJlcXVpcmVOb25OdWxsKG1hcHBlciwgXCJNYXBwZXIgaXMgbnVsbFwiKTtcbiAgICBPYmplY3RzLnJlcXVpcmVGdW5jdGlvbihtYXBwZXIsIFwiTWFwcGVyIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgIGlmKCF0aGlzLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gT3B0aW9uYWwuZW1wdHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9yZXR1cm4gT3B0aW9uYWwub2ZOdWxsYWJsZShtYXBwZXIodGhpc1tcInZhbHVlXCJdKSk7XG4gICAgICByZXR1cm4gT3B0aW9uYWwub2ZOdWxsYWJsZShtYXBwZXIuYXBwbHkobnVsbCwgW3RoaXNbXCJ2YWx1ZVwiXV0pKTtcbiAgICB9XG4gIH1cblxuICAvLyBtYXBwZXIgbXVzdCByZXR1cm4gYW4gb3B0aW9uYWxcbiAgZmxhdE1hcChtYXBwZXIpIHtcbiAgICBPYmplY3RzLnJlcXVpcmVOb25OdWxsKG1hcHBlciwgXCJNYXBwZXIgaXMgbnVsbFwiKTtcbiAgICBPYmplY3RzLnJlcXVpcmVGdW5jdGlvbihtYXBwZXIsIFwiTWFwcGVyIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgIGlmKCF0aGlzLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gT3B0aW9uYWwuZW1wdHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHJlcyA9IE9iamVjdHMucmVxdWlyZU5vbk51bGwobWFwcGVyLmFwcGx5KG51bGwsIFt0aGlzW1widmFsdWVcIl1dKSwgXCJSZXN1bHQgaXMgbnVsbFwiKTtcblxuXG4gICAgICBpZihyZXMgaW5zdGFuY2VvZiBPcHRpb25hbCkge1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZSBwcm92aWRlZCBtYXBwZXIgbXVzdCByZXR1cm4gYW4gT3B0aW9uYWxcIik7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cblxuICBvckVsc2Uob3RoZXIpIHtcbiAgICByZXR1cm4gISh0aGlzW1widmFsdWVcIl0gPT0gbnVsbCB8fCB0aGlzW1widmFsdWVcIl0gPT0gdW5kZWZpbmVkKSA/IHRoaXNbXCJ2YWx1ZVwiXSA6IG90aGVyO1xuICB9XG5cblxuICBvckVsc2VHZXQoc3VwcGxpZXIpIHtcbiAgICBPYmplY3RzLnJlcXVpcmVOb25OdWxsKHN1cHBsaWVyLCBcIlN1cHBsaWVyIGlzIG51bGxcIik7XG4gICAgT2JqZWN0cy5yZXF1aXJlRnVuY3Rpb24oc3VwcGxpZXIsIFwiU3VwcGxpZXIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgcmV0dXJuICEodGhpc1tcInZhbHVlXCJdID09IG51bGwgfHwgdGhpc1tcInZhbHVlXCJdID09IHVuZGVmaW5lZClcbiAgICAgID8gdGhpc1tcInZhbHVlXCJdXG4gICAgICA6IE9iamVjdHMucmVxdWlyZU5vbk51bGwoc3VwcGxpZXIuYXBwbHkobnVsbCwgW3RoaXNbXCJ2YWx1ZVwiXV0pLCBcIlJlc3VsdCBpcyBudWxsXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIEltcGxlbWVudCB0aGlzIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSBzdXBwbGllclxuICAgKi9cbiAgb3JFbHNlVGhyb3coc3VwcGxpZXIpIHtcbiAgICAvLyBXSVBcbiAgfVxuXG4gIC8qKlxuICAgKiBAb3ZlcnJpZGVcbiAgICogQHBhcmFtIG9ialxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGVxdWFscyhvYmopIHtcbiAgICBpZih0aGlzPT1vYmopIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZighKG9iaiBpbnN0YW5jZW9mIE9wdGlvbmFsKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1tcInZhbHVlXCJdID09IG9ialtcInZhbHVlXCJdO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIEltcGxlbWVudCB0aGlzIGZ1bmN0aW9uIC4uLiBvciBOb3RcbiAgICogQG92ZXJyaWRlXG4gICAqL1xuICBoYXNoQ29kZSgpIHtcbiAgICAvL1dJUFxuICB9XG5cbiAgLyoqXG4gICAqIEBvdmVycmlkZVxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICEodGhpc1tcInZhbHVlXCJdID09IG51bGwgfHwgdGhpc1tcInZhbHVlXCJdID09IHVuZGVmaW5lZClcbiAgICAgID8gYE9wdGlvbmFsWyR7dGhpc1tcInZhbHVlXCJdfV1gIDogXCJPcHRpb25hbC5lbXB0eVwiO1xuICB9XG5cbn1cblxuY2xhc3MgUmVzdWx0IHtcblxuXG4gIGNvbnN0cnVjdG9yKHZhbHVlLCB0aHJvd2FibGUpIHtcbiAgICB0aGlzW1widmFsdWVcIl0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiBudWxsO1xuICAgIHRoaXNbXCJlcnJvclwiXSA9IHRocm93YWJsZSAhPT0gdW5kZWZpbmVkID8gdGhyb3dhYmxlIDogbnVsbDtcbiAgICAvL3RoaXNbZW1wdHldID0gbmV3IFJlc3VsdCgpO1xuICB9XG5cbiAgc3RhdGljIGVtcHR5KCkge1xuICAgIHJldHVybiBuZXcgUmVzdWx0KCk7XG4gIH1cblxuICBzdGF0aWMgb2sgKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09IHVuZGVmaW5lZCkgPyBSZXN1bHQuZW1wdHkoKSA6IG5ldyBSZXN1bHQodmFsdWUsIG51bGwpO1xuICB9XG5cbiAgc3RhdGljIGVycm9yKHRocm93YWJsZSkge1xuICAgIHJldHVybiAodGhyb3dhYmxlID09IG51bGwgfHwgdGhyb3dhYmxlID09IHVuZGVmaW5lZCkgPyBSZXN1bHQuZW1wdHkoKSA6IG5ldyBSZXN1bHQobnVsbCwgdGhyb3dhYmxlKTtcbiAgfVxuXG4gIHN0YXRpYyBvcHRpb24ob3B0LCBtZXNzYWdlKSB7XG4gICAgaWYobWVzc2FnZT09dW5kZWZpbmVkKSB7XG4gICAgICBpZighKG9wdCBpbnN0YW5jZW9mIE9wdGlvbmFsKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhpcyBpcyBub3QgYW4gT3B0aW9uYWxcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gKG9wdCA9PSBudWxsIHx8IG9wdCA9PSB1bmRlZmluZWQgfHwgIW9wdC5pc1ByZXNlbnQoKSlcbiAgICAgICAgPyBSZXN1bHQuZW1wdHkoKVxuICAgICAgICA6IG5ldyBSZXN1bHQob3B0LmdldCgpLCBudWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChvcHQgPT0gbnVsbCB8fCBvcHQgPT0gdW5kZWZpbmVkIHx8ICFvcHQuaXNQcmVzZW50KCkpXG4gICAgICAgID8gbmV3IFJlc3VsdChudWxsLCBuZXcgTm9TdWNoRWxlbWVudEV4Y2VwdGlvbihtZXNzYWdlKSlcbiAgICAgICAgOiBuZXcgUmVzdWx0KG9wdC5nZXQoKSwgbnVsbCk7XG4gICAgfVxuXG4gIH1cblxuICBzdGF0aWMgZmFpbChtZXNzYWdlKSB7XG4gICAgcmV0dXJuIFJlc3VsdC5lcnJvcihuZXcgUnVudGltZUV4Y2VwdGlvbihtZXNzYWdlKSk7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgaWYodGhpc1tcInZhbHVlXCJdICE9PSBudWxsIHx8IHRoaXNbXCJ2YWx1ZVwiXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpc1tcInZhbHVlXCJdO1xuICAgIH1cbiAgICBpZih0aGlzW1wiZXJyb3JcIl0gIT09IG51bGwgfHwgdGhpc1tcImVycm9yXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHRoaXNbXCJlcnJvclwiXTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IE5vU3VjaEVsZW1lbnRFeGNlcHRpb24oXCJFbXB0eSByZXN1bHRcIilcbiAgfVxuXG4gIHRvT3B0aW9uYWwoKSB7XG4gICAgaWYodGhpc1tcInZhbHVlXCJdICE9PSBudWxsIHx8IHRoaXNbXCJ2YWx1ZVwiXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gT3B0aW9uYWwub2YodGhpc1tcInZhbHVlXCJdKTtcbiAgICB9XG4gICAgcmV0dXJuIE9wdGlvbmFsLmVtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQHRvZG8gSW1wbGVtZW50IHRoaXMgZnVuY3Rpb25cbiAgICovXG4gIHRvTGlzdCgpIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIEltcGxlbWVudCB0aGlzIGZ1bmN0aW9uXG4gICAqL1xuICB0b0Vycm9yTGlzdCgpIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIEltcGxlbWVudCB0aGlzIGZ1bmN0aW9uXG4gICAqL1xuICBpdGVyYXRvcigpIHtcblxuICB9XG5cbiAgdG9PcHRpb25hbEVycm9yKCkge1xuICAgIGlmKHRoaXNbXCJlcnJvclwiXSAhPT0gbnVsbCB8fCB0aGlzW1wiZXJyb3JcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIE9wdGlvbmFsLm9mKHRoaXNbXCJlcnJvclwiXSk7XG4gICAgfVxuICAgIHJldHVybiBPcHRpb25hbC5lbXB0eSgpO1xuICB9XG5cbiAgb3JFbHNlKG90aGVyKSB7XG4gICAgcmV0dXJuICEodGhpc1tcInZhbHVlXCJdID09IG51bGwgfHwgdGhpc1tcInZhbHVlXCJdID09IHVuZGVmaW5lZClcbiAgICAgID8gdGhpc1tcInZhbHVlXCJdXG4gICAgICA6IG90aGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIHRvIGJlIHZlcmlmaWVkXG4gICAqIEBwYXJhbSBzdXBwbGllclxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIG9yRWxzZUdldChzdXBwbGllcikge1xuICAgIE9iamVjdHMucmVxdWlyZU5vbk51bGwoc3VwcGxpZXIsIFwiU3VwcGxpZXIgaXMgbnVsbFwiKTtcbiAgICBPYmplY3RzLnJlcXVpcmVGdW5jdGlvbihzdXBwbGllciwgXCJTdXBwbGllciBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICByZXR1cm4gISh0aGlzW1widmFsdWVcIl0gPT0gbnVsbCB8fCB0aGlzW1widmFsdWVcIl0gPT0gdW5kZWZpbmVkKVxuICAgICAgPyB0aGlzW1widmFsdWVcIl1cbiAgICAgIDogT2JqZWN0cy5yZXF1aXJlTm9uTnVsbChzdXBwbGllci5hcHBseShudWxsKSwgXCJSZXN1bHQgaXMgbnVsbFwiKTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuICh0aGlzW1widmFsdWVcIl0gPT0gbnVsbCB8fCB0aGlzW1widmFsdWVcIl0gPT0gdW5kZWZpbmVkKSAmJlxuICAgICAgKHRoaXNbXCJlcnJvclwiXSA9PSBudWxsIHx8IHRoaXNbXCJlcnJvclwiXSA9PSB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIGlzRXJyb3IoQ2xhc3M8Pz4gdHlwZSlcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0Vycm9yKCkge1xuICAgIHJldHVybiAodGhpc1tcInZhbHVlXCJdID09IG51bGwgfHwgdGhpc1tcInZhbHVlXCJdID09IHVuZGVmaW5lZCkgJiZcbiAgICAgICEodGhpc1tcImVycm9yXCJdID09IG51bGwgfHwgdGhpc1tcImVycm9yXCJdID09IHVuZGVmaW5lZCk7XG4gIH1cblxuICBpc1ZhbHVlKHZhbCkge1xuICAgIGlmKHZhbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAhKHRoaXNbXCJ2YWx1ZVwiXSA9PSBudWxsIHx8IHRoaXNbXCJ2YWx1ZVwiXSA9PSB1bmRlZmluZWQpICYmXG4gICAgICAgICh0aGlzW1wiZXJyb3JcIl0gPT0gbnVsbCB8fCB0aGlzW1wiZXJyb3JcIl0gPT0gdW5kZWZpbmVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNbXCJ2YWx1ZVwiXSA9PSB2YWw7XG4gICAgfVxuICB9XG5cbiAgbWFwKG1hcHBlcikge1xuICAgIE9iamVjdHMucmVxdWlyZU5vbk51bGwobWFwcGVyLCBcIk1hcHBlciBpcyBudWxsXCIpO1xuICAgIE9iamVjdHMucmVxdWlyZUZ1bmN0aW9uKG1hcHBlciwgXCJNYXBwZXIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG5cbiAgICBpZih0aGlzW1widmFsdWVcIl0gPT0gbnVsbCB8fCB0aGlzW1widmFsdWVcIl0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIFJlc3VsdC5vayhtYXBwZXIuYXBwbHkobnVsbCwgW3RoaXNbXCJ2YWx1ZVwiXV0pKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gUmVzdWx0LmVycm9yKGUpO1xuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIEltcGxlbWVudCB0aGlzIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSBtYXBwZXJcbiAgICovXG4gIG1hcEVycm9yKG1hcHBlcikge1xuXG4gIH1cblxuXG4gIGZsYXRNYXAobWFwcGVyKSB7XG4gICAgT2JqZWN0cy5yZXF1aXJlTm9uTnVsbChtYXBwZXIsIFwiTWFwcGVyIGlzIG51bGxcIik7XG4gICAgT2JqZWN0cy5yZXF1aXJlRnVuY3Rpb24obWFwcGVyLCBcIk1hcHBlciBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICBpZih0aGlzLmlzRW1wdHkoKSB8fCB0aGlzLmlzRXJyb3IoKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciByZXM7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBPYmplY3RzLnJlcXVpcmVOb25OdWxsKG1hcHBlci5hcHBseShudWxsLCBbdGhpc1tcInZhbHVlXCJdXSksIFwiUmVzdWx0IGlzIG51bGxcIik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIFJlc3VsdC5lcnJvcihlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAdG9kbyBJbXBsZW1lbnQgdGhpcyBmdW5jdGlvbiAuLi4gb3IgTm90XG4gICAqL1xuICBmbGF0dGVuZWQoKSB7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBAdG9kbyBJbXBsZW1lbnQgdGhpcyBmdW5jdGlvbiAuLi4gb3IgTm90XG4gICAqL1xuICBhbmRUaGVuKG1hcHBlcikge1xuXG4gIH1cblxuICBlaXRoZXIobWFwcGluZywgcmVjb3Zlcikge1xuICAgIGlmKHRoaXMuaXNFcnJvcigpKSB7XG4gICAgICByZXR1cm4gcmVjb3Zlci5hcHBseShudWxsLCBbdGhpc1tcImVycm9yXCJdXSk7XG4gICAgfVxuICAgIHJldHVybiBtYXBwaW5nLmFwcGx5KG51bGwsIFt0aGlzW1widmFsdWVcIl1dKTtcbiAgfVxuXG4gIGZpbHRlcihwcmVkaWNhdGUpIHtcbiAgICBPYmplY3RzLnJlcXVpcmVOb25OdWxsKHByZWRpY2F0ZSwgXCJQcmVkaWNhdGUgaXMgbnVsbFwiKTtcbiAgICBpZih0aGlzLmlzRW1wdHkoKSB8fCB0aGlzLmlzRXJyb3IoKSkge1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByZWRpY2F0ZS5hcHBseShudWxsLCBbdGhpc1tcInZhbHVlXCJdXSlcbiAgICAgICAgPyB0aGlzXG4gICAgICAgIDogUmVzdWx0LmVtcHR5KCk7XG5cbiAgICB9XG4gIH1cblxuICByZWR1Y2UoaW5pdCwgZnVuYykge1xuICAgIGlmICh0aGlzW1widmFsdWVcIl0gPT0gbnVsbCB8fCB0aGlzW1widmFsdWVcIl0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaW5pdFxuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCBbaW5pdCwgdGhpc1tcInZhbHVlXCJdXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAdG9kbyBJbXBsZW1lbnQgdGhpcyBmdW5jdGlvbiAuLi4gb3IgTm90XG4gICAqIEBwYXJhbSBvdGhlclxuICAgKi9cbiAgYXBwbHkob3RoZXIpIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBvdGhlclxuICAgKi9cbiAgYW5kKG90aGVyKSB7XG4gICAgaWYoIXRoaXMuaXNFcnJvcigpKSB7XG4gICAgICByZXR1cm4gb3RoZXI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBvdGhlclxuICAgKi9cbiAgb3Iob3RoZXIpIHtcbiAgICBpZih0aGlzLmlzRXJyb3IoKSkge1xuICAgICAgcmV0dXJuIG90aGVyO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGVxdWFscyhvYmopIHtcbiAgICBpZihvYmogPT0gbnVsbCB8fCBvYmogPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKHRoaXMgPT0gb2JqKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBpZighKG9iaiBpbnN0YW5jZW9mIFJlc3VsdCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNbXCJ2YWx1ZVwiXSA9PSBvYmpbXCJ2YWx1ZVwiXVxuICAgICAgJiYgdGhpc1tcImVycm9yXCJdID09IG9ialtcImVycm9yXCJdO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIEltcGxlbWVudCB0aGlzIGZ1bmN0aW9uIC4uLiBvciBOb3RcbiAgICogQG92ZXJyaWRlXG4gICAqL1xuICBoYXNoQ29kZSgpIHtcbiAgICAvL1dJUFxuICB9XG5cbiAgLyoqXG4gICAqIEBvdmVycmlkZVxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgaWYodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybiBcIlJlc3VsdC5lbXB0eVwiO1xuICAgIH1cbiAgICBpZih0aGlzLmlzRXJyb3IoKSkge1xuICAgICAgcmV0dXJuIGBSZXN1bHQuZXJyb3JbJHt0aGlzW1wiZXJyb3JcIl19XWA7XG4gICAgfVxuICAgIHJldHVybiBgUmVzdWx0LnZhbHVlWyR7dGhpc1tcInZhbHVlXCJdfV1gO1xuICB9XG5cbiAgZGVzdHJ1Y3QoKSB7XG4gICAgcmV0dXJuIFt0aGlzW1wiZXJyb3JcIl0sIHRoaXNbXCJ2YWx1ZVwiXV07XG4gIH1cblxufVxuXG5leHBvcnQgeyBFeHRlbmRhYmxlRXhjZXB0aW9uLCBOdWxsUG9pbnRlckV4Y2VwdGlvbiwgTm9TdWNoRWxlbWVudEV4Y2VwdGlvbiwgUnVudGltZUV4Y2VwdGlvbiwgT2JqZWN0cywgT3B0aW9uYWwsIFJlc3VsdCB9OyJdfQ==