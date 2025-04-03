import { useState } from "react";

const HoroscopeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    ampm: "AM", // Default AM
    place: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert YYYY-MM-DD to DD-MM-YYYY
    const formattedDate = formData.date.split("-").reverse().join("-");
    // Combine time with AM/PM
    const formattedTime = `${formData.time} ${formData.ampm}`;

    onSubmit({
      name: formData.name,
      date: formattedDate,
      time: formattedTime,
      place: formData.place,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">பெயர் (Name):</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">பிறந்த தேதி (Birth Date):</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">பிறந்த நேரம் (Birth Time):</label>
        <div className="flex space-x-2">
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-2/3 border p-2 rounded"
            required
          />
          <select
            name="ampm"
            value={formData.ampm}
            onChange={handleChange}
            className="w-1/3 border p-2 rounded"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700">பிறந்த இடம் (Birth Place):</label>
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded">
        ஜாதகம் கணிக்க (Calculate Horoscope)
      </button>
    </form>
  );
};

export default HoroscopeForm;
