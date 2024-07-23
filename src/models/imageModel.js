import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  image_url: {
    type: String,
  },
  public_id: {
    type: String,
  },
  //timeStamps: true,
});

const Image = mongoose.models.imagaes || mongoose.model("imagaes", imageSchema);

export default Image;
