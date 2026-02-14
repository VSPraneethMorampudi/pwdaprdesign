import "ol/ol.css";
import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

const DEFAULT_CENTER = [81.6333, 21.2514];
const DEFAULT_ZOOM = 10;

export function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(DEFAULT_CENTER),
        zoom: DEFAULT_ZOOM,
      }),
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <div className="relative rounded-[3px] overflow-hidden border border-[#DFE1E6] bg-white h-full min-h-[350px] shadow-sm">
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
