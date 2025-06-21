// src/components/AdminDashboard/index.js
import {Component} from 'react';
import Cookies from 'js-cookie';
import {ThreeDots} from 'react-loader-spinner';
import Header from '../Header';
import './index.css';

class AdminDashboard extends Component {
  state = {
    jobs: [],
    apiStatus: 'INITIAL',
    title: '',
    companyLogoUrl: '',
    companyWebsiteUrl: '',
    location: '',
    employmentType: 'Full Time',
    packagePerAnnum: '',
    jobDescription: '',
    editingJobId: null,
    successMessage: '',
    errorMessage: '',
    // --- NEW: State for the search feature ---
    searchQuery: '',
  };

  // --- All existing logic functions (componentDidMount, fetchJobs, etc.) remain the same ---
  componentDidMount() {
    this.fetchJobs();
  }

  fetchJobs = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'});
    const token = Cookies.get('jwt_token');
    const url = `${process.env.REACT_APP_API_URL}/api/jobs`;
    const options = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      const formattedJobs = data.jobs.map(job => ({...job, id: job.id}));
      this.setState({jobs: formattedJobs, apiStatus: 'SUCCESS'});
    } else {
      this.setState({apiStatus: 'FAILURE'});
    }
  };

  handleInputChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  // --- NEW: Handler for the search input ---
  handleSearchChange = event => {
    this.setState({searchQuery: event.target.value});
  };

  handleFormSubmit = async event => {
    event.preventDefault();
    this.setState({successMessage: '', errorMessage: ''});
    const {
      editingJobId,
      title,
      companyLogoUrl,
      companyWebsiteUrl,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
    } = this.state;
    const token = Cookies.get('jwt_token');
    const jobData = {
      title,
      companyLogoUrl,
      companyWebsiteUrl,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
    };
    const isUpdating = editingJobId !== null;
    const url = isUpdating
      ? `${process.env.REACT_APP_API_URL}/api/jobs/${editingJobId}`
      : `${process.env.REACT_APP_API_URL}/api/jobs`;
    const options = {
      method: isUpdating ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    };
    const response = await fetch(url, options);
    if (response.ok) {
      this.setState({
        successMessage: `Job ${isUpdating ? 'updated' : 'created'} successfully!`,
      });
      this.resetForm();
      this.fetchJobs();
    } else {
      this.setState({errorMessage: 'Failed to save job. Please try again.'});
    }
  };

  handleEditClick = job => {
    this.setState({
      editingJobId: job.id,
      title: job.title,
      companyLogoUrl: job.company_logo_url,
      companyWebsiteUrl: job.company_website_url || '',
      location: job.location,
      employmentType: job.employment_type,
      packagePerAnnum: job.package_per_annum,
      jobDescription: job.job_description,
    });
    window.scrollTo(0, 0);
  };

  handleDeleteClick = async jobId => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const token = Cookies.get('jwt_token');
      const url = `${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`;
      const options = {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${token}`},
      };
      const response = await fetch(url, options);
      if (response.ok) {
        this.setState({successMessage: 'Job deleted successfully!'});
        this.fetchJobs();
      } else {
        this.setState({errorMessage: 'Failed to delete job.'});
      }
    }
  };

  resetForm = () => {
    this.setState({
      editingJobId: null,
      title: '',
      companyLogoUrl: '',
      companyWebsiteUrl: '',
      location: '',
      employmentType: 'Full Time',
      packagePerAnnum: '',
      jobDescription: '',
    });
  };


  render() {
    const {
      editingJobId,
      title,
      companyLogoUrl,
      companyWebsiteUrl,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      successMessage,
      errorMessage,
      apiStatus,
      jobs,
      // --- NEW: Get search query from state ---
      searchQuery,
    } = this.state;

    // --- NEW: Filter the jobs list based on the search query ---
    const filteredJobs = jobs.filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
      <>
        <Header />
        <div className="admin-page-container">
          <h1 className="admin-page-title">Admin Dashboard</h1>
          <div className="admin-layout">
            {/* Left Column: Form */}
            <div className="admin-form-container">
              <form className="admin-form" onSubmit={this.handleFormSubmit}>
                <h2>{editingJobId ? 'Edit Job' : 'Add New Job'}</h2>
                <div className="form-group">
                  <label htmlFor="title">Job Title</label>
                  <input id="title" name="title" value={title} onChange={this.handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="companyLogoUrl">Company Logo URL</label>
                  <input id="companyLogoUrl" name="companyLogoUrl" value={companyLogoUrl} onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="companyWebsiteUrl">Company Website URL</label>
                  <input id="companyWebsiteUrl" name="companyWebsiteUrl" value={companyWebsiteUrl} onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input id="location" name="location" value={location} onChange={this.handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="employmentType">Employment Type</label>
                  <select id="employmentType" name="employmentType" value={employmentType} onChange={this.handleInputChange}>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="packagePerAnnum">Package Per Annum</label>
                  <input id="packagePerAnnum" name="packagePerAnnum" value={packagePerAnnum} onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="jobDescription">Job Description</label>
                  <textarea id="jobDescription" name="jobDescription" value={jobDescription} onChange={this.handleInputChange} required />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="submit-btn">{editingJobId ? 'Update Job' : 'Create Job'}</button>
                  {editingJobId && <button type="button" className="cancel-btn" onClick={this.resetForm}>Cancel Edit</button>}
                </div>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </form>
            </div>

            {/* Right Column: Jobs List */}
            <div className="jobs-list-container">
              <h2>Manage Existing Jobs</h2>
              
              {/* --- NEW: Search Bar --- */}
              <div className="admin-search-container">
                <input
                  type="search"
                  className="admin-search-input"
                  placeholder="Search by job title..."
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                />
              </div>

              {apiStatus === 'IN_PROGRESS' && <div className="loader-container"><ThreeDots color="#4f46e5" height={80} width={80} /></div>}
              {apiStatus === 'FAILURE' && <p className="error-message">Failed to load jobs data.</p>}
              {apiStatus === 'SUCCESS' && (
                // --- UPDATED: Use the filteredJobs array ---
                filteredJobs.length === 0 ? (
                  <p className="no-jobs-message">
                    {searchQuery ? 'No jobs match your search.' : 'No jobs found. Add one using the form.'}
                  </p>
                ) : (
                  <ul className="jobs-list">
                    {filteredJobs.map(job => (
                      <li key={job.id} className="job-item-admin">
                        <div className="job-info">
                          <h3>{job.title}</h3>
                          <p>{job.location} - {job.employment_type}</p>
                        </div>
                        <div className="job-actions">
                          <button className="edit-btn" onClick={() => this.handleEditClick(job)}>Edit</button>
                          <button className="delete-btn" onClick={() => this.handleDeleteClick(job.id)}>Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AdminDashboard;