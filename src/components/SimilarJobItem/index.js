// src/components/SimilarJobItem/index.js
import {AiFillStar} from 'react-icons/ai';
import {BsBriefcaseFill} from 'react-icons/bs';
import {GoLocation} from 'react-icons/go';
import './index.css'; // <-- ADD THIS LINE

const SimilarJobItem = props => {
  const {jobDetails} = props;
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    title,
    rating,
  } = jobDetails;

  return (
    // Use a more specific class name for the list item
    <li className="similar-job-card">
      <div className="similar-job-top-section">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-logo"
        />
        <div className="similar-job-title-container">
          <h1 className="similar-job-title">{title}</h1>
          <div className="similar-job-rating-container">
            <AiFillStar className="similar-job-star-icon" />
            <p className="similar-job-rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similar-job-desc-heading">Description</h1>
      <p className="similar-job-desc">{jobDescription}</p>
      <div className="similar-job-location-container">
        <div className="similar-job-icon-text-pair">
          <GoLocation className="similar-job-icon" />
          <p className="similar-job-text">{location}</p>
        </div>
        <div className="similar-job-icon-text-pair">
          <BsBriefcaseFill className="similar-job-icon" />
          <p className="similar-job-text">{employmentType}</p>
        </div>
      </div>
    </li>
  );
};

export default SimilarJobItem;