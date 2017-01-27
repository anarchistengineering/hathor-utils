const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

const utils = require('../');

describe('utils', ()=>{
  describe('camelCase', ()=>{
    it('Should convert "foo bar none" to fooBarNone', (done)=>{
      const res = utils.camelCase('foo bar none');
      expect(res).to.be.a.string().and.to.equal('fooBarNone');
      return done();
    });

    it('Should convert "FOO BAR NONE" to fooBarNone', (done)=>{
      const res = utils.camelCase('FOO BAR NONE');
      expect(res).to.be.a.string().and.to.equal('fooBarNone');
      return done();
    });

    it('Should convert "foo-bar_none" to fooBarNone', (done)=>{
      const res = utils.camelCase('foo bar none');
      expect(res).to.be.a.string().and.to.equal('fooBarNone');
      return done();
    });

    it('Should convert "FOO-BAR_NONE" to fooBarNone', (done)=>{
      const res = utils.camelCase('FOO BAR NONE');
      expect(res).to.be.a.string().and.to.equal('fooBarNone');
      return done();
    });

    it('Should convert "FOO -_BAR_NONE" to fooBarNone', (done)=>{
      const res = utils.camelCase('FOO BAR NONE');
      expect(res).to.be.a.string().and.to.equal('fooBarNone');
      return done();
    });
  });

  describe('camelKeys', ()=>{
    it('Should convert basic object keys', (done)=>{
      const res = utils.camelKeys({fooBar: '', FOO_BAR2: ''});
      const xpct = {fooBar: '', fooBar2: ''};
      expect(res).to.equal(xpct);
      return done();
    });

    it('Should convert embedded object keys', (done)=>{
      const res = utils.camelKeys({fooBar: {FOO_BAR2: ''}});
      const xpct = {fooBar: {fooBar2: ''}};
      expect(res).to.equal(xpct);
      return done();
    });

    it('Should convert array object keys', (done)=>{
      const res = utils.camelKeys({fooBar: [{FOO_BAR2: ''}, 1, 'str', true]});
      const xpct = {fooBar: [{fooBar2: ''}, 1, 'str', true]};
      expect(res).to.equal(xpct);
      return done();
    });
  });

  describe('toUnderscore', ()=>{
    it('Should convert aB to A_B', (done)=>{
      const res = utils.toUnderscore('aB');
      expect(res).to.equal('A_B');
      return done();
    });

    it('Should convert aBBBB to A_BBBB', (done)=>{
      const res = utils.toUnderscore('aBBBB');
      expect(res).to.equal('A_BBBB');
      return done();
    });

    it('Should convert aBCdEF to A_BCD_EF', (done)=>{
      const res = utils.toUnderscore('aBCdEF');
      expect(res).to.equal('A_BCD_EF');
      return done();
    });

    it('Should convert a_bcd_ef as A_BCD_EF', (done)=>{
      const res = utils.toUnderscore('a_bcd_ef');
      expect(res).to.equal('A_BCD_EF');
      return done();
    });

    it('Should leave A_BCD_EF as A_BCD_EF', (done)=>{
      const res = utils.toUnderscore('A_BCD_EF');
      expect(res).to.equal('A_BCD_EF');
      return done();
    });
  });

  describe('underscoreKeys', ()=>{
    it('Should convert basic object keys', (done)=>{
      const res = utils.underscoreKeys({fooBar: '', FOO_BAR2: ''});
      const xpct = {FOO_BAR: '', FOO_BAR2: ''};
      expect(res).to.equal(xpct);
      return done();
    });

    it('Should convert embedded object keys', (done)=>{
      const res = utils.underscoreKeys({fooBar: {FOO_BAR2: ''}});
      const xpct = {FOO_BAR: {FOO_BAR2: ''}};
      expect(res).to.equal(xpct);
      return done();
    });

    it('Should convert array object keys', (done)=>{
      const res = utils.underscoreKeys({FOO_BAR: [{FOO_BAR2: ''}, 1, 'str', true]});
      const xpct = {FOO_BAR: [{FOO_BAR2: ''}, 1, 'str', true]};
      expect(res).to.equal(xpct);
      return done();
    });
  });

  describe('exclude', ()=>{
    it('Should create a new object that does not contain specified keys', (done)=>{
      const src = {foo: 'bar', bar: 'none', some: 123};
      const out = utils.exclude(src, 'some', 'bar');
      expect(out).to.equal({foo: 'bar'});
      expect(out.bar).to.be.undefined();
      expect(out.some).to.be.undefined();
      done();
    });
  });

  describe('unique', ()=>{
    it('Should return a unique list of items', (done)=>{
      const src = [1, 2, 2, 3, 4, 1, 3, 4, 5];
      const out = utils.unique(src);
      expect(out).to.equal([1, 2, 3, 4, 5]);
      done();
    });
  });

  describe('keyToPath', ()=>{
    it('Should split this.and/that into ["this", "and", "that"]', (done)=>{
      const out = utils.keyToPath('this.and/that');
      expect(out).to.equal(['this', 'and', 'that']);
      done();
    });

    it('Should accept custom splitOn values', (done)=>{
      const out = utils.keyToPath('this;and:that', /[:;]/);
      expect(out).to.equal(['this', 'and', 'that']);
      done();
    });
  });

  describe('getObjectValue', ()=>{
    it('Should be able to return top level values', (done)=>{
      const src = {foo: 'bar'};
      const out = utils.getObjectValue(['foo'], src);
      expect(out).to.equal(src.foo);
      done();
    });

    it('Should be able to return embedded values', (done)=>{
      const src = {foo: {bar: 'none'}};
      const out = utils.getObjectValue(['foo', 'bar'], src);
      expect(out).to.equal(src.foo.bar);
      done();
    });

    it('Should be able to retrieve values from an array by index', (done)=>{
      const src = {foo: [0, 1, 2, 3]};
      const out = utils.getObjectValue(['foo', '2'], src);
      expect(out).to.equal(src.foo[2]);
      done();
    });
  });

  describe('setObjectValue', ()=>{
    it('Should not mutate source object', (done)=>{
      const src = {foo: 'bar'};
      const out = utils.setObjectValue(['test'], src, 'value');
      expect(src).to.equal({foo: 'bar'});
      expect(out).to.equal({foo: 'bar', test: 'value'});
      done();
    });

    it('Should be able to set top level values', (done)=>{
      const src = {foo: 'bar'};
      const out = utils.setObjectValue(['test'], src, 'value');
      expect(out).to.equal({foo: 'bar', test: 'value'});
      done();
    });

    it('Should be able to override top level values', (done)=>{
      const src = {foo: 'bar'};
      const out = utils.setObjectValue(['foo'], src, 'value');
      expect(out).to.equal({foo: 'value'});
      done();
    });

    it('Should be able to set embedded values', (done)=>{
      const src = {foo: 'bar'};
      const out = utils.setObjectValue(['test', 'child'], src, 'value');
      expect(out).to.equal({foo: 'bar', test: {child: 'value'}});
      done();
    });

    it('Should be able to set array values', (done)=>{
      const src = {foo: 'bar', test: [0, 1, 2]};
      const out = utils.setObjectValue(['test', '1'], src, 'value');
      expect(out).to.equal({foo: 'bar', test: [0, 'value', 2]});
      done();
    });
  });

  describe('removeObjectValue', ()=>{
    it('Should be able to remove top level values', (done)=>{
      const src = {foo: 'bar', bar: 'none'};
      const out = utils.removeObjectValue(['bar'], src);
      expect(out).to.equal({foo: 'bar'});
      done();
    });

    it('Should be able to remove embedded values', (done)=>{
      const src = {foo: {bar: 'none', some: 'value'}};
      const out = utils.removeObjectValue(['foo', 'bar'], src);
      expect(out).to.equal({foo: {some: 'value'}});
      done();
    });

    it('Should be able to remove array values', (done)=>{
      const src = {foo: {bar: [0, 1, 2], some: 'value'}};
      const out = utils.removeObjectValue(['foo', 'bar', 1], src);
      expect(out).to.equal({foo: {bar: [0, 2], some: 'value'}});
      done();
    });

    it('Should be able to remove embedded array values', (done)=>{
      const src = {foo: {bar: [0, {some: 'value', remove: 'this'}, 2], some: 'value'}};
      const out = utils.removeObjectValue(['foo', 'bar', 1, 'remove'], src);
      expect(out).to.equal({foo: {bar: [0, {some: 'value'}, 2], some: 'value'}});
      done();
    });
  });

  describe('merge', ()=>{
    it('Should be able to merge a single source', (done)=>{
      const src = {foo: 'bar'};
      const out = utils.merge(src);
      expect(out).to.be.an.object().and.to.equal(src);
      done();
    });

    it('Should be able to merge two objects', (done)=>{
      const src = {foo: 'bar'};
      const out = utils.merge(src, {bar: 'none'});
      expect(out).to.be.an.object().and.to.equal({foo: 'bar', bar: 'none'});
      done();
    });

    it('Should be able to merge three or more objects', (done)=>{
      const src = {foo: 'bar'};
      const out = utils.merge(src, {bar: 'none'}, {some: 'value'});
      expect(out).to.be.an.object().and.to.equal({foo: 'bar', bar: 'none', some: 'value'});
      done();
    });

    it('Should be able to merge embedded values', (done)=>{
      const src = {foo: {
        bar: 'none'
      }};
      const out = utils.merge(src, {foo: {some: 'value'}});
      expect(out).to.be.an.object().and.to.equal({foo: {bar: 'none', some: 'value'}});
      done();
    });
  });

  describe('clone', ()=>{
    it('Should create a copy of an object', (done)=>{
      const src = {foo: 'bar', bar: 'none'};
      const out = utils.clone(src);
      expect(out !== src);
      expect(out).to.equal(src);
      done();
    });

    it('Should create a deep clone of an object', (done)=>{
      const src = {foo: {some: 'bar', bar: 'none'}};
      const int = utils.clone(src);
      const out = utils.setObjectValue(['foo', 'some'], int, 'value');
      expect(out !== src);
      expect(src).to.equal({foo: {some: 'bar', bar: 'none'}});
      expect(out).to.equal({foo: {some: 'value', bar: 'none'}});
      done();
    });

    it('Should clone arrays', (done)=>{
      const src = [1, 2, 3];
      const out = utils.clone(src);
      expect(out !== src);
      expect(out).to.equal(src);
      done();
    });
  });

  describe('isNumeric', ()=>{
    it('Should return false for null', (done)=>{
      const out = utils.isNumeric(null);
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for undefined', (done)=>{
      const out = utils.isNumeric(undefined);
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for Boolean false', (done)=>{
      const out = utils.isNumeric(false);
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for a string value that is not "true"', (done)=>{
      const out = utils.isNumeric('test');
      expect(out).to.equal(false);
      done();
    });

    it('Should return true for a numeric value', (done)=>{
      const out = utils.isNumeric(1234.567);
      expect(out).to.equal(true);
      done();
    });

    it('Should return false for a Boolean true', (done)=>{
      const out = utils.isNumeric(true);
      expect(out).to.equal(false);
      done();
    });

    it('Should return true for a String value that is a numeric value', (done)=>{
      const out = utils.isNumeric('123.456');
      expect(out).to.equal(true);
      done();
    });
  });

  describe('isTrue', ()=>{
    it('Should return false for null', (done)=>{
      const out = utils.isTrue(null);
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for undefined', (done)=>{
      const out = utils.isTrue(undefined);
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for Boolean false', (done)=>{
      const out = utils.isTrue(false);
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for a string value that is not "true"', (done)=>{
      const out = utils.isTrue('test');
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for a numeric value', (done)=>{
      const out = utils.isTrue(1234.567);
      expect(out).to.equal(false);
      done();
    });

    it('Should return true for a Boolean true', (done)=>{
      const out = utils.isTrue(true);
      expect(out).to.equal(true);
      done();
    });

    it('Should return true for a String value that is "true"', (done)=>{
      const out = utils.isTrue('true');
      expect(out).to.equal(true);
      done();
    });
  });

  describe('isFalse', ()=>{
    it('Should return false for null', (done)=>{
      const out = utils.isFalse(null);
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for undefined', (done)=>{
      const out = utils.isFalse(undefined);
      expect(out).to.equal(false);
      done();
    });

    it('Should return true for Boolean false', (done)=>{
      const out = utils.isFalse(false);
      expect(out).to.equal(true);
      done();
    });

    it('Should return false for a string value that is not "false"', (done)=>{
      const out = utils.isFalse('test');
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for a numeric value', (done)=>{
      const out = utils.isFalse(1234.567);
      expect(out).to.equal(false);
      done();
    });

    it('Should return false for a Boolean true', (done)=>{
      const out = utils.isFalse(true);
      expect(out).to.equal(false);
      done();
    });

    it('Should return true for a String value that is "false"', (done)=>{
      const out = utils.isFalse('false');
      expect(out).to.equal(true);
      done();
    });
  });

/*
  decode64,
  encode64,
*/
});
