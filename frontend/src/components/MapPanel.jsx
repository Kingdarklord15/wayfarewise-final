import indiaMap from "../assets/india-map.png";

export default function MapPanel({ map }) {
  const markers = map?.markers || [];

  return (
    <div className="glass rounded-lg p-5">
      <h2 className="text-2xl font-black mb-4">
        Route Map
      </h2>

      <div className="relative">
        <img
          src={indiaMap}
          alt="India Map"
          className="w-full rounded-lg"
        />

        {markers.map((marker, index) => (
          <div
            key={marker.name || index}
            className="absolute"
            style={{
              left: marker.left,
              top: marker.top
            }}
          >
            <div className="bg-aqua px-2 py-1 rounded-full text-xs font-bold">
              {marker.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}