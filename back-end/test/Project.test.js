import { use, expect } from "chai";
import chaiHttp, { request } from "chai-http";
import sinon from "sinon";
import fs from "fs";
import app from "../app.js";

use(chaiHttp);

const fakeProjects = [
  {
    id: 1,
    title: "Test Game",
    description: "A test game",
    genre: "Puzzle",
    tags: [],
    visibility: "public",
  },
];

describe("POST /createprojects", () => {
  beforeEach(() => {
    sinon.stub(fs, "readFile").callsFake((path, encoding, cb) => {
      cb(null, JSON.stringify(fakeProjects));
    });
    sinon.stub(fs, "writeFile").callsFake((path, data, cb) => {
      cb(null);
    });
  });

  afterEach(() => {
    sinon.restore();
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

    const res = await request.execute(app).post("/createprojects").send(newProject);

    expect(res).to.have.status(201);
    expect(res.body.title).to.equal("My New Game");
    expect(res.body.id).to.exist;
  });

  it("should assign an id greater than existing max id", async () => {
    const res = await request.execute(app)
      .post("/createprojects")
      .send({ title: "Another Game", visibility: "public" });

    expect(res).to.have.status(201);
    expect(res.body.id).to.equal(2);
  });
});

describe("PUT /createprojects/:id", () => {
  beforeEach(() => {
    sinon.stub(fs, "readFile").callsFake((path, encoding, cb) => {
      cb(null, JSON.stringify(fakeProjects));
    });
    sinon.stub(fs, "writeFile").callsFake((path, data, cb) => {
      cb(null);
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update an existing project and return 200", async () => {
    const updates = {
      title: "Updated Game Title",
      description: "Now updated"
    };

    const res = await request.execute(app).put("/createprojects/1").send(updates);

    expect(res).to.have.status(200);
    expect(res.body.title).to.equal("Updated Game Title");
  });

  it("should return 404 if project does not exist", async () => {
    const res = await request.execute(app)
      .put("/createprojects/999")
      .send({ title: "Ghost Game" });

    expect(res).to.have.status(404);
  });
});