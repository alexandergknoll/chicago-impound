// jshint jquery:true

var chicagoImpoundApiURL = "https://data.cityofchicago.org/resource/ygr5-vcbg.json";

$(function(){
	var doc, newCell, searchResults, resultDetail, plateSearchForm;

	doc = $(document);
	newCell = $('<td>');
	searchResults = $('.searchresults');
	resultDetail = $('.resultdetail');
	plateSearchForm = $('.searchform');

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

		clearResultDetail();
		appendResultDetail(inventoryNumber, towedToAddress, towFacilityPhone);
		showResultDetail();
	}

	function carResponse (cars) {
		clearSearchResults();
		showSearchResults();
		cars.forEach(appendCarResult);
	}

	function clearSearchResults () {
		searchResults.find('.result').remove();
	}

	function clearResultDetail() {
		resultDetail.text("");
	}

	function showSearchResults () {
		searchResults.show();
	}

	function showResultDetail () {
		resultDetail.show();
	}

	function appendCarResult (car) {
		htmlCarResult(car).appendTo(searchResults);
	}

	function appendResultDetail (inventoryNumber, towedToAddress, towFacilityPhone) {
		resultDetail
			.append($('<p>')
				.text(inventoryNumber))
			.append($('<p>')
				.text(towedToAddress))
			.append($('<p>')
				.text(towFacilityPhone));
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
