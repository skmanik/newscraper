function renderArticles() {
	// empty page
	renderEmpty();
	// get all articles
	$.getJSON("/api/articles", function(data) {
		// for each one
		for (var i = 0; i < data.length; i++) {
			var title = data[i].title;
			var link = data[i].link;
			var subhead = data[i].subhead;
			var id = data[i]._id;

			// build article widget
			$(".__articles").append(`
				<li class="__article" id=${id}>
					<h2 class="title"><a href=${link}>${title}</a></h2>
					<p class="subtitle">${subhead}</p>
					<div class="__actions">
						<div class="__comment">
							<i class="far fa-comment"></i>
						</div>
					</div>
				</li>
			`);
		}
	});
}

function renderEmpty() {
	$(".__articles").empty();
}

function scrapeArticles() {
	// this function handles the user clicking any "scrape new article" buttons
	$.get("/api/scrape").then(function(data) {
		console.log("Articles scraped! We hope.");
		renderArticles();
	});
}

function clearDB() {
	$.get("/api/clear").then(function(data) {
		console.log("DB is empty! :(");

		// empty page
		renderEmpty();
	});
}

$(document).ready(function() {
	$(document).on("click", "#__add", scrapeArticles);
	$(document).on("click", "#__clear", clearDB);
});
