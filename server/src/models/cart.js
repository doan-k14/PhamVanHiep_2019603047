import mongoose from 'mongoose'

const { Schema } = mongoose

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cars: [
      {
        car: { type: Schema.Types.ObjectId, ref: 'Car' },
        color: {
          colorName: { type: String },
          color: { type: String },
          image: { type: String },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Cart', cartSchema)
