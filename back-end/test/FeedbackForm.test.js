import { use, expect } from "chai";
import chaiHttp, { request } from "chai-http";
import app from "../app.js";
import FeedbackForm from "../models/FeedbackForm.js";
import FeedbackSummary from "../models/FeedbackSummary.js";
import FeedbackResult from "../models/FeedbackResult.js";
import Project from "../models/Project.js";
import Counter from "../models/Counter.js";
import { authHeader } from "./setup.js";

use(chaiHttp);

describe("POST /createfeedback", () => {
  beforeEach(async () => {
    await Promise.all([
      FeedbackForm.deleteMany({}),
      FeedbackSummary.deleteMany({}),
      FeedbackResult.deleteMany({}),
      Project.deleteMany({}),
    ]);
    await Project.create({ id: 10, userId: "9999", title: "Test Project" });
    await Counter.findByIdAndUpdate(
      "feedbackForm",
      { $max: { seq: 1 } },
      { upsert: true }
    );
    await FeedbackForm.create({
      id: 1,
      projectId: 10,
      title: "Test Feedback Form",
      questions: [],
    });
    await FeedbackSummary.create({
      id: 1,
      formId: 1,
      projectId: 10,
      title: "Test Feedback Form",
      status: "Draft",
      responseCount: 0,
    });
    await FeedbackResult.create({ id: 1, submissions: [] });
  });

  it("should create a new feedback form and return 201", async () => {
    const newForm = {
      projectId: 10,
      title: "My Playtest Form",
      questions: [{ type: "short_answer", title: "What did you think?" }],
    };
    const res = await request
      .execute(app)
      .post("/createfeedback")
      .set(authHeader())
      .send(newForm);
    expect(res).to.have.status(201);
    expect(res.body.title).to.equal("My Playtest Form");
    expect(res.body.id).to.exist;
  });

  it("should return 400 if projectId is missing", async () => {
    const res = await request.execute(app)
      .post("/createfeedback")
      .set(authHeader())
      .send({ title: "No Project" });
    expect(res).to.have.status(400);
    expect(res.body.error).to.equal("projectId is required");
  });

  it("should return 400 if title is missing", async () => {
    const res = await request.execute(app)
      .post("/createfeedback")
      .set(authHeader())
      .send({ projectId: 10 });
    expect(res).to.have.status(400);
    expect(res.body.error).to.equal("title is required");
  });
});

describe("GET /createfeedback/:id", () => {
  beforeEach(async () => {
    await FeedbackForm.deleteMany({});
    await FeedbackForm.create({
      id: 1,
      projectId: 10,
      title: "Test Feedback Form",
      questions: [],
    });
  });

  it("should return the form with the given id", async () => {
    const res = await request.execute(app).get("/createfeedback/1");
    expect(res).to.have.status(200);
    expect(res.body.id).to.equal(1);
    expect(res.body.title).to.equal("Test Feedback Form");
  });

  it("should return 404 if form does not exist", async () => {
    const res = await request.execute(app).get("/createfeedback/1000");
    expect(res).to.have.status(404);
    expect(res.body.error).to.equal("Form not found");
  });
});

describe("PATCH /createfeedback/:id/status", () => {
  beforeEach(async () => {
    await Promise.all([
      FeedbackSummary.deleteMany({}),
      Project.deleteMany({}),
    ]);
    await Project.create({ id: 10, userId: "9999", title: "Test Project" });
    await FeedbackSummary.create({
      id: 1,
      formId: 1,
      projectId: 10,
      title: "Test Feedback Form",
      status: "Draft",
      responseCount: 0,
    });
  });

  it("should update the status and return the updated summary", async () => {
    const res = await request.execute(app)
      .patch("/createfeedback/1/status")
      .set(authHeader())
      .send({ status: "Open" });
    expect(res).to.have.status(200);
    expect(res.body.status).to.equal("Open");
  });
});

describe("POST /feedback-result/:formId", () => {
  beforeEach(async () => {
    await Promise.all([
      FeedbackSummary.deleteMany({}),
      FeedbackResult.deleteMany({}),
    ]);
    await FeedbackSummary.create({
      id: 1,
      formId: 1,
      projectId: 10,
      title: "Test Feedback Form",
      status: "Active",
      responseCount: 0,
    });
    await FeedbackResult.create({ id: 1, submissions: [] });
  });

  it("should append a submission and increment responseCount", async () => {
    const res = await request
      .execute(app)
      .post("/feedback-result/1")
      .set(authHeader())
      .send({ answers: { 123: "great game" } });
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("success", true);

    const result = await FeedbackResult.findOne({ id: 1 }).lean();
    expect(result.submissions).to.have.lengthOf(1);
    expect(result.submissions[0]).to.have.property("username");
    expect(result.submissions[0].answers).to.deep.equal({ 123: "great game" });

    const summary = await FeedbackSummary.findOne({ formId: 1 }).lean();
    expect(summary.responseCount).to.equal(1);
  });

  it("should reject submissions when form is not Active", async () => {
    await FeedbackSummary.updateOne({ formId: 1 }, { status: "Closed" });
    const res = await request
      .execute(app)
      .post("/feedback-result/1")
      .set(authHeader())
      .send({ answers: {} });
    expect(res).to.have.status(400);
  });

  it("should 404 when form does not exist", async () => {
    const res = await request
      .execute(app)
      .post("/feedback-result/999")
      .set(authHeader())
      .send({ answers: {} });
    expect(res).to.have.status(404);
  });

  it("should 400 if answers missing", async () => {
    const res = await request
      .execute(app)
      .post("/feedback-result/1")
      .set(authHeader())
      .send({});
    expect(res).to.have.status(400);
  });

  it("should 401 without auth", async () => {
    const res = await request
      .execute(app)
      .post("/feedback-result/1")
      .send({ answers: {} });
    expect(res).to.have.status(401);
  });
});
