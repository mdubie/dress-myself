
/**
 * Uses JSON Proxy to fetch cross origin API call from openweather.map
 * @param  {string}   zipcode  user entered string pattern=[0-9]{5}
 * @param  {Function} callback used to capture data returned from JSON call
 */
var fetchWeather = function(zipcode, callback) {
  var APIKEY = '69b4d7933efbceb618ca503d8fa7821e';
  var baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipcode + ',us&appid=' + APIKEY;
  var URL = encodeURIComponent(baseURL);
  $.getJSON('https://jsonp.afeld.me/?callback=?&url=' + URL, callback);
};

/**
 * tranlates a raw temp range into a tempCode that is used as a key on the wardrobes object
 * @param  {number} temp temperature returned from API call Celsisu ~[-40, 40]
 * @return {number}      [-1, 0, 1, 2] to express temp range
 */
var tempCode = function(temp){
  var code = Math.min(Math.max(Math.ceil(temp/10), -1), 2);
  return code === -0 ? 0 : code;
};

/**
 * Takes in data object from API call, captures only data of interest and store in wx object
 * @param  {object} data return from API call
 * @return {object}      selected and processed data from API call
 */
var translateWx = function(data) {
	var temp = Math.round(data.main.temp - 273);
	var base = wxCodes[data.weather[0].id];
  return {
    loc : data.name,
    temp : temp,
    info : base.id,
    description : base.description,
    tempCode: tempCode(temp)
  };
};

/**
 * returns requested wardrobe as specified by key
 * @param  {string} key will be called with key for tempCode [-1, 0 , 1, 2] or info [sun, rain, wind]
 * @return {object} will return object as requested from the key
 */
var pickWardrobes = function(key){
  return {
    '-1': {accessories:['gloves', 'toe warmers', 'mittens'], head: ['hat', 'beanie'], neck:['scarf', 'neck warmer'], top:['ski coat', 'parka', 'winter jacket'], bottom:['snow pants', 'double sweats', 'woolies'], feet:['boots', 'muckluks', 'bean boots', 'galoshes']},
    '0': {accessories:[], head:['gloves', 'hat', 'beanie', 'ear warmer'], neck:['scarf'], top:['blazer', 'flannel', 'shell', 'light coat', 'pattaguicci'], bottom:['sweats', 'trousers'], feet:['cowboy boots', 'boots', 'sneakers']},
    '1': {accessories:[], head:['head band', 'top hat'], neck:[], top:['flannel', 'sweater', 'hoodie', 'sweatshirt', 'long sleeve T'], bottom:['sweats', 'jeans', 'khakis', 'wind pants'], feet:['sneakers', 'dunks', 'nikes', 'running shoes', 'boat shoes']},
    '2': {accessories:[], head:[], neck:[], top:['lax penny', 'white T', 'cutoff T', 'no shirt?'], bottom:['bathing suite', 'swim trunks', 'chubs', 'shorts', 'sweat shorts'], feet:['sandals', 'tevas', 'chacos', 'rainbows', 'mocasins']},
    sun: {accessories:['sun glasses'], head:['baseball cap'], neck:[], top:[], bottom:[], feet:[]},
	  rain: {accessories:['umbrella'], head:[], neck:[], top:['rain coat', 'poncho'], bottom:[], feet:['mud boots', 'rain boots']},
	  wind: {accessories:[], head:['spinny hat'], neck:['scarf'], top:['wind breaker'], bottom:['wind pants'], feet:[]}
  }[key]
};

/**
 * Takes base wardrobe and extends articles array of modifier wardrobe
 * @param  {object} wardrobe1 wardrobe specific to a given temperature condition
 * @param  {object} wardrobe2 wardrobe specific to a give weather condidtion
 * @return {object}           merged wardobe
 */
var extendWardrobe = function(wardrobe1, wardrobe2) {
  for (var key in wardrobe1) {
    wardrobe1[key] = wardrobe1[key].concat(wardrobe2[key]);
  }
  return wardrobe1;
};

/**
 * Function that takes in an array and returns a random elemement internally
 * @param  {array} items array of clothing articles
 * @return {string} one random clothing article of given array
 */
var randomElement = function(items) {
  return items[Math.floor(Math.random() * items.length)];
};

/**
 * Selects one article of clothing or removes grouping of articles if empty
 * @param  {object} wardrobe wardrobe object
 * @return {object}          trimmed wardrobe object
 */
var outfitSelect = function(wardrobe) {
  for (var key in wardrobe) {
    var item = randomElement(wardrobe[key]);
    wardrobe[key] = item;
    item === undefined && delete wardrobe[key];
  }
  return wardrobe;
};

/**
 * Calls required functions for generating recommendation based on wx
 * @param  {object} wx 
 * @return {object}    object containing only and all articles to be recommended for wear
 */
var recommendataion = function(wx) {
  var baseWardrobe = pickWardrobes(wx.tempCode) || {};
  var modifierWardrobe = pickWardrobes(wx.info) || {};
  var wardrobe = extendWardrobe(baseWardrobe, modifierWardrobe);
  var outfit = outfitSelect(wardrobe);
  return outfit;
};

/**
 * makes required DOM changes to remove display of previously displayed WX and outfit 
 */
var displayReset = function(){
  $('#rec').children().remove();
  $('#rec').addClass('inactive');
  $('#wxreport').children().remove();
  $('#wxreport').addClass('inactive');
  $('html').removeClass();
  $('#zip').val('');
};

/**
 * Makes required DOM changes to display wx information for given zipcode
 * @param  {object} wx all relevant wx information
 */
var displayWx = function(wx) {
  var $report = $('<p id=report></p>')
    .text(wx.description+ ' and ' + wx.temp + ' degrees C outside today for ' + wx.loc + '!');
  $('#wxreport').append($report);
  $('#rec').removeClass('inactive');
  $('#wxreport').removeClass('inactive');
  $('html').addClass(wx.info);
};

/**
 * makes required DOM changes to display outfit information for given wx condition
 * @param  {object} outfit object containing only and all articles to be recommended for wear
 */
var displayOutfit = function(outfit) {
  var $recHeader = $('<h3></h3>');
  $recHeader.text('You should wear: ');
  $('#rec').append($recHeader);
  for (var key in outfit) {
    var $p = $('<p class=item></p>');
    $p.text(outfit[key]);
    $('#rec').append($p);
  }
};

/**
 * Main function for website. listent for button clicks, captures zipcode, and executes processing and display
 */
$(document).ready(function() {
  $('#btn').on('click', function() {
    var zipcode = $('#zip').val();
    displayReset();
    fetchWeather(zipcode, function(data) {
      var wx = translateWx(data);
      displayWx(wx);
      displayOutfit(recommendataion(wx));
    });
  });
});