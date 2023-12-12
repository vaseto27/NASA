const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {

  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  })

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /lauch", () => {

    // flightNumber: 100,
    // mission: "Kepler X",
    // rocket: "Explorer IX 1",
    // launchDate: new Date("December 27, 2030"),
    // target: "Kepler-442 b",
    // customer: ["ZTM", "NASA"],
    // upcoming: true,
    // success: true,
    const completeLaunchData = {
      mission: "Kepler X",
      rocket: "Explorer IX 1",
      target: "Kepler-442 b",
      launchDate: "December 27, 2030",
    };

    const laucnhDataWithoutTheDate = {
      mission: "Kepler X",
      rocket: "Explorer IX 1",
      target: "Kepler-442 b",
    };

    const launcDataWithInvalidDate = {
      mission: "Kepler X",
      rocket: "Explorer IX 1",
      target: "Kepler-442 b",
      launchDate: "zoot",
    };

    test("It should respond with 201 success", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(response.body).toMatchObject(laucnhDataWithoutTheDate);
      expect(responseDate).toBe(requestDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(laucnhDataWithoutTheDate)
        .expect("Content-type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launcDataWithInvalidDate)
        .expect("Content-type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
