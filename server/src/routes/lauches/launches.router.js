const express = require("express");
const { httpGetAllLaunches, httpAddNewLaunch, httpAbourtLaunch } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbourtLaunch)

module.exports = launchesRouter;
