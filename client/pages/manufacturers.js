import React from 'react'
import Head from 'next/head'
import baseApi from '../api/BaseApi'
import Gallery from '../components/Gallery/Gallery'
import ManufacturerCard from '../components/ProductCard/ManufacturerCard'
import ProductCardLoading from '../components/ProductCard/ProductCardLoading'
import { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'

const ManufacturerePage = () => {
  const [manufacturers, setManufacturers] = useState([])
  const [manufacturers2, setManufacturers2] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getPaging()
  }, [])

  const getPaging = async (query = 'pageSize=200&pageIndex=1&sort=name|1') => {
    setIsLoading(true)
    try {
      const res = await baseApi.get(`/manufacturers/query?${query}`)
      setManufacturers([...res.data.data.pageData])
      setManufacturers2([...res.data.data.pageData].slice(0, 7))

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  return (
    <div>
      <Head>
        <title>Hãng xe - Công ty CP Việt Hưng</title>
        <link rel="icon" href="/icon.ico" />
      </Head>
      <main className="container mx-auto px-6 ms:px-0">
        <div className="bg-primary pb-[10px] pt-6 my-6 rounded-md">
          <div className="text-2xl font-bold uppercase text-center text-white">
            Thương hiệu xe nổi bật
          </div>
          <div className="flex items-center justify-center gap-x-10 py-6">
            {manufacturers2.map((m) => (
              <Link key={m._id} href={`/products?m=${m._id}`}>
                <a className="overflow-hidden h-[30px] flex items-center bg-black rounded-md justify-center px-3 font-medium text-white hover:text-black hover:bg-white transition-colors duration-200">
                  {m.name}
                </a>
              </Link>
            ))}
          </div>
        </div>

        <div>
          {isLoading ? (
            <Gallery>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((productIdx) => (
                <ProductCardLoading key={productIdx} />
              ))}
            </Gallery>
          ) : (
            <Gallery>
              {manufacturers.map((m) => {
                return <ManufacturerCard {...m} key={m._id} />
              })}
            </Gallery>
          )}
        </div>
      </main>
    </div>
  )
}

export default ManufacturerePage
