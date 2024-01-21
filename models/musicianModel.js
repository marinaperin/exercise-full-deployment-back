import mongoose, { Schema, SchemaTypes, model } from "mongoose";

const schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    artName: {
      type: String,
      required: true,
    },
    albums: {
      type: [SchemaTypes.ObjectId],
      ref: 'Album',
    },
    poster: String,
  },
  { timestamps: true }
);

const Musician = model("Musician", schema);

export default Musician;
