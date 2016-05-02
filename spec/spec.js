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
      it('should return 2 for temps 11 and above', function() {
        var result = [];
        for(var i = 11; i < 40; i++){
          result.push(i);
        }
        result = result.map(x => tempCode(x));

        expect(result).to.satisfy(
          a => a.every(
            n => n === 2
          )
        );
      });

      it('should return 1 for temps between 1 and 10', function() {
        var result = [];
        for(var i = 1; i <= 10; i++){
          result.push(i);
        }
        result = result.map(x => tempCode(x));

        expect(result).to.satisfy(
          a => a.every(
            n => n === 1
          )
        );
      });

      it('should return 0 for temps between -9C and 0', function() {
        var result = [];
        for(var i = -9; i <= 0; i++){
          result.push(i);
        }
        result = result.map(x => tempCode(x));

        expect(result).to.satisfy(
          a => a.every(
            n => n === 0
          )
        );
      });

      it('should return -1 for temps -10C and less', function() {
        var result = [];
        for(var i = -40; i <= -10; i++){
          result.push(i);
        }
        result = result.map(x => tempCode(x));

        expect(result).to.satisfy(
          a => a.every(
            n => n === -1
          )
        );
      });

    });

    describe('pickWardrobes', function() {
      it('should return correct object for all calls', function() {
        var exhaustiveCalls = [-1, 0, 1, 2, 'sun', 'rain', 'wind'];
        var exhaustiveResults = exhaustiveCalls.map(x => pickWardrobes(x))
        var expectedResults = [
          {accessories:['gloves', 'toe warmers', 'mittens'], head: ['hat', 'beanie'], neck:['scarf', 'neck warmer'], top:['ski coat', 'parka', 'winter jacket'], bottom:['snow pants', 'double sweats', 'woolies'], feet:['boots', 'muckluks', 'bean boots', 'galoshes']},
          {accessories:[], head:['gloves', 'hat', 'beanie', 'ear warmer'], neck:['scarf'], top:['blazer', 'flannel', 'shell', 'light coat', 'pattaguicci'], bottom:['sweats', 'trousers'], feet:['cowboy boots', 'boots', 'sneakers']},
          {accessories:[], head:['head band', 'top hat'], neck:[], top:['flannel', 'sweater', 'hoodie', 'sweatshirt', 'long sleeve T'], bottom:['sweats', 'jeans', 'khakis', 'wind pants'], feet:['sneakers', 'dunks', 'nikes', 'running shoes', 'boat shoes']},
          {accessories:[], head:[], neck:[], top:['lax penny', 'white T', 'cutoff T', 'no shirt?'], bottom:['bathing suite', 'swim trunks', 'chubs', 'shorts', 'sweat shorts'], feet:['sandals', 'tevas', 'chacos', 'rainbows', 'mocasins']},
          {accessories:['sun glasses'], head:['baseball cap'], neck:[], top:[], bottom:[], feet:[]},
          {accessories:['umbrella'], head:[], neck:[], top:['rain coat', 'poncho'], bottom:[], feet:['mud boots', 'rain boots']},
          {accessories:[], head:['spinny hat'], neck:['scarf'], top:['wind breaker'], bottom:['wind pants'], feet:[]}
        ]

        expect(exhaustiveResults).to.eql(expectedResults);
      });

    });

    describe('pickWardrobes', function() {
      it('should return correct object for all calls', function() {

        expect(exhaustiveResults).to.eql(expectedResults);
      });

    });










  });
}());

/*
extendWardrobe
  new object should contain all key value pairs from each input wardrobe
  new object extended by empty wardrobe ({}) results in new wardrobe initial to input wardrobe

fetchWeather
  //test later

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

 */


