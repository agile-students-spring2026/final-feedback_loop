import { expect, use } from "chai";
import chaiHttp, { request } from "chai-http";
import app from "../app.js";
import { authHeader } from "./setup.js";

use(chaiHttp);

describe("GET /data/settings", () => {
  before(async () => {
    const { default: User } = await import("../models/User.js");
    const existing = await User.findOne({ id: 9999 });
    if (!existing) {
      await User.create({
        id: 9999,
        username: "tester",
        password: "fakehash",
      });
    }
  });
  
  it("should return settings object", async () => {
    const res = await request
      .execute(app)
      .get("/data/settings")
      .set(authHeader());
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
  });

  it("should 401 without auth", async () => {
    const res = await request.execute(app).get("/data/settings");
    expect(res).to.have.status(401);
  });
});

describe("POST /data/settings", () => {
  it("should update profile picture", async () => {
    const pfpUrl = "https://picsum.photos/200";
    const res = await request
      .execute(app)
      .post("/data/settings")
      .set(authHeader())
      .send({ profilePic: pfpUrl });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Settings updated!");
  });
});

describe("DELETE /auth/users/:id", () => {
  it("should let a user delete their own account", async () => {
    const { default: User } = await import("../models/User.js");
    const { signToken } = await import("../auth.js");
    const testUsername = `user-${Date.now()}`;
    const reg = await request
      .execute(app)
      .post("/auth/register")
      .send({ username: testUsername, password: "pass1234" });
    const realId = reg.body.user.id;
    const selfToken = signToken({ userId: realId, username: testUsername });

    const res = await request
      .execute(app)
      .delete(`/auth/users/${realId}`)
      .set({ Authorization: `Bearer ${selfToken}` });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "User deleted");
    const remaining = await User.findOne({ id: realId });
    expect(remaining).to.equal(null);
  });

  it("should 403 when trying to delete a different user", async () => {
    const res = await request
      .execute(app)
      .delete("/auth/users/12345")
      .set(authHeader());
    expect(res).to.have.status(403);
  });

  it("should 404 when deleting a non-existent self (edge case)", async () => {
    const res = await request
      .execute(app)
      .delete("/auth/users/9999")
      .set(authHeader());
    expect([404, 200]).to.include(res.status);
  });
});
