const { Client } = require('discord.js');
const axios = require('axios').default;
const {token,WeatherApi} = require('./config.json');
const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
});
let city;
client.once('ready', () => console.log('Ready!'));

// send a image img.png when user said send
client.on('messageCreate', message => {
	if (message.content.startsWith("!set")) {
		city = message.content.split(" ")[1];
		message.channel.send("City set to " + city);
	}
	if (message.content.startsWith("!h")) {
		message.channel.send("!w : can use with cityname after it or if you have set city name you can use it with out city name after it")
		message.channel.send("!set : set city name")
	}
	// if message had flag !weather or !weat or !w
	if(message.content.startsWith("!w")){
		city = city || message.content.split(" ")[1];
		// send a request to openWeather Api with token we have
		axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WeatherApi}`)
		.then(res => {
			// get data
			let data = res.data;
			// get weather description
			let weather = data.weather[0].description;
			// get temperature to celcius
			let temp = data.main.temp;
			let celcius = temp - 273.15;
			celcius = Math.floor(celcius);
			// send message with weather description and temperature
			message.channel
			.send(`
			${city}:
			${weather}
			 ${celcius} C
			`);

		}).catch(err => {
			// if error send message
			message.channel.send(`City ${city} not found`);
			message.channel.send("If you're just using !w, make sure you have set the city with !set")
			message.channel.send("Also you can use !w city name");
		})
	}
});
// Login to Discord with your client's token
client.login(token);
