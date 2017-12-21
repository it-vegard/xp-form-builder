import React from 'react';

const OverviewMainContent = (props) => (
  <div className="overview-main-content">
    <p>{(props.currentForm) ? "Editing form not implemented" : "No form selected"}</p>
    <p>{JSON.stringify(props.currentForm, 2)}</p>
  </div>
);

OverviewMainContent.displayName = "OverviewMainContent";

export default OverviewMainContent;