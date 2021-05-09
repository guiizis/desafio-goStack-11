const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(req, res, next) {
  const { id } = req.params

  const repository = repositories.find(repo => repo.id == id)

  if (!repository) {
    res.status(400).json({ message: "error! element not found 😃" })
  } else {
    next()
  }
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const newRepositorie = {
    title,
    url,
    techs,
    likes: 0,
    id: uuid()
  }

  repositories.push(newRepositorie)

  return response.status(201).json(newRepositorie)

});

app.put("/repositories/:id", validateId, (request, response) => {

  const { id } = request.params
  const { title, techs, url } = request.body

  const repository = repositories.findIndex(repo => repo.id == id)

  if (title) {
    repositories[repository].title = title
  }
  if (techs) {
    repositories[repository].techs = techs
  }
  if (url) {
    repositories[repository].url = url
  }

  response.status(200).json(repositories[repository])

});

app.delete("/repositories/:id", validateId, (request, response) => {
  // TODO

  const { id } = request.params

  const repository = repositories.findIndex(repo => repo.id == id)

  repositories.splice(repository, 1)

  response.status(204).json({ message: "element deleted" })
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params

  const repository = repositories.findIndex(repo => repo.id == id)
  repositories[repository].likes = Number(repositories[repository].likes) + 1

  response.status(200).json(repositories[repository])

});

module.exports = app;
