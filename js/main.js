var app = function () {
	var apiBaseUrl = 'https://script.google.com/macros/s/AKfycbyP5Rifn7Q05Qcd7CTfm-AOouFHHvUAvCVVuKSfQu-LCqJocP8/exec';
	var apiKey = 'abcdef';
	var categories = ['general', 'financial', 'technology', 'marketing'];

	var state = {
		activeCategory: null,
		posts: []
	};

	function init () {
		_setNotice('Loading posts');

		var requestUrl = _buildApiUrl(1, null);
		_getRequest(requestUrl, function (error, data) {
			if (error) {
				_setNotice('Unexpected error loading posts');
			}

			response = JSON.parse(data);

			if (response.status !== 'success') {
				_setNotice(response.message);
			}

			state.posts = response.data
			
		})

		var filter = document.getElementById('filter');
		_buildFilter(filter);
	}

	function _getRequest(url, callback) {
		var request = new XMLHttpRequest();
		request.open('get', url);
		request.onload = function () {
			callback(null, request.response);
		};
		request.onerror = function () {
			callback(request.response);
		};
		request.send();
	}

	function _buildFilter (filter) {
		var title = document.createElement('span');
	    title.innerHTML = 'Filter posts by category';
	    filter.appendChild(title);

	    filter.appendChild(_buildFilterLink('no filter', true));

	    categories.forEach(function (category) {
	    	filter.appendChild(_buildFilterLink(category));
	    });
	}

	function _buildFilterLink (label, isSelected) {
		var link = document.createElement('a');
    	link.setAttribute('href', '#');
	  	link.className = isSelected ? 'button selected' : 'button';
	  	link.innerHTML = _capitalize(label);

	  	return link;
	}

	function _buildApiUrl (page, category) {
		var url = apiBaseUrl;
		url += '?key=' + apiKey;
		url += '&page=' + page;
		url += category !== null ? '&category=' + category : '';

		return url;
	}

	function _setNotice (label) {
		var notice = document.getElementById('notice');
		notice.innerHTML = label;
	}

	function _getActiveCategory () {
		return state.category;
	}

	function _setActiveCategory (category) {
		if (categories.indexOf(category.toLowerCase()) === -1) {
			return false;
		}

		return state.activeCategory = category;
	}

	function _capitalize (label) {
		return label.slice(0, 1).toUpperCase() + label.slice(1).toLowerCase();
	}

	return {
		init: init
 	};
}();
