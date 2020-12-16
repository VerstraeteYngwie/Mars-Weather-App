const API_KEY = '8UvsUZdb3dXD5Fubiaj414OklOsHuZZPoTgVEG0f'
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

const unitToggle = document.querySelector('[data-unit-toggle]')
const metricRadio = document.getElementById('cel')
const imperialRadio = document.getElementById('fah')

const displaySols = (sols) => {
	let index = 0;
	htmlCardString = "";
	htmlNavsString = "<div>";

	for (let sol of sols) {
		index++;
		let selectedSol = {};
		
		selectedSol.sol = sol.sol
		selectedSol.date = displayDate(sol.date)
		selectedSol.maxTemp = displayTemperature(sol.maxTemp)
		selectedSol.minTemp = displayTemperature(sol.minTemp)
		selectedSol.windSpeed = displaySpeed(sol.windSpeed)
		selectedSol.windDirectionDegrees = displayTemperature(sol.windDirectionDegrees)
		selectedSol.windDirectionCardinal = displaySpeed(sol.windDirectionCardinal)

		htmlCardString += `
			<div class="c-card" id="slide-${index}">
				<div class="c-card-header">
					<p class="c-card-header__item c-card__title js-mission">Latest weather at Elysium Planitia</p>
				</div>

				<div class="c-card__content">

					<div class="c-subject">
						<h2 class="c-subject__item c-subject__title">
							Sol 
							<span data-current-sol>${selectedSol.sol}</span>
						</h2>
						<p class="c-subject__item c-subject__reading" data-current-date>${selectedSol.date}</p>
					</div>

					<div class="c-subject">
						<h2 class="c-subject__item c-subject__title">Temperature</h2>
						<p class="c-subject__item c-subject__reading">
							High:
							<span class="js-toggle-temp" data-current-temp-high>${selectedSol.maxTemp}</span>
							°<span data-temp-unit></span>
						</p>
						<p class="c-subject__item c-subject__reading">
							Low:
							<span class="js-toggle-temp" data-current-temp-low>${selectedSol.minTemp}</span>
							°<span data-temp-unit></span>
						</p>
					</div>

					<div class="c-subject c-subject__wind">
						<h2 class="c-subject__item c-subject__title">Wind</h2>
						<p class="c-subject__item c-subject__reading">
							<span data-wind-speed>${selectedSol.windSpeed}</span>
							<span data-speed-unit></span>
						</p>

						<div class="c-subject__wind-direction">
							<p class="c-subject__sr-only" data-wind-direction-text>${selectedSol.windDirectionCardinal}</p>
				
							<!-- update --direction custom prop
								to change arrow direction -->
							<div class="c-subject__wind-arrow" style="--direction: ${selectedSol.windDirectionDegrees}deg;" data-wind-direction-arrow></div>
						</div>
					</div> 
				</div>
			</div>`;

			htmlNavsString += `<a class="c-pages" href="#slide-${index}">${index}</a>`;
	}

	htmlNavsString += `
		</div>

		<div class="c-button">
			<label for="cel">°C</label>
			<input type="radio" id="cel" name="unit" checked>
			<button class="c-button__toggle" data-unit-toggle></button>
			<label for="fah">°F</label>
			<input type="radio" id="fah" name="unit">
		</div>`;

	htmlCards.innerHTML = htmlCardString;
	htmlNavs.innerHTML = htmlNavsString;
}

const displayDate = (date) => {
	return date.toLocaleDateString(
		undefined,
		{ day: 'numeric', month: 'long' }
	)
}

const displayTemperature = (temperature) => {
	let returnTemp = temperature
	if (!isMetric()) {
		returnTemp = (temperature - 32) * (5 / 9)
	}
	return Math.round(returnTemp)
}

const displaySpeed = (speed) => {
	let returnSpeed = speed
	if (!isMetric()) {
		returnSpeed = speed / 1.609
	}
	return Math.round(returnSpeed)
}


const getWeather = () => {
	return fetch(API_URL)
		.then(res => res.json())
		.then(data => {
			const {
				sol_keys,
				validity_checks,
				...solData
			} = data
			console.log(data)
			return Object.entries(solData).map(([sol, data]) => {
				return {
					sol: sol,
					maxTemp: data.PRE.mx,
					minTemp: data.PRE.mn,
					windSpeed: data.PRE.av,
					windDirectionDegrees: data.WD.most_common.compass_degrees,
					windDirectionCardinal: data.WD.most_common.compass_point,
					date: new Date(data.First_UTC)
				}
			})
		})
}

function test() {
	console.log(test[0].innerText)
}

const updateTemperature = (temperature) => {
	if (!isMetric()) {
		return Math.round(temperature  * 1.8 + 32)
	}
	else {
		return Math.round((temperature - 32) / 1.8)
	}
	
}

const updateSpeed = (speed) => {
	if (!isMetric()) {
		return Math.round(speed / 1.609)
	}
	else {
		return Math.round(speed * 1.609)
	}
}

const updateUnits = () => {
	const temps = document.getElementsByClassName("js-toggle-temp")
	const windspeeds = document.getElementsByClassName("js-toggle-windspeed")

	const speedUnits = document.querySelectorAll('[data-speed-unit]')
	const tempUnits = document.querySelectorAll('[data-temp-unit]')

	let index = 0
	speedUnits.forEach(unit => {
		unit.innerText = isMetric() ? 'kph' : 'mph'
		windspeeds[index].innerText = updateSpeed(windspeeds[index].innerText);
		index++
	})

	index = 0
	tempUnits.forEach(unit => {
		unit.innerText = isMetric() ? 'C' : 'F'
		temps[index].innerText = updateTemperature(temps[index].innerText);
		index++
	})
}

const isMetric = () => {
	return metricRadio.checked
}

document.addEventListener("DOMContentLoaded", function() {
	htmlCards = document.querySelector('.c-cards');
	htmlNavs = document.querySelector('c-navigations');

	// NOTE: api doesn't work right now
	// When the api works again, uncomment all functions 'displaySols(sols)' below
	getWeather().then(sols => {
		// displaySols(sols)

		unitToggle.addEventListener('click', () => {
			let metricUnits = !isMetric()
			metricRadio.checked = metricUnits
			imperialRadio.checked = !metricUnits
			// displaySols(globalSols)
			updateUnits()
		})
	
		metricRadio.addEventListener('change', () => {
			// displaySols(globalSols)
			updateUnits()
		})
	
		imperialRadio.addEventListener('change', () => {
			// displaySols(globalSols)
			updateUnits()
		})
	})
});

