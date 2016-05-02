(function() {
  'use strict';

  describe('dress-myself', function() {
    describe('randomElement', function() {
      it('should return an element of an array', function() {
        var inputArray = ['a', 'b', 'c', 'd'];
        var el = randomElement(inputArray);

        expect(inputArray).to.contain(el);
      });

      it('empty array should return undefined', function() {
        var inputArray = [];
        var el = randomElement(inputArray);

        expect(el).to.not.exist;
      });

      it('should be a string (for input arrays of only strings)', function() {
        var inputArray = ['a', 'b', 'c', 'd'];
        var el = randomElement(inputArray);

        expect(el).to.be.a('string');
      });
    });

    describe('tempCode', function() {
      var buildInputRange = function(s,f){
        var result = [];
        for(var i = s; i <= f; i++){
          result.push(i);
        }
        return result;
      }

      var allArrValEqual = function(array, val){
        return array => array.every(
          num => num === val
        );
      };

      it('should return 2 for temps 11 and above', function() {
        var result = buildInputRange(11, 40);
        result = result.map(x => tempCode(x));

        expect(result).to.satisfy(function(array){
          return allArrValEqual(array, 2);
        });
      });

      it('should return 1 for temps between 1 and 10', function() {
        var result = buildInputRange(1, 10);
        result = result.map(x => tempCode(x));

        expect(result).to.satisfy(function(array){
          return allArrValEqual(array, 1);
        });
      });

      it('should return 0 for temps between -9C and 0', function() {
        var result = buildInputRange(-9, 0);
        result = result.map(x => tempCode(x));

        expect(result).to.satisfy(function(array){
          return allArrValEqual(array, 0);
        });
      });

      it('should return -1 for temps -10C and less', function() {
        var result = buildInputRange(-40, -10);
        result = result.map(x => tempCode(x));

        expect(result).to.satisfy(function(array){
          return allArrValEqual(array, -1);
        });
      });

    });

    describe('pickWardrobes', function() {
      it('should return correct object for all calls', function() {
        var exhaustiveArguments = [-1, 0, 1, 2, 'sun', 'rain', 'wind'];
        var exhaustiveReturns = exhaustiveArguments.map(x => pickWardrobes(x));
        var expectedReturns = [
          {accessories:['gloves', 'toe warmers', 'mittens'], head: ['hat', 'beanie'], neck:['scarf', 'neck warmer'], top:['ski coat', 'parka', 'winter jacket'], bottom:['snow pants', 'double sweats', 'woolies'], feet:['boots', 'muckluks', 'bean boots', 'galoshes']},
          {accessories:[], head:['gloves', 'hat', 'beanie', 'ear warmer'], neck:['scarf'], top:['blazer', 'flannel', 'shell', 'light coat', 'pattaguicci'], bottom:['sweats', 'trousers'], feet:['cowboy boots', 'boots', 'sneakers']},
          {accessories:[], head:['head band', 'top hat'], neck:[], top:['flannel', 'sweater', 'hoodie', 'sweatshirt', 'long sleeve T'], bottom:['sweats', 'jeans', 'khakis', 'wind pants'], feet:['sneakers', 'dunks', 'nikes', 'running shoes', 'boat shoes']},
          {accessories:[], head:[], neck:[], top:['lax penny', 'white T', 'cutoff T', 'no shirt?'], bottom:['bathing suite', 'swim trunks', 'chubs', 'shorts', 'sweat shorts'], feet:['sandals', 'tevas', 'chacos', 'rainbows', 'mocasins']},
          {accessories:['sun glasses'], head:['baseball cap'], neck:[], top:[], bottom:[], feet:[]},
          {accessories:['umbrella'], head:[], neck:[], top:['rain coat', 'poncho'], bottom:[], feet:['mud boots', 'rain boots']},
          {accessories:[], head:['spinny hat'], neck:['scarf'], top:['wind breaker'], bottom:['wind pants'], feet:[]}
        ];

        expect(exhaustiveReturns).to.eql(expectedReturns);
      });

    });

    describe('outfitSelect', function() {
      it('all values should be strings (not arrays or undefined)', function() {
        var input = {accessories:['umbrella'], head:[], neck:[], top:['rain coat', 'poncho'], bottom:[], feet:['mud boots', 'rain boots']};
        var output = outfitSelect(input);

        expect(output).to.satisfy(function(outfitObj){
          for(var key in outfitObj){
            if (typeof outfitObj[key] !== 'string') {
              return false;
            }
          }
          return true;
        });
      });

      it('keys with empty arrays should be removed', function(){
        var input = {a: ['x', 'y', 'z'], b:[]};

        expect(outfitSelect(input)).to.not.have.keys('b');
      })

      it('keys with arrays should have a random element picked', function(){
        var input = {a: ['x', 'y', 'z'], b:[]};

        expect(input.a).to.include(outfitSelect(input).a);
      })
    });

    describe('extendWardrobe', function() {
      it('should concatenate arrays of a given key', function() {
        var objectA = {a: [1,2,3]};
        var objectB = {a: ['a', 'b', 'c']};

        expect(extendWardrobe(objectA, objectB).a).to.eql([1,2,3,'a','b','c']);
      });

      it('extending {} should result in original object', function() {
        var objectA = {a: [1,2,3], b: ['a', 'b', 'c']};
        var objectB = {};

        expect(extendWardrobe(objectA, objectB)).to.deep.equal({a: [1,2,3], b: ['a', 'b', 'c']});
      });

    });

  });
}());

/*
extendWardrobe
  new object should contain all key value pairs from each input wardrobe
  new object extended by empty wardrobe ({}) results in new wardrobe initial to input wardrobe


xoutfitSelect
  should be no empty arrays in wardrobe
  each value of output object should be indexOf the input value array

xpickWardrobes
  should return specified object
  //if no object is return should throw error

xrandomElement
  should return an element of an array
  empty array should return undefined

recommendation


xtempCode
  should return -1 for temps -10C and less
  should return 0 for temps between -9C and 0
  should return 1 for temps between 1 and 10
  should return 2 for temps 11 and above

translateWx
  sample object in and out

fetchWeather
  //test later
  //cross origin call?
  //data in a cb fn?  

 */


