import React, { useEffect, useState } from 'react'
import baseApi from '../../api/BaseApi'
import Head from 'next/head'
import Link from 'next/link'
import Slide from '../../components/Slide/Slide'
import Button from '../../components/Button/Button'
import Gallery from '../../components/Gallery/Gallery'
import ProductCard from '../../components/ProductCard/ProductCard'
import Rating from '../../components/Rating/Rating'
import { convertPrice, numberWithCommas } from '../../js/commonFn'
import { useRouter } from 'next/router'
import { useCart } from '../../hooks/cartHook'
import { useAccount } from '../../hooks/accountHook'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'

const convertDetailProduct = (productData) => {
  if (!productData) {
    return []
  }

  const result = []
  const detailProduct = productData.detail

  result.push({
    key: 'engineType',
    label: 'Kiểu động cơ',
    value: detailProduct.engineType,
  })
  result.push({
    key: 'energySystem',
    label: 'Hệ thống nhiên liệu',
    value: detailProduct.energySystem,
  })
  result.push({
    key: 'cylinderCapacity',
    label: 'Dung tích xi lanh(Cm3)',
    value: numberWithCommas(productData.cylinderCapacity),
  })
  result.push({
    key: 'fuelCapacity',
    label: 'Dung tích thùng nhiên liệu(lít)',
    value: productData.fuelCapacity,
  })
  result.push({
    key: 'consumption',
    label: 'Mức tiêu thụ nhiên liệu(lít/100km)',
    value: productData.consumption,
  })
  result.push({
    key: 'numberOfSeats',
    label: 'Số ghế ngồi',
    value: detailProduct.numberOfSeats,
  })
  result.push({
    key: 'size',
    label: 'Kích thước(mm)',
    value: `${numberWithCommas(productData.size.length)} x ${numberWithCommas(
      productData.size.width
    )} x ${numberWithCommas(productData.size.height)}`,
  })
  result.push({
    key: 'weight',
    label: 'Trọng lượng(kg)',
    value: numberWithCommas(detailProduct.weight),
  })
  result.push({
    key: 'frontBrake',
    label: 'Phanh trước',
    value: detailProduct.frontBrake === 1 ? 'Phanh đĩa' : 'Phanh thường',
  })
  result.push({
    key: 'backBrake',
    label: 'Phanh sau',
    value: detailProduct.backBrake === 1 ? 'Phanh đĩa' : 'Phanh thường',
  })
  result.push({
    key: 'eco',
    label: 'Eco',
    value: detailProduct.eco ? 'Có' : 'Không',
  })
  result.push({
    key: 'powerSupport',
    label: 'Hệ thống trợ lực',
    value: detailProduct.powerSupport ? 'Có' : 'Không',
  })
  result.push({
    key: 'warningSystem',
    label: 'Hệ thống cảnh báo',
    value: detailProduct.warningSystem ? 'Có' : 'Không',
  })

  return result
}

const ProductDetail = () => {
  const [selectedColor, setSelectedColor] = useState(0)
  const [slideHeight, setSlideHeight] = useState(400)
  const [productDetail, setProductDetail] = useState(null)
  const [relatedProducts, setRelatedProduct] = useState([])
  const [formattedColorList, setFormattedColorList] = useState([])

  const { accountInfo } = useAccount()
  const { addProduct } = useCart()
  const dispatch = useDispatch()
  const router = useRouter()

  const formattedproductDetail = convertDetailProduct(productDetail)

  useEffect(() => {
    if (window.innerWidth < 976) {
      setSlideHeight(400)
    } else {
      setSlideHeight(600)
    }

    const getRelatedProducts = async (product) => {
      try {
        const res = await baseApi.get(
          `/cars/query?pageIndex=1&pageSize=8&manufacturer=${product.manufacturer._id}`
        )
        if (res.data.success) {
          setRelatedProduct(res.data.data.pageData)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getProductData = async () => {
      const productID = router.query.id
      const res = await baseApi.get(`/cars/${productID}`)
      let productDetail = null
      if (res.data.success) {
        productDetail = res.data.data

        const formattedColorList = productDetail.colors.map((color) => {
          const formattedImages = color.images.map((image) => ({ src: image }))
          return {
            ...color,
            formattedImages,
          }
        })

        setFormattedColorList(formattedColorList)
      }

      setProductDetail(productDetail)
      return productDetail
    }

    if (router.query.id) {
      getProductData().then((productDetail) => {
        getRelatedProducts(productDetail)
      })
    }

    const windowResize = () => {
      if (window.innerWidth < 976) {
        setSlideHeight(400)
      } else {
        setSlideHeight(600)
      }
    }
    window.addEventListener('resize', windowResize)

    return () => {
      window.removeEventListener('resize', windowResize)
    }
  }, [router.query.id])

  const addToCart = () => {
    if (!accountInfo?._id) {
      dispatch(
        openToastMsg({
          msg: 'Bạn cần đăng nhập để có thể mua hàng',
          status: ToastMsgStatus.Info,
        })
      )
      return
    }
    addProduct(productDetail._id, productDetail.colors[selectedColor])
    dispatch(
      openToastMsg({
        msg: 'Thêm thành công sản phẩm vào giỏ hàng',
        status: ToastMsgStatus.Success,
      })
    )
  }

  return (
    <div>
      <Head>
        <title>{`Sản phẩm ${productDetail?.name}`}</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <main className="container mx-auto px-6 sm:px-0">
        <div className="mt-10 grid-cols-3 gap-x-10 lg:grid">
          <div className="relative w-full shadow-md rounded-lg col-start-1 col-end-3">
            <Slide
              items={
                formattedColorList.length ? formattedColorList[selectedColor].formattedImages : []
              }
              height={slideHeight}
              objectFit="contain"
            />
          </div>
          <div className="mt-8 lg:mt-0 col-start-3 col-end-4 lg:flex lg:flex-col lg:justify-between">
            <h1 className="text-4xl font-bold mb-6">{productDetail?.name}</h1>
            <div className="mb-2">
              <h2 className="text-xl font-bold">Giá từ: {convertPrice(productDetail?.price)}</h2>
              <div className="text-sm italic">*Thông tin mức giá chỉ mang tính chất tham khảo</div>
            </div>
            <div className="font-medium mb-2">
              Dung tích xi lanh: {numberWithCommas(productDetail?.cylinderCapacity)}
            </div>
            <div className="font-medium mb-2">
              Nhà cung cấp: {productDetail?.manufacturer?.name}
            </div>
            <div className="font-medium mb-2">
              Dung tích thùng nhiên liệu: {productDetail?.fuelCapacity}
            </div>
            <div className="font-medium mb-2">
              Mức tiêu thu nhiên liệu: {productDetail?.consumption}
            </div>
            <div className="font-medium mb-2">
              Dài x rộng x cao:{' '}
              {`${numberWithCommas(productDetail?.size?.length)} x ${numberWithCommas(
                productDetail?.size?.width
              )} x ${numberWithCommas(productDetail?.size?.height)} (cm)`}
            </div>
            <div className="font-medium mb-2">
              Màu sắc:{' '}
              {formattedColorList.length ? formattedColorList[selectedColor].colorName : ''}
            </div>
            <ul className="flex pl-[2px] gap-x-3 mb-4 h-10 items-center transition-all">
              {formattedColorList.map((color, idx) => {
                let className =
                  'h-8 w-8 shadow-lg border border-white ring-2 ring-black cursor-pointer hover:ring-primary transition-all'
                if (idx === selectedColor) {
                  className =
                    'shadow-lg border border-white ring-2 cursor-pointer ring-primary w-10 h-10 transition-all'
                }
                return (
                  <li
                    className={className}
                    key={idx}
                    style={{
                      backgroundColor: color.color,
                    }}
                    onClick={() => setSelectedColor(idx)}
                  />
                )
              })}
            </ul>
            <Button
              className="group"
              style={{
                borderRadius: '8px',
                width: '100%',
              }}
              onClick={addToCart}
            >
              <div className="flex items-center gap-x-2">
                <span>Thêm vào giỏ hàng</span>
                <div className="flex items-center transition-[transform] duration-300 ease-in-out group-hover:scale-125">
                  <i className="fa-solid fa-cart-arrow-down"></i>
                </div>
              </div>
            </Button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t-4 border-black border-solid">
          <h2 className="text-2xl font-bold mb-6">Chi tiết sản phẩm</h2>
          <table className="table-fixed w-full">
            <colgroup>
              <col width="50%" />
              <col width="50%" />
            </colgroup>
            <thead>
              <tr className="text-left border-collapse">
                <th className="bg-primary text-white py-2 px-2 border-b border-r border-black">
                  Thuộc tính
                </th>
                <th className="bg-primary text-white py-2 px-2 border-b border-black">Thông số</th>
              </tr>
            </thead>
            <tbody>
              {formattedproductDetail.map((property) => (
                <tr key={property.key}>
                  <td className="text-black py-2 px-2 border-b border-r border-black text-ellipsis overflow-hidden whitespace-nowrap">
                    {property.label}
                  </td>
                  <td
                    title={property.value}
                    className="text-black py-2 px-2 border-b border-black text-ellipsis overflow-hidden whitespace-nowrap"
                  >
                    {property.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 pt-8 border-t-4 border-black border-solid">
          <h2 className="text-2xl font-bold mb-6">Đánh giá</h2>
          <Rating product={productDetail} />
        </div>

        <div className="mt-10 pt-8 border-t-4 border-black border-solid">
          <h2 className="text-2xl font-bold mb-6 flex items-end justify-between">
            <span>Sản phẩm cùng nhà cung cấp</span>
            <div className="relative group flex items-center ml-3 text-sm text-primary">
              <Link href={`/products?m=${productDetail?.manufacturer?._id}`}>
                <a className="transition-all group-hover:underline">Xem tất cả</a>
              </Link>
              <div className="text-sm pl-1 flex items-center -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </h2>
          <Gallery>
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </Gallery>
        </div>
      </main>
    </div>
  )
}

export default ProductDetail
