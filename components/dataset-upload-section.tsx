const DatasetUploadSection = () => {
  return (
    <section className="bg-slate-800/90 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Dataset Overview</h2>

      <div className="mb-6">
        <h3 className="text-xl text-gray-300 mb-2">Key Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
            <p className="text-cyan-400 font-semibold">FID</p>
            <p className="text-slate-400 text-sm">Feature ID</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
            <p className="text-cyan-400 font-semibold">Trip_ID</p>
            <p className="text-slate-400 text-sm">Trip Identifier</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
            <p className="text-cyan-400 font-semibold">Metro_Name</p>
            <p className="text-slate-400 text-sm">Metro Line</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
            <p className="text-cyan-400 font-semibold">City</p>
            <p className="text-slate-400 text-sm">Metro City</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
            <p className="text-cyan-400 font-semibold">Source</p>
            <p className="text-slate-400 text-sm">Origin Station</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
            <p className="text-cyan-400 font-semibold">Destination</p>
            <p className="text-slate-400 text-sm">Target Station</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
            <p className="text-cyan-400 font-semibold">Date</p>
            <p className="text-slate-400 text-sm">Travel Date</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
            <p className="text-cyan-400 font-semibold">Time</p>
            <p className="text-slate-400 text-sm">Travel Time</p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
            <p className="text-cyan-400 font-semibold">Boardings</p>
            <p className="text-slate-400 text-sm">Passenger Count</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl text-gray-300 mb-2">Coverage Details</h3>
        <div className="bg-slate-700/30 p-4 rounded-lg">
          <h4 className="text-purple-400 font-semibold mb-3">Coverage Areas</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-cyan-400 font-medium">Hyderabad Metro</p>
              <p className="text-slate-300">19 Stations</p>
              <p className="text-slate-400 text-xs">Secunderabad to LB Nagar</p>
            </div>
            <div>
              <p className="text-cyan-400 font-medium">Delhi Metro</p>
              <p className="text-slate-300">Multiple Lines</p>
              <p className="text-slate-400 text-xs">Comprehensive Network</p>
            </div>
            <div>
              <p className="text-cyan-400 font-medium">Mumbai Metro</p>
              <p className="text-slate-300">Active Lines</p>
              <p className="text-slate-400 text-xs">Urban Coverage</p>
            </div>
            <div>
              <p className="text-cyan-400 font-medium">Bangalore Metro</p>
              <p className="text-slate-300">Expanding Network</p>
              <p className="text-slate-400 text-xs">Tech Hub Routes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DatasetUploadSection
