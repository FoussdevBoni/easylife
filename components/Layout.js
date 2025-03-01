import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TabAppBar from './TabAppbar';

const Layout = ({children , user}) => {
    return (
        <>
          <TabAppBar user={user} />
          {children}
        </>
    );
};

Layout.propTypes = {};

export { Layout };