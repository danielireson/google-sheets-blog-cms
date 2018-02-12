const app = function () {
	const API_BASE = 'https://script.google.com/macros/s/AKfycbyP5Rifn7Q05Qcd7CTfm-AOouFHHvUAvCVVuKSfQu-LCqJocP8/exec';
	const API_KEY = 'abcdef';
	const CATEGORIES = ['general', 'financial', 'technology', 'marketing'];

	const state = {activePage: 1};
	const page = {};

	function init () {
		page.notice = document.getElementById('notice');
		page.filter = document.getElementById('filter');
		page.container = document.getElementById('container');

		_buildFilter();
		_getPosts(null);
	}

	function _getPosts(category) {
		_setNotice('Loading posts');
		page.container.innerHTML = '';

		fetch(_buildApiUrl(state.activePage, category))
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

	function _buildFilter () {
	    page.filter.appendChild(_buildFilterLink('no filter', true));

	    CATEGORIES.forEach(function (category) {
	    	page.filter.appendChild(_buildFilterLink(category, false));
	    });
	}

	function _buildFilterLink (label, isSelected) {
		const link = document.createElement('button');
	  	link.innerHTML = _capitalize(label);
	  	link.classList = isSelected ? 'selected' : '';
	  	link.onclick = function (event) {
	  		_resetActivePage();

	  		Array.from(page.filter.children).forEach(function (element) {
	  			element.classList = label === element.innerHTML.toLowerCase() ? 'selected' : '';
	  		});

	  		let category = label === 'no filter' ? null : label.toLowerCase();
	  		_getPosts(category);
	  	};

	  	return link;
	}

	function _buildApiUrl (page, category) {
		let url = API_BASE;
		url += '?key=' + API_KEY;
		url += '&page=' + page;
		url += category !== null ? '&category=' + category : '';

		return url;
	}

	function _setNotice (label) {
		page.notice.innerHTML = label;
	}

	function _renderPosts (posts) {
		posts.forEach(function (post) {
			const article = document.createElement('article');
			article.innerHTML = `
				<h2>${post.title}</h2>
				<div class="article-details">
					<div>By ${post.author} on ${_formatDate(post.timestamp)}</div>
					<div>Posted in <em>${post.category}</em></div>
				</div>
				${_formatContent(post.content)}
			`;
			page.container.appendChild(article);
		});
	}

	function _formatDate (string) {
		return new Date(string).toLocaleDateString('en-GB');
	}

	function _formatContent (string) {
		return string.split('\n')
			.filter((str) => str !== '')
			.map((str) => `<p>${str}</p>`)
			.join('');
	}

	function _capitalize (label) {
		return label.slice(0, 1).toUpperCase() + label.slice(1).toLowerCase();
	}

	function _resetActivePage () {
		state.activePage = 1;
		return true;
	}

	return {
		init: init
 	};
}();
