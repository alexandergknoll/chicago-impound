var starApiUrl = "https://data.cityofchicago.org/resource/ygr5-vcbg.json";

$(function(){
	var plateSearchForm = $('.platesearch')

	plateSearchForm.on('submit', carRequest)
})

function carRequest (e) {
	var formData;
	e.preventDefault();

	formData = $(this).serialize();
 	$.getJSON(starApiUrl, formData).done(carResponse);
	}

function carResponse (response) {
	console.log(response);
}