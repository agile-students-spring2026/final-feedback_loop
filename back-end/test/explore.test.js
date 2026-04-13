import { expect } from "chai";
import chaiHttp, { request } from "chai-http";
import { use } from "chai";
import app from "../app.js";

use(chaiHttp);

// playerexplore
describe("PlayerExplore", () => {
  it("GET /explore/projects → 200 and returns an array", async () => {
    const res = await request.execute(app).get("/explore/projects");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("GET /explore/projects → only published or public projects are returned", async () => {
    const res = await request.execute(app).get("/explore/projects");
    expect(res).to.have.status(200);
    res.body.forEach((p) => {
      expect(["published", "public"]).to.include(p.visibility);
    });
  });

  it("GET /playtests → 200 and returns an array", async () => {
    const res = await request.execute(app).get("/playtests");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("POST /playtests without projectId → 400 bad request", async () => {
    const res = await request.execute(app).post("/playtests").send({});
    expect(res).to.have.status(400);
    expect(res.body).to.have.property("error");
  });

  it("POST /playtests with non-existent projectId → 404", async () => {
    const res = await request.execute(app).post("/playtests").send({ projectId: 99999999 });
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error");
  });
});

//playtest
describe("PlayerPlaytest", () => {
  it("GET /playtests → 200 and returns an array", async () => {
    const res = await request.execute(app).get("/playtests");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("GET /feedback/:projectId → 200 and returns an array", async () => {
    const res = await request.execute(app).get("/feedback/1");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("GET /feedback/:projectId with unknown id → 200 and empty array", async () => {
    const res = await request.execute(app).get("/feedback/99999999");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array").that.is.empty;
  });

  it("DELETE /playtests/:projectId with unknown id → 404", async () => {
    const res = await request.execute(app).delete("/playtests/99999999");
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error");
  });
});

// projectdetails
describe("ProjectDetails", () => {
  it("GET /explore/projects/:id with unknown id → 404", async () => {
    const res = await request.execute(app).get("/explore/projects/99999999");
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error");
  });

  it("GET /explore/projects/:id with valid id → 200 and project object", async () => {
    const listRes = await request.execute(app).get("/explore/projects");
    expect(listRes).to.have.status(200);

    if (listRes.body.length === 0) return;

    const firstId = listRes.body[0].id;
    const res = await request.execute(app).get(`/explore/projects/${firstId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("id", firstId);
    expect(res.body).to.have.property("title");
  });
});