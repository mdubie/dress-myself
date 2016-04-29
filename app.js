/**
 * Uses JSON Proxy to fetch cross origin API call from openweather.map
 * @param  {string}   zipcode  user entered string pattern=[0-9]{5}
 * @param  {Function} callback used to capture data returned from JSON call
 */
var fetchWeather = function(zipcode, callback) {
	var APIKEY = '69b4d7933efbceb618ca503d8fa7821e';
	var URL = "http%3A%2F%2Fapi.openweathermap.org%2Fdata%2F2.5%2Fweather%3Fzip%3D" + zipcode + "%2Cus%26APPID%3D" + APIKEY;
	$.getJSON('https://jsonp.afeld.me/?callback=?&url=' + URL, callback);
};

/**
 * Takes in raw data object from API call, captures only data of interest and store in wx object
 * @param  {object} data return from API call
 * @return {object}      selected and processed data from API call
 */
var translateWx = function(data) {
	var wx = {};
	wx.loc = data.name;
	wx.temp = Math.round(data.main.temp - 273);
	wx.info = wxCodes[data.weather[0].id];
	wx.rainy = wx.info.id === 'rain';
	wx.sunny = wx.info.id === 'sun';
	wx.windy = wx.info.id === 'wind' || data.wind.speed > 8;
	wx.snowy = wx.info.id === 'snow';
	wx.tempShift = wx.rainy ? -5 : 0;
	wx.tempShift += wx.sunny ? +5 : 0;
	wx.tempShift += wx.windy ? -5 : 0;
	wx.tempShift += wx.snowy ? -5 : 0;
	wx.tempFeel = wx.temp + wx.tempShift;
	return wx;
};

/**
 * createWardrobes contains nested constructor and data neccessary to build wardrobes
 * @return {object} contains all temperature and conditions wardrobes
 */
var createWardrobes = function() {
	var Wardrobe = function(accessories, head, neck, top, bottom, feet) {
		return {
			accessories: accessories || [],
			head: head || [],
			neck: neck || [],
			top: top || [],
			bottom: bottom || [],
			feet: feet || []
		};
	};

	var wardrobes = {};
	wardrobes.freezeing = Wardrobe(['gloves', 'toe warmers', 'mittens'], ['hat', 'beanie'], ['scarf', 'neck warmer'], ['ski coat', 'parka', 'winter jacket'], ['snow pants', 'double sweats', 'woolies'], ['boots', 'muckluks', 'bean boots', 'galoshes']);
	wardrobes.cold = Wardrobe([], ['gloves', 'hat', 'beanie', 'ear warmer'], ['scarf'], ['blazer', 'flannel', 'shell', 'light coat', 'pattaguicci'], ['sweats', 'trousers'], ['cowboy boots', 'boots', 'sneakers']);
	wardrobes.warm = Wardrobe([], ['head band', 'top hat'], [], ['flannel', 'sweater', 'hoodie', 'sweatshirt', 'long sleeve T'], ['sweats', 'jeans', 'khakis', 'wind pants'], ['sneakers', 'dunks', 'nikes', 'running shoes', 'boat shoes']);
	wardrobes.hot = Wardrobe([], [], [], ['lax penny', 'white T', 'cutoff T', 'no shirt?'], ['bathing suite', 'swim trunks', 'chubs', 'shorts', 'sweat shorts'], ['sandals', 'tevas', 'chacos', 'rainbows', 'mocasins']);
	wardrobes.sun = Wardrobe(['sun glasses'], ['baseball cap'], [], [], [], []);
	wardrobes.rain = Wardrobe(['umbrella'], [], [], ['rain coat', 'poncho'], [], ['mud boots', 'rain boots']);
	wardrobes.wind = Wardrobe([], ['spinny hat'], ['scarf'], ['wind breaker'], ['wind pants'], []);

	return wardrobes;
};

/**
 * Takes base wardrobe and extends articles array of conditional wardrobe
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
 * Returns a wardrobe for this wx condition
 * @param  {object} wx        wx condition object
 * @param  {object} wardrobes all potential wardrobes object
 * @return {object}           wardrobe for this wx condition
 */
var pickWardrobe = function(wx, wardrobes) {
	var wardrobe = {};
	if (wx.tempFeel < -10) {
		wardrobe = wardrobes.freezeing;
	} if (-10 <= wx.tempFeel && wx.tempFeel < 5) {
		wardrobe = wardrobes.cold;
	} if (5 <= wx.tempFeel && wx.tempFeel < 20) {
		wardrobe = wardrobes.warm;
	} if (20 <= wx.tempFeel) {
		wardrobe = wardrobes.hot;
	} if (wx.rainy) {
		wardrobe = extendWardrobe(wardrobe, wardrobes.rain);
	} if (wx.sunny) {
		wardrobe = extendWardrobe(wardrobe, wardrobes.sun);
	} if (wx.windy) {
		wardrobe = extendWardrobe(wardrobe, wardrobes.wind);
	}
	return wardrobe;
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
var wardrobeSelect = function(wardrobe) {
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
	var wardrobes = createWardrobes();
	var wardrobe = pickWardrobe(wx, wardrobes);
	var outfit = wardrobeSelect(wardrobe);
	return outfit;
};

/**
 * Makes required DOM changes to display wx information for given zipcode
 * @param  {object} wx all relevant wx information
 */
var displayWx = function(wx) {
  var $report = $('<p id=report></p>');
  $report.text(wx.info.description + ' and ' + wx.temp + ' degrees C outside today for ' + wx.loc + '!');
  $('#wxreport').append($report);
  $('#rec').removeClass('inactive');
  $('#wxreport').removeClass('inactive');
  if (wx.rainy) {
    $('html').addClass('rain');
	} if (wx.sunny) {
		$('html').addClass('sun');
	} if (wx.windy) {
		$('html').addClass('wind');
	} if (wx.snow) {
		$('html').addClass('snow');
	}
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
 * Main function for website. listen for button clicks, captures zipcode, and executes processing and display
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