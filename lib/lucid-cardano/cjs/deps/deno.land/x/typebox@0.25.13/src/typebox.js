"use strict";

require("core-js/modules/es.array.push.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeBuilder = exports.Type = exports.Modifier = exports.Kind = exports.Hint = void 0;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.global-this.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.set.difference.v2.js");
require("core-js/modules/es.set.intersection.v2.js");
require("core-js/modules/es.set.is-disjoint-from.v2.js");
require("core-js/modules/es.set.is-subset-of.v2.js");
require("core-js/modules/es.set.is-superset-of.v2.js");
require("core-js/modules/es.set.symmetric-difference.v2.js");
require("core-js/modules/es.set.union.v2.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/web.dom-collections.iterator.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*--------------------------------------------------------------------------

@sinclair/typebox

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/
// --------------------------------------------------------------------------
// Symbols
// --------------------------------------------------------------------------
const Kind = exports.Kind = Symbol.for('TypeBox.Kind');
const Hint = exports.Hint = Symbol.for('TypeBox.Hint');
const Modifier = exports.Modifier = Symbol.for('TypeBox.Modifier');
// --------------------------------------------------------------------------
// TypeBuilder
// --------------------------------------------------------------------------
let TypeOrdinal = 0;
class TypeBuilder {
  // ----------------------------------------------------------------------
  // Modifiers
  // ----------------------------------------------------------------------
  /** Creates a readonly optional property */
  ReadonlyOptional(item) {
    return _objectSpread({
      [Modifier]: 'ReadonlyOptional'
    }, item);
  }
  /** Creates a readonly property */
  Readonly(item) {
    return _objectSpread({
      [Modifier]: 'Readonly'
    }, item);
  }
  /** Creates a optional property */
  Optional(item) {
    return _objectSpread({
      [Modifier]: 'Optional'
    }, item);
  }
  // ----------------------------------------------------------------------
  // Types
  // ----------------------------------------------------------------------
  /** `Standard` Creates a any type */
  Any() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Any'
    }));
  }
  /** `Standard` Creates a array type */
  Array(items) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Array',
      type: 'array',
      items
    }));
  }
  /** `Standard` Creates a boolean type */
  Boolean() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Boolean',
      type: 'boolean'
    }));
  }
  /** `Extended` Creates a tuple type from this constructors parameters */
  ConstructorParameters(schema) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.Tuple([...schema.parameters], _objectSpread({}, options));
  }
  /** `Extended` Creates a constructor type */
  Constructor(parameters, returns) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (parameters[Kind] === 'Tuple') {
      const inner = parameters.items === undefined ? [] : parameters.items;
      return this.Create(_objectSpread(_objectSpread({}, options), {}, {
        [Kind]: 'Constructor',
        type: 'object',
        instanceOf: 'Constructor',
        parameters: inner,
        returns
      }));
    } else if (globalThis.Array.isArray(parameters)) {
      return this.Create(_objectSpread(_objectSpread({}, options), {}, {
        [Kind]: 'Constructor',
        type: 'object',
        instanceOf: 'Constructor',
        parameters,
        returns
      }));
    } else {
      throw new Error('TypeBuilder.Constructor: Invalid parameters');
    }
  }
  /** `Extended` Creates a Date type */
  Date() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Date',
      type: 'object',
      instanceOf: 'Date'
    }));
  }
  /** `Standard` Creates a enum type */
  Enum(item) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const values = Object.keys(item).filter(key => isNaN(key)).map(key => item[key]);
    const anyOf = values.map(value => typeof value === 'string' ? {
      [Kind]: 'Literal',
      type: 'string',
      const: value
    } : {
      [Kind]: 'Literal',
      type: 'number',
      const: value
    });
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Union',
      [Hint]: 'Enum',
      anyOf
    }));
  }
  /** `Extended` Creates a function type */
  Function(parameters, returns) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (parameters[Kind] === 'Tuple') {
      const inner = parameters.items === undefined ? [] : parameters.items;
      return this.Create(_objectSpread(_objectSpread({}, options), {}, {
        [Kind]: 'Function',
        type: 'object',
        instanceOf: 'Function',
        parameters: inner,
        returns
      }));
    } else if (globalThis.Array.isArray(parameters)) {
      return this.Create(_objectSpread(_objectSpread({}, options), {}, {
        [Kind]: 'Function',
        type: 'object',
        instanceOf: 'Function',
        parameters,
        returns
      }));
    } else {
      throw new Error('TypeBuilder.Function: Invalid parameters');
    }
  }
  /** `Extended` Creates a type from this constructors instance type */
  InstanceType(schema) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _objectSpread(_objectSpread({}, options), this.Clone(schema.returns));
  }
  /** `Standard` Creates a integer type */
  Integer() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Integer',
      type: 'integer'
    }));
  }
  /** `Standard` Creates a intersect type. */
  Intersect(objects) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const isOptional = schema => schema[Modifier] && schema[Modifier] === 'Optional' || schema[Modifier] === 'ReadonlyOptional';
    const [required, optional] = [new Set(), new Set()];
    for (const object of objects) {
      for (const [key, schema] of Object.entries(object.properties)) {
        if (isOptional(schema)) optional.add(key);
      }
    }
    for (const object of objects) {
      for (const key of Object.keys(object.properties)) {
        if (!optional.has(key)) required.add(key);
      }
    }
    const properties = {};
    for (const object of objects) {
      for (const [key, schema] of Object.entries(object.properties)) {
        properties[key] = properties[key] === undefined ? schema : {
          [Kind]: 'Union',
          anyOf: [properties[key], _objectSpread({}, schema)]
        };
      }
    }
    if (required.size > 0) {
      return this.Create(_objectSpread(_objectSpread({}, options), {}, {
        [Kind]: 'Object',
        type: 'object',
        properties,
        required: [...required]
      }));
    } else {
      return this.Create(_objectSpread(_objectSpread({}, options), {}, {
        [Kind]: 'Object',
        type: 'object',
        properties
      }));
    }
  }
  /** `Standard` Creates a keyof type */
  KeyOf(object) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const items = Object.keys(object.properties).map(key => this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Literal',
      type: 'string',
      const: key
    })));
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Union',
      [Hint]: 'KeyOf',
      anyOf: items
    }));
  }
  /** `Standard` Creates a literal type. */
  Literal(value) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Literal',
      const: value,
      type: typeof value
    }));
  }
  /** `Standard` Creates a never type */
  Never() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Never',
      allOf: [{
        type: 'boolean',
        const: false
      }, {
        type: 'boolean',
        const: true
      }]
    }));
  }
  /** `Standard` Creates a null type */
  Null() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Null',
      type: 'null'
    }));
  }
  /** `Standard` Creates a number type */
  Number() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Number',
      type: 'number'
    }));
  }
  /** `Standard` Creates an object type */
  Object(properties) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const property_names = Object.keys(properties);
    const optional = property_names.filter(name => {
      const property = properties[name];
      const modifier = property[Modifier];
      return modifier && (modifier === 'Optional' || modifier === 'ReadonlyOptional');
    });
    const required = property_names.filter(name => !optional.includes(name));
    if (required.length > 0) {
      return this.Create(_objectSpread(_objectSpread({}, options), {}, {
        [Kind]: 'Object',
        type: 'object',
        properties,
        required
      }));
    } else {
      return this.Create(_objectSpread(_objectSpread({}, options), {}, {
        [Kind]: 'Object',
        type: 'object',
        properties
      }));
    }
  }
  /** `Standard` Creates a new object type whose keys are omitted from the given source type */
  Omit(schema, keys) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const select = keys[Kind] === 'Union' ? keys.anyOf.map(schema => schema.const) : keys;
    const next = _objectSpread(_objectSpread(_objectSpread({}, this.Clone(schema)), options), {}, {
      [Hint]: 'Omit'
    });
    if (next.required) {
      next.required = next.required.filter(key => !select.includes(key));
      if (next.required.length === 0) delete next.required;
    }
    for (const key of Object.keys(next.properties)) {
      if (select.includes(key)) delete next.properties[key];
    }
    return this.Create(next);
  }
  /** `Extended` Creates a tuple type from this functions parameters */
  Parameters(schema) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return Type.Tuple(schema.parameters, _objectSpread({}, options));
  }
  /** `Standard` Creates an object type whose properties are all optional */
  Partial(schema) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const next = _objectSpread(_objectSpread(_objectSpread({}, this.Clone(schema)), options), {}, {
      [Hint]: 'Partial'
    });
    delete next.required;
    for (const key of Object.keys(next.properties)) {
      const property = next.properties[key];
      const modifer = property[Modifier];
      switch (modifer) {
        case 'ReadonlyOptional':
          property[Modifier] = 'ReadonlyOptional';
          break;
        case 'Readonly':
          property[Modifier] = 'ReadonlyOptional';
          break;
        case 'Optional':
          property[Modifier] = 'Optional';
          break;
        default:
          property[Modifier] = 'Optional';
          break;
      }
    }
    return this.Create(next);
  }
  /** `Standard` Creates a new object type whose keys are picked from the given source type */
  Pick(schema, keys) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const select = keys[Kind] === 'Union' ? keys.anyOf.map(schema => schema.const) : keys;
    const next = _objectSpread(_objectSpread(_objectSpread({}, this.Clone(schema)), options), {}, {
      [Hint]: 'Pick'
    });
    if (next.required) {
      next.required = next.required.filter(key => select.includes(key));
      if (next.required.length === 0) delete next.required;
    }
    for (const key of Object.keys(next.properties)) {
      if (!select.includes(key)) delete next.properties[key];
    }
    return this.Create(next);
  }
  /** `Extended` Creates a Promise type */
  Promise(item) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Promise',
      type: 'object',
      instanceOf: 'Promise',
      item
    }));
  }
  /** `Standard` Creates a record type */
  Record(key, value) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    // If string literal union return TObject with properties extracted from union.
    if (key[Kind] === 'Union') {
      return this.Object(key.anyOf.reduce((acc, literal) => {
        return _objectSpread(_objectSpread({}, acc), {}, {
          [literal.const]: value
        });
      }, {}), _objectSpread(_objectSpread({}, options), {}, {
        [Hint]: 'Record'
      }));
    }
    // otherwise return TRecord with patternProperties
    const pattern = ['Integer', 'Number'].includes(key[Kind]) ? '^(0|[1-9][0-9]*)$' : key[Kind] === 'String' && key.pattern ? key.pattern : '^.*$';
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Record',
      type: 'object',
      patternProperties: {
        [pattern]: value
      },
      additionalProperties: false
    }));
  }
  /** `Standard` Creates recursive type */
  Recursive(callback) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (options.$id === undefined) options.$id = "T".concat(TypeOrdinal++);
    const self = callback({
      [Kind]: 'Self',
      $ref: "".concat(options.$id)
    });
    self.$id = options.$id;
    return this.Create(_objectSpread(_objectSpread({}, options), self));
  }
  /** `Standard` Creates a reference type. The referenced type must contain a $id. */
  Ref(schema) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (schema.$id === undefined) throw Error('TypeBuilder.Ref: Referenced schema must specify an $id');
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Ref',
      $ref: schema.$id
    }));
  }
  /** `Standard` Creates a string type from a regular expression */
  RegEx(regex) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'String',
      type: 'string',
      pattern: regex.source
    }));
  }
  /** `Standard` Creates an object type whose properties are all required */
  Required(schema) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const next = _objectSpread(_objectSpread(_objectSpread({}, this.Clone(schema)), options), {}, {
      [Hint]: 'Required'
    });
    next.required = Object.keys(next.properties);
    for (const key of Object.keys(next.properties)) {
      const property = next.properties[key];
      const modifier = property[Modifier];
      switch (modifier) {
        case 'ReadonlyOptional':
          property[Modifier] = 'Readonly';
          break;
        case 'Readonly':
          property[Modifier] = 'Readonly';
          break;
        case 'Optional':
          delete property[Modifier];
          break;
        default:
          delete property[Modifier];
          break;
      }
    }
    return this.Create(next);
  }
  /** `Extended` Creates a type from this functions return type */
  ReturnType(schema) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _objectSpread(_objectSpread({}, options), this.Clone(schema.returns));
  }
  /** Removes Kind and Modifier symbol property keys from this schema */
  Strict(schema) {
    return JSON.parse(JSON.stringify(schema));
  }
  /** `Standard` Creates a string type */
  String() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'String',
      type: 'string'
    }));
  }
  /** `Standard` Creates a tuple type */
  Tuple(items) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const additionalItems = false;
    const minItems = items.length;
    const maxItems = items.length;
    const schema = items.length > 0 ? _objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Tuple',
      type: 'array',
      items,
      additionalItems,
      minItems,
      maxItems
    }) : _objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Tuple',
      type: 'array',
      minItems,
      maxItems
    });
    return this.Create(schema);
  }
  /** `Extended` Creates a undefined type */
  Undefined() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Undefined',
      type: 'null',
      typeOf: 'Undefined'
    }));
  }
  /** `Standard` Creates a union type */
  Union(items) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return items.length === 0 ? Type.Never(_objectSpread({}, options)) : this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Union',
      anyOf: items
    }));
  }
  /** `Extended` Creates a Uint8Array type */
  Uint8Array() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Uint8Array',
      type: 'object',
      instanceOf: 'Uint8Array'
    }));
  }
  /** `Standard` Creates an unknown type */
  Unknown() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Unknown'
    }));
  }
  /** `Standard` Creates a user defined schema that infers as type T  */
  Unsafe() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: options[Kind] || 'Unsafe'
    }));
  }
  /** `Extended` Creates a void type */
  Void() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.Create(_objectSpread(_objectSpread({}, options), {}, {
      [Kind]: 'Void',
      type: 'null',
      typeOf: 'Void'
    }));
  }
  /** Use this function to return TSchema with static and params omitted */
  Create(schema) {
    return schema;
  }
  /** Clones the given value */
  Clone(value) {
    const isObject = object => typeof object === 'object' && object !== null && !Array.isArray(object);
    const isArray = object => typeof object === 'object' && object !== null && Array.isArray(object);
    if (isObject(value)) {
      return Object.keys(value).reduce((acc, key) => _objectSpread(_objectSpread({}, acc), {}, {
        [key]: this.Clone(value[key])
      }), Object.getOwnPropertySymbols(value).reduce((acc, key) => _objectSpread(_objectSpread({}, acc), {}, {
        [key]: this.Clone(value[key])
      }), {}));
    } else if (isArray(value)) {
      return value.map(item => this.Clone(item));
    } else {
      return value;
    }
  }
}
/** JSON Schema Type Builder with Static Type Resolution for TypeScript */
exports.TypeBuilder = TypeBuilder;
const Type = exports.Type = new TypeBuilder();