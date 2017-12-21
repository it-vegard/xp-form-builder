import React from 'react';
import OverviewMainContent from './content/OverviewMainContent';
import OverviewMainNavigation from './navigation/OverviewMainNavigation';

const OverviewMain = (props) => (
  <div className="overview-main">
    <OverviewMainNavigation forms={props.forms.formList} />
    <OverviewMainContent currentForm={props.forms.formList[0]} />
  </div>
);

OverviewMain.displayName = "OverviewMain";

export default OverviewMain;