// src/components/SimilarJobItem/index.js
import {AiFillStar} from 'react-icons/ai';
import {BsBriefcaseFill} from 'react-icons/bs';
import {GoLocation} from 'react-icons/go';
import {Link} from 'react-router-dom'; // <-- IMPORT LINK
import './index.css';

const SimilarJobItem = props => {
  const {jobDetails} = props;
  const {
    companyLogoUrl,
    employmentType,
    id, // We need the ID to create the link
    location,
    title,
    rating,
  } = jobDetails;

  // --- THIS IS THE FIX ---
  // The entire card is wrapped in a Link component.
  // When clicked, it will navigate to the new job's details page.
  return (
    <Link to={`/jobs/${id}`} className="similar-job-link">
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
    </Link>
  );
};

export default SimilarJobItem;