import mongoose from 'mongoose'
const { Schema } = mongoose

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userCode: { type: String },
    userEmail: { type: String },
    userFullname: { type: String },
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    carCode: { type: String },
    carName: { type: String },
    comment: { type: String, required: true },
    score: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Review', reviewSchema)
