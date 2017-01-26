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

module.exports = {
  noop,
  stringify,
  isHtmlPage,
  isTrue,
  isFalse,
  isNumeric,
  exclude,
  unique,
  decode64,
  encode64,
  keyToPath,
  getObjectValue,
  setObjectValue,
  removeObjectValue,
  clone,
  toUnderscore,
  underscoreKeys,
  camelCase,
  camelKeys
};
