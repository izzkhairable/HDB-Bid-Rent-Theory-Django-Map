let map;

// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: 1.3521, lng: 103.8198 },
//     zoom: 8,
//   });
// }

function pickHex(color1, color2, weight) {
  var w1 = weight;
  var w2 = 1 - w1;
  var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2)];
  return rgb;
}

function rgb(values) {
  return 'rgb(' + values.join(', ') + ')';
}

function initMap() {
  hdb_data=JSON.parse(hdb_data_json);
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: {lat: 1.3521, lng: 103.8198},
  });
  

  const cbd_polygon = new google.maps.Polygon({
    paths: downtown_polygon_clean,
    strokeColor: "#349eeb",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#349eeb",
    fillOpacity: 0.35,
  });
  cbd_polygon.setMap(map);

  const marker =new google.maps.Marker({
    position: {lat:1.287953, lng:103.851784},
    label: {text:"CBD", color:"#ffffff", fontSize:"9px" },
    map: map,
  });


  for(hdb of hdb_data){
    range = Number(max_price_sqm) - Number(min_price_sqm)
    correctedStartValue = hdb.price_per_sqm - Number(min_price_sqm)
    percentage = (correctedStartValue * 100) / range 
    let svgMarker = {
          path: "M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z",
          fillColor: rgb(pickHex(["255", "0","0"],["0", "255", "0"],percentage/100)),
          fillOpacity: 0.9,
          strokeWeight: 0,
          rotation: 0,
          scale: 2,
          anchor: new google.maps.Point(15, 30),
          };
  
      const contentString =`
                            <p style="color:${rgb(pickHex(["255", "0","0"],["0", "255", "0"],percentage/100))}"><b>Price per SQM:</b> $${Math.round(hdb.price_per_sqm)}</p>
                            <p><b>Block & Town:</b> ${hdb.block} ${hdb.town}</p>
                            <p><b>Resale price:</b> ${hdb.resale_price}</p>
                            <p><b>Floor Area SQM:</b> ${hdb.floor_area_sqm}</p>
                            <p><b>Year:</b> ${hdb.actual_year}</p>
                            <p><b>Month:</b> ${hdb.actual_month}</p>
                          `
      const marker =new google.maps.Marker({
          position: {lat:Number(hdb.latitude), lng:Number(hdb.longitude)},
          icon: svgMarker,
          // label: {text:"Hello how are you", color:"#ff1100", fontSize:"100px" },
          map: map,
        });
      
      const infowindow = new google.maps.InfoWindow({
      content: contentString,
      });

      marker.addListener("click", () => {
        infowindow.open({
            anchor: marker,
            map,
            shouldFocus: false,
        });
      });
  }
}