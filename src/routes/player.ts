import { Router } from "express";
const playerRouter = Router();
playerRouter.get("/", (req, res) => {
  res.render("player", { title: "Player" });
}
);
playerRouter.get("/play", (req, res) => {
  res.render("play", { title: "Play" });
}
);     
export default playerRouter;