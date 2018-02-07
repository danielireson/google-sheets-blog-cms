var app = function () {
	var apiBaseUrl = 'https://script.google.com/macros/s/AKfycbyP5Rifn7Q05Qcd7CTfm-AOouFHHvUAvCVVuKSfQu-LCqJocP8/exec';
	var apiKey = 'abcdef';
	var categories = ['general', 'financial', 'technology', 'marketing'];

	var state = {
		activePage: 1,
		activeCategory: null,
		posts: []
	};

	function init () {
		_setNotice('Loading posts');

		var filter = document.getElementById('filter');
		_buildFilter(filter);

		_getPosts(state.activePage, state.activeCategory);
	}

	function _getPosts(page, category) {
		var requestUrl = _buildApiUrl(page, category);
		_getRequest(requestUrl, function (error, data) {
			if (error) {
				_setNotice('Unexpected error loading posts');
			}

			response = JSON.parse(data);

			if (response.status !== 'success') {
				_setNotice(response.message);
			}

			state.posts = response.data;

			var container = document.getElementById('container');
			_renderPosts(container);

			_setNotice('No more posts to display');
		})
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

	function _renderPosts (container) {
		state.posts.forEach(function (post) {
			var template = document.getElementById('article-template').innerHTML;

			template = template.replace('{{ title }}', post.title);
			template = template.replace('{{ author }}', post.author);
			template = template.replace('{{ date }}', _formatDate(post.timestamp));
			template = template.replace('{{ category }}', post.category);
			template = template.replace('{{ content }}', _formatContent(post.content));

			var article = document.createElement('article');
			article.innerHTML = template;
			container.appendChild(article);
		});
	}

	function _formatDate (string) {
		return new Date(string).toLocaleDateString('en-GB');
	}

	function _formatContent (string) {
		return string.split('\n')
			.filter(_hasContent)
			.map(_wrapParagraphTags)
			.join('');
	}

	function _hasContent (string) {
		return string !== '';
	}

	function _wrapParagraphTags (string) {
		return '<p>' + string + '</p>';
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
