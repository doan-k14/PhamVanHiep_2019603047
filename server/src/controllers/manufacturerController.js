import Manufacturer from '../models/manufacturer.js'
import BaseController from './baseController.js'
import Car from '../models/car.js'
import mongoose from 'mongoose'

class ManufacturerController extends BaseController {
  /**
   * Constructor
   * @param {mongoose.Model} model
   */
  constructor(model, car) {
    super(model)
    this.car = car
  }

  customValidate = async (req) => {
    const { name, code } = req.body
    if (req.method === 'POST' || req.method === 'PUT') {
      const [foundEntityWidthCode, foundEntityWidthName] = await Promise.all([
        this.model.findOne({ code }).select({ _id: 1 }),
        this.model.findOne({ name }).select({ _id: 1 }),
      ])

      const errors = []

      let manufacturerId = ''
      if (req.method === 'PUT') {
        manufacturerId = req.params.id
      }

      if (
        (foundEntityWidthCode && manufacturerId === '') ||
        (foundEntityWidthCode && manufacturerId !== foundEntityWidthCode?._id?.toString())
      ) {
        errors.push({
          param: 'code',
          msg: 'Mã nhà sản xuất đã tồn tại',
        })
      }
      if (
        (foundEntityWidthName && manufacturerId === '') ||
        (foundEntityWidthName && manufacturerId !== foundEntityWidthName?._id?.toString())
      ) {
        errors.push({
          param: 'name',
          msg: 'Tên nhà sản xuất đã tồn tại',
        })
      }

      return errors
    }
    return []
  }

  getNewCode = async (_, res) => {
    try {
      const manufacturer = await this.model.find().sort({ code: -1 }).limit(1)

      if (manufacturer.length > 0) {
        const newestCar = manufacturer[0]
        const newestCarCode = newestCar.code

        const codeArr = newestCarCode.split('.')
        const codeNumber = parseInt(codeArr[1])

        const newCodeNumber = codeNumber + 1
        const newCode = `M.${newCodeNumber.toString().padStart(4, '0')}`
        return this.success(res, newCode)
      }

      return this.success(res, 'M.0001')
    } catch (error) {
      return this.serverError(res, error)
    }
  }

  getPaging = async (req, res) => {
    try {
      const query = req.query
      const filter = {}
      const sort = {}

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

      const pageIndex = parseInt(query.pageIndex)
      const pageSize = parseInt(query.pageSize)

      const limit = pageSize
      const skip = (pageIndex - 1) * pageSize

      const [manufacturers, numberManufacturers] = await Promise.all([
        this.model.aggregate([
          { $match: filter },
          {
            $lookup: {
              from: 'cars',
              localField: '_id',
              foreignField: 'manufacturer',
              as: 'products',
            },
          },
          {
            $project: {
              name: 1,
              code: 1,
              image: 1,
              numberProducts: { $size: '$products' },
            },
          },
          {
            $sort: sort,
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ]),
        this.model.countDocuments(filter),
      ])

      return this.success(res, {
        pageData: manufacturers,
        totalRecords: numberManufacturers,
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
        filterList2.push({
          manufacturer: id,
        })
      }
      const products = await this.car.find({ $or: filterList2 }).select({ _id: 1 })
      if (products.length > 0) {
        return res.sendStatus(400)
      }

      const foundEntities = await this.model.find({ $or: filterList }).select({ _id: 1 })
      if (foundEntities.length !== idList.length) {
        return res.sendStatus(404)
      }
      await this.model.deleteMany({ $or: filterList })
      return this.success(res)
    } catch (error) {
      return this.serverError(res, error)
    }
  }
}

const manufacturerController = new ManufacturerController(Manufacturer, Car)

export default manufacturerController
