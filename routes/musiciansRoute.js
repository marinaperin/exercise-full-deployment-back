import express from "express";
import Musician from "../models/musicianModel.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const musicians = await Musician.find();
    res.send(musicians);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const musician = await Musician.create(req.body);
    res.status(201).send(musician);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const musician = await Musician.findById(id).populate('albums', 'title -_id');
    if (!musician) {
      res.status(404).send("Not Found");
    } else {
      res.send(musician);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const musician = await Musician.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      context: "query",
    });
    res.send(musician);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Musician.findByIdAndDelete(id);
    res.send(`Musician with id ${id} deleted successfully`);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

export default router;
