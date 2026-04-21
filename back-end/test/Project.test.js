import { use, expect } from "chai";
import chaiHttp, { request } from "chai-http";
import app from "../app.js";
import Project from "../models/Project.js";
import Counter from "../models/Counter.js";
import { authHeader } from "./setup.js";

use(chaiHttp);

describe("POST /createprojects", () => {
  beforeEach(async () => {
    await Project.deleteMany({});
    await Counter.findByIdAndUpdate(
      "project",
      { $max: { seq: 1 } },
      { upsert: true }
    );
    await Project.create({
      id: 1,
      userId: "9999",
      title: "Test Game",
      description: "A test game",
      visibility: "public",
    });
  });

  it("should create a new project and return 201", async () => {
    const newProject = {
      title: "My New Game",
      description: "Fun platformer",
      genre: "Action",
      tags: ["singleplayer"],
      visibility: "public",
      uploadType: "url",
      uploadUrl: "https://example.com/game",
    };
    const res = await request
      .execute(app)
      .post("/createprojects")
      .set(authHeader())
      .send(newProject);
    expect(res).to.have.status(201);
    expect(res.body.title).to.equal("My New Game");
    expect(res.body.id).to.exist;
  });

  it("should assign a new unique id", async () => {
    const first = await request.execute(app)
      .post("/createprojects")
      .set(authHeader())
      .send({ title: "Another Game", visibility: "public" });
    expect(first).to.have.status(201);
    const second = await request.execute(app)
      .post("/createprojects")
      .set(authHeader())
      .send({ title: "Third Game", visibility: "public" });
    expect(second.body.id).to.be.greaterThan(first.body.id);
  });
});

describe("PUT /createprojects/:id", () => {
  beforeEach(async () => {
    await Project.deleteMany({});
    await Counter.findByIdAndUpdate(
      "project",
      { $max: { seq: 1 } },
      { upsert: true }
    );
    await Project.create({
      id: 1,
      userId: "9999",
      title: "Test Game",
      description: "A test game",
      visibility: "public",
    });
  });

  it("should update an existing project and return 200", async () => {
    const updates = { title: "Updated Game Title", description: "Now updated" };
    const res = await request
      .execute(app)
      .put("/createprojects/1")
      .set(authHeader())
      .send(updates);
    expect(res).to.have.status(200);
    expect(res.body.title).to.equal("Updated Game Title");
  });

  it("should return 404 if project does not exist", async () => {
    const res = await request.execute(app)
      .put("/createprojects/999")
      .set(authHeader())
      .send({ title: "Ghost Game" });
    expect(res).to.have.status(404);
  });
});
