import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Table, Pagination, Spin } from 'antd'
import './style.scss'
const Tables = props => {
  const pageSizeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
  const [pageNumber, setPageNumber] = useState(1)
  const listing = props.listing || []
  const columns = props.columns || []
  const count = props.pageCount || 0
  const isDetail = props.isDetail || false
  const [pageSize, setPageSize] = useState(10)
  const { getPagination } = useSelector(state => state.pagination)

  useEffect(() => {
    setPageNumber(1)
    setPageSize(10)
  }, [props.pageCount])

  const onPageChange = (page, pageSize) => {
    setPageSize(pageSize)
    setPageNumber(page)
    props && props.next(page, pageSize)
  }

  return (
    <>
      <div className={isDetail ? 'detailTableBox' : 'tableBox'}>
        <Table
          bordered={false}
          columns={columns}
          dataSource={listing}
          pagination={false}
          scroll={isDetail ? '' : { x: props.number }}
          sticky={isDetail ? '' : true}
          loading={props.loading && <Spin size="large" />}
        />
      </div>
      <div className="pagination">
        <Pagination
          current={getPagination ? getPagination.pageNo : pageNumber}
          total={count}
          onChange={(page, pageSize) => onPageChange(page, pageSize)}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          hideOnSinglePage={count === 0}
          defaultPageSize={10}
          showSizeChanger={false}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
        />
      </div>
    </>
  )
}

Tables.propTypes = {
  listing: PropTypes.arrayOf(PropTypes.shape()),
  columns: PropTypes.arrayOf(PropTypes.shape()),
  pageCount: PropTypes.number,
  pageSize: PropTypes.number,
  current: PropTypes.number,
  next: PropTypes.func,
  isDetail: PropTypes.bool,
  number: PropTypes.number,
  loading: PropTypes.bool,
}

export default Tables
