import axios from 'axios'

import classes from "./Header.module.css";

const Header = (props) => {

  const signout = async () => {
    const res = await axios.get(`http://127.0.0.1/logout`)
  }

  return (
    <header id="app_header" className={classes.header}>
      <span>Welcome <strong>sachinAthu!</strong></span>

      <button onClick={signout}>Signout</button>
    </header>
  );
};

export default Header;
