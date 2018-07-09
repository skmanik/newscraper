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

function showModal() {
	var articleId = $(this)
		.parent()
		.parent()
		.attr("id");
	$(".modal").addClass("is-active");
	$(".modal").attr("id", articleId);

	refreshModal();
}

function hideModal() {
	$(".modal").removeClass("is-active");
}

function refreshModal() {
	// empty notes before re display
	$(".__notes ul").empty();

	var articleId = $(".modal").attr("id");

	$.getJSON("/api/articles/" + articleId, function(data) {
		// for this particular article
		for (var i = 0; i < data.note.length; i++) {
			var body = data.note[i].body;
			var id = data.note[i]._id;

			// build note widget
			$(".__notes ul").append(`
				<li class="__note" id=${id}>
					${body}
					<span class="__delete"><i class="fas fa-trash-alt"></i></span>
				</li>
			`);
		}
	});
}

function addNote(event) {
	event.preventDefault();

	var note = $("#__addnote").val();
	var articleId = $(".modal").attr("id");

	$.ajax({
		method: "POST",
		url: "/api/articles/" + articleId,
		data: {
			body: note
		}
	})
		.then(function(data) {
			console.log("Added note", data);
			$("#__addnote").val("");

			// refresh modal
			refreshModal();
		});
}

function deleteNote() {
	var noteId = $(this).parent().attr("id");

	$.ajax({
		method: "DELETE",
		url: "/api/notes/" + noteId
	})
		.then(function(data) {
			console.log("Deleted note");

			// refresh modal
			refreshModal();
		});
}

$(document).ready(function() {
	// render whatever we have in the DB
	renderArticles();

	$(document).on("click", "#__add", scrapeArticles);
	$(document).on("click", "#__clear", clearDB);
	$(document).on("click", ".__comment", showModal);
	$(document).on("click", ".modal-close", hideModal);
	$(document).on("click", ".modal-background", hideModal);
	$(document).on("click", "#__submit", addNote);
	$(document).on("click", ".__delete", deleteNote);
});
