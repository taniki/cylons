var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key: '1nTj648YIiFJAPaZD3pw',
  consumer_secret: '6AOQ5RKzJ6Y42oKWrFpI54sX0aWaX756kb7G8YG90E',
  access_token_key: '1740241-BcveVF1tGmPBCF4CvImfuUJOToqa2N5fLuwlvb4',
  access_token_secret: 'uXaywfk1wd00fG03jM8z9UbqZxWh4liqVTh9zifISk'
});

twit.stream('statuses/filter',
  {'track':'apple'},
  function(stream) {
	  stream.on('data', function (data) {
	    console.log(data.text);
  });
});