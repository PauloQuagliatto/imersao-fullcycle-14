'use client'

import { FormEvent, useEffect, useRef, useState } from "react";
import type { DirectionsResponseData, FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js";

import { useMap } from "../hooks/useMap";

export function NewRoutePage() {
  const mapContainerRef = useRef(null);
  const map = useMap(mapContainerRef);
  const [directionsData, setDirectionsData] = useState<
    DirectionsResponseData & { request: any }
  >();

  async function searchPlace(event: FormEvent) {
    event.preventDefault();
    const source = (document.getElementById("source") as HTMLInputElement).value;
    const destination = (document.getElementById("destination") as HTMLInputElement).value;

    const [sourceResponse, destinationResponse] = await Promise.all([
      fetch(`http://localhost:5000/places?text=${source}`),
      fetch(`http://localhost:5000/places?text=${destination}`)
    ]);

    const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] = await Promise.all([
      sourceResponse.json(),
      destinationResponse.json()
    ]);

    if (sourcePlace.status !== 'OK') {
      alert('Nao foi possivel encontrar a origem');
      return;
    }

    if (destinationPlace.status !== 'OK') {
      alert('Nao foi possivel encontrar o destino');
      return;
    }

    const placeSourceId = sourcePlace.candidates[0].place_id;
    const placeDestinationId = destinationPlace.candidates[0].place_id;
    const directionsResponse = await fetch(
      `http://localhost:5000/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`
    );

    const directionsData: DirectionsResponseData & { request: any } = await directionsResponse.json();

    setDirectionsData(directionsData);

    map?.removeAllRoutes();

    await map?.addRouteWithIcons({
      routeId: '1',
      startMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: directionsData.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      }
    });
  }

  async function createRoute() {
    const startAddress = directionsData!.routes[0].legs[0].start_address;
    const endAddress = directionsData!.routes[0].legs[0].end_address;
    const response = await fetch(`http://localhost:5000/rotues` ,{
      method: "POST",
      headers: {
        'Content-Type': 'aplication/json',
      },
      body: JSON.stringify({
        name: `${startAddress} - ${endAddress}`,
        source_id: directionsData!.request.origin.place_id,
        destination_id: directionsData!.request.destination.place_id,
      })
    });

    const route = await response.json() 
  }
  return (
    <div style={{
      height: "100%",
      width: "100%"
    }}>
      <div>
        <h1>
          Nova Rota
        </h1>
        <form
          onSubmit={searchPlace}
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div>
            <input id="source" type="text" placeholder="origem" />
          </div>
          <div>
            <input id="destination" type="text" placeholder="destino" />
          </div>
          <div>
            <button type="submit">Enviar</button>
          </div>
        </form>
        {directionsData &&
          <ul>
            <li>Origem: {directionsData.routes[0].legs[0].start_address}</li>
            <li>Destino: {directionsData.routes[0].legs[0].end_address}</li>
            <li>
              <button onClick={createRoute}>Criar Rota</button>
            </li>
          </ul>
        }
      </div>
      <div
        id='map'
        style={{
          height: "100%",
          width: "100%"
        }}
        ref={mapContainerRef}
      >
      </div>
    </div>
  );
}

export default NewRoutePage;
