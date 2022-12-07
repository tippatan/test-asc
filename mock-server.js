const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(express.json());
const urlPrefix = "/api/v1";

app.post(`${urlPrefix}/login-tts`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/login-tts.json", "utf8");
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/view-login`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/view-login.json", "utf8");
  return res.json(JSON.parse(data));
});

app.post(`${urlPrefix}/change-log-in-profile`, (req, res, next) => {
  const data = fs.readFileSync(
    "./mock-data/change-log-in-profile.json",
    "utf8"
  );
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/view-change-login-profile`, (req, res, next) => {
  const data = fs.readFileSync(
    "./mock-data/view-change-login-profile.json",
    "utf8"
  );
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/menu/:page`, (req, res, next) => {
  let data = {};
  if (req.params["page"] === "MAIN_MENU") {
    data = fs.readFileSync("./mock-data/main-menu.json", "utf8");
  } else if (req.params["page"] === "MODIFY_TT") {
    data = fs.readFileSync("./mock-data/modify-tt-menu.json", "utf8");
  }
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/menu-left/list`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/left-menu.json", "utf8");
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/tt-list/init-create-tt`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/init-create-tt.json", "utf8");
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/tt-list/:ttId`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/init-view-tt.json", "utf8");
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/tt-list/init-modify-tt`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/init-modify-tt.json", "utf8");
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/file/init-attach-file`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/init-attach-file.json", "utf8");
  return res.json(JSON.parse(data));
});

app.post(`${urlPrefix}/tt-list/find-service`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/find-service.json", "utf8");
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/tt-list/flow`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/flow.json", "utf8");
  return res.json(JSON.parse(data));
});

app.get(`${urlPrefix}/tt-list/find-column-sort/:page`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/find-column-sort.json", "utf8");
  return res.json(JSON.parse(data));
});

app.post(`${urlPrefix}/tt-list/init-find-tt-filter`, (req, res, next) => {
  const data = fs.readFileSync("./mock-data/init-find-tt-filter.json", "utf8");
  return res.json(JSON.parse(data));
});

app.post(`${urlPrefix}/tt-list/find-tt-in-active-box`, (req, res, next) => {
  const data = fs.readFileSync(
    "./mock-data/find-tt-in-active-box.json",
    "utf8"
  );
  return res.json(JSON.parse(data));
});

app.listen(3000, () => {
  console.log("Mock server listen on port 3000");
});
