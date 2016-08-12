function initAddressAutoComplete() {
	var address_inputs = document.querySelectorAll('input.address')
	for (var i = 0; i < address_inputs.length; i++){
		var self = address_inputs[i];
		var cmps = document.querySelector('#' + self.name + '_components')
		var fmtd = document.querySelector('input[name="' + self.name + '_formatted"]');
		var autocomplete = new google.maps.places.Autocomplete(self);
		var changed_flag = false;
		autocomplete.addListener('place_changed', function() {
			changed_flag = true;
			var place = autocomplete.getPlace();
			fmtd.value = place.formatted_address;
			for (var x = 0; x < place.address_components.length; x++){
				var cmp = place.address_components[x]
				if (cmp.types[0] == "sublocality_level_1"){cmp.types[0] = "locality"}
				if (cmps.querySelector('input[data-geo="'+cmp.types[0]+'"')){
					cmps.querySelector('input[data-geo="'+cmp.types[0]+'"').value = cmp.long_name
					if (cmps.querySelector('input[data-geo="'+cmp.types[0]+'_short"')){
						cmps.querySelector('input[data-geo="'+cmp.types[0]+'_short"').value = cmp.short_name
					}
				}
			}
		  	if (place.geometry) {
				cmps.querySelector('input[data-geo="lat"').value = place.geometry.location.lat();
				cmps.querySelector('input[data-geo="lng"').value = place.geometry.location.lng();
			} else {
		    		console.log("Autocomplete's returned place contains no geometry");
	  		}
			changed_flag = false;
		})
		self.addEventListener("change", function( event ) {
		  !changed_flag && clear_address_hidden_fields(event.target)
		}, true);
	}
}
function clear_address_hidden_fields(element){
	var cmp_names = ['country', 'country_code', 'locality', 'postal_code',
				 'route', 'street_number', 'state', 'state_code',
				 'formatted', 'latitude', 'longitude'];
		for(var ii = 0; ii < cmp_names.length; ++ii){
		    document.querySelector('input[name="' + element.name + '_' + cmp_names[ii] + '"]').value = '';
	    }
}