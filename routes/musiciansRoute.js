import express from "express";
import Musician from "../models/musicianModel.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const musicians = await Musician.find().populate("albums", "title");
    res.send(musicians);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
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
  const { id } = req.params;
  try {
    const musician = await Musician.findById(id).populate("albums", "title");
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
  const { id } = req.params;
  try {
    const musician = await Musician.findById(id);
    Object.entries(req.body).forEach(([key, value]) => {
      musician[key] = value;
    });
    await musician.save();
    res.send(musician);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const musician = await Musician.findById(id);
    if (musician.albums) {
      await musician.removeFromAlbums();
    }

    await Musician.findByIdAndDelete(id);
    res.send(`Musician with id ${id} deleted successfully`);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

export default router;
