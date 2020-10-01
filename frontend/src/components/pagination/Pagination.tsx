import React, { useState } from 'react';
import { PaginationWrapper, PaginationBtn, Separator } from '../../styles/PaginationStyle';
export interface Props {
  page: number;
  totalPages: number;
  handlePagination: (page: number) => void;
}
export const PaginationComponent: React.FC<Props> = ({
  page,
  totalPages,
  handlePagination,
}) => {

    const [isActive,setIsActive] = useState(false);

  return (
    <div>
      <PaginationWrapper>
        {page !== 1 && (
          <PaginationBtn
            onClick={() => {handlePagination(page - 1)
            setIsActive(!isActive)
            }}
            isActive
          >
            &lt;
          </PaginationBtn>
        )}
        <PaginationBtn
            onClick={() => {handlePagination(1)
            setIsActive(!isActive)
            }}
            isActive
          >
            {1}
          </PaginationBtn>        
        {page > 3 && <Separator>...</Separator>}
        {page === totalPages && totalPages > 3 && (
            <PaginationBtn
            onClick={() => {handlePagination(page - 2)
            setIsActive(!isActive)
            }}
            isActive
        >
                {page - 2}
            </PaginationBtn>  
        )}
        {page > 2 && (
            <PaginationBtn
            onClick={() => {handlePagination(page - 1)
            setIsActive(!isActive)
            }}
            isActive
        >
                {page - 1}
            </PaginationBtn> 
        )}
        {page !== 1 && page !== totalPages && (
            <PaginationBtn
            onClick={() => {handlePagination(page)
            setIsActive(!isActive)
            }}
            isActive
        >
                {page}
            </PaginationBtn> 
        )}
        {page < totalPages - 1 && (
            <PaginationBtn
            onClick={() => {handlePagination(page + 1)
            setIsActive(!isActive)
            }}
            isActive
        >
                {page + 1}
            </PaginationBtn> 
        )}
        {page === 1 && totalPages > 3 && (
            <PaginationBtn
            onClick={() => {handlePagination(page + 2)
            setIsActive(!isActive)
            }}
            isActive
        >
                {page + 2}
            </PaginationBtn> 
        )}
        {page < totalPages - 2 && <Separator>...</Separator>}
        <PaginationBtn
            onClick={() => {handlePagination(totalPages)
            setIsActive(!isActive)
            }}
            isActive
        >
                {totalPages}
            </PaginationBtn> 
        {page !== totalPages && (
            <PaginationBtn
            onClick={() => {handlePagination(page + 1)
            setIsActive(!isActive)
            }}
            isActive
            >
            &gt;
            </PaginationBtn>
        )}
      </PaginationWrapper>
    </div>
  );
};
export const Pagination = PaginationComponent;