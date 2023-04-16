import mongoose from 'mongoose'

const { Schema } = mongoose

const carSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, maxLength: 256, required: true },
    manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
    image: { type: String },
    number: { type: Number, default: 0 },
    price: { type: Number, required: true },
    gallery: [{ type: String, default: '' }],
    colors: [
      {
        colorName: { type: String, default: '' },
        color: { type: String, default: '' },
        images: [{ type: String, default: '' }],
      },
    ],
    cylinderCapacity: { type: Number, default: 0 },
    fuelCapacity: { type: Number, default: 0 },
    consumption: { type: Number, default: 0 },
    size: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    detail: {
      numberOfSeats: { type: Number, default: 0 },
      weight: { type: Number, default: 0 },
      engineType: { type: String, default: '' },
      energySystem: { type: String, default: '' },
      frontBrake: { type: Number, default: 0 },
      backBrake: { type: Number, default: 0 },
      powerSupport: { type: Boolean, default: false },
      eco: { type: Boolean, default: false },
      warningSystem: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Car', carSchema)
