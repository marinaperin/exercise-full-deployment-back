import mongoose, { Schema, SchemaTypes, model } from "mongoose";
import Musician from "./musicianModel.js";

const schema = new Schema(
  {
    musician: {
      type: SchemaTypes.ObjectId,
      ref: "Musician",
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    poster: String,
    songs: [String],
    duration_seconds: Number,

    /*  slug: {
      type: String,
      trim: true,
      validate: {
        validator: async function (slug) {
          const Album = this.constructor;
          const isValid = !(await Album.exists({ slug }));
          return isValid;
        },
        message: (props) => `${props.value} is already in use.`,
      },
      index: true,
    }, */
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  const Album = this.constructor;
  if (this.isModified("musician")) {
    this.musicianModified = true;
    const oldAlbumId = this._id.toString();
    const oldAlbum = await Album.findById(oldAlbumId);
    if (oldAlbum) {
      await oldAlbum.removeFromMusician();
    }
  }
  next();
});

schema.post("save", async function (doc, next) {
  if (doc.musicianModified) {
    const newMusicianId = doc.musician?.toString();
    if (newMusicianId) {
      const newMusician = await Musician.findById(newMusicianId);
      if (newMusician) {
        await newMusician.addAlbum(doc._id);
      }
    }
    delete doc.musicianModified;
  }
  next();
});

/* schema.pre("save", async function (next) {
  if (!this.slug) {
    const slug =
      this.title.replaceAll(" ", "-").toLowerCase();
    const Album = this.constructor;
    let isSlugValid = false;
    let currentSlug = slug;
    let i = 1;
    while (!isSlugValid) {
      isSlugValid = !(await Album.exists({ slug: currentSlug }));
      if (!isSlugValid) {
        currentSlug = slug + "-" + i;
        i++;
      }
    }
    this.slug = currentSlug;
  }
  next();
}); */

schema.methods.changeMusician = async function (musicianId) {
  const Album = this.constructor;
  if(musicianId !== null){
    const oldMusician = await Musician.findById(this.musician);
    oldMusician.removeAlbum(this._id);
  }
  await Album.findByIdAndUpdate(this._id, { musician: musicianId });
  
};

schema.methods.removeFromMusician = async function () {
  if (this.musician) {
    const oldMusician = await Musician.findById(this.musician);
    if (oldMusician) {
      await oldMusician.removeAlbum(this._id.toString());
    }
  }
};

const Album = model("Album", schema);

export default Album;
