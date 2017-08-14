const _stringify = require('json-stringify-safe');

const noop = ()=>{};

const stringify = (obj, serializer, indent, decycler = noop)=>{
  return _stringify(obj, serializer, indent, decycler);
};

const exclude = (obj, ...keys)=>{
  return Object.keys(obj).reduce((o, key)=>{
    if(keys.indexOf(key) > -1){
      return o;
    }
    return Object.assign({}, o, {[key]: obj[key]});
  }, {});
};

const reIsHtml = /\.html?$/;
const isHtmlPage = (pageName)=>{
  return !!reIsHtml.exec(pageName);
};

const _reIsDateTime = /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-][01]\d:[0-5]\d)$/;
// ^^ from https://stackoverflow.com/a/43931246
const isDateTime = (v, reIsDateTime = _reIsDateTime)=>{
  if(!!(v && reIsDateTime.exec(v.toString()))){
    return !isNaN(Date.parse(v));
  }
  return false;
};
const isTrue = (v, reIsTrue = /^true$/i)=>!!(v && reIsTrue.exec(v.toString()));
const isFalse = (v, reIsFalse = /^false$/i)=>!!((v !== null) && (typeof(v) !== 'undefined') && reIsFalse.exec(v.toString()));

const isNumeric = (n)=>!isNaN(parseFloat(n)) && isFinite(n);

const unique = (a)=>{
  return [...(new Set(a))];
};

const decode64 = (src)=>{
  const buff = new Buffer(src, 'base64');
  return buff.toString();
};

const encode64 = (src)=>{
  const buff = new Buffer(src.toString(), 'binary');
  return buff.toString('base64');
};

const clone = (src)=>{
  if(null === src || typeof(src) !== 'object'){
    return src;
  }

  if(Array.isArray(src)){
    return src.map(clone);
  }

  if(src instanceof RegExp){
    return new RegExp(src);
  }

  if(src instanceof Date){
    return new Date(src);
  }

  return Object.keys(src).reduce((copy, key)=>{
    if(src.hasOwnProperty(key)){
      return Object.assign({}, copy, {[key]: clone(src[key])});
    }
    return copy;
  }, {});
};

const typeOf = (val)=>{
  const type = typeof(val);
  if(type === 'object'){
    if(Array.isArray(val)){
      return 'array';
    }
    if(val instanceof RegExp){
      return 'regex';
    }
    if(val instanceof Date){
      return 'date';
    }
    if(val === null){
      return 'null';
    }
    return type;
  }
  return type;
};

const isTheSame = (a, b, maxDepth=100)=>{
  if(maxDepth < 0){
    return false;
  }
  if(a === b){
    return true;
  }
  const typeA = typeOf(a);
  const typeB = typeOf(b);
  if(typeA !== typeB){
    return false;
  }
  if(typeA === 'object'){
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if(!isTheSame(aKeys, bKeys)){
      return false;
    }
    return aKeys.every((key)=>{
      return isTheSame(a[key], b[key], maxDepth-1);
    });
  }
  if(typeA === 'array'){
    if(a.length !== b.length){
      return false;
    }
    return a.every((item, index)=>isTheSame(item, b[index], maxDepth-1));
  }
  if(typeA === 'date'){
    return a.getTime() === b.getTime();
  }
  if(typeA === 'regex'){
    return a.toString() === b.toString();
  }
  if(typeA === 'null'){
    return true;
  }
  if(typeA === 'undefined'){
    return true;
  }
  return a === b;
};

const merge = (...args)=>{
  if(!args.length){
    return {};
  }
  return args.reduce((res, arg)=>{
    if(!res){
      return arg;
    }
    if(Array.isArray(res)){
      return [...res, ...(Array.isArray(arg)?arg:[arg])];
    }
    if(Array.isArray(arg)){
      return [res, ...arg];
    }
    const rType = typeof(res);
    const aType = typeof(arg);
    if(rType !== 'object'){
      return arg;
    }
    if(aType !== 'object'){
      return [res, arg];
    }
    return Object.keys(arg).reduce((res, key)=>{
      return Object.assign({}, res, {[key]: merge(res[key], arg[key])});
    }, res);
  }, clone(args[0]));
};

const keyToPath = (key, splitOn = /[\.\/]/)=>key.split(splitOn);

const getObjectValue = (path, obj, defaultValue)=>{
  const val = path.reduce((curr, key)=>{
    if(!key){
      return curr;
    }
    if(!curr){
      return curr;
    }
    return curr[key];
  }, obj);
  if(typeof(val) === 'undefined'){
    return defaultValue;
  }
  return val;
};

const setObjectValue = (path, src, value)=>{
  const obj = clone(src);
  let o = obj;
  let last, segment;
  while(o && path.length){
    segment = path.shift();
    last = o;
    o = o[segment];
    if(!o){
      o = last[segment] = {};
    }
  }
  last[segment] = value;
  return obj;
};

const removeObjectValue = (path, src)=>{
  if(null === src || typeof(src) !== 'object'){
    return src;
  }

  const seg = path[0];
  const lastSeg = path.length === 1;

  if(Array.isArray(src)){
    if(isNumeric(seg)){
      const iSeg = +seg;
      if(lastSeg){
        return [...src.slice(0, iSeg), ...src.slice(iSeg+1)];
      }
      return [...src.slice(0, iSeg), removeObjectValue(path.slice(1), src[iSeg]), ...src.slice(iSeg+1)];
    }
    return src.map(clone);
  }

  if(src instanceof RegExp){
    return new RegExp(src);
  }

  if(src instanceof Date){
    return new Date(src);
  }

  return Object.keys(src).reduce((copy, key)=>{
    if(src.hasOwnProperty(key)){
      if(seg === key){
        if(lastSeg){
          return copy;
        }
        return Object.assign({}, copy, {[key]: removeObjectValue(path.slice(1), src[key])});
      }
      return Object.assign({}, copy, {[key]: clone(src[key])});
    }
    return copy;
  }, {});
};

const toUnderscore = (str)=>{
  return str.replace(/\.?([A-Z]+)/g, (x,y)=>`_${y.toLowerCase()}`).replace(/^_/, "").replace(/__/g, '_').toUpperCase();
};

const underscoreKeys = (obj)=>{
  if(typeof(obj)!=='object'){
    return obj;
  }
  if(Array.isArray(obj)){
    return obj.map(underscoreKeys);
  }
  if(obj instanceof RegExp || obj instanceof Date){
    return obj;
  }
  return Object.keys(obj).reduce((res, key)=>{
    return Object.assign(res, {[toUnderscore(key)]: underscoreKeys(obj[key])});
  }, {});
};

const camelCase = (src)=>{
  const str = src.toUpperCase() === src?src.toLowerCase():src;
  return str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset)=>(p2)?p2.toUpperCase():p1.toLowerCase());
};

const camelKeys = (obj)=>{
  if(typeof(obj)!=='object'){
    return obj;
  }
  if(Array.isArray(obj)){
    return obj.map(camelKeys);
  }
  if(obj instanceof RegExp || obj instanceof Date){
    return obj;
  }
  return Object.keys(obj).reduce((res, key)=>{
    return Object.assign(res, {[camelCase(key)]: camelKeys(obj[key])});
  }, {});
};

const getTypedValueFrom = exports.getTypedValueFrom = (value) => {
  if(isNumeric(value)){
    return +value;
  }
  if(isTrue(value)){
    return true;
  }
  if(isFalse(value)){
    return false;
  }
  if(isDateTime(value)){
    return new Date(Date.parse(value));
  }
  return value;
};

module.exports = {
  noop,
  stringify,
  isHtmlPage,
  isTrue,
  isFalse,
  isNumeric,
  isDateTime,
  exclude,
  unique,
  decode64,
  encode64,
  keyToPath,
  getObjectValue,
  setObjectValue,
  removeObjectValue,
  clone,
  typeOf,
  isTheSame,
  merge,
  toUnderscore,
  underscoreKeys,
  camelCase,
  camelKeys,
  getTypedValueFrom
};
