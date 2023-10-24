  const myMap = {
    coordinates: [],
    businesses: [],
	map: {},
	markers: {},


buildMap() {
        this.map = L.map('map', {
        center: this.coordinates,
        zoom: 15,
    });
    
    // opentree map tiles , this is what makes it functional
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy;  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: '15'
    }).addTo(this.map)

    const marker = L.marker(this.coordinates) //adding a marker based on user cordinates 
    marker
    .addTo(this.map)   //adds the marker to map
    .bindPopup('Your Journey Starts Here') // creates a clickable popup when we click on our marker 
    .openPopup()  //opens the popup on window load
},
   
addMarkers() {
    for (var i = 0; i < this.businesses.length; i++){
        this.markers = L.marker([
            this.businesses[i].lat,
            this.businesses[i].long,
        ])
        .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
            .addTo(this.map)
        }
    
    }

}

// grabing  user cordinates
async function getCoords(){     //from previous assignment , gives us the user cordinates 
    const pos = await new Promise ((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
        return [pos.coords.latitude, pos.coords.longitude]
}
console.log(getCoords())

      //we are placeing buisnessChoice as our callback function 

async function getFoursquare(business){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3znPJouolKBHoB7G+XolXrvjZWZCZ4XMYYlgfWfK4oG4='
        }
      }
      
    //   You'll need a query (place type), ll (latitude, longitue), and limit (5)
        let limit = 5
        let lat = myMap.coordinates[0]
        let lon = myMap.coordinates[1]
        let response = await  fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
        let data = await response.text()
        let parsedData = JSON.parse(data)
        let businesses = parsedData.results
        return businesses

}

function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}



// function getFoursquare(buisness){
//     const options = {
//         method: 'GET',
//         headers: {
//           accept: 'application/json',
//           Authorization: 'fsq3znPJouolKBHoB7G+XolXrvjZWZCZ4XMYYlgfWfK4oG4='
//         }
//       }
      
//     //   You'll need a query (place type), ll (latitude, longitue), and limit (5)
//         let limit = 5
//         let lat = myMap.coordinates[0]
//         let lon = myMap.coordinates[1]
//         fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options) //did not know this was possible, and was having trouble figuring out how to put my cordiantes in here .
//         .then(response => response.json())
//         .then(response => console.log(response))
//         .catch(err => console.error(err));


window.onload = async () => {               //window.onload is a async function because we are waiting until we have recived the coordinates , console.log those cordinates , make ourMap cordiantes equal to to the coordinates gathered by the async function above
	const coords = await getCoords()    // then we call on the function from the top to desplay our map
	console.log(coords)
	myMap.coordinates = coords
	myMap.buildMap()
}

document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.getElementById('business').value
    console.log(business)
    let data = await getFoursquare(business)
    myMap.businesses = processBusinesses(data)
    myMap.addMarkers()
})









// document.getElementById('drpdwnCont').addEventListener('click', async (event) => {
//     event.preventDefault()
//     let information =  document.getElementsByClassName('test3').value
//     console.log(information)
// })

// i am having trouble getting this to work, i only am getting undefined in my console when trying to get the value of my li elements. I also tried 


