// src/components/ProfileDetails/index.js
import {Component} from 'react';
import {ThreeDots} from 'react-loader-spinner';
import Cookies from 'js-cookie';
import './index.css'; // We will update this CSS file

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

// This component now fetches and displays profile details in a card format
class ProfileDetails extends Component {
  state = {
    profileData: {},
    apiStatus: apiStatusConstants.initial,
  };

  componentDidMount() {
    this.getProfileDetails();
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'});
    const jwtToken = Cookies.get('jwt_token');
    const url = `http://localhost:5001/api/profile`;
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
    };

    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      this.setState({
        profileData: data.profile_details,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({apiStatus: 'FAILURE'});
    }
  };

  renderLoadingView = () => (
    <div className="profile-loader">
      <ThreeDots color="#4f46e5" height={40} width={40} />
    </div>
  );

  renderFailureView = () => (
    <div className="profile-failure">
      <p>Failed to load profile.</p>
      <button type="button" onClick={this.getProfileDetails}>Retry</button>
    </div>
  );

  renderSuccessView = () => {
    const {profileData} = this.state;
    const {name, short_bio, profile_image_url} = profileData;
    return (
      <>
        <img src={profile_image_url} alt="profile" className="profile-avatar" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{short_bio}</p>
      </>
    );
  };

  render() {
    const {apiStatus} = this.state;
    
    // The main container now has a class for dropdown styling
    return (
      <div className="profile-details-container">
        {apiStatus === 'IN_PROGRESS' && this.renderLoadingView()}
        {apiStatus === 'FAILURE' && this.renderFailureView()}
        {apiStatus === 'SUCCESS' && this.renderSuccessView()}
      </div>
    );
  }
}

export default ProfileDetails;