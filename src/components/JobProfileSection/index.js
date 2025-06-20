// src/components/JobProfileSection/index.js
import {Component} from 'react';
import {ThreeDots} from 'react-loader-spinner';
import {BsSearch} from 'react-icons/bs';
import {IoMdClose} from 'react-icons/io'; // Close Icon
import Cookies from 'js-cookie';
import JobCard from '../JobCard';
import JobsFilterGroup from '../JobsFilterGroup';
import './index.css';

// ... (employmentTypesList, salaryRangesList, apiStatusConstants remain the same) ...
const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'Full Time'},
  {label: 'Part Time', employmentTypeId: 'Part Time'},
  {label: 'Freelance', employmentTypeId: 'Freelance'},
  {label: 'Internship', employmentTypeId: 'Internship'},
];
const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
];
const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

class JobProfileSection extends Component {
  // ... (state and all logic functions like getJobDetails remain the same) ...
  state = {
    jobsList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: 0,
    apiStatus: apiStatusConstants.initial,
  };

  componentDidMount() {
    this.getJobDetails();
  }

  getJobDetails = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'});
    const jwtToken = Cookies.get('jwt_token');
    const {salaryRange, employmentType, searchInput} = this.state;
    const url = `http://localhost:5001/api/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryRange}&search=${searchInput}`;
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }));
      this.setState({jobsList: updatedData, apiStatus: 'SUCCESS'});
    } else {
      this.setState({apiStatus: 'FAILURE'});
    }
  };

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value});
  };

  onEnterKey = event => {
    if (event.key === 'Enter') {
      this.getJobDetails();
    }
  };

  changeSalaryRange = salary => {
    this.setState({salaryRange: salary}, this.getJobDetails);
  };

  changeEmploymentType = type => {
    this.setState(
      prev => {
        const {employmentType} = prev;
        const newEmploymentType = employmentType.includes(type)
          ? employmentType.filter(t => t !== type)
          : [...employmentType, type];
        return {employmentType: newEmploymentType};
      },
      this.getJobDetails,
    );
  };

  renderJobsList = () => {
    const {jobsList} = this.state;
    const jobsDisplay = jobsList.length > 0;

    return jobsDisplay ? (
      <ul className="job-cards-list">
        {jobsList.map(eachData => (
          <JobCard key={eachData.id} jobDetails={eachData} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    );
  };

  renderFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  );

  renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <ThreeDots color="#ffffff" height={50} width={50} />
    </div>
  );

  renderJobsContent = () => {
    const {apiStatus} = this.state;
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderJobsList();
      case 'FAILURE':
        return this.renderFailureView();
      case 'IN_PROGRESS':
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    const {searchInput} = this.state;
    const {showFilters, onCloseFilters} = this.props;

    // Add a class to the sidebar container when it should be shown
    const sidebarClassName = `filters-group-container ${
      showFilters ? 'show-sidebar' : ''
    }`;

    return (
      <div className="jobs-section-container">
        {/* --- LEFT COLUMN / SLIDING SIDEBAR --- */}
        <div className={sidebarClassName}>
          {/* This button is only for the mobile sidebar view */}
          <button
            type="button"
            className="sidebar-close-button"
            onClick={onCloseFilters}
          >
            <IoMdClose />
          </button>
          <JobsFilterGroup
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            changeEmploymentType={this.changeEmploymentType}
            changeSalaryRange={this.changeSalaryRange}
          />
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="jobs-list-section">
          <div className="search-input-container">
            <input
              type="search"
              className="search-input"
              placeholder="Search"
              value={searchInput}
              onChange={this.changeSearchInput}
              onKeyDown={this.onEnterKey}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.getJobDetails}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          {this.renderJobsContent()}
        </div>
      </div>
    );
  }
}

export default JobProfileSection;