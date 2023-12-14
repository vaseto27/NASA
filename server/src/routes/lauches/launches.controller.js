const {
  getAllLaunches,
  scheduleNewLaunc,
  existLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

const {getPagination} = require('../../services/query')

async function httpGetAllLaunches(req, res) {
  const {skip, limit} = getPagination(req.query)
  const launches = await getAllLaunches(skip, limit)
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  await scheduleNewLaunc(launch);
  return res.status(201).json(launch);
}

async function httpAbourtLaunch(req, res) {
  const launchId = +req.params.id;

  const existLaunch = await existLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }

  const aborted = abortLaunchById(launchId);
  if(!aborted) {
    return res.status(400).json({
      error: "Launch not aborted"
    })
  }
  return res.status(200).json({
    ok: true
  });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbourtLaunch };
