var chicagoImpoundApiURL = "https://data.cityofchicago.org/resource/ygr5-vcbg.json";

$(function(){
	var searchResults, plateSearchForm;

	plateSearchForm = $('.searchform');
	searchResults = $('.searchtable');

	plateSearchForm.on('submit', carRequest);

	function carRequest (e) {
		var formData;
		e.preventDefault();

		formData = $(this).serialize();
	 	$.getJSON(chicagoImpoundApiURL, formData).done(carResponse);
	}

	function carResponse (cars) {
		clearResults();
		cars.forEach(appendCarResult);
	}

	function clearResults () {
		searchResults.find('.result').remove();
	}

	function appendCarResult (car) {
		htmlCarResult(car).appendTo(searchResults)
	}

	function htmlCarResult (car) {
		var result;

		console.log(car);

		result = $('<tr class="result">').append(
				$('<td>').text(car.tow_date.substring(0,10))
			).append(
				$('<td>').text(car.plate)
			).append(
				$('<td>').text(car.state)
			).append(
				$('<td>').text(car.make)
			).append(
				$('<td>').text(car.color)
			).append(
				$('<td>').text(car.style)
			).append(
				$('<td>').append(
					$('<a class="resultlink" href="#">').text("Hey That's My Car!")
				)
			)
		return result;
	}

})