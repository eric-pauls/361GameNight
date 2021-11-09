import * as userFuncs from "./gameNightModel.mjs";
import express from "express";
import cors from "cors";
const app = express();
const PORT = 7777;
app.use(cors());
app.use(express.static("public"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//update all users in the request. if user does not exist, then create user
app.put("/users/:_id", (req, res) => {
  if (!req.body) {
    res.status(400).json({ Error: "No Players to add" });
  }
  const players = req.body.players;
  let promises = [];
  players.forEach((player) => {
    let promise = userFuncs.updateUser(player.name, player.total);
    promises.push(promise);
  });
  //promises [] is a array of pormises that i want to execute and resolve
  Promise.all(promises)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((e) => {
      res.status(400).json();
    });
});

//get user based on filter
/* app.get("/users", (req, res) => {
  const filter = req.query.name === undefined ? {} : { name: req.query.name };
  userFuncs
    .findUsers(filter, "", 0)
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ Error: "Request Failed" });
    });
}); */
// get user based on id
app.get("/users/:_id", (req, res) => {
  const userId = req.params._id;
  userFuncs
    .findUserBy_id(userId)
    .then((user) => {
      if (user !== null) {
        res.json(user);
      } else {
        res.status(404).json({ Error: "Resource not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ Error: "request failed" });
    });
});

//delete all players
app.delete("/users", (req, res) => {
  userFuncs.clearUsers().then((deletedCount) => {
    if (deletedCount >= 1) {
      res.status(204).send();
    } else {
      res.status(404).json({ Error: "Request Failed" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
