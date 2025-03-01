import React, {useState} from 'react';
import GlobalAppBar from '../../../components/GlobalAppbar';
import { colors } from '../../../utils/colors';

const StayLayout = ({user , children}) => {
    return (
       <>
         <GlobalAppBar color={colors.tertiary} user={user} />
         <>
          {children}
         </>
       </>
    );
};


export default  StayLayout ;