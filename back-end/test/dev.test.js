import { expect, use } from "chai";
import chaiHttp, { request } from "chai-http";
import app from "../app.js";
import Project from "../models/Project.js";
import DevLog from "../models/DevLog.js";
import { authHeader } from "./setup.js";

use(chaiHttp);

describe("DeveloperProjects", () => {
  before(async () => {
    await Project.deleteMany({});
    await Project.create({
      id: 1,
      userId: "9999",
      title: "Seed Game",
      description: "seed",
      visibility: "public",
    });
  });

  it("GET /projects → returns array for signed-in user", async () => {
    const res = await request.execute(app).get("/projects").set(authHeader());
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("GET /projects → 401 without auth", async () => {
    const res = await request.execute(app).get("/projects");
    expect(res).to.have.status(401);
  });

  it("GET /projects/:id → returns {} for unknown id", async () => {
    const res = await request.execute(app).get("/projects/999999");
    expect(res.body).to.deep.equal({});
  });

  it("GET /projects/:id → returns project when valid", async () => {
    const list = await request.execute(app).get("/projects").set(authHeader());
    if (list.body.length === 0) return;
    const id = list.body[0].id;
    const res = await request.execute(app).get(`/projects/${id}`);
    expect(res.body).to.have.property("id", id);
  });

  it("DELETE /projects/:id with invalid id → 404 or safe behavior", async () => {
    const res = await request
      .execute(app)
      .delete("/projects/999999")
      .set(authHeader());
    expect([200, 404]).to.include(res.status);
  });
});

describe("DeveloperLogs", () => {
  before(async () => {
    await Project.create({
      id: 9001,
      userId: "9999",
      title: "Test Game",
      description: "test",
      visibility: "public",
    });
  });

 it("POST /devlogs → creates log", async () => {
    const res = await request
      .execute(app)
      .post("/devlogs")
      .set(authHeader())
      .send({ projectId: 9001, notes: "test" });
    
    expect(res.body).to.have.property("projectId", 9001);
    expect(res.body).to.have.property("notes", "test");
    expect(res.body).to.have.property("teamMember", "tester");
  });

  it("GET /devlogs/:projectId → returns array", async () => {
    const res = await request.execute(app).get("/devlogs/1");
    expect(res.body).to.be.an("array");
  });

  it("GET /devlogs/:projectId → empty array for unknown", async () => {
    const res = await request.execute(app).get("/devlogs/999999");
    expect(res.body).to.be.an("array").that.is.empty;
  });
});
