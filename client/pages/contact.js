import React from 'react'
import Head from 'next/head'
import Image from 'next/image'

import Img from '../assets/images/factory.jpg'
import Img2 from '../assets/images/mec.jpg'

const IntroPage = () => {
  return (
    <div>
      <Head>
        <title>LIên hệ - Công ty CP Việt Hưng</title>
        <link rel="icon" href="/icon.ico" />
      </Head>
      <main className="container mx-auto px-6 ms:px-0">
        <h1 className="mt-10 mb-8 text-justify text-xl font-medium lg:text-3xl lg:text-center">
          Công ty CP Việt Hưng Hà Nội
        </h1>
        <div className="text-lg font-bold mb-5 text-primary text-center lg:text-2xl">
          Sáng tạo - Thành công - Uy tín
        </div>
        <div className="relative w-full h-[500px] mb-8 lg:h-[400px] rounded-md overflow-hidden">
          <Image
            className="object-center object-cover"
            src={Img}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
          />
        </div>
        <div className="relative w-full h-[200px] mb-8 lg:h-[400px] rounded-md overflow-hidden">
          <Image
            className="object-center object-cover"
            src={Img2}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
          />
        </div>
        <h2 className="font-bold text-2xl text-center mb-8 relative before:absolute before:top-[calc(100%_+_4px)] before:left-1/2 before:-translate-x-1/2 before:w-36 before:h-1 before:bg-primary">
          Địa chỉ
        </h2>
        <p className="font-bold text-center">
          370 Đ. Cầu Giấy, Dịch Vọng, Cầu Giấy, Hà Nội, Việt Nam
        </p>
        <div className="font-bold mb-1 mx-auto">
          <iframe className="w-full" src="https://bom.so/DwRxX7" height={400}></iframe>
        </div>
        <h3 className="font-bold mt-10 text-2xl text-center mb-8 relative before:absolute before:top-[calc(100%_+_4px)] before:left-1/2 before:-translate-x-1/2 before:w-36 before:h-1 before:bg-primary">
          Đường dây nóng - Phục vụ 24/7
        </h3>
        <p className="font-bold text-2xl mb-1 text-center">0123456789</p>
      </main>
    </div>
  )
}

export default IntroPage
