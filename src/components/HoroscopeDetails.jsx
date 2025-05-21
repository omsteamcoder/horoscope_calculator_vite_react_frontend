function HoroscopeDetails({ horoscopeData }) {
  if (!horoscopeData) return null;

  const { name, date, time, place, latitude, longitude, rasi, nakshatra, tithi, karana, yoga, planetaryPositions, dasha ,sutham} = horoscopeData;


  return (
    <div className="space-y-6 no-break">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Birth Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">பிறந்த விவரங்கள்</h3>
          <div className="grid grid-cols-2 gap-x-8 text-sm">
            <p className="font-medium">பெயர்:</p> <p>{name}</p>
            <p className="font-medium">பிறந்த தேதி:</p> <p>{date}</p>
            <p className="font-medium">பிறந்த நேரம்:</p> <p>{time}</p>
            <p className="font-medium">பிறந்த இடம்:</p> <p>{place}</p>
            <p className="font-medium">அகலாங்கு:</p> <p>{latitude}</p>
            <p className="font-medium">நெட்டாங்கு:</p> <p>{longitude}</p>
          </div>
        </div>

        {/* Rasi & Nakshatra */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">ஜாதக விவரங்கள்</h3>
          <div className="grid grid-cols-2 gap-x-8 text-sm">
            <p className="font-medium">ராசி:</p> <p>{rasi}</p>
            <p className="font-medium">நட்சத்திரம்:</p> <p>{nakshatra}</p>
            <p className="font-medium">நிலவு நாள்:</p> <p>{tithi}</p>
            <p className="font-medium">கரணம்:</p> <p>{karana}</p>
            <p className="font-medium">யோகம்:</p> <p>{yoga}</p>
            <p className="font-medium">சுத்த:</p> <p>{sutham}</p>
          </div>
        </div>
      </div>

  

    </div>
  );
}

export default HoroscopeDetails;
