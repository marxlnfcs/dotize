import {dotify, parse} from "../src";

// define sources
const source = {
  "government": {
    "flight": {
      "familiar": true,
      "lower": true,
      "middle": "represent",
      "settlers": 1924474102.269784,
      "been": false,
      "upper": -1853053123
    },
    "late": 1986524194,
    "rubbed": true,
    "character": -726901040,
    "deeply": false,
    "anyone": true
  },
  "make": true,
  "package": 720350447,
  "walk": true,
  "physical": 1141390123,
  "easy": "wrapped"
};
const incompatibleSource = {
  "type1": true,
  "type1.type2": true,
  "type1.type2.type3": true,
  "type4": true,
  "type4.type5": true,
  "type4.type5.type6": true,
};

describe('Testing Library', () => {

  // create object for testing
  let objectDotified = {};
  let objectParsed = {};

  describe('Validate functions dotify and parse', () => {
    it('Should return the dotified object', () => {
      objectDotified = dotify(source);
      expect(objectDotified).toBeTruthy();
    });
    it('Should return the parsed object', () => {
      objectParsed = parse(objectDotified);
      expect(objectParsed).toBeTruthy();
    });
    it('The parsed should be equal to the source', () => {
      expect(JSON.stringify(objectParsed)).toBe(JSON.stringify(source));
    });
  });

  describe('Test incompatible sources', () => {
    it('It should skip childs of an incompatible source', () => {
      const obj = parse(incompatibleSource, {
        incompatibleTypeStrategy: 'skip'
      });
      expect(obj).toBeTruthy();
    });
    it('It should override incompatible parent', () => {
      const obj = parse(incompatibleSource, {
        incompatibleTypeStrategy: 'override'
      });
      expect(obj).toBeTruthy();
    });
    it('It should throw an error on incompatible parent', () => {
      try{
        parse(incompatibleSource, {
          incompatibleTypeStrategy: 'throwError'
        });
        expect(false).toBeTruthy();
      }catch{
        expect(true).toBeTruthy();
      }
    });
  });

});