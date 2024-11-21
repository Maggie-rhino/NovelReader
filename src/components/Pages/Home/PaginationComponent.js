
import React from 'react';
import { Pagination } from 'antd';

const PaginationComponent = ({totalPage, onChange }) =>{

    const handlePageChange = (pageNumber) => {
        onChange(pageNumber);
    }

    return(
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination defaultCurrent={1} total={totalPage*10} onChange={handlePageChange} showSizeChanger={false} />
    </div>
)};

export default PaginationComponent;