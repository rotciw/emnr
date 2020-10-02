import { CourseList } from 'components/CourseList';
import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FlexContainer, FlexItem } from 'styles/Containers';
import { getLocalEmail } from '../utils/api';
import { Layout } from 'styles/Layout';
import { PaginationContainer } from 'components/pagination/PaginationContainer';

export const CourseListPage: React.FC = () => {
  const code: string = useLocation().pathname.substr(8);
  const { userProvider, pageProvider, totalPageProvider } = useContext(GlobalStateContext)!;

  return (
    <Layout>
        <FlexItem>
            <h1>Du er nå logget inn</h1>
            <p>Din bruker er {userProvider.email || getLocalEmail()}</p>
        </FlexItem>
        <FlexItem>
            <CourseList pageNumber={pageProvider.page}/>
        </FlexItem>
        <PaginationContainer totalPages={totalPageProvider.totalPage}/>
    </Layout>
  );
};
