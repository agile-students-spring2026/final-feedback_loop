import { use, expect } from "chai";
import chaiHttp, { request } from "chai-http";
import sinon from "sinon";
import app from "../app.js";
import Options from "../models/Options.js";
import FeedbackResult from "../models/FeedbackResult.js";

use(chaiHttp);

describe("GET /options", () => {
  afterEach(() => sinon.restore());

  it("should return options data with status 200", async () => {
    await Options.deleteMany({});
    await Options.create({});
    const res = await request.execute(app).get("/options");
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("tagOption");
    expect(res.body).to.have.property("genreOption");
  });

  it("should return 500 if the query fails", async () => {
    sinon.stub(Options, "findOne").throws(new Error("boom"));
    const res = await request.execute(app).get("/options");
    expect(res).to.have.status(500);
    expect(res.body.error).to.equal("Read error");
  });
});

describe("GET /feedback-result/:id", () => {
  beforeEach(async () => {
    await FeedbackResult.deleteMany({});
    await FeedbackResult.create({ id: 1, submissions: [] });
  });

  it("should return the result with the given id", async () => {
    const res = await request.execute(app).get("/feedback-result/1");
    expect(res).to.have.status(200);
    expect(res.body.id).to.equal(1);
  });

  it("should return 404 if result does not exist", async () => {
    const res = await request.execute(app).get("/feedback-result/999");
    expect(res).to.have.status(404);
    expect(res.body.error).to.equal("Results not found");
  });
});
