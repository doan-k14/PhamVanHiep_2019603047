import express, { json, urlencoded } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Connect DB
import connectDB from './database/connect.js'

// Routers
import userRouter from './routers/userRouter.js'
import manufacturerRouter from './routers/manufacturerRouter.js'
import carRouter from './routers/carRouter.js'
import cartRouter from './routers/cartRouter.js'
import orderRouter from './routers/orderRouter.js'
import reviewRouter from './routers/reviewRouter.js'

dotenv.config()
const PORT = process.env.PORT || 3000
const MONGODB_URL = process.env.MONGODB_URL

const app = express()

connectDB(MONGODB_URL)

// Middleware
app.use(morgan('dev'))
app.use(urlencoded())
app.use(json())
app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost:3000', ['https://open-source-project.vercel.app']],
    credentials: true,
  })
)

// Use Routers
app.use('/api/v1/users', userRouter)
app.use('/api/v1/manufacturers', manufacturerRouter)
app.use('/api/v1/cars', carRouter)
app.use('/api/v1/carts', cartRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/', (req, res) => {
  res.json({
    message: 'Hello',
  })
})

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`)
})
