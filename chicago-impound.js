var chicagoImpoundApiURL = "https://data.cityofchicago.org/resource/ygr5-vcbg.json";
var googleMapsGeocodeApiURL = "https://maps.googleapis.com/maps/api/geocode/";

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
		initializeMap(towedToAddress);
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

	function initializeMap (address) {
    var mapCanvas = $('#map-canvas');
    var mapOptions = {
      center: new google.maps.LatLng(44.5403, -78.5463),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);

    appendMapDetail(address);
  }

	function appendMapDetail (address) {
		var fullAddress = address + " Chicago, IL";

		geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': fullAddress }, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
	    map.setCenter(results[0].geometry.location);
	    var marker = new google.maps.Marker({
	    map: map,
	    position: results[0].geometry.location
	  });
	}

});
