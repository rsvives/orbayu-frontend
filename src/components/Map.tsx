import { useEffect } from "react";
import { Circle, MapContainer, TileLayer, useMap } from "react-leaflet"

export const Map = ({ lat, lng, radius }: { lat: number | null | undefined, lng: number | null | undefined, radius: number }) => {

    if (!lat || !lng) {
        return (
            <div className='w-full h-[200px] sm:h-[300px] relative bg-gray-100 flex items-center justify-center'>
                <p className="text-center text-sm">No location selected</p>
            </div>
        )
    }

    const zoom = Math.floor(11 - ((radius + (radius * (- 0.5))) / 10))
    return (
        <div className="w-full h-[200px] sm:h-[300px] ">
            <MapContainer style={{ zIndex: 5 }} className="h-full w-full" center={{ lat, lng }} zoom={zoom} scrollWheelZoom={false} dragging={false}  >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle center={[lat, lng]} fillColor="--slate-500" color="black" radius={radius * 1000}></Circle>
                <ChangeMapView center={[lat, lng]} zoom={zoom} />
            </MapContainer>
        </div >

    )
}

function ChangeMapView({ center, zoom }: { center: [number, number], zoom?: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);

    return null;
}