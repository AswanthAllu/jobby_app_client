// src/components/Home/index.js
import {Link} from 'react-router-dom';
import Header from '../Header';
import './index.css'; // This CSS file will now work correctly

const Home = () => {
  // To check if the user is an admin, we should read from localStorage, not cookies.
  const userInfoString = localStorage.getItem('user_info');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const isAdmin = userInfo && userInfo.role === 'admin';

  return (
    <>
      <Header />
      {/* Using the class name from your CSS */}
      <div className="home-container">
        {/* Using the class name from your CSS */}
        <div className="responsive-container">
          {/* Using the class name from your CSS */}
          <h1 className="main-heading">Find The Job That Fits Your Life</h1>
          {/* Using the class name from your CSS */}
          <p className="job-desc">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            {/* Using the class name from your CSS */}
            <button type="button" className="find-jobs">
              Find Jobs
            </button>
          </Link>

          {/* Conditional Button for Admin */}
          {isAdmin && (
            <Link to="/admin">
              {/* Using the class name from your CSS */}
              <button type="button" className="create-job-button">
                Admin Dashboard
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;