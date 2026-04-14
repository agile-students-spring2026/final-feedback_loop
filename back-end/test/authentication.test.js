import { expect, use } from "chai";
import chaiHttp, { request } from "chai-http";
import app from "../app.js";

use(chaiHttp);

let testEmail = `user-${Date.now()}@test.com`;
const testPass = "pass123";

describe("POST /auth/register", () => {
  it("should successfully register new user", async () => {
    const data = {
      email: testEmail,
      password: testPass,
    };

    const res = await request.execute(app).post("/auth/register").send(data);
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("success", true);
    expect(res.body).to.have.property("message", "Registration successful!");
  });

  it("should fail to register if email is already taken", async () => {
    const data = {
      email: testEmail,
      password: "notpass123",
    };
    const res = await request.execute(app).post("/auth/register").send(data);
    expect(res).to.have.status(409);
    expect(res.body).to.have.property("success", false);
    expect(res.body).to.have.property("message", "Email is taken");
  });
});

describe("POST /auth/login", () => {
  it("should login successfully with correct credentials", async () => {
    const data = {
      email: testEmail,
      password: testPass,
    };

    const res = await request.execute(app).post("/auth/login").send(data);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("email", testEmail);
    expect(res.body.user).to.not.have.property("password");
  });

  it("should fail with wrong password", async () => {
    const data = {
      email: testEmail,
      password: "notpass123",
    };
    const res = await request.execute(app).post("/auth/login").send(data);
    expect(res).to.have.status(401);
    expect(res.body).to.have.property("success", false);
  });
});
