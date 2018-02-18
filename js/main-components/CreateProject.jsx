import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { database, storage } from '../app-logic-components/Firebase';
import { isEmpty } from 'lodash';
import Alert from '../helpers/Alert';

class CreateProject extends Component {
  constructor(props) {
    super();
    this.state = {
      user: props.user,
      projectName: '',
      projectNameSlug: '',
      projectDescription: '',
      projectMembers: [],
      projectColumns: [],
      projectLabels: [],
      projectLogoUrl: '',
      projectSpecificationUrl: '',
      startDate: '',
      fileUploadState: false,
      projectDataValid: true,
      redirect: false
    };
  }

  handleTitleChange(changeEvent) {
    this.setState({
      projectName: changeEvent.target.value,
      projectNameSlug: this.createTitleSlug(changeEvent.target.value)
    });
  }

  createTitleSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s/g, '-')
      .replace(/\,/g, '')
      .replace(/\%/g, '');
  }

  handleDescriptionChange(changeEvent) {
    this.setState({
      projectDescription: changeEvent.target.value
    });
  }

  handleProjectMembersChange(changeEvent) {
    this.setState({
      projectMembers: changeEvent.target.value.split('|')
    });
  }

  handleProjectColumnsChange(changeEvent) {
    this.setState({
      projectColumns: changeEvent.target.value.split('|')
    });
  }

  handleProjectLabelsChange(changeEvent) {
    this.setState({
      projectLabels: changeEvent.target.value.split('|')
    });
  }

  handleProjectSpecificationChange(changeEvent) {
    this.setState({
      projectSpecificationUrl: changeEvent.target.value
    });
  }

  handleProjectStartDateChange(changeEvent) {
    this.setState({
      startDate: new Date(changeEvent.target.value).toDateString()
    });
  }

  handleImageUpload(changeEvent) {
    if (isEmpty(this.state.projectNameSlug)) {
      return;
    }
    this.storrageRef = storage.ref(
      `/${this.state.projectNameSlug}/project-images`
    );
    const file = changeEvent.target.files[0];
    const uploadTask = this.storrageRef
      .child(file.name)
      .put(file, { contentType: file.type });
    uploadTask.then(snapshot => {
      this.setState({
        projectLogoUrl: snapshot.downloadURL
      });
      this.setState({
        fileUploadState: true
      });
    });
  }

  createProject() {
    if (this.isProjectDataValid()) {
      this.projectRef = database.ref(`/${this.state.projectNameSlug}`);
      this.projectRef
        .set({
          name: this.state.projectName,
          description: this.state.projectDescription,
          members: this.state.projectMembers,
          boardColumns: this.state.projectColumns,
          logo: this.state.projectLogoUrl,
          specification: this.state.projectSpecificationUrl,
          startDate: this.state.startDate,
          projectMaster: this.state.user.email,
          tasks: [],
          labels: this.state.projectLabels,
          projectNameSlug: this.state.projectNameSlug
        })
        .then(() => {
          this.setState({ redirect: true });
        });
    } else {
      this.setState({
        projectDataValid: false
      });
      setTimeout(
        () =>
          this.setState({
            projectDataValid: true
          }),
        2300
      );
    }
  }

  isProjectDataValid() {
    return !(isEmpty(this.state.projectName) &&
      isEmpty(this.state.projectDescription) &&
      isEmpty(this.state.projectLogoUrl) &&
      isEmpty(this.state.projectMembers) &&
      isEmpty(this.state.startDate) &&
      isEmpty(this.state.projectSpecificationUrl));
  }

  render() {
    return (
      <main role="main" className="container-fluid">
        {this.state.redirect || !this.state.user
          ? <Redirect to="/" />
          : <div />}
        <div id="content">
          <div className="form create-project col-md-8">
            {!this.state.projectDataValid
              ? <Alert
                  type="warning"
                  message="Please check if all project data has been entered."
                />
              : <div />}
            <h1 className="text-center">CREATE NEW PROJECT</h1>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label>Project Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="projectTitle"
                  placeholder="Project Title"
                  onBlur={event => this.handleTitleChange(event)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Project Description</label>
              <textarea
                className="form-control"
                id="projectDescription"
                placeholder="Project description..."
                onBlur={event => this.handleDescriptionChange(event)}
              />
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label>Project Members</label>
                <input
                  type="text"
                  className="form-control"
                  id="Members"
                  placeholder="project members"
                  onBlur={event => this.handleProjectMembersChange(event)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label>Project Board Columns</label>
                <input
                  type="text"
                  className="form-control"
                  id="columns"
                  placeholder="Enter Project Board Columns"
                  onBlur={event => this.handleProjectColumnsChange(event)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label>Project Board Labels</label>
                <input
                  type="text"
                  className="form-control"
                  id="columns"
                  placeholder="Enter Project Board Labels"
                  onBlur={event => this.handleProjectLabelsChange(event)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label>Project Specification Url</label>
                <input
                  type="text"
                  className="form-control"
                  id="projet-specification-url"
                  placeholder="Project Specification Url"
                  onBlur={event => this.handleProjectSpecificationChange(event)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <input
                  type="text"
                  className="form-control"
                  id="projet-start-date"
                  placeholder="Project Start Date (MM-DD-YYYY)"
                  onBlur={event => this.handleProjectStartDateChange(event)}
                />
              </div>
              <div className="custom-file col-md-6">
                <input
                  type="file"
                  className="custom-file-input"
                  id="customFile"
                  onChange={event => this.handleImageUpload(event)}
                />
                <label className="custom-file-label">
                  Choose project logo
                </label>
              </div>
            </div>
            <div className="col-md-6">

              {this.state.fileUploadState
                ? <Alert
                    type="success"
                    message="Your File is Successfully uploaded"
                  />
                : <div />}
            </div>
            <button
              className="btn btn-success btn-block"
              onClick={() => this.createProject()}
            >
              Create Project
            </button>
          </div>
        </div>
      </main>
    );
  }
}

export default CreateProject;
