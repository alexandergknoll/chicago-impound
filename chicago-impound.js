var chicagoImpoundApiURL = "https://data.cityofchicago.org/resource/ygr5-vcbg.json";

$(function(){
	var doc, newCell, searchResults, resultDetail, plateSearchForm, notFound;

	doc = $(document);
	newCell = $('<td>');
	searchResults = $('.searchresults');
	resultDetail = $('.resultdetail');
	plateSearchForm = $('.searchform');
	notFound = $('.notfound');

	plateSearchForm.on('submit', carRequest);
	doc.on('click','.resultlink', showInventory);

	function carRequest (e) {
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

	function carResponse (cars) {
		clearSearchResults();
		searchResults.hide();
		notFound.hide();
		resultDetail.hide();
		if (cars.length > 0) {
			cars.forEach(appendCarResult);
			searchResults.show();
		} else {
			notFound.show();
		}
	}

	function clearSearchResults () {
		searchResults.find('.result').remove();
	}

	function appendCarResult (car) {
		htmlCarResult(car).appendTo(searchResults);
	}

	function appendResultDetail (inventoryNumber, towedToAddress, towFacilityPhone) {
		mapsURL = "http://maps.googleapis.com/maps/api/staticmap?center=" + encodeURI(towedToAddress) + ",%20Chicago,%20IL&zoom=12&size=420x420&maptype=roadmap&markers=color:red%7Clabel:A%7C" + encodeURI(towedToAddress) + ",%20Chicago,%20IL&sensor=false"

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

	function htmlCarResult (car) {
		var $result = $('<tr class="result">');

		$result
				.append($('<td>').text(car.tow_date.substring(0,10)))
				.append($('<td>').text(car.plate))
				.append($('<td>').text(car.state))
				.append($('<td>').text(car.make))
				.append($('<td>').text(car.color))
				.append($('<td>').text(car.style))
				.append($('<td>')
					.append($('<a>')
						.text("Hey That's My Car!")
						.attr({
							class: "resultlink",
							href: "#",
							inventory_number: car.inventory_number,
							towed_to_address: car.towed_to_address,
							tow_facility_phone: car.tow_facility_phone
						})
					)
				);

		return $result;
	}

});
