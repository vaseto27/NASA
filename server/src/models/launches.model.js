const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;


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


saveLaunch(launch)


async function getAllLaunches() {
  return await launchesDataBase.find({}, {'_id': 0, '__v': 0});
}

async function saveLaunch(launch) {

  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if(!planet) {
    throw new Error('No matching planet found')
  }

  await launchesDataBase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  })
}

async function scheduleNewLaunc(launch) {
  const newFightNumber = await getLatestsFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    customer: ["ZTM", "NASA"],
    flightNumber: newFightNumber,
    upcoming: true,
    success: true
  })

  await saveLaunch(newLaunch)
}

async function existLaunchWithId(launchId) {
  return await launchesDataBase.findOne({flightNumber: launchId})
}

async function getLatestsFlightNumber() {
  const latestLaunch = await launchesDataBase.findOne({}).sort('-flightNumber')
  if(!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }
  return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDataBase.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  return aborted.modifiedCount === 1;
}

module.exports = { getAllLaunches, scheduleNewLaunc, existLaunchWithId, abortLaunchById };
