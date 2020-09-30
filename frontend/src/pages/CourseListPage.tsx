import { CourseList } from 'components/CourseList';
import { GlobalStateContext } from 'context/GlobalStateContext';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { FlexContainer, FlexItem } from 'styles/Containers';
import { getLocalEmail } from '../utils/api';
import { Layout } from 'styles/Layout';

export const CourseListPage: React.FC = () => {
  const code: string = useLocation().pathname.substr(8);
  const { userProvider } = useContext(GlobalStateContext)!;

  return (
    <Layout>
        <FlexItem>
            <h1>Du er nå logget inn</h1>
            <p>Din bruker er {userProvider.email || getLocalEmail()}</p>
        </FlexItem>
        <FlexItem>
            <CourseList/>
        </FlexItem>
    </Layout>
  );
};
