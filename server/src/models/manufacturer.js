import mongoose from 'mongoose'
const { Schema } = mongoose

const manufacturerSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, maxLength: 256, required: true },
    image: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Manufacturer', manufacturerSchema)
