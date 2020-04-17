const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function valitadionId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "ID Invalido" });
  }

  const checkId = repositories.find((repository) => repository.id === id);
  if (!checkId) {
    return res.status(400).json({ error: "Repositorio não existente" });
  }

  return next();
}

app.use("/repositories/:id", valitadionId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const repository = repositories.find((repository) => repository.id === id);

  const data = {
    id,
    title: title ? title : repository.title,
    url: url ? url : repository.url,
    techs: techs ? techs : repository.techs,
    likes: repository.likes,
  };

  repositories[repositoryIndex] = data;

  return response.json(data);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const { title, url, techs, likes } = repositories.find(
    (repository) => repository.id === id
  );

  const countLikes = likes + 1;

  const data = {
    id,
    title,
    url,
    techs,
    likes: countLikes,
  };

  repositories[repositoryIndex] = data;

  return response.json(data);
});

module.exports = app;
