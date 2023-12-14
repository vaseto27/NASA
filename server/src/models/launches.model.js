const axios = require("axios");

const launchesDataBase = require("./launches.mongo");
const planets = require("./planets.mongo");

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches(skip, limit) {
  return await launchesDataBase.find({}, { _id: 0, __v: 0 }).sort({flightNumber: 1}).skip(skip).limit(limit);
}

async function saveLaunch(launch) {
  await launchesDataBase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunc(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }
  const newFightNumber = (await getLatestsFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    customer: ["ZTM", "NASA"],
    flightNumber: newFightNumber,
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

async function existLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function papulateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
      ],
    },
  });

  if(response.staus !== 200) {
    console.log('Problem downloading laucnh data');
    throw new Error('Launch data download failed!')
  }

  const launchDocs = response.data.docs;
  for(const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers']
    })
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers
    }
    console.log(`${launch.flightNumber}`)
    await saveLaunch(launch)
  }

}

async function loadLaucnData() {
  const firstLaucnh  = await findLaunch({flightNumber: 1, rocket: 'Falcon 1', mission: 'FalconSat'})
  if(firstLaucnh) {
    console.log('Alreaydy loaded')
  } else {
    await papulateLaunches()
  }
  

}

async function getLatestsFlightNumber() {
  const latestLaunch = await launchesDataBase.findOne({}).sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function findLaunch(filter) {
  return await launchesDataBase.findOne(filter)
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDataBase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunc,
  existLaunchWithId,
  abortLaunchById,
  loadLaucnData,
};
