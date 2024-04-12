import './index.css'

const ProjectsItem = props => {
  const {projectsItemDetails} = props
  const {name, imageUrl} = projectsItemDetails

  return (
    <li className="list-items">
      <img src={imageUrl} alt={name} className="image" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectsItem
