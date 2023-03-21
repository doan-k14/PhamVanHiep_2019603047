import React, { useState } from 'react'
import { convertPrice } from '../../js/commonFn'
import Image from 'next/image'
import NumberChanger from '../NumberChanger/NumberChanger'
import PopupChangeColor from '../Popup/PopupChangeColor'
import { useCart } from '../../hooks/cartHook'
import { useRouter } from 'next/router'

const CartItem = ({
  name,
  price,
  number,
  _id,
  code,
  color,
  colors,
  isWatch = false,
  isAdminView = false,
}) => {
  const [isActivePopupChangeColor, setIsActivePopupChangeColor] = useState(false)
  const { products, addProduct, minusProduct, deleteProduct, changeColor, toggleCart } = useCart()
  const router = useRouter()

  const totalPrice = convertPrice(price * number)
  const formattedPrice = convertPrice(price)

  const handleChangeNumber = (newNumber) => {
    if (newNumber > number) {
      addProduct(_id, color)
    } else {
      if (newNumber > 0) {
        minusProduct(_id, color)
      }
    }
  }

  const handleChangeColor = (newColor) => {
    if (color.color !== newColor.color) {
      changeColor(_id, color, newColor)
    }
    setIsActivePopupChangeColor(false)
  }

  const handleClickItem = () => {
    toggleCart(false)
    router.replace(`/products/${_id}`)
  }

  return (
    <div className="last:border-b-0 pr-3 flex w-full justify-between border-b border-gray-300 py-3">
      <div className="relative mr-6 w-28 h-28 rounded-md overflow-hidden border border-gray-300 shrink-0">
        <Image
          src={color.image}
          objectFit="contain"
          objectPosition="center"
          width={128}
          height={128}
        />
      </div>
      <div className="flex flex-col justify-between grow py-3">
        <div className="grid grid-cols-2 gap-x-2 items-center w-full">
          <span
            className="text-lg text-gray-700 font-medium leading-none hover:text-primary/80 transition-colors cursor-pointer block w-full overflow-hidden text-ellipsis whitespace-nowrap"
            title={name}
            onClick={handleClickItem}
          >
            {name}
          </span>
          <span
            className="font-medium leading-none justify-self-end block w-full overflow-hidden text-ellipsis whitespace-nowrap text-right"
            title={totalPrice}
          >
            {totalPrice}
          </span>
        </div>
        {isAdminView && (
          <div className="text-sm text-gray-500 leading-none mt-1">Mã sản phẩm: {code}</div>
        )}
        <div className="text-sm text-gray-500 grid grid-cols-2 gap-x-2 items-center">
          <div
            className="leading-none whitespace-nowrap overflow-hidden w-full text-ellipsis"
            title={formattedPrice}
          >
            Giá: {formattedPrice}
          </div>
          <div className="justify-self-end flex items-center w-full" title={color.colorName}>
            <span className="block leading-none w-[calc(100%_-_28px)] whitespace-nowrap overflow-hidden text-ellipsis text-right">
              {color.colorName}
            </span>
            <div
              style={{
                backgroundColor: color.color,
              }}
              className="w-5 h-5 rounded-full border-2 border-white ring-1 ring-gray-400 ml-2 shrink-0"
            ></div>
          </div>
        </div>
        {isWatch ? (
          <div className="text-sm text-gray-500 leading-none">Số lượng: {number}</div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <NumberChanger value={number} onChange={handleChangeNumber} />
            </div>
            <div className="flex items-center gap-x-4">
              <div
                className="text-gray-500 cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsActivePopupChangeColor(true)}
              >
                <i className="fa-solid fa-pen-to-square"></i>
                <span className="pl-2 text-sm">Đổi màu</span>
              </div>
              <div
                className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors"
                onClick={() => deleteProduct(_id, color)}
              >
                <i className="fa-solid fa-trash"></i>
                <span className="pl-2 text-sm">Xóa</span>
              </div>
            </div>

            <PopupChangeColor
              isActive={isActivePopupChangeColor}
              colors={colors}
              value={color}
              productId={_id}
              products={products}
              onClose={() => setIsActivePopupChangeColor(false)}
              onChange={handleChangeColor}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartItem
