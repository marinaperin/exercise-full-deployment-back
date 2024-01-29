import mongoose, { Schema, SchemaTypes, model } from "mongoose";
import Album from "./albumModel.js";

const schema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    art_name: {
      type: String,
      required: true,
    },
    albums: {
      type: [SchemaTypes.ObjectId],
      ref: "Album",
    },
    poster: String,
    debut_year: Number,
    agency: String,
    country: String,
    band: String,
    members_number: Number,
    /* slug: {
      type: String,
      trim: true,
      validate: {
        validator: async function (slug) {
          const Musician = this.constructor;
          const isValid = !(await Musician.exists({ slug }));
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
  const Musician = this.constructor;
  if (this.isModified("albums")) {
    const oldMusicianId = this._id.toString();
    const oldMusician = await Musician.findById(oldMusicianId);
    if (oldMusician) {
      this.oldMusician = oldMusician.albums.map((a) => a._id.toString());
    }
  }
  next();
});

schema.post("save", async function (doc, next) {
  const { oldAlbums, _id } = doc;
  if (oldAlbums) {
    const newAlbums = doc.albums.map((a) => a._id.toString());
    oldAlbums.forEach(async (oldAlbumId) => {
      if (!newAlbums.includes(oldAlbumId)) {
        const album = await Album.findById(oldAlbumId);
        if (album) {
          await album.changeMusician(null);
          console.log(`Musician removed from Album ${oldAlbumId}`);
        }
      }
    });
    newAlbums.forEach(async (newAlbumId) => {
      if (!oldAlbums.includes(newAlbumId)) {
        const album = await Album.findById(newAlbumId);
        if (album) {
          await album.changeMusician(_id);
          console.log(`Musician added to Album ${newAlbumId}`);
        }
      }
    });
  }
  next();
});

/* schema.pre("save", async function (next) {
  if (!this.slug) {
    const slug = this.art_name.replaceAll(" ", "-").toLowerCase();
    const Musician = this.constructor;
    let isSlugValid = false;
    let currentSlug = slug;
    let i = 1;
    while (!isSlugValid) {
      isSlugValid = !(await Musician.exists({ slug: currentSlug }));
      if (!isSlugValid) {
        currentSlug = slug + "-" + i;
        i++;
      }
    }
    this.slug = currentSlug;
  }
  next();
}); */

schema.methods.removeAlbum = async function (albumId) {
  const Musician = this.constructor;
  const albumsIds = this.albums.map((a) => a._id.toString());
  if (albumsIds.includes(albumId)) {
    albumsIds.splice(albumsIds.indexOf(albumId), 1);
    await Musician.findByIdAndUpdate(this._id, { albums: albumsIds });
    console.log(
      `Album removed from Musician ${art_name ? art_name : this.first_name + ' ' + this.last_name}`
    );
  }
};

schema.methods.addAlbum = async function (albumId) {
  const albumsIds = this.albums.map((a) => a._id.toString());
  if (!albumsIds.includes(albumId)) {
    albumsIds.push(albumId);
    await Musician.findByIdAndUpdate(this._id, { albums: albumsIds });
    console.log(
      `New album added to Musician ${art_name ? art_name : this.first_name + ' ' + this.last_name}`
    );
  }
};

schema.methods.removeFromAlbums = async function () {
  const albumsIds = this.albums.map((a) => a._id.toString());
  albumsIds.forEach(async (id) => {
    const album = await Album.findById(id);
    await album.changeMusician(null);
  });
};

const Musician = model("Musician", schema);

export default Musician;
