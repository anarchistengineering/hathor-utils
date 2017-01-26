Hathor Utils
===

Collection of utility functions for use with Hathor projects, plugins, and routes.  The basic usage of each method is covered here, but full usage is covered in the tests.

**NOTE:** All functions in this library work in an immutable fashion, creating clones or copies of objects and never modifing the source object or values.

Install
---

```
npm install --save hathor-utils
```

API
===

noop()
---

An empty function, no operation, useful for things like optional callbacks.

stringify(obj, serializer, indent, decycler)
---

Wrapper around json-stringify-safe, useful when you want to JSON.stringify an object that may or may not have things that are compatable with JSON.

isHtmlPage(pageName)
---

Returns a true false flag if the string filename passed in ends in html or htm.

isTrue(value)
---

Checks value to see if it is either "true" or a boolean true value.  If so will return a boolean true.  All other values return a boolean false.

isFalse
---

Checks value to see if it is either "false" or a boolean false value.  If so will return a boolean true.  All other values return a boolean false.

isNumeric
---

Checks value to see if a value is a numeric value.  If so will return a boolean true, if the value is a string that represents a numeric true will also be returned.  All other values return a boolean false.

exclude(source, [key], [...key])
---

Creates a new object then copies all key values from source into the new object and excludes any keys provided.

unique(array)
---

Returns a new array that only contains unique values from the source aray.  Useful to dedupe arrays.

decode64(str)
---

Decodes a Base 64 string into a binary blob.

encode64(blob)
---

Encodes a value into a Base 64 string representation.

keyToPath(key, splitOn = /[\.\/]/)
---

Takes key as a string and splits it on the expression provided (defaults to splitting on all .'s and /'s) then returns the resulting array.  Useful for passing search paths to getObjectValue, setObjectValue, etc...

getObjectValue(path, obj, defaultValue)
---

Accepts path as an array of keys to recurse through and return the value from obj.  If the value is not found then returns defaultValue (undefined by default).

### Example:

```js
const src = {
  foo: {
    bar: {
      value: 'something'
    }
  }
};
const value = getObjectValue(keyToPath('foo.bar.value'),  src, 'value');
const noValue = getObjectValue(keyToPath('foo.bar.noValue'), src, 'nothing');
console.log(value); // outputs "something"
console.log(noValue); // outputs "nothing"
```

setObjectValue(path, obj, value)
---

Accepts path as an array of keys to recurse through the keys creating new objects if no key exists and updating the final value.

### Example:

```js
const src = {
  foo: {
  }
};
const out1 = setObjectValue(keyToPath('foo'),  src, 'bar');
const out2 = setObjectValue(keyToPath('foo.bar'), src, 'value');
console.log(out1); // outputs {foo: "bar"}
console.log(out2); // outputs {foo: {bar: "value"}}
```

removeObjectValue(path, obj)
---

Similar to exclude, but instead works with key paths and can remove embedded values from the source object.

### Example:

```js
const src = {
  foo: {
    bar: {
      value: 'something'
    }
  }
};
const value = removeObjectValue(keyToPath('foo.bar.value'),  src);
console.log(value); // {foo: bar: {}}
```

clone(source)
---

Creates a deep clone of source and returns it.

If the passed value is a Date or Regular Expression a new instance is created and returned.
If the value is a string, numeric, or boolean then it is returned as by default these do not require explicit cloning.
If the value is an array it is mapped over returning a new array of cloned values within.
If the value is an object then all keys are mapped over, checked against "hasOwnProperty" and cloned recursivly then returned.

toUnderscore
---

Converts a camel cased string into an underscored uppercase string.

### Example:

```js
const input = 'testString';
const output = toUnderscore(input);
console.log(output); // TEST_STRING
```

underscoreKeys
---

Takes an object, itterates over its keys calling toUnderscore recursivly, and returns a new object with the keys in all uppercase with underscores.

camelCase
---

Converts a string into its camel cased representation.

```js
const input = 'TEST_STRING FOO-BAR_NONE';
const output = camelCase(input);
console.log(output); // testStringFooBarNone
```

camelKeys
---

Takes an object, itterates over its keys calling camelCase recursivly, and returns a new object with the keys converted to camel case.
