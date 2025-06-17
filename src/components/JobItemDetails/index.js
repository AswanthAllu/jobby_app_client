import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {ThreeDots} from 'react-loader-spinner' // UPDATED IMPORT

import SkillsCard from '../SkillsCard'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemList: {},
    similarJobItemList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItem()
  }

  getJobItem = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    // To get the ID from the URL with react-router-dom v6, we need a wrapper component.
    // For a quick fix in a class component, we can parse the window location.
    const urlPath = window.location.pathname
    const id = urlPath.substring(urlPath.lastIndexOf('/') + 1)

    const jwtToken = Cookies.get('jwt_token')
    const url = `http://localhost:5001/api/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      // The frontend expects camelCase, but our backend sends snake_case. Let's format it.
      const updatedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        rating: data.job_details.rating,
        title: data.job_details.title,
        packagePerAnnum: data.job_details.package_per_annum,
        skills: data.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
      }
      const updatedSkillData = data.similar_jobs.map(eachSimilarJob => ({
        companyLogoUrl: eachSimilarJob.company_logo_url,
        employmentType: eachSimilarJob.employment_type,
        jobDescription: eachSimilarJob.job_description,
        id: eachSimilarJob.id,
        rating: eachSimilarJob.rating,
        location: eachSimilarJob.location,
        title: eachSimilarJob.title,
      }))

      this.setState({
        jobItemList: updatedData,
        similarJobItemList: updatedSkillData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobItemDetails = () => {
    const {jobItemList, similarJobItemList} = this.state
    // Check if jobItemList and its nested properties exist before destructuring
    if (!jobItemList || !jobItemList.lifeAtCompany) {
      return null // or a loading state
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
    } = jobItemList
    const {description, imageUrl} = lifeAtCompany

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
              Visit
              <BiLinkExternal className="bi-link" />
            </a>
          </div>
          <p className="job-story-desc">{jobDescription}</p>
          <h1 className="skill-heading">Skills</h1>
          <ul className="skill-container">
            {skills.map(eachSkill => (
              <SkillsCard key={eachSkill.name} skillDetails={eachSkill} />
            ))}
          </ul>
          <h1 className="life-company-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-company-desc">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="company-logo"
            />
          </div>
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-cards">
          {similarJobItemList.map(eachItem => (
            <SimilarJobItem key={eachItem.id} jobDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="render-loading-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong </h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="job-item-failure-button"
        onClick={this.getJobItem}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="profile-loader-container" data-testid="loader">
      {/* UPDATED COMPONENT USAGE */}
      <ThreeDots color="#ffffff" height={50} width={50} />
    </div>
  )

  renderJobViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="get-products-details-container">
          {this.renderJobViews()}
        </div>
      </>
    )
  }
}

export default JobItemDetails