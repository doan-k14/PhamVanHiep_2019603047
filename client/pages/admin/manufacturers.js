import React, { useState, useEffect } from 'react'
import baseApi from '../../api/BaseApi'
import { DataTypeEnum } from '../../enums/DataTypeEnum'
import { ComboboxLabelPositionEnum } from '../../enums/ComboboxEnum'
import { TypeStyle } from '../../enums/InputFieldEnum'
import { ButtonType } from '../../enums/ButtomEnum'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'

import Head from 'next/head'
import Button from '../../components/Button/Button'
import ManufacturerInfoPopup from '../../components/ManufacturerPopup/ManufacturerInfoPopup'
import Table from '../../components/Table/Table'
import InputField from '../../components/InputField/InputField'
import Combobox from '../../components/Combobox/Combobox'
import Paging from '../../components/Paging/Paging'
import PopupMsg from '../../components/Popup/PopupMsg'

const HEADERS = [
  {
    caption: 'Mã hãng sản xuất',
    fieldName: 'code',
    dataType: DataTypeEnum.Text,
    width: '170px',
    minWidth: '170px',
    sticky: {
      left: '48px',
    },
  },
  {
    caption: 'Tên hãng sản xuất',
    fieldName: 'name',
    dataType: DataTypeEnum.Text,
    minWidth: '200px',
  },
  {
    caption: 'Số lượng SP',
    fieldName: 'numberProducts',
    dataType: DataTypeEnum.Number,
    width: '150px',
    minWidth: '150px',
  },
]

const SORT_OPTIONS = [
  {
    _id: 'code|1',
    name: 'Mã nhà cung cấp tăng dần',
  },
  {
    _id: 'code|-1',
    name: 'Mã nhà cung cấp giảm dần',
  },
  {
    _id: 'name|1',
    name: 'Tên nhà cung cấp tăng dần',
  },
  {
    _id: 'name|-1',
    name: 'Tên nhà cung cấp giảm dần',
  },
]

const ManufacturersAdmin = () => {
  const [isActivePopupAdd, setIsActivePopupAdd] = useState(false)
  const [manufacturers, setManufacturers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [searchText, setSearchText] = useState('')
  const [selectedSortOption, setSelectedSortOption] = useState('code|1')
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState('20')
  const [totalRecords, setTotalRecords] = useState(0)
  const [edittingManufacturerId, setEdittingManufacturerId] = useState('')
  const [searchFunc, setSearchFunc] = useState(null)
  const [isActivePopupDelete, setIsActivePopupDelete] = useState(false)
  const [isLoadingPopupDelete, setIsLoadingPopupDelete] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    getPagingManufacturers(generateQuery({ PageIndex: 1 }))

    return () => {
      clearTimeout(searchFunc)
    }
  }, [])

  const handleEditRow = (manufacturerId) => {
    setEdittingManufacturerId(manufacturerId)
    setIsActivePopupAdd(true)
  }

  const handleDeleteRow = (manufacturerId) => {
    setEdittingManufacturerId(manufacturerId)
    setIsActivePopupDelete(true)
  }

  const handleChangeSearchText = (e) => {
    setSearchText(e.target.value)
    clearTimeout(searchFunc)
    setSearchFunc(
      setTimeout(() => {
        getPagingManufacturers(generateQuery({ SearchText: e.target.value }))
      }, 500)
    )
  }

  const handleChangeSort = (e) => {
    getPagingManufacturers(generateQuery({ Sort: e, PageIndex: 1 }))
    setPageIndex(1)
    setSelectedSortOption(e)
  }

  const handleChangePageIndex = (newPageIdx) => {
    setPageIndex(newPageIdx)
    getPagingManufacturers(generateQuery({ PageIndex: newPageIdx }))
  }

  const handleChangePageSize = (newPageSize) => {
    setPageSize(newPageSize)
    setPageIndex(1)
    getPagingManufacturers(generateQuery({ PageSize: newPageSize, PageIndex: 1 }))
  }

  const getPagingManufacturers = async (query = '') => {
    setIsLoading(true)
    try {
      const res = await baseApi.get(`/manufacturers/query?${query}`)
      setManufacturers([...res.data.data.pageData])
      setTotalRecords(res.data.data.totalRecords)
      setSelectedRows([])
      setEdittingManufacturerId('')

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const generateQuery = ({ SearchText = null, PageSize = null, PageIndex = null, Sort = null }) => {
    const query = `pageSize=${PageSize || pageSize}&pageIndex=${
      PageIndex || pageIndex
    }&searchText=${SearchText !== null ? SearchText : searchText}&sort=${
      Sort || selectedSortOption
    }`
    return query
  }

  const handleClosePopup = (isReload) => {
    setIsActivePopupAdd(false)
    setEdittingManufacturerId('')
    if (isReload) {
      getPagingManufacturers(generateQuery({ PageIndex: null }))
    }
  }

  const handleClosePopupDelete = () => {
    setEdittingManufacturerId('')
    setIsActivePopupDelete(false)
  }

  const handleClickDeleteMultiple = () => {
    if (selectedRows.length === 0) {
      return
    }
    if (selectedRows.length === 1) {
      setEdittingManufacturerId(selectedRows[0])
    }
    setIsActivePopupDelete(true)
  }

  const handleDeleteManufacturers = async () => {
    setIsLoadingPopupDelete(true)
    try {
      let res = null
      let msg = ''
      if (edittingManufacturerId !== '') {
        res = await baseApi.delete(`/manufacturers/${edittingManufacturerId}`)
        msg = 'Xóa thành công 1 nhà sản xuất'
        const deletedManufacturer = manufacturers.find((p) => p._id === edittingManufacturerId)
        if (deletedManufacturer) {
          msg = `Xóa thành công nhà sản xuất có mã <${deletedManufacturer.code}>`
        }
      } else {
        const idList = selectedRows.join(';')
        res = await baseApi.delete(`/manufacturers/${idList}`)
        msg = `Xóa thành công ${selectedRows.length} nhà sản xuất`
      }
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Success,
          msg,
        })
      )
      setIsLoadingPopupDelete(false)
      setIsActivePopupDelete(false)
      getPagingManufacturers(generateQuery({ PageIndex: null }))
    } catch (error) {
      setIsLoadingPopupDelete(false)
      setIsActivePopupDelete(false)
      if (error.response.status === 400) {
        dispatch(
          openToastMsg({
            status: ToastMsgStatus.Error,
            msg: 'Không thể xóa hãng sản xuất đang có sản phẩm',
          })
        )
        return
      }
      if (error.response.status === 404) {
        dispatch(
          openToastMsg({
            status: ToastMsgStatus.Error,
            msg: 'Dữ liệu đã bị thay đổi hãy tải lại trang',
          })
        )
        return
      }
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
      console.log(error)
    }
  }

  return (
    <div className="container mx-auto px-6 mt-6">
      <Head>
        <title>Nhà cung cấp</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <main className="w-full">
        <div className="flex items-center justify-between">
          <div className="w-96">
            <InputField
              id="search-text"
              name="search-text"
              placeholder="Tìm kiếm theo tên, mã nhà cung cấp..."
              typeStyle={TypeStyle.Normal}
              startIcon={
                <div>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
              }
              value={searchText}
              onInput={handleChangeSearchText}
            />
          </div>
          <div className="flex items-center gap-x-3">
            <div className="w-72">
              <Combobox
                id="sort-option"
                name="sort-option"
                items={SORT_OPTIONS}
                value={selectedSortOption}
                label="Sắp xếp theo"
                labelPosition={ComboboxLabelPositionEnum.Left}
                onChange={handleChangeSort}
              />
            </div>
            <Button
              style={{
                height: '40px',
                borderRadius: '6px',
                padding: '0 16px',
                fontWeight: '500',
                fontSize: '14px',
              }}
              onClick={() => setIsActivePopupAdd(true)}
            >
              <span className="leading-none pr-2 text-white">
                <i className="fa-solid fa-plus"></i>
              </span>
              <span className="leading-none">Thêm nhà cung cấp</span>
            </Button>
            <Button
              style={{
                height: '40px',
                width: '40px',
                minWidth: 'unset',
              }}
              className="hover:text-red-600 group"
              buttonType={ButtonType.Secondary}
              onClick={handleClickDeleteMultiple}
            >
              <div className="flex items-center justify-center group-hover:text-red-600">
                <i className="fa-solid fa-trash"></i>
              </div>
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <Table
            headers={HEADERS}
            data={manufacturers}
            hasCheckbox={true}
            allowEdit={true}
            allowDelete={true}
            checkedRows={selectedRows}
            isLoading={isLoading}
            height="calc(100vh - 200px)"
            onCheckRow={(e) => setSelectedRows(e)}
            onEdit={handleEditRow}
            onDelete={handleDeleteRow}
          />
        </div>
        <div>
          <Paging
            totalRecords={totalRecords}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onChangePageIndex={handleChangePageIndex}
            onChangePageSize={handleChangePageSize}
          />
        </div>
      </main>

      <ManufacturerInfoPopup
        isActive={isActivePopupAdd}
        edittingId={edittingManufacturerId}
        onClose={handleClosePopup}
      />

      <PopupMsg
        isActive={isActivePopupDelete}
        isLoading={isLoadingPopupDelete}
        isActiveLoadingScreen={false}
        title="Xác nhận"
        textCloseBtn="Hủy"
        textAgreeBtn="Đồng ý"
        msg={
          <div>
            {selectedRows.length > 1 ? (
              <div>
                <span>Bạn có chắc muốn xóa </span>
                <span className="font-medium">{selectedRows.length} </span>
                <span>nhà sản xuất?</span>
              </div>
            ) : edittingManufacturerId !== '' ? (
              <div>
                <span>Bạn có chắc muốn xóa nhà sản xuất có mã </span>
                <span className="font-medium">
                  {manufacturers.find((m) => m._id === edittingManufacturerId)?.code}
                </span>
              </div>
            ) : null}
          </div>
        }
        onClose={handleClosePopupDelete}
        onAgree={handleDeleteManufacturers}
      />
    </div>
  )
}

export default ManufacturersAdmin
