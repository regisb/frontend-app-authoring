import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import {
  ActionRow,
  Button,
  DataTableContext,
  Dropdown,
  SearchField,
  useToggle,
} from '@openedx/paragon';
import { Add, Tune, Search } from '@openedx/paragon/icons';
import messages from '../messages';
import SortAndFilterModal from './sort-and-filter-modal';

const TableActions = ({
  fileInputControl,
  handleSort,
  handleBulkDownload,
  handleOpenDeleteConfirmation,
  encodingsDownloadUrl,
  fileType,
  setInitialState,
  handleSearch,
  // injected
  intl,
}) => {
  const searchFilterId = fileType === 'video' ? 'clientVideoId' : 'displayName';

  const [isSortOpen, openSort, closeSort] = useToggle(false);

  const { state, selectedFlatRows, setFilter, ...context } = useContext(DataTableContext);
  // This useEffect saves DataTable state so it can persist after table re-renders due to data reload.
  useEffect(() => {
    setInitialState(state);
  }, [state]);

  const handleSearchChange = (value) => {
    let filterValue = [value]
    console.log(value);
    if (_.isEmpty(value)) {
      console.log('inside empty');
    } else {
      setFilter(searchFilterId, filterValue);
      if (handleSearch) {
        handleSearch([{ id: searchFilterId, value: filterValue }, ...state.filters], state.sortBy);
      }
    }
  }

  return (
    <ActionRow className="mt-5">
      <SearchField.Advanced
        onSubmit={handleSearchChange}
      >
        <SearchField.Label />
        <SearchField.Input 
          placeholder={`Search ${fileType} name`}
          value={state.filter}
        />
        <SearchField.SubmitButton />
      </SearchField.Advanced>
      <Button variant="outline-primary" onClick={openSort} iconBefore={Tune}>
        <FormattedMessage {...messages.sortButtonLabel} />
      </Button>
      <ActionRow.Spacer />
      <Dropdown className="mx-2">
        <Dropdown.Toggle
          id="actions-menu-toggle"
          alt="actions-menu-toggle"
          variant="outline-primary"
        >
          <FormattedMessage {...messages.actionsButtonLabel} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {encodingsDownloadUrl ? (
            <Dropdown.Item
              download
              href={`${getConfig().STUDIO_BASE_URL}${encodingsDownloadUrl}`}
            >
              <FormattedMessage {...messages.downloadEncodingsTitle} />
            </Dropdown.Item>
          ) : null}
          <Dropdown.Item
            onClick={() => handleBulkDownload(selectedFlatRows)}
            disabled={_.isEmpty(selectedFlatRows)}
          >
            <FormattedMessage {...messages.downloadTitle} />
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            data-testid="open-delete-confirmation-button"
            onClick={() => handleOpenDeleteConfirmation(selectedFlatRows)}
            disabled={_.isEmpty(selectedFlatRows)}
          >
            <FormattedMessage {...messages.deleteTitle} />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Button iconBefore={Add} onClick={fileInputControl.click}>
        {intl.formatMessage(messages.addFilesButtonLabel, { fileType })}
      </Button>
      <SortAndFilterModal {...{ isSortOpen, closeSort, handleSort }} />
    </ActionRow>
  );
};

TableActions.defaultProps = {
  selectedFlatRows: null,
};
TableActions.propTypes = {
  selectedFlatRows: PropTypes.arrayOf(
    PropTypes.shape({
      original: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        wrapperType: PropTypes.string.isRequired,
        locked: PropTypes.bool,
        externalUrl: PropTypes.string,
        thumbnail: PropTypes.string,
        id: PropTypes.string.isRequired,
        portableUrl: PropTypes.string,
      }).isRequired,
    }),
  ),
  fileInputControl: PropTypes.shape({
    click: PropTypes.func.isRequired,
  }).isRequired,
  handleOpenDeleteConfirmation: PropTypes.func.isRequired,
  handleBulkDownload: PropTypes.func.isRequired,
  encodingsDownloadUrl: PropTypes.string,
  handleSort: PropTypes.func.isRequired,
  fileType: PropTypes.string.isRequired,
  setInitialState: PropTypes.func.isRequired,
  handleSearch: PropTypes.func,
  intl: intlShape.isRequired,
};

TableActions.defaultProps = {
  encodingsDownloadUrl: null,
  handleSearch: null,
};

export default injectIntl(TableActions);
