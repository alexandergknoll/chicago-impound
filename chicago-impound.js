var doc, newCell, searchResults, resultDetail, plateSearchForm, notFound, chicagoImpoundApiURL;

chicagoImpoundApiURL = "https://data.cityofchicago.org/resource/ygr5-vcbg.json";

$(function(){
	plateSearchForm = $('.searchform');
	doc = $(document);

	newCell = $('<td>');
	recents = $('.recent');
	searchResults = $('.searchresults');
	resultDetail = $('.resultdetail');
	notFound = $('.notfound');

	requestRecents();

	plateSearchForm.on('submit', carRequest);
	doc.on('click','.resultlink', showInventory);
});

function requestRecents() {
	var recentsURL = chicagoImpoundApiURL + "?$order=tow_date%20DESC&$limit=3";
	$.getJSON(recentsURL).done(recentsResults);
}

function recentsResults(r) {
	console.log(r);
	r.forEach(appendRecent);
}

function appendRecent(r) {
	var recentResult = r.plate + " " + r.state + " "
	recents.append(recentResult);
}

function carRequest(e) {
	e.preventDefault();

	var formData = $(this).serialize();
 	$.getJSON(chicagoImpoundApiURL, formData).done(carResponse);
}

function showInventory(e) {
	e.preventDefault();

	var inventoryNumber = $(this).attr("inventory_number");
	var towedToAddress = $(this).attr("towed_to_address");
	var towFacilityPhone = $(this).attr("tow_facility_phone");

	resultDetail.text("");
	appendResultDetail(inventoryNumber, towedToAddress, towFacilityPhone);
	resultDetail.show();
}

function carResponse(r) {
	clearSearchResults();
	recents.hide();
	searchResults.hide();
	notFound.hide();
	resultDetail.hide();
	if (r.length > 0) {
		r.forEach(appendCarResult);
		searchResults.show();
	} else {
		notFound.show();
	}
}

function clearSearchResults() {
	searchResults.find('.result').remove();
}

function appendCarResult(r) {
	htmlCarResult(r).appendTo(searchResults);
}

function appendResultDetail(inventoryNumber, towedToAddress, towFacilityPhone) {
	mapsURL = "http://maps.googleapis.com/maps/api/staticmap?center=" 
						+ encodeURI(towedToAddress) 
					  + ",%20Chicago,%20IL&zoom=12&size=420x420&maptype=roadmap&markers=color:red%7C" 
					  + encodeURI(towedToAddress)
					  + ",%20Chicago,%20IL&sensor=false"

	resultDetail
		.append($('<h3>')
			.text("Found it!"))
		.append($('<p>')
			.text("Inventory Number: " + inventoryNumber))
		.append($('<p>')
			.text(towedToAddress))
		.append($('<p>')
			.text(towFacilityPhone))
		.append($('<img>')
			.attr({
				src: mapsURL
			})
		);
}

function htmlCarResult(r) {
	var $result = $('<tr class="result">');

	$result
			.append($('<td>').text(r.tow_date.substring(5,10)))
			.append($('<td>').text(r.plate))
			.append($('<td>').text(r.state))
			.append($('<td>').text(r.make))
			.append($('<td>').text(r.color))
			.append($('<td>').text(r.style))
			.append($('<td>')
				.append($('<a>')
					.text("Hey That's My Car!")
					.attr({
						class: "resultlink",
						href: "#",
						inventory_number: r.inventory_number,
						towed_to_address: r.towed_to_address,
						tow_facility_phone: r.tow_facility_phone
					})
				)
			);

	return $result;
}