const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler X",
  rocket: "Explorer IX 1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(latestFlightNumber, Object.assign(launch, {
    customer: ["ZTM", "NASA"],
    flightNumber: latestFlightNumber,
    upcoming: true,
    success: true
  }));
}

function existLaunchWithId(launchId) {
  return launches.has(launchId)
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted
}

module.exports = { getAllLaunches, addNewLaunch, existLaunchWithId, abortLaunchById };
