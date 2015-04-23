var chicagoImpoundApiURL = "https://data.cityofchicago.org/resource/ygr5-vcbg.json";

$(function(){
	var plateSearchForm = $('.platesearch')

	plateSearchForm.on('submit', carRequest)
})

function carRequest (e) {
	var formData;
	e.preventDefault();

	formData = $(this).serialize();
 	$.getJSON(chicagoImpoundApiURL, formData).done(carResponse);
	}

function carResponse (response) {
	console.log(response);
}