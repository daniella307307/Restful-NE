import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function Sidebar() {
  return (
    <div className='lg:w-[15%] bg-blue-100 h-full overflow-hidden'>
      <h1 className='text-blue-800 font-semiBold text-lg text-center'>PMS</h1>
      <ul>
        <li>
            <FontAwesomeIcon name={faUser}/>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
