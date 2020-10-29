import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FlexContainer, HrLine } from 'styles/Containers';
import { Title, BoldTitle, ExtraBold } from 'styles/Text';
import { SortFactor } from './SortFactor';
import { GlobalStateContext } from 'context/GlobalStateContext';

interface AdvancedSortFormProps {
  closeModal: () => void;
}

const ModalXButton = styled.span`
  font-size: 1.5em;
  margin-top: -5px;
  cursor: pointer;
`;

const SortButton = styled.button`
  border: none;
  background-color: ${({ theme }) => theme.darkBlue};
  color: ${({ theme }) => theme.white};
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 5px;
`;

const AdvancedSortForm: React.FC<AdvancedSortFormProps> = ({ closeModal }) => {

  const { advancedQueryProvider } = useContext(GlobalStateContext)!;

  const doSort = () => {
    advancedQueryProvider.setScoreHigh(scoreHighState);
    advancedQueryProvider.setScoreWeight(scoreWeight);
    advancedQueryProvider.setDiffHigh(difficultyHighState);
    advancedQueryProvider.setDiffWeight(difficultyWeight);
    advancedQueryProvider.setWorkLoadHigh(workloadHighState);
    advancedQueryProvider.setWorkLoadWeight(workloadWeight);
    advancedQueryProvider.setGradeHigh(gradeHighState);
    advancedQueryProvider.setGradeWeight(gradeWeight);
    advancedQueryProvider.setPassRateHigh(passrateHighState);
    advancedQueryProvider.setPassRateWeight(passrateWeight);
    advancedQueryProvider.setAdvancedSorting(true);
    closeModal();
  };


  const [scoreHighState, setScoreHighState] = useState<boolean>(advancedQueryProvider.scoreHigh);
  const [scoreWeight, setScoreWeight] = useState<number>(advancedQueryProvider.scoreWeight);
  const [difficultyHighState, setDifficultyHighState] = useState<boolean>(advancedQueryProvider.diffHigh);
  const [difficultyWeight, setDifficultyWeight] = useState<number>(advancedQueryProvider.diffWeight);
  const [workloadHighState, setWorkloadHighState] = useState<boolean>(advancedQueryProvider.workLoadHigh);
  const [workloadWeight, setWorkloadWeight] = useState<number>(advancedQueryProvider.workLoadWeight);
  const [gradeHighState, setGradeHighState] = useState<boolean>(advancedQueryProvider.gradeHigh);
  const [gradeWeight, setGradeWeight] = useState<number>(advancedQueryProvider.gradeWeight);
  const [passrateHighState, setPassrateHighState] = useState<boolean>(advancedQueryProvider.passRateHigh);
  const [passrateWeight, setPassrateWeight] = useState<number>(advancedQueryProvider.passRateWeight);

  return (
    <div>
      <FlexContainer style={{ justifyContent: 'space-between' }}>
        <Title margin='0 0 5px 0'>Avansert sortering</Title>
        <ModalXButton onClick={closeModal}>&#10006;</ModalXButton>
      </FlexContainer>
      <HrLine margin='5px 0 15px 0' />
      <p>Ranger hvor viktig det er at...</p>

      <SortFactor
        setDirectionFunction={setScoreHighState}
        directionVariable={scoreHighState}
        setWeightFunction={setScoreWeight}
        weightVariable={scoreWeight}
        displayName={'score'}
        idName={'score'}
      />
      <SortFactor
        setDirectionFunction={setDifficultyHighState}
        directionVariable={difficultyHighState}
        setWeightFunction={setDifficultyWeight}
        weightVariable={difficultyWeight}
        displayName={'vanskelighetsgrad'}
        idName={'difficulty'}
      />
      <SortFactor
        setDirectionFunction={setWorkloadHighState}
        directionVariable={workloadHighState}
        setWeightFunction={setWorkloadWeight}
        weightVariable={workloadWeight}
        displayName={'arbeidsmengde'}
        idName={'workload'}
      />
      <SortFactor
        setDirectionFunction={setGradeHighState}
        directionVariable={gradeHighState}
        setWeightFunction={setGradeWeight}
        weightVariable={gradeWeight}
        displayName={'karaktersnitt'}
        idName={'grade'}
      />
      <SortFactor
        setDirectionFunction={setPassrateHighState}
        directionVariable={passrateHighState}
        setWeightFunction={setPassrateWeight}
        weightVariable={passrateWeight}
        displayName={'andel bestått'}
        idName={'passrate'}
      />

      <SortButton onClick={doSort}>Lagre innstillinger</SortButton>
    </div>
  );
};

export default AdvancedSortForm;
