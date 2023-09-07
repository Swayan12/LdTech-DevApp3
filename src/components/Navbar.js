
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faCaretDown, faHome, faRocket, faRotate, faClockRotateLeft, faAddressBook, faUser, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faSearchengin } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Dropdown from './Dropdown';
import Testdropdown from './Testdropdown';
import Historydropdown from './Historydropdown';
import logo from "./images/logo.png";

function Navbar({ isAuthenticated }) {
  const [click, setClick] = useState(false);
  const [ciJobsDropdown, setCiJobsDropdown] = useState(false);
  const [testingDropdown, setTestingDropdown] = useState(false);
  const [historyDropdown, setHistoryDropdown] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const onMouseEnterCiJobs = () => {
    if (window.innerWidth >= 960) {
      setCiJobsDropdown(true);
    }
  };

  const onMouseEnterTesting = () => {
    if (window.innerWidth >= 960) {
      setTestingDropdown(true);
    }
  };

  const onMouseEnterHistory = () => {
    if (window.innerWidth >= 960) {
      setHistoryDropdown(true);
    }
  };

  const onMouseLeaveCiJobs = () => {
    if (window.innerWidth >= 960) {
      setCiJobsDropdown(false);
    }
  };

  const onMouseLeaveTesting = () => {
    if (window.innerWidth >= 960) {
      setTestingDropdown(false);
    }
  };

  const onMouseLeaveHistory = () => {
    if (window.innerWidth >= 960) {
      setHistoryDropdown(false);
    }
  };

  const onClickTesting = () => {
    setTestingDropdown(!testingDropdown);
  };

  const onClickHistory = () => {
    setHistoryDropdown(!historyDropdown);
  };

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
          <img src={logo} alt="Logo" className='logo-image' style={{height:70}}/>
        </Link>
        <div className='menu-icon' onClick={handleClick}>
          <FontAwesomeIcon icon={click ? faTimes : faBars} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link to='/' className='nav-links' onClick={closeMobileMenu}>
              <FontAwesomeIcon icon={faHome} className='home-icon' /> Home
            </Link>
          </li>
     
          {isAuthenticated && (
            <>
              <li className='nav-item'>
                <Link to='/deployment' className='nav-links' onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon={faRocket} className='home-icon' /> Deployments
                </Link>
              </li>
              <li className='nav-item' onMouseEnter={onMouseEnterCiJobs} onMouseLeave={onMouseLeaveCiJobs}>
                <Link to='/cijobs' className='nav-links' onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon={faRotate} className='home-icon' /> CI Jobs <FontAwesomeIcon icon={faCaretDown} />
                </Link>
                {ciJobsDropdown && <Dropdown />}
              </li>
              <li className='nav-item'>
                <Link to='/github' className='nav-links' onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon={faGithub} className='home-icon' /> GitHub
                </Link>
              </li>
              <li className='nav-item' onMouseEnter={onMouseEnterTesting} onMouseLeave={onMouseLeaveTesting}>
                <Link to='/testing' className='nav-links' onClick={onClickTesting}>
                  <FontAwesomeIcon icon={faSearchengin} className='home-icon' /> Testing <FontAwesomeIcon icon={faCaretDown} />
                </Link>
                {testingDropdown && <Testdropdown />}
              </li>
              <li className='nav-item' onMouseEnter={onMouseEnterHistory} onMouseLeave={onMouseLeaveHistory}>
                <Link to='/history' className='nav-links' onClick={onClickHistory}>
                  <FontAwesomeIcon icon={faClockRotateLeft} className='home-icon' /> History <FontAwesomeIcon icon={faCaretDown} />
                </Link>
                {historyDropdown && <Historydropdown />}
              </li>
            
              <li className='nav-item'>
                <Link to='/signout' className='nav-links' onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon={faSignOut} className='home-icon' /> Sign Out
                </Link>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
             <li className='nav-item'>
              <Link to='/signin' className='nav-links' onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faUser} className='home-icon' /> SignIn
              </Link>
            </li>
                <li className='nav-item'>
                 <Link to='/contact' className='nav-links' onClick={closeMobileMenu}>
                   <FontAwesomeIcon icon={faAddressBook} className='home-icon' /> Contact
                 </Link>
               </li>
            </>
           
             
          )}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;