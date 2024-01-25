import Album from "../models/albumModel.js";
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const albums = await Album.find().populate("musician", "art_name");
    res.send(albums);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const album = await Album.create(req.body);
    res.status(201).send(album);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id).populate("musician", "art_name");
    if (!album) {
      res.status(404).send("Not Found");
    } else {
      res.send(album);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
      context: "query",
    });
    res.send(album);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Album.findById(id);
    const musician = await Musician.findById(album.musician);
    if (musician) {
      await musician.removeAlbum(id);
    }
    await Album.findByIdAndDelete(id);
    res.send(`Album with ID ${id} was deleted successfully.`);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

export default router;
