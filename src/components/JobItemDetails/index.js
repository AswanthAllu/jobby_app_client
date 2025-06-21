// src/components/JobItemDetails/index.js
import {Component} from 'react';
import {useParams} from 'react-router-dom'; // <-- Import the useParams hook
import Cookies from 'js-cookie';
import {AiFillStar} from 'react-icons/ai';
import {GoLocation} from 'react-icons/go';
import {BsBriefcaseFill} from 'react-icons/bs';
import {BiLinkExternal} from 'react-icons/bi';
import {ThreeDots} from 'react-loader-spinner';
import Header from '../Header';
import SimilarJobItem from '../SimilarJobItem';
import './index.css';

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

class JobItemDetails extends Component {
  state = {
    jobItemList: {},
    similarJobItemList: [],
    apiStatus: apiStatusConstants.initial,
  };

  // --- UPDATED: componentDidUpdate now compares the ID from props ---
  componentDidUpdate(prevProps) {
    // Check if the router's id prop has changed
    if (this.props.router.params.id !== prevProps.router.params.id) {
      this.getJobItem();
    }
  }

  componentDidMount() {
    this.getJobItem();
  }

  getJobItem = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'});
    
    // --- UPDATED: Get the ID directly from props ---
    const {id} = this.props.router.params;

    const jwtToken = Cookies.get('jwt_token');
    const url = `${process.env.REACT_APP_API_URL}/api/jobs/${id}`;
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    };

    // ... (rest of the getJobItem function remains the same)
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        const updatedData = {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          lifeAtCompany: data.job_details.life_at_company,
          location: data.job_details.location,
          rating: data.job_details.rating,
          title: data.job_details.title,
          packagePerAnnum: data.job_details.package_per_annum,
          skills: data.job_details.skills.map(eachSkill => ({
            name: eachSkill.name,
          })),
        };
        const updatedSkillData = data.similar_jobs.map(eachSimilarJob => ({
          companyLogoUrl: eachSimilarJob.company_logo_url,
          employmentType: eachSimilarJob.employment_type,
          jobDescription: eachSimilarJob.job_description,
          id: eachSimilarJob.id,
          rating: eachSimilarJob.rating,
          location: eachSimilarJob.location,
          title: eachSimilarJob.title,
        }));

        this.setState({
          jobItemList: updatedData,
          similarJobItemList: updatedSkillData,
          apiStatus: apiStatusConstants.success,
        });
      } else {
        this.setState({apiStatus: 'FAILURE'});
      }
    } catch (error) {
      this.setState({apiStatus: 'FAILURE'});
    }
  };

  // ... (renderJobItemDetails, renderFailureView, etc. remain the same)
  renderJobItemDetails = () => {
    const {jobItemList, similarJobItemList} = this.state;
    if (Object.keys(jobItemList).length === 0) {
      return null;
    }

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      title,
      rating,
      packagePerAnnum,
      lifeAtCompany,
      skills,
    } = jobItemList;

    const description = lifeAtCompany ? lifeAtCompany.description : '';
    const imageUrl = lifeAtCompany ? lifeAtCompany.imageUrl : '';

    return (
      <div className="full-job-item-container">
        <div className="job-items-container">
          <div className="logo-image-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-justify"
            />
            <div className="title-container">
              <h1 className="company-title-head">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="count-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-salary-container">
            <div className="location-container">
              <div className="responsive">
                <GoLocation className="location-logo" />
                <p className="location-desc">{location}</p>
              </div>
              <div className="responsive">
                <BsBriefcaseFill className="location-logo-brief" />
                <p className="location-desc">{employmentType}</p>
              </div>
            </div>
            <p className="package-desc">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="description-container">
            <h1 className="desc-heading">Description</h1>
            <a
              className="visit-link"
              href={companyWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit <BiLinkExternal className="bi-link" />
            </a>
          </div>
          <p className="job-story-desc">{jobDescription}</p>
          <h1 className="skill-heading">Skills</h1>
          <ul className="skill-container-details">
            {skills.map(eachSkill => (
              <li key={eachSkill.name} className="skill-item-details">
                {eachSkill.name}
              </li>
            ))}
          </ul>
          {description && (
            <>
              <h1 className="life-company-heading">Life at Company</h1>
              <div className="life-at-company-container">
                <p className="life-company-desc">{description}</p>
                {imageUrl && <img src={imageUrl} alt="life at company" className="company-logo" />}
              </div>
            </>
          )}
        </div>

        {similarJobItemList.length > 0 && (
          <>
            <h1 className="similar-job-heading">Similar Jobs</h1>
            <ul className="similar-cards">
              {similarJobItemList.map(eachItem => (
                <SimilarJobItem key={eachItem.id} jobDetails={eachItem} />
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  renderFailureView = () => (
    <div className="render-loading-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="job-item-failure-button"
        onClick={this.getJobItem}
      >
        Retry
      </button>
    </div>
  );

  renderLoadingView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <ThreeDots color="#ffffff" height={50} width={50} />
    </div>
  );

  renderJobViews = () => {
    const {apiStatus} = this.state;
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetails();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      default:
        return null;
    }
  };

  render() {
    return (
      <>
        <Header />
        <div className="get-products-details-container">
          {this.renderJobViews()}
        </div>
      </>
    );
  }
}

// --- THIS IS THE NEW WRAPPER COMPONENT ---
const JobItemDetailsWrapper = () => {
  // useParams() is a hook that gives us the URL parameters, like ':id'
  const params = useParams();
  // We pass the params down to our class component in a 'router' prop
  return <JobItemDetails router={{params}} />;
};

export default JobItemDetailsWrapper;