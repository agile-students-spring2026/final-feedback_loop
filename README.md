# FeedbackLoop

## Product Vision Statement

Helping small game teams organize playtests, collect player feedback, and share development updates — all in one place.

Indie developers currently use multiple platforms (Discord, itch.io, social media) to interact with players, making feedback scattered and hard to track. FeedbackLoop simplifies this by providing structured tools for managing playtests and feedback.

---

## Description

FeedbackLoop provides a single platform for developers and players to interact efficiently. Key features include:

- **Project Pages** – Developers create project pages for their games with descriptions, updates, and playtest links.  
- **Custom Feedback Forms** – Developers design forms with ratings, questions, and optional comments.  
- **Browse & Join Playtests** – Players can find and participate in games that interest them.  
- **Feedback Organization** – Developers can tag, filter, and summarize feedback for analysis.  
- **Notifications & Following** – Players follow projects to receive updates, and trending projects are highlighted.  

### Example User Flow

1. Player registers an account and selects their role.  
2. Developer creates a project page with a playtest.  
3. Player browses and joins the playtest.  
4. Player submits feedback through a custom form.  
5. Developer views and organizes feedback to plan updates.

---

## Team Members

| Role | Name | GitHub | Email |
|------|------|--------|-------|
| Product Owner & Developer | Angela Gao | [@Xuan4781](https://github.com/Xuan4781) | ag8969@nyu.edu |
| Developer | Shutong Zhang | [@ShutongZhang2023](https://github.com/ShutongZhang2023) | sz3832@nyu.edu |
| Scrum Master & Developer | Jania Jones | [@janiajones](https://github.com/username3) | jaj9365@nyu.edu |
| Developer | Nicholas Michael | [@NMichael111](https://github.com/NMichael111) | ngm9720@nyu.edu |
| Developer | Felix Hall | [@fh2303](https://github.com/fh2303) | fh2303@nyu.edu |

---

## Project History & Contributing

*TBD*

To contribute to this project, please see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Building and Running

This project has two parts: a React front-end and an Express back-end. You need to run both at the same time in two separate terminals.

### 1. Clone the repo
```bash
git clone https://github.com/agile-students-spring2026/final-feedback_loop.git
cd final-feedback_loop
```

### 2. Set up environment variables
Each side of the project needs an `.env` file. Templates are provided as `example.env`. Copy them into place:
```bash
cp back-end/example.env back-end/.env
cp front-end/example.env front-end/.env
```
The default values in the templates will run the project locally as-is.

### 3. Start the back-end (terminal 1)
```bash
cd back-end
npm install
npm start
```
The back-end will run on `http://localhost:7002`.

### 4. Start the front-end (terminal 2)
```bash
cd front-end
npm install
npm start
```
The front-end will run on `http://localhost:3000` and proxies API calls to the back-end automatically.

### Running the tests
From the `back-end` folder:
```bash
npm test
```
To see code coverage:
```bash
npm run coverage
```

---

## Additional Documents

- See the [UX Design](UX-DESIGN.md) for the app map, wireframes, and prototype.  
- See the [Sprint Planning instructions](instructions-0d-sprint-planning.md) for requirements for each sprint.  
- See the [Front-End Development instructions](instructions-1-front-end.md) for the initial front-end implementation.  
- See the [Back-End Development instructions](instructions-2-back-end.md) for the initial back-end implementation.  
- See the [Database Integration instructions](instructions-3-database.md) for integrating a database into the back-end.  
- See the [Deployment instructions](instructions-4-deployment.md) for deploying the application.
