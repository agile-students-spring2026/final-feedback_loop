import { use, expect } from "chai";
import chaiHttp, { request } from "chai-http";
import sinon from "sinon";
import fs from "fs";
import app from "../app.js";

use(chaiHttp);

const fakeForms = [
  {
    id: 1,
    projectId: 10,
    title: "Test Feedback Form",
    questions: [],
  },
];

const fakeSummaries = [
  {
    id: 1,
    formId: 1,
    projectId: 10,
    title: "Test Feedback Form",
    status: "Draft",
    responseCount: 0,
  },
];

describe("POST /createfeedback", () => {
  beforeEach(() => {
    // readFile 被调用两次：先读 formFilePath，再读 summaryFilePath
    // 用 onFirstCall / onSecondCall 分别返回不同的假数据
    sinon
      .stub(fs, "readFile")
      .onFirstCall()
      .callsFake((path, encoding, cb) => cb(null, JSON.stringify(fakeForms)))
      .onSecondCall()
      .callsFake((path, encoding, cb) => cb(null, JSON.stringify(fakeSummaries)));

    sinon.stub(fs, "writeFile").callsFake((path, data, cb) => cb(null));
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a new feedback form and return 201", async () => {
    const newForm = {
      projectId: 10,
      title: "My Playtest Form",
      questions: [{ type: "short_answer", title: "What did you think?" }],
    };

    const res = await request.execute(app).post("/createfeedback").send(newForm);

    expect(res).to.have.status(201);
    expect(res.body.title).to.equal("My Playtest Form");
    expect(res.body.id).to.exist;
  });

  it("should return 400 if projectId is missing", async () => {
    const res = await request.execute(app)
      .post("/createfeedback")
      .send({ title: "No Project" });

    expect(res).to.have.status(400);
    expect(res.body.error).to.equal("projectId is required");
  });

  it("should return 400 if title is missing", async () => {
    const res = await request.execute(app)
      .post("/createfeedback")
      .send({ projectId: 10 });

    expect(res).to.have.status(400);
    expect(res.body.error).to.equal("title is required");
  });
});

describe("GET /createfeedback/:id", () => {
  beforeEach(() => {
    sinon.stub(fs, "readFile").callsFake((path, encoding, cb) => {
      cb(null, JSON.stringify(fakeForms));
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return the form with the given id", async () => {
    const res = await request.execute(app).get("/createfeedback/1");

    expect(res).to.have.status(200);
    expect(res.body.id).to.equal(1);
    expect(res.body.title).to.equal("Test Feedback Form");
  });

  it("should return 404 if form does not exist", async () => {
    const res = await request.execute(app).get("/createfeedback/999");

    expect(res).to.have.status(404);
    expect(res.body.error).to.equal("Form not found");
  });
});

describe("PATCH /createfeedback/:id/status", () => {
  beforeEach(() => {
    sinon.stub(fs, "readFile").callsFake((path, encoding, cb) => {
      cb(null, JSON.stringify(fakeSummaries));
    });
    sinon.stub(fs, "writeFile").callsFake((path, data, cb) => cb(null));
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update the status and return the updated summary", async () => {
    const res = await request.execute(app)
      .patch("/createfeedback/1/status")
      .send({ status: "Open" });

    expect(res).to.have.status(200);
    expect(res.body.status).to.equal("Open");
  });
});