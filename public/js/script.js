const socket = io();

const userName = prompt("Enter your name:") || "Anonymous";

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude, name: userName });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}


const map = L.map("map").setView([0,0],16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
  attribution: "openStreetMap"
}).addTo(map)

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude, name } = data;
  map.setView([latitude, longitude], 16);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup(`${name}'s Location`).openPopup();
    markers[id] = marker;
  }
});


socket.on("user-disconnected",(id) => {
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});