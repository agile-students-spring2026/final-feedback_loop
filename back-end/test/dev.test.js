import { expect, use } from "chai";
import chaiHttp, { request } from "chai-http";
import app, { readJSON, writeJSON } from "../app.js";
import fs from "fs";

use(chaiHttp);

// dev dash & proj info
describe("DeveloperProjects", () => {
  it("GET /projects → returns array", async () => {
    const res = await request.execute(app).get("/projects");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("GET /projects/:id → returns {} for unknown id", async () => {
    const res = await request.execute(app).get("/projects/999999");
    expect(res.body).to.deep.equal({});
  });

  it("GET /projects/:id → returns project when valid", async () => {
    const list = await request.execute(app).get("/projects");

    if (list.body.length === 0) return;

    const id = list.body[0].id;

    const res = await request.execute(app).get(`/projects/${id}`);
    expect(res.body).to.have.property("id", id);
  });

  it("DELETE /projects/:id with invalid id → 404 or safe behavior", async () => {
    const res = await request.execute(app).delete("/projects/999999");
    expect([200, 404]).to.include(res.status);
  });
});


// dev logs
describe("DeveloperLogs", () => {
  it("POST /devlogs → creates log", async () => {
    const payload = {
      projectId: 1,
      teamMember: "@user",
      date: "01/01/2024",
      notes: "test"
    };

    const res = await request.execute(app)
      .post("/devlogs")
      .send(payload);

    expect(res.body).to.include(payload);
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

