const app = function () {
	const API_BASE = 'https://script.google.com/macros/s/AKfycbyP5Rifn7Q05Qcd7CTfm-AOouFHHvUAvCVVuKSfQu-LCqJocP8/exec';
	const API_KEY = 'abcdef';
	const CATEGORIES = ['general', 'financial', 'technology', 'marketing'];

	const state = {
		activePage: 1
	};

	function init () {
		_buildFilter();
		_getPosts(null);
	}

	function _getPosts(category) {
		_setNotice('Loading posts');

		const container = document.getElementById('container');
		container.innerHTML = '';

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
		const filter = document.getElementById('filter');
	    filter.appendChild(_buildFilterLink('no filter', true));

	    CATEGORIES.forEach(function (category) {
	    	filter.appendChild(_buildFilterLink(category));
	    });
	}

	function _buildFilterLink (label, isSelected) {
		const link = document.createElement('button');
	  	link.className = isSelected ? 'button selected' : 'button';
	  	link.innerHTML = _capitalize(label);
	  	link.onclick = function (event) {
	  		_resetActivePage();

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
		const notice = document.getElementById('notice');
		notice.innerHTML = label;
	}

	function _renderPosts (posts) {
		const container = document.getElementById('container');

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
			container.appendChild(article);
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
