var app = function () {
	var apiBaseUrl = 'https://script.google.com/macros/s/AKfycbyP5Rifn7Q05Qcd7CTfm-AOouFHHvUAvCVVuKSfQu-LCqJocP8/exec';
	var apiKey = 'abcdef';
	var categories = ['general', 'financial', 'technology', 'marketing'];

	var state = {
		activePage: 1,
		activeCategory: null,
	};

	function init () {
		_setNotice('Loading posts');

		var filter = document.getElementById('filter');
		_buildFilter(filter);

		_getPosts();
	}

	function _getPosts() {
		_setNotice('Loading posts');
		
		var container = document.getElementById('container');
		container.innerHTML = '';

		var requestUrl = _buildApiUrl(state.activePage, state.activeCategory);
		fetch(requestUrl)
			.then((response) => response.json())
			.then((json) => {
				if (json.status !== 'success') {
					_setNotice(json.message);
				}

				_renderPosts(json.data);
				_setNotice('No more posts to display');
			})
			.catch((error) => {
				_setNotice('Unexpected error loading posts');
			})
	}

	function _buildFilter (filter) {
	    filter.appendChild(_buildFilterLink('no filter', true));

	    categories.forEach(function (category) {
	    	filter.appendChild(_buildFilterLink(category));
	    });
	}

	function _buildFilterLink (label, isSelected) {
		var link = document.createElement('button');
	  	link.className = isSelected ? 'button selected' : 'button';
	  	link.innerHTML = _capitalize(label);
	  	link.onclick = function (event) {
	  		_resetActivePage();
	  		_setActiveCategory(label);
	  		_getPosts();
	  	};

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

	function _renderPosts (posts) {
		var container = document.getElementById('container');

		posts.forEach(function (post) {
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

	function _capitalize (label) {
		return label.slice(0, 1).toUpperCase() + label.slice(1).toLowerCase();
	}

	function _setActiveCategory (category) {
		if (categories.indexOf(category.toLowerCase()) === -1) {
			return false;
		}

		state.activeCategory = category;
		return true;
	}

	function _resetActivePage () {
		state.activePage = 1;
		return true;
	}

	return {
		init: init
 	};
}();
