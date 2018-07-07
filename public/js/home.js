// get all articles
$.getJSON("/api/articles", function(data) {
	// For each one
	for (var i = 0; i < data.length; i++) {
		var title = data[i].title;
		var link = data[i].link;
		var subhead = data[i].subhead;

		// Display the apropos information on the page
		$(".__articles").append(`
			<li class="__article">
				<h2 class="title"><a href=${link}>${title}</a></h2>
				<p class="subtitle">${subhead}</p>
				<div class="__actions">
					<div class="__save">
						<i class="far fa-heart"></i>
					</div>
				</div>
			</li>
		`);
	}
});

$(document).ready(function() {
	// element that all the articles will append to
	var articlesBody = $(".__articles");
	$(document).on("click", "#__add", scrapeArticles);

	function scrapeArticles() {
		// This function handles the user clicking any "scrape new article" buttons
		// $.get("/api/scrape").then(function(data) {
		// If we are able to successfully scrape the NYTIMES and compare the articles to those
		// already in our collection, re render the articles on the page
		// and let the user know how many unique articles we were able to save
		// });
	}
});
