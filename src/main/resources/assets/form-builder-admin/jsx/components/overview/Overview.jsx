import React from 'react';
import OverviewMain from './main/OverviewMain';
import OverviewToolbar from './toolbar/OverviewToolbar';
import { connect } from 'react-redux';

const Overview = (props) => {
  return (props.showOverview === true) ? (
    <div className="overview">
      <OverviewToolbar />
      <OverviewMain forms={props.forms}/>
    </div>
  ) : null;
};

Overview.displayName = "Overview";

const mapStateToProps = (state, props) => {
  return {
    ...props,
    showOverview: state.admin.showViews.formOverview,
    forms: state.forms
  };
};

export default connect(mapStateToProps)(Overview);