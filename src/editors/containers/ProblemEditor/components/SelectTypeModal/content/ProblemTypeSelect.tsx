import React from 'react';
import { Button, Container } from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

// SelectableBox in paragon has a bug where you can't change selection. So we override it
import SelectableBox from '../../../../../sharedComponents/SelectableBox';
import { ProblemTypes, ProblemTypeKeys, AdvanceProblemKeys } from '../../../../../data/constants/problem';
import messages from './messages';

interface Props {
  selected: string;
  setSelected: (selected: string) => void;
}

const ProblemTypeSelect: React.FC<Props> = ({
  selected,
  setSelected,
}) => {
  const handleChange = e => setSelected(e.target.value);
  const handleClick = () => setSelected(AdvanceProblemKeys.BLANK);
  const settings = { 'aria-label': 'checkbox', type: 'radio' };

  return (
    <Container style={{ width: '494px', height: '400px' }}>
      <SelectableBox.Set
        name="problem-type"
        columns={1}
        onChange={handleChange}
        type={settings.type}
        value={selected}
      >
        {Object.values(ProblemTypeKeys).map((key) => (
          key !== 'advanced'
            ? (
              <SelectableBox
                className="border border-light-400 text-primary-500 shadow-none"
                id={key}
                key={key}
                value={key}
                {...settings}
              >
                {ProblemTypes[key].title}
              </SelectableBox>
            )
            : null
        ))}
      </SelectableBox.Set>
      <Button variant="link" className="pl-0 mt-2" onClick={handleClick}>
        <FormattedMessage {...messages.advanceProblemButtonLabel} />
      </Button>
    </Container>
  );
};

export default ProblemTypeSelect;
