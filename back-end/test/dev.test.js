import { expect, use } from "chai";
import chaiHttp, { request } from "chai-http";
import app, { readJSON, writeJSON } from "../app.js";
import fs from "fs";

use(chaiHttp);

beforeEach(() => {
  fs.writeFileSync("projects.json", JSON.stringify([]));
  fs.writeFileSync("devlogs.json", JSON.stringify([]));
  fs.writeFileSync("feedback.json", JSON.stringify([]));
});


// dev dash & proj info
describe("DeveloperProjects", () => {
  it("GET /projects → returns array", async () => {
    const res = await request.execute(app).get("/projects");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("GET /projects/:id → returns {} when not found", async () => {
    const res = await request.execute(app).get("/projects/999");
    expect(res.body).to.deep.equal({});
  });

  it("GET /projects/:id → returns project when found", async () => {
    fs.writeFileSync("projects.json", JSON.stringify([{ id: 1, title: "Test" }]));

    const res = await request.execute(app).get("/projects/1");
    expect(res.body).to.have.property("id", 1);
  });

  it("DELETE /projects/:id → removes project", async () => {
    fs.writeFileSync("projects.json", JSON.stringify([{ id: 1 }]));

    await request.execute(app).delete("/projects/1");

    const data = JSON.parse(fs.readFileSync("projects.json"));
    expect(data).to.have.lengthOf(0);
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

  it("GET /devlogs/:projectId → returns logs", async () => {
    fs.writeFileSync("devlogs.json",
      JSON.stringify([{ id: 1, projectId: 1 }])
    );

    const res = await request.execute(app).get("/devlogs/1");
    expect(res.body).to.have.lengthOf(1);
  });

  it("GET /devlogs/:projectId → returns [] if none", async () => {
    const res = await request.execute(app).get("/devlogs/999");
    expect(res.body).to.be.an("array").that.is.empty;
  });
});



// utils
describe("Utils", () => {
  it("readJSON returns [] if missing", () => {
    expect(readJSON("fake.json")).to.deep.equal([]);
  });

  it("writeJSON writes correctly", () => {
    const data = [{ id: 1 }];
    writeJSON("temp.json", data);

    const result = JSON.parse(fs.readFileSync("temp.json"));
    expect(result).to.deep.equal(data);

    fs.unlinkSync("temp.json");
  });
});