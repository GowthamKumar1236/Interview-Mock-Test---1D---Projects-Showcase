import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProjectsItem from '../ProjectsItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class ProjectsShowcase extends Component {
  state = {
    projects: [],
    activeCategory: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  getProjectDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeCategory} = this.state

    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(projectsApiUrl, options)

    if (response.ok === true) {
      const projectsData = await response.json()
      const updatedData = projectsData.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projects: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProjects = () => {
    const {projects} = this.state

    return (
      <ul className="projects-list">
        {projects.map(each => (
          <ProjectsItem key={each.id} projectsItemDetails={each} />
        ))}
      </ul>
    )
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} color="#00BFFF" />
    </div>
  )

  onClickRetry = () => {
    this.getProjectDetails()
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        Oops! Something Went Wrong We cannot seem to find the page you are
        looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderAllProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjects()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  onChangeCategory = event => {
    this.setState({activeCategory: event.target.value}, () =>
      this.getProjectDetails(),
    )
  }

  render() {
    const {activeCategory} = this.state

    return (
      <>
        <Header />
        <div className="bg-container">
          <select
            value={activeCategory}
            className="select-container"
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(eachSubject => (
              <option
                key={eachSubject.id}
                value={eachSubject.id}
                className="option-list"
              >
                {eachSubject.displayText}
              </option>
            ))}
          </select>
          {this.renderAllProjects()}
        </div>
      </>
    )
  }
}

export default ProjectsShowcase
