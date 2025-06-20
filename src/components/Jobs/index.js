// src/components/Jobs/index.js
import {useState} from 'react';
import Header from '../Header';
import JobProfileSection from '../JobProfileSection';
import {FiFilter} from 'react-icons/fi'; // Filter Icon
import './index.css';

const Jobs = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <Header />
      <div className="jobs-page-container">
        {/* This button is only visible on mobile */}
        <div className="mobile-filter-button-container">
          <button
            type="button"
            className="mobile-filter-button"
            onClick={() => setShowFilters(true)}
          >
            <FiFilter /> Filters
          </button>
        </div>

        {/* The JobProfileSection now receives props to control the sidebar */}
        <JobProfileSection
          showFilters={showFilters}
          onCloseFilters={() => setShowFilters(false)}
        />
      </div>
    </>
  );
};

export default Jobs;