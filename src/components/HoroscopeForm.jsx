"use client"

import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const HoroscopeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: null,
    time: "",
    ampm: "AM",
    place: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDateChange = (date) => {
    setFormData({ ...formData, date })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.date) {
      alert("Please select a date")
      return
    }

    // Format date as DD-MM-YYYY
    const day = String(formData.date.getDate()).padStart(2, "0")
    const month = String(formData.date.getMonth() + 1).padStart(2, "0")
    const year = formData.date.getFullYear()
    const formattedDate = `${day}-${month}-${year}`

    // Combine time with AM/PM
    const formattedTime = `${formData.time} ${formData.ampm}`

    onSubmit({
      name: formData.name,
      date: formattedDate,
      time: formattedTime,
      place: formData.place,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1.5">பெயர் (Name):</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1.5">பிறந்த தேதி (Birth Date):</label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select date"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            maxDate={new Date()}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1.5">பிறந்த நேரம் (Birth Time):</label>
          <div className="flex space-x-2">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-2/3 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              required
            />
            <select
              name="ampm"
              value={formData.ampm}
              onChange={handleChange}
              className="w-1/3 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1.5">பிறந்த இடம் (Birth Place):</label>
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700  font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
      >
        ஜாதகம் கணிக்க (Generate Horoscope)
      </button>
    </form>
  )
}

export default HoroscopeForm

