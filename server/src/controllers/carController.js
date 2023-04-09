import BaseController from './baseController.js'
import Car from '../models/car.js'
import Manufacturer from '../models/manufacturer.js'
import Order from '../models/order.js'
import mongoose from 'mongoose'

class CarController extends BaseController {
  constructor(model, manufacturer, order) {
    super(model)
    this.manufacturer = manufacturer
    this.order = order
  }

  getCarsByManufacturer = async (req, res) => {
    try {
      const manufacturerId = req.query.manufacturer
      if (!manufacturerId) {
        return this.clientError(res, [
          {
            param: 'manufacturer',
            msg: 'Bắt buộc điền mã nhà sản xuất',
          },
        ])
      }

      if (!mongoose.Types.ObjectId.isValid(manufacturerId)) {
        return this.clientError(res, [
          {
            param: 'manufacturer',
            msg: 'Mã nhà sản xuất không đúng định dạng',
          },
        ])
      }

      const cars = await this.model.find({ manufacturer: manufacturerId })
      return this.success(res, cars)
    } catch (error) {
      this.serverError(res, error)
    }
  }

  getCarsForHome = async (req, res) => {
    try {
      const manufacturers = await this.manufacturer.find().limit(3)
      const result = []

      const manufacturersLength = manufacturers.length
      for (let index = 0; index < manufacturersLength; index++) {
        const mnu = manufacturers[index]
        const item = {
          _id: mnu._id,
          name: mnu.name,
          products: [],
        }
        const products = await this.model.find({ manufacturer: mnu._id }).limit(4)
        item.products = [...products]
        result.push(item)
      }

      const newestProducts = await this.model.find({}).sort({ createdAt: -1 }).limit(8)

      return this.success(res, {
        newestProducts,
        productByManufacturer: result,
      })
    } catch (error) {
      this.serverError(res, error)
    }
  }

  customValidate = async (req) => {
    const { name, manufacturer, code } = req.body
    const errors = []
    if (req.method === 'POST' || req.method === 'PUT') {
      const [foundCarWidthCode, foundCarWidthName] = await Promise.all([
        this.model.findOne({ code }).select({ _id: 1 }),
        this.model.findOne({ name }).select({ _id: 1 }),
      ])

      let productId = ''

      if (req.method === 'PUT') {
        productId = req.params.id
      }

      if (
        (foundCarWidthCode && productId === '') ||
        (foundCarWidthCode && productId !== foundCarWidthCode?._id?.toString())
      ) {
        errors.push({
          param: 'name',
          msg: 'Mã sản phẩm trùng',
        })
      }

      if (
        (foundCarWidthName && productId === '') ||
        (foundCarWidthName && productId !== foundCarWidthName?._id?.toString())
      ) {
        errors.push({
          param: 'name',
          msg: 'Tên sản phẩm trùng',
        })
      }
    }

    const foundManufacturer = await this.manufacturer.findOne({ _id: manufacturer })
    if (!foundManufacturer) {
      errors.push({
        param: 'manufacturer',
        msg: 'Mã nhà sản xuất không tồn tại',
      })
    }

    return errors
  }

  getNewCode = async (_, res) => {
    try {
      const cars = await this.model.find().sort({ code: -1 }).limit(1)

      if (cars.length > 0) {
        const newestCar = cars[0]
        const newestCarCode = newestCar.code

        const codeArr = newestCarCode.split('.')
        const codeNumber = parseInt(codeArr[1])

        const newCodeNumber = codeNumber + 1
        const newCode = `P.${newCodeNumber.toString().padStart(4, '0')}`
        return this.success(res, newCode)
      }

      return this.success(res, 'P.0001')
    } catch (error) {
      return this.serverError(res, error)
    }
  }

  get = async (req, res) => {
    try {
      const car = await this.model.findOne({ _id: req.params.id }).populate('manufacturer')

      if (!car) {
        return this.notFound(res)
      }

      return this.success(res, car)
    } catch (error) {
      return this.serverError(res, error)
    }
  }

  getPaging = async (req, res) => {
    try {
      const query = req.query
      const filter = {}
      const sort = {}
      if (query.manufacturer) {
        if (mongoose.Types.ObjectId.isValid(query.manufacturer)) {
          filter.manufacturer = query.manufacturer
        }
      }
      if (query.sort) {
        const sortArr = query.sort.split('|')
        const key = sortArr[0]
        const direction = sortArr[1]
        sort[key] = parseInt(direction)
      }

      if (query.searchText) {
        const myRegex = { $regex: `.*${query.searchText}.*`, $options: 'i' }
        filter.$or = [
          {
            code: myRegex,
          },
          {
            name: myRegex,
          },
        ]
      }

      if (!query.pageIndex || !query.pageSize) {
        const [cars, numberCars] = await Promise.all([
          this.model.find(filter).populate('manufacturer').sort(sort),
          this.model.countDocuments(filter),
        ])

        return this.success(res, {
          pageData: cars,
          totalRecords: numberCars,
        })
      }

      const pageIndex = parseInt(query.pageIndex)
      const pageSize = parseInt(query.pageSize)

      const limit = pageSize
      const skip = (pageIndex - 1) * pageSize

      const [cars, numberCars] = await Promise.all([
        this.model.find(filter).populate('manufacturer').sort(sort).skip(skip).limit(limit),
        this.model.countDocuments(filter),
      ])

      return this.success(res, {
        pageData: cars,
        totalRecords: numberCars,
      })
    } catch (error) {
      return this.serverError(res, error)
    }
  }

  delete = async (req, res) => {
    try {
      const { id: idListStr } = req.params
      const idList = idListStr.split(';')
      const filterList = []
      const filterList2 = []
      const idListCount = idList.length
      for (let index = 0; index < idListCount; index++) {
        const id = idList[index]
        filterList.push({
          _id: id,
        })
        filterList2.push(id)
      }

      const orderList = await this.order.find({
        cars: { $elemMatch: { _id: { $in: filterList2 } } },
        status: { $in: [1, 2] },
      })

      if (orderList.length > 0) {
        return res.sendStatus(400)
      }

      const foundEntities = await this.model.find({ $or: filterList }).select({ _id: 1 })
      if (foundEntities.length !== idList.length) {
        return res.sendStatus(404)
      }
      await this.model.deleteMany({ $or: filterList })
      return this.success(res)
    } catch (error) {
      console.log(error)
      return this.serverError(res, error)
    }
  }
}

const carController = new CarController(Car, Manufacturer, Order)

export default carController
