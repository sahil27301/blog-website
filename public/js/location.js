const callback = () => {
  if (
    $('#phoneNumber').val() &&
    !$('#phoneNumber')
      .val()
      .match(/^\+\d{2}\s?\d{10}$/)
  ) {
    alert('Please enter a valid phone number');
    return;
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      $('#latitude').val(latitude);
      $('#longitude').val(longitude);
      $('#location_form').submit();
    });
  } else {
    alert('Geo-location failed! Please allow geo-location!');
  }
};
$('#api').on('click', callback);
$('#graphical').on('click', () => {
  $('#location_form').attr('action', '/twitter/location/graphical');
  callback();
});
