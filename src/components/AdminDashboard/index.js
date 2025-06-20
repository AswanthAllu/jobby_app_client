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
    // Form state
    title: '',
    companyLogoUrl: '',
    companyWebsiteUrl: '',
    location: '',
    employmentType: 'Full Time',
    packagePerAnnum: '',
    jobDescription: '',
    // Editing state
    editingJobId: null,
    successMessage: '',
    errorMessage: '',
  };

  componentDidMount() {
    this.fetchJobs();
  }

  fetchJobs = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'});
    const token = Cookies.get('jwt_token');
    const url = `http://localhost:5001/api/jobs`;
    const options = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      const formattedJobs = data.jobs.map(job => ({
        ...job,
        id: job.id,
      }));
      this.setState({jobs: formattedJobs, apiStatus: 'SUCCESS'});
    } else {
      this.setState({apiStatus: 'FAILURE'});
    }
  };

  handleInputChange = event => {
    this.setState({[event.target.name]: event.target.value});
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
      ? `http://localhost:5001/api/jobs/${editingJobId}`
      : `http://localhost:5001/api/jobs`;

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
      this.setState({successMessage: `Job ${isUpdating ? 'updated' : 'created'} successfully!`});
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
      const url = `http://localhost:5001/api/jobs/${jobId}`;
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // --- THIS FUNCTION IS NOW BACK IN THE COMPONENT ---
  renderJobsList = () => {
    const {jobs} = this.state;
    return (
      // Using the original class names for the list part
      <div className="jobs-list-container">
        <h2>Manage Existing Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs found. Add one using the form above.</p>
        ) : (
          <ul className="jobs-list">
            {jobs.map(job => (
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
        )}
      </div>
    );
  };

  // --- THIS FUNCTION IS ALSO BACK ---
  renderContent = () => {
    const {apiStatus} = this.state;
    switch (apiStatus) {
      case 'IN_PROGRESS':
        return <div className="loader-container"><ThreeDots color="#4f46e5" height={80} width={80} /></div>;
      case 'FAILURE':
        return <p className="error-message">Failed to load jobs data. Please try again.</p>;
      case 'SUCCESS':
        return this.renderJobsList();
      default:
        return null;
    }
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
    } = this.state;

    return (
      <>
        <Header />
        {/* Using the original class name for the main container */}
        <div className="admin-dashboard">
          <h1>Admin Dashboard</h1>
          {/* Using the form-specific class names */}
          <form className="admin-form" onSubmit={this.handleFormSubmit}>
            <h2>{editingJobId ? 'Edit Job' : 'Add New Job'}</h2>
            <input name="title" value={title} onChange={this.handleInputChange} placeholder="Job Title" required />
            <input name="companyLogoUrl" value={companyLogoUrl} onChange={this.handleInputChange} placeholder="Company Logo URL" />
            <input name="companyWebsiteUrl" value={companyWebsiteUrl} onChange={this.handleInputChange} placeholder="Company Website URL" />
            <input name="location" value={location} onChange={this.handleInputChange} placeholder="Location" required />
            <select name="employmentType" value={employmentType} onChange={this.handleInputChange}>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
            <input name="packagePerAnnum" value={packagePerAnnum} onChange={this.handleInputChange} placeholder="Package Per Annum (e.g., 15 LPA)" />
            <textarea name="jobDescription" value={jobDescription} onChange={this.handleInputChange} placeholder="Job Description" required />
            <button type="submit" className="submit-job-button">
              {editingJobId ? 'Update Job' : 'Create Job'}
            </button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>

          {/* --- THIS LINE ADDS THE JOBS LIST BACK TO THE PAGE --- */}
          {this.renderContent()}
        </div>
      </>
    );
  }
}

export default AdminDashboard;