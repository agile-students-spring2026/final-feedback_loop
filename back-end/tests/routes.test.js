import { expect } from "chai";
import app from "../app.js";
import fs from "fs";

const PORT = 4010;
let server;

before((done) => {
  server = app.listen(PORT, done);
});

after(() => {
  server.close();
});

beforeEach(() => {
  fs.writeFileSync("projects.json", JSON.stringify([
    { id: 1, name: "Test Project", title: "Test Project", genre: "Action", status: "PUBLISHED", visibility: "public" },
    { id: 2, name: "Draft Game", title: "Draft Game", genre: "RPG", status: "DRAFT", visibility: "draft" },
  ]));
  fs.writeFileSync("devlogs.json", JSON.stringify([
    { id: 1, projectId: 1, author: "@tester", content: "test log" },
  ]));
  fs.writeFileSync("feedback.json", JSON.stringify([
    { id: 1, projectId: 1, title: "Round 1", status: "Ongoing", responses: 5 },
  ]));
  fs.writeFileSync("playtests.json", JSON.stringify([]));
});

const get = async (path) => {
  const res = await fetch(`http://localhost:${PORT}${path}`);
  const body = await res.json();
  return { status: res.status, body };
};

const post = async (path, data) => {
  const res = await fetch(`http://localhost:${PORT}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  return { status: res.status, body };
};

const del = async (path) => {
  const res = await fetch(`http://localhost:${PORT}${path}`, {
    method: "DELETE",
  });
  const body = await res.json();
  return { status: res.status, body };
};

describe("GET /hello", () => {
  it("returns a working message", async () => {
    const res = await get("/hello");
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("server is working");
  });
});

describe("Projects routes", () => {
  it("GET /projects returns an array", async () => {
    const res = await get("/projects");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.greaterThan(0);
  });

  it("GET /projects/:id returns a single project", async () => {
    const res = await get("/projects/1");
    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(1);
  });

  it("GET /projects/:id returns {} for missing id", async () => {
    const res = await get("/projects/9999");
    expect(res.body).to.deep.equal({});
  });

  it("DELETE /projects/:id responds with success", async () => {
    const res = await del("/projects/1");
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Deleted successfully");
  });
});

describe("Devlogs routes", () => {
  it("GET /devlogs/:projectId returns filtered logs", async () => {
    const res = await get("/devlogs/1");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    res.body.forEach((log) => expect(String(log.projectId)).to.equal("1"));
  });

  it("POST /devlogs creates a new log", async () => {
    const res = await post("/devlogs", {
      projectId: 1,
      author: "@test",
      date: "04/07/2026",
      content: "Test log",
    });
    expect(res.body.content).to.equal("Test log");
  });
});

describe("Feedback routes", () => {
  it("GET /feedback/:projectId returns an array", async () => {
    const res = await get("/feedback/1");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});

describe("Games routes", () => {
  it("GET /games returns an array", async () => {
    const res = await get("/games");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("GET /games/:id returns a single game", async () => {
    const res = await get("/games/1");
    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(1);
  });
});

describe("Following routes", () => {
  it("GET /following returns followed games", async () => {
    const res = await get("/following");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});

describe("Notifications routes", () => {
  it("GET /notifications returns an array", async () => {
    const res = await get("/notifications");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("DELETE /notifications/:id dismisses", async () => {
    const res = await del("/notifications/1");
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Notification dismissed");
  });
});

describe("Updates routes", () => {
  it("GET /updates returns an array", async () => {
    const res = await get("/updates");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});

describe("Playtests routes", () => {
  it("GET /playtests returns an array", async () => {
    const res = await get("/playtests");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});

describe("Comments routes", () => {
  it("GET /comments returns an array", async () => {
    const res = await get("/comments");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("POST /comments creates a new comment", async () => {
    const res = await post("/comments", { player: "Player X", text: "Nice" });
    expect(res.status).to.equal(201);
    expect(res.body.text).to.equal("Nice");
  });
});

describe("Reports routes", () => {
  it("POST /reports creates a report", async () => {
    const res = await post("/reports", { reason: "spam" });
    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal("received");
  });
});
