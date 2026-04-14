import { expect, use } from "chai";
import chaiHttp, { request } from "chai-http";
import app from "../app.js";

use(chaiHttp);

describe("GET /data/settingsdata", () => {
  it("should return settings object", async () => {
    const res = await request.execute(app).get("/data/settingsdata");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
  });
});

describe("POST /data/settingsdata", () => {
  it("should update profile picture", async () => {
    const pfpUrl = "https://picsum.photos/200";
    const data = { profilePic: pfpUrl };
    const res = await request
      .execute(app)
      .post("/data/settingsdata")
      .send(data);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Profile pic updated!");
  });
});

describe("DELETE /auth/users/:id", () => {
  it("should remove user credentials", async () => {
    let testEmail = `user-${Date.now()}@test.com`;
    const data = { email: testEmail, password: "pass1234" };

    const resId = await request.execute(app).post("/auth/register").send(data);

    const realId = resId.body.user?.id || Date.now();

    const res = await request.execute(app).delete(`/auth/users/${realId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "User deleted");
  });

  it("should return 404 for user not in system", async () => {
    const res = await request.execute(app).delete("/auth/users/09090998098");
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "User not found");
  });
});
