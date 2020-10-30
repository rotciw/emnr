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
  padding: 10px 30px;
  border-radius: 5px;
  margin: 30px 10px 0 0;
  outline: none;
`;

const ResetButton = styled(SortButton) `
  background-color: ${({ theme }) => theme.lightBlue};
  color: ${({ theme }) => theme.black};
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
    advancedQueryProvider.setAdvancedSortChangedFlag(!advancedQueryProvider.advancedSortChangedFlag);
    closeModal();
  };

  const doReset = () => {
    advancedQueryProvider.setScoreHigh(true);
    advancedQueryProvider.setScoreWeight(0);
    advancedQueryProvider.setDiffHigh(true);
    advancedQueryProvider.setDiffWeight(0);
    advancedQueryProvider.setWorkLoadHigh(true);
    advancedQueryProvider.setWorkLoadWeight(0);
    advancedQueryProvider.setGradeHigh(true);
    advancedQueryProvider.setGradeWeight(0);
    advancedQueryProvider.setPassRateHigh(true);
    advancedQueryProvider.setPassRateWeight(0);
    advancedQueryProvider.setAdvancedSorting(false);
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
      <p>Hvor viktig det er at?</p>

      <SortFactor
        setDirectionFunction={setScoreHighState}
        directionVariable={scoreHighState}
        setWeightFunction={setScoreWeight}
        weightVariable={scoreWeight}
        displayName={'Score'}
        idName={'score'}
      />
      <SortFactor
        setDirectionFunction={setDifficultyHighState}
        directionVariable={difficultyHighState}
        setWeightFunction={setDifficultyWeight}
        weightVariable={difficultyWeight}
        displayName={'Vanskelighetsgrad'}
        idName={'difficulty'}
      />
      <SortFactor
        setDirectionFunction={setWorkloadHighState}
        directionVariable={workloadHighState}
        setWeightFunction={setWorkloadWeight}
        weightVariable={workloadWeight}
        displayName={'Arbeidsmengde'}
        idName={'workload'}
      />
      <SortFactor
        setDirectionFunction={setGradeHighState}
        directionVariable={gradeHighState}
        setWeightFunction={setGradeWeight}
        weightVariable={gradeWeight}
        displayName={'Karaktersnitt'}
        idName={'grade'}
      />
      <SortFactor
        setDirectionFunction={setPassrateHighState}
        directionVariable={passrateHighState}
        setWeightFunction={setPassrateWeight}
        weightVariable={passrateWeight}
        displayName={'Andel bestått'}
        idName={'passrate'}
      />

      <SortButton onClick={doSort}>Lagre og sorter</SortButton>
      <ResetButton onClick={doReset}>Nullstill sortering</ResetButton>
    </div>
  );
};

export default AdvancedSortForm;
