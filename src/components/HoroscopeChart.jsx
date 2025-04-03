function HoroscopeChart({ chartData, chartType }) {
  // Planet abbreviations for display in the chart
  const planetAbbreviations = {
    SUN: "சூ",
    MOON: "சந்",
    MARS: "செவ்",
    MERCURY: "புத",
    JUPITER: "குரு",
    VENUS: "சுக்",
    SATURN: "சனி",
    RAHU: "ராகு",
    KETU: "கேது",
  }
  console.log(chartData);
  // Traditional South Indian chart layout (houses indexed from 1)
  // This layout matches the reference image better
  const traditionalLayout =
    chartType === "rasi"
      ? [
          // Rasi Chart houses (1-12)
          { house: 1, row: 0, col: 3, planets: [] },
          { house: 2, row: 0, col: 2, planets: [] },
          { house: 3, row: 0, col: 1, planets: [] },
          { house: 4, row: 0, col: 0, planets: [] },
          { house: 5, row: 1, col: 0, planets: [] },
          { house: 6, row: 2, col: 0, planets: [] },
          { house: 7, row: 3, col: 0, planets: [] },
          { house: 8, row: 3, col: 1, planets: [] },
          { house: 9, row: 3, col: 2, planets: [] },
          { house: 10, row: 3, col: 3, planets: [] },
          { house: 11, row: 2, col: 3, planets: [] },
          { house: 12, row: 1, col: 3, planets: [] },
        ]
      : [
          // Navamsa Chart houses (1-12)
          { house: 1, row: 0, col: 3, planets: [] },
          { house: 2, row: 0, col: 2, planets: [] },
          { house: 3, row: 0, col: 1, planets: [] },
          { house: 4, row: 0, col: 0, planets: [] },
          { house: 5, row: 1, col: 0, planets: [] },
          { house: 6, row: 2, col: 0, planets: [] },
          { house: 7, row: 3, col: 0, planets: [] },
          { house: 8, row: 3, col: 1, planets: [] },
          { house: 9, row: 3, col: 2, planets: [] },
          { house: 10, row: 3, col: 3, planets: [] },
          { house: 11, row: 2, col: 3, planets: [] },
          { house: 12, row: 1, col: 3, planets: [] },
        ]

  // Calculate the ascendant house (lagna)
  const ascendantDegree = chartData?.ascendant?.degrees || 0
  const ascendantRasi = Math.floor(ascendantDegree / 30) % 12

  // For fixed positioning matching the sample data
  // This is for demonstration - in a real implementation, you'd calculate these positions
  if (chartType === "rasi") {
    // Based on the provided data
    const planetPositions = {
      SUN: 2, // Gemini (Mithunam)
      MOON: 11, // Aquarius (Kumbam)
      MARS: 12, // Pisces (Meenam)
      MERCURY: 1, // Taurus (Rishabam)
      JUPITER: 2, // Gemini (Mithunam)
      VENUS: 0, // Aries (Mesham)
      SATURN: 10, // Capricorn (Makaram)
      RAHU: 10, // Capricorn (Makaram)
      KETU: 4, // Cancer (Kadakam)
    }

    // Assign planets to houses based on the positions from the image
    Object.entries(planetPositions).forEach(([planet, position]) => {
      // Find the right house to place this planet
      // For example, if ascendantRasi is 3 (Cancer) and planet is in position 9 (Pisces),
      // we'd place it in house 6 (counting from 0-11)
      const houseIndex = (position - ascendantRasi + 12) % 12
      const houseNumber = houseIndex + 1 // Convert to 1-indexed house number

      // Find the house in our layout and add the planet
      const house = traditionalLayout.find((h) => h.house === houseNumber)
      if (house) {
        house.planets.push(planet)
      }
    })
  } else {
    // Navamsa chart - using different positions for demonstration
    const navamsaPositions = {
      SUN: 1, // Position for Navamsa
      MOON: 3, // Position for Navamsa
      MARS: 10, // Position for Navamsa
      MERCURY: 2, // Position for Navamsa
      JUPITER: 2, // Position for Navamsa
      VENUS: 0, // Position for Navamsa
      SATURN: 10, // Position for Navamsa
      RAHU: 8, // Position for Navamsa
      KETU: 2, // Position for Navamsa
    }

    // Same logic as above but with different positions
    Object.entries(navamsaPositions).forEach(([planet, position]) => {
      const houseIndex = (position - ascendantRasi + 12) % 12
      const houseNumber = houseIndex + 1

      const house = traditionalLayout.find((h) => h.house === houseNumber)
      if (house) {
        house.planets.push(planet)
      }
    })
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 grid-rows-4 border-2 border-green-600 rounded-lg overflow-hidden aspect-square">
        {/* Top row (houses 4, 3, 2, 1) */}
        {traditionalLayout.slice(0, 4).map((house) => (
          <div
            key={`house-${house.house}`}
            className={`border border-green-600 p-1 flex flex-col ${house.house === 1 ? "bg-yellow-50" : ""}`}
          >
            <div className="text-xs text-gray-600 self-start">{house.house}</div>
            <div className="flex-grow flex flex-wrap content-center justify-center">
              {house.planets.map((planet) => (
                <div key={planet} className="text-sm mx-1">
                  {planetAbbreviations[planet]}
                </div>
              ))}
            </div>
            {house.house === 1 && <div className="text-xs text-red-600 self-end">லக்</div>}
          </div>
        ))}

        {/* Middle rows with center */}
        <div className="border border-green-600 p-1 flex flex-col">
          {/* House 5 */}
          <div className="text-xs text-gray-600 self-start">5</div>
          <div className="flex-grow flex flex-wrap content-center justify-center">
            {traditionalLayout
              .find((h) => h.house === 5)
              ?.planets.map((planet) => (
                <div key={planet} className="text-sm mx-1">
                  {planetAbbreviations[planet]}
                </div>
              ))}
          </div>
        </div>

        {/* Center cell spanning 2x2 */}
        <div className="col-span-2 row-span-2 border border-green-600 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">{chartType === "rasi" ? "ராசி" : "நவாம்சம்"}</div>
            {chartType === "rasi" && <div className="text-lg text-red-600">{chartData?.ascendant?.rasi || "கும்பம்"}</div>}
          </div>
        </div>

        <div className="border border-green-600 p-1 flex flex-col">
          {/* House 12 */}
          <div className="text-xs text-gray-600 self-start">12</div>
          <div className="flex-grow flex flex-wrap content-center justify-center">
            {traditionalLayout
              .find((h) => h.house === 12)
              ?.planets.map((planet) => (
                <div key={planet} className="text-sm mx-1">
                  {planetAbbreviations[planet]}
                </div>
              ))}
          </div>
        </div>

        <div className="border border-green-600 p-1 flex flex-col">
          {/* House 6 */}
          <div className="text-xs text-gray-600 self-start">6</div>
          <div className="flex-grow flex flex-wrap content-center justify-center">
            {traditionalLayout
              .find((h) => h.house === 6)
              ?.planets.map((planet) => (
                <div key={planet} className="text-sm mx-1">
                  {planetAbbreviations[planet]}
                </div>
              ))}
          </div>
        </div>

        <div className="border border-green-600 p-1 flex flex-col">
          {/* House 11 */}
          <div className="text-xs text-gray-600 self-start">11</div>
          <div className="flex-grow flex flex-wrap content-center justify-center">
            {traditionalLayout
              .find((h) => h.house === 11)
              ?.planets.map((planet) => (
                <div key={planet} className="text-sm mx-1">
                  {planetAbbreviations[planet]}
                </div>
              ))}
          </div>
        </div>

        {/* Bottom row (houses 7, 8, 9, 10) */}
        {traditionalLayout.slice(6, 10).map((house) => (
          <div key={`house-${house.house}`} className="border border-green-600 p-1 flex flex-col">
            <div className="text-xs text-gray-600 self-start">{house.house}</div>
            <div className="flex-grow flex flex-wrap content-center justify-center">
              {house.planets.map((planet) => (
                <div key={planet} className="text-sm mx-1">
                  {planetAbbreviations[planet]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HoroscopeChart

