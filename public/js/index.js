var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var a = jQuery('<a target="_blank">My Current location</a>');

  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});

// const locationButton = jQuery('#send-location');
// locationButton.on('click', () => {
//
//  if (!navigator.geolocation) {
//  return alert('Geo location not supported by your browser');
//  }
//  navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
//  navigator.geolocation.getCurrentPosition((position) => {
//  console.log('ay');
//  console.log(position);
//  }, (err) => {
//  alert('Unable to fetch location');
//  }, {
//  maximumAge: 60000,
//  timeout: 10000,
//  enableHighAccuracy: true
//  });
// });
