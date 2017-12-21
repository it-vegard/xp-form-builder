import React from 'react';
import OverviewMainNavigationSearch from './OverviewMainNavigationSearch';
import FormContentTree from './contenttree/FormContentTree';

const OverviewMainNavigation = (props) => (
  <div className="overview-main-navigation">
    <OverviewMainNavigationSearch/>
    <FormContentTree forms={props.forms}/>
  </div>
);

OverviewMainNavigation.displayName = "OverviewMainNavigation";

export default OverviewMainNavigation;