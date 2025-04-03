import EditableHoroscopeChart from "./EditableHoroscopeChart";
import HoroscopeDetails from "./HoroscopeDetails";

const PrintPreview = ({ horoscopeData, onClose }) => {
  if (!horoscopeData) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-indigo-800">Print Preview</h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-center text-indigo-700">ராசி (Rasi Chart)</h3>
            <EditableHoroscopeChart chartData={horoscopeData} chartType="rasi" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-center text-indigo-700">நவாம்சம் (Navamsa Chart)</h3>
            <EditableHoroscopeChart chartData={horoscopeData} chartType="navamsa" />
          </div>
        </div>

        <div className="mt-6">
          <HoroscopeDetails horoscopeData={horoscopeData} />
        </div>

        {/* Print and Close Buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md">
            Close Preview
          </button>
          <button onClick={() => window.print()} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md">
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
