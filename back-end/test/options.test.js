import { use, expect } from "chai";
import chaiHttp, { request } from "chai-http";
import sinon from "sinon";
import fs from "fs";
import app from "../app.js";
 
use(chaiHttp);
 
const fakeOptions = {
  tags: ["singleplayer", "multiplayer", "puzzle", "action"],
  genres: ["RPG", "Platformer", "Puzzle", "Action"],
};

const fakeResults = [
  {
    id: 1,
    formId: 1,
    projectId: 10,
    responses: [],
  },
];
 
describe("GET /options", () => {
  afterEach(() => {
    sinon.restore();
  });
 
  it("should return options data with status 200", async () => {
    sinon.stub(fs, "readFile").callsFake((path, encoding, cb) => {
      cb(null, JSON.stringify(fakeOptions));
    });
 
    const res = await request.execute(app).get("/options");
 
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("tags");
    expect(res.body).to.have.property("genres");
  });
 
  it("should return 500 if file cannot be read", async () => {
    sinon.stub(fs, "readFile").callsFake((path, encoding, cb) => {
      cb(new Error("File not found"), null);
    });
 
    const res = await request.execute(app).get("/options");
 
    expect(res).to.have.status(500);
    expect(res.body.error).to.equal("Read error");
  });
});


describe("GET /feedback-result/:id", () => {
  afterEach(() => {
    sinon.restore();
  });
 
  it("should return the result with the given id", async () => {
    sinon.stub(fs, "readFile").callsFake((path, encoding, cb) => {
      cb(null, JSON.stringify(fakeResults));
    });
 
    const res = await request.execute(app).get("/feedback-result/1");
 
    expect(res).to.have.status(200);
    expect(res.body.id).to.equal(1);
  });
 
  it("should return 404 if result does not exist", async () => {
    sinon.stub(fs, "readFile").callsFake((path, encoding, cb) => {
      cb(null, JSON.stringify(fakeResults));
    });
 
    const res = await request.execute(app).get("/feedback-result/999");
 
    expect(res).to.have.status(404);
    expect(res.body.error).to.equal("Results not found");
  });
 
  it("should return 500 if file cannot be read", async () => {
    sinon.stub(fs, "readFile").callsFake((path, encoding, cb) => {
      cb(new Error("File not found"), null);
    });
 
    const res = await request.execute(app).get("/feedback-result/1");
 
    expect(res).to.have.status(500);
    expect(res.body.error).to.equal("Failed to read results");
  });
});