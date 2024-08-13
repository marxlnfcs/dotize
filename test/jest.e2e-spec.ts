

// define sources
import { dotizeDotify, dotizeParse } from '../src';

const source = {
  "date": new Date(),
  "function": () => null,
  "emptyArray": [],
  "emptyObject": {},
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

const sourceWithDots = {
  "foo.bar.date": new Date(),
  "foo.bar.function": () => null,
  "foo.bar.emptyArray": [],
  "foo.bar.emptyObject": {},
  "foo.bar.government": {
    "foo.bar.flight": {
      "foo.bar.familiar": true,
      "foo.bar.lower": true,
      "foo.bar.middle": "represent",
      "foo.bar.settlers": 1924474102.269784,
      "foo.bar.been": false,
      "foo.bar.upper": -1853053123
    },
    "foo.bar.late": 1986524194,
    "foo.bar.rubbed": true,
    "foo.bar.character": -726901040,
    "foo.bar.deeply": false,
    "foo.bar.anyone": true
  },
  "foo.bar.make": true,
  "foo.bar.package": 720350447,
  "foo.bar.walk": true,
  "foo.bar.physical": 1141390123,
  "foo.bar.easy": "wrapped"
};

const sourceWithAllEmptyObject = {
  "foo": {
    "bar": {}
  }
};

const sourceWithAllEmptyArray = [
  []
];

const sourceWithNonEmptyItems = {
  "date": new Date(),
  "function": () => null,
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

  describe('Validate functions dotify and parse', () => {
    it('The parsed should be equal to the source', () => {
      expect(JSON.stringify(dotizeParse(dotizeDotify(source)))).toBe(JSON.stringify(source));
    });
    it('The parsed should be equal to the source', () => {
      expect(JSON.stringify(dotizeParse(dotizeDotify(sourceWithDots)))).toBe(JSON.stringify(sourceWithDots));
    });
    it('The parsed should be equal to the source', () => {
      expect(JSON.stringify(dotizeParse(dotizeDotify(source, {
        emptyObjectStrategy: 'remove',
        emptyArrayStrategy: 'remove',
      })))).toBe(JSON.stringify(sourceWithNonEmptyItems));
    });
    it('The parsed should be equal to the source', () => {
      expect(JSON.stringify(dotizeParse(dotizeDotify(sourceWithAllEmptyObject, {
        emptyArrayStrategy: 'remove',
        emptyObjectStrategy: 'remove'
      })))).toBe('{}');
    });
    it('The parsed should be equal to the source', () => {
      expect(JSON.stringify(dotizeParse(dotizeDotify(sourceWithAllEmptyArray, {
        emptyArrayStrategy: 'remove',
        emptyObjectStrategy: 'remove'
      })))).toBe('[]');
    });
  });

  describe('Test incompatible sources', () => {
    it('It should skip childs of an incompatible source', () => {
      const obj = dotizeParse(incompatibleSource, {
        incompatibleTypeStrategy: 'skip'
      });
      expect(obj).toBeTruthy();
    });
    it('It should override incompatible parent', () => {
      const obj = dotizeParse(incompatibleSource, {
        incompatibleTypeStrategy: 'override'
      });
      expect(obj).toBeTruthy();
    });
    it('It should throw an error on incompatible parent', () => {
      try{
        dotizeParse(incompatibleSource, {
          incompatibleTypeStrategy: 'throwError'
        });
        expect(false).toBeTruthy();
      }catch{
        expect(true).toBeTruthy();
      }
    });
  });

});