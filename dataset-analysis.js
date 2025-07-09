// Fetch and analyze the metro dataset
async function analyzeMetroDataset() {
  try {
    console.log("🚇 Fetching Metro Dataset from Vercel Blob Storage...\n")

    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Datasets-AUC7i0812pSY5F1NQx8Uw4jzC2CeoX.csv",
    )
    const csvText = await response.text()

    console.log("✅ Dataset fetched successfully!\n")

    // Parse CSV data
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",")
    const dataRows = lines.slice(1)

    console.log("📊 DATASET OVERVIEW")
    console.log("==================")
    console.log(`Total Records: ${dataRows.length.toLocaleString()}`)
    console.log(`Columns: ${headers.length}`)
    console.log(`File Size: ${(csvText.length / 1024 / 1024).toFixed(2)} MB\n`)

    console.log("📋 COLUMN HEADERS")
    console.log("=================")
    headers.forEach((header, index) => {
      console.log(`${index + 1}. ${header.trim()}`)
    })
    console.log("")

    // Sample data analysis
    console.log("🔍 SAMPLE DATA (First 5 Records)")
    console.log("==================================")
    for (let i = 0; i < Math.min(5, dataRows.length); i++) {
      const row = dataRows[i].split(",")
      console.log(`\nRecord ${i + 1}:`)
      headers.forEach((header, index) => {
        console.log(`  ${header.trim()}: ${row[index]?.trim() || "N/A"}`)
      })
    }

    // Data quality analysis
    console.log("\n📈 DATA QUALITY ANALYSIS")
    console.log("=========================")

    // Parse all data for analysis
    const parsedData = dataRows.map((row) => {
      const values = row.split(",")
      return {
        fid: values[0]?.trim(),
        tripid: values[1]?.trim(),
        metroName: values[2]?.trim(),
        city: values[3]?.trim(),
        source: values[4]?.trim(),
        destination: values[5]?.trim(),
        dateTime: values[6]?.trim(),
        numberOfBoardings: values[7]?.trim(),
        label: values[8]?.trim(),
      }
    })

    // Analyze cities
    const cities = {}
    const metroLines = {}
    const sources = {}
    const destinations = {}
    const boardingCounts = []

    parsedData.forEach((record) => {
      // Count cities
      if (record.city) {
        cities[record.city] = (cities[record.city] || 0) + 1
      }

      // Count metro lines
      if (record.metroName) {
        metroLines[record.metroName] = (metroLines[record.metroName] || 0) + 1
      }

      // Count sources
      if (record.source) {
        sources[record.source] = (sources[record.source] || 0) + 1
      }

      // Count destinations
      if (record.destination) {
        destinations[record.destination] = (destinations[record.destination] || 0) + 1
      }

      // Collect boarding numbers
      if (record.numberOfBoardings && !isNaN(record.numberOfBoardings)) {
        boardingCounts.push(Number.parseInt(record.numberOfBoardings))
      }
    })

    console.log(`\n🏙️ CITIES DISTRIBUTION (${Object.keys(cities).length} unique cities):`)
    Object.entries(cities)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([city, count]) => {
        console.log(`  ${city}: ${count.toLocaleString()} records`)
      })

    console.log(`\n🚇 METRO LINES (${Object.keys(metroLines).length} unique lines):`)
    Object.entries(metroLines)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([line, count]) => {
        console.log(`  ${line}: ${count.toLocaleString()} records`)
      })

    console.log(`\n🚉 TOP SOURCE STATIONS (${Object.keys(sources).length} unique stations):`)
    Object.entries(sources)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([station, count]) => {
        console.log(`  ${station}: ${count.toLocaleString()} records`)
      })

    console.log(`\n🎯 TOP DESTINATION STATIONS (${Object.keys(destinations).length} unique stations):`)
    Object.entries(destinations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([station, count]) => {
        console.log(`  ${station}: ${count.toLocaleString()} records`)
      })

    // Boarding statistics
    if (boardingCounts.length > 0) {
      const avgBoardings = boardingCounts.reduce((a, b) => a + b, 0) / boardingCounts.length
      const maxBoardings = Math.max(...boardingCounts)
      const minBoardings = Math.min(...boardingCounts)

      console.log("\n👥 PASSENGER BOARDING STATISTICS:")
      console.log(`  Average Boardings: ${avgBoardings.toFixed(2)}`)
      console.log(`  Maximum Boardings: ${maxBoardings}`)
      console.log(`  Minimum Boardings: ${minBoardings}`)
      console.log(`  Total Boarding Records: ${boardingCounts.length.toLocaleString()}`)
    }

    // Date analysis
    console.log("\n📅 DATE ANALYSIS:")
    const dates = parsedData
      .map((record) => record.dateTime)
      .filter((date) => date && date !== "N/A")
      .slice(0, 10)

    console.log("Sample dates:")
    dates.forEach((date) => console.log(`  ${date}`))

    // Label distribution
    const labels = {}
    parsedData.forEach((record) => {
      if (record.label) {
        labels[record.label] = (labels[record.label] || 0) + 1
      }
    })

    console.log("\n🏷️ LABEL DISTRIBUTION:")
    Object.entries(labels)
      .sort(([, a], [, b]) => b - a)
      .forEach(([label, count]) => {
        console.log(`  Label ${label}: ${count.toLocaleString()} records`)
      })

    // Data completeness check
    console.log("\n✅ DATA COMPLETENESS CHECK:")
    const completeness = {
      fid: parsedData.filter((r) => r.fid && r.fid !== "").length,
      tripid: parsedData.filter((r) => r.tripid && r.tripid !== "").length,
      metroName: parsedData.filter((r) => r.metroName && r.metroName !== "").length,
      city: parsedData.filter((r) => r.city && r.city !== "").length,
      source: parsedData.filter((r) => r.source && r.source !== "").length,
      destination: parsedData.filter((r) => r.destination && r.destination !== "").length,
      dateTime: parsedData.filter((r) => r.dateTime && r.dateTime !== "").length,
      numberOfBoardings: parsedData.filter((r) => r.numberOfBoardings && r.numberOfBoardings !== "").length,
      label: parsedData.filter((r) => r.label && r.label !== "").length,
    }

    Object.entries(completeness).forEach(([field, count]) => {
      const percentage = ((count / parsedData.length) * 100).toFixed(1)
      console.log(`  ${field}: ${count.toLocaleString()}/${parsedData.length.toLocaleString()} (${percentage}%)`)
    })

    console.log("\n🎯 DATASET SUMMARY FOR AFFN MODEL:")
    console.log("===================================")
    console.log("✅ This dataset is suitable for passenger flow prediction!")
    console.log(`✅ Contains ${dataRows.length.toLocaleString()} training samples`)
    console.log(`✅ Covers ${Object.keys(cities).length} cities and ${Object.keys(sources).length} stations`)
    console.log("✅ Includes temporal data (Date_Time) for time-series analysis")
    console.log("✅ Has boarding counts for flow prediction targets")
    console.log("✅ Contains route information (Source → Destination)")
    console.log("✅ Includes labels for supervised learning")

    console.log("\n📋 RECOMMENDED PREPROCESSING STEPS:")
    console.log("====================================")
    console.log("1. Parse Date_Time column for temporal features")
    console.log("2. Normalize NumberOfBoardings for consistent scaling")
    console.log("3. Encode categorical variables (City, Source, Destination)")
    console.log("4. Handle any missing values in critical columns")
    console.log("5. Split data into training/validation/test sets")
    console.log("6. Create time-based features (hour, day, month, weekday)")
  } catch (error) {
    console.error("❌ Error analyzing dataset:", error.message)
  }
}

// Run the analysis
analyzeMetroDataset()
