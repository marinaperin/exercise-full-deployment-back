import mongoose, { Schema, SchemaTypes, model } from "mongoose";

const schema = new Schema(
  {
    musician: {
      type: SchemaTypes.ObjectId,
      ref: 'Musician',
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    duration_seconds: {
      type: Number,
      required: true,
    },
    poster: String,
  },
  { timestamps: true }
);

const Album = model("Album", schema);

export default Album;
