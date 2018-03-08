import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { database, storage } from '../app-logic-components/Firebase';
import { isEmpty, get, map, merge, isNil } from 'lodash';
import Alert from '../helpers/Alert';
import Footer from '../incudes/Footer';
import FormReadonlyField from '../helpers/form-field-helpers/FormReadonlyField';
import FormField from '../helpers/form-field-helpers/FormField';
import FormFileInput from '../helpers/form-field-helpers/FormFileInput';
import FormTextAreaField from '../helpers/form-field-helpers/FormTextAreaField';
import FormSelect from '../helpers/form-field-helpers/FormSelect';
import TaskSingleComment from '../helpers/task-components/TaskSingleComment';
import TaskAddComment from '../helpers/task-components/TaskAddComment';


class CreateProject extends Component {
  constructor(props) {
    super();
    this.state = {
      user: props.user,
      name: '',
      projectNameSlug: '',
      description: '',
      members: [],
      projectColumns: [],
      labes: [],
      logo: '',
      specification: '',
      startDate: '',
      fileUploadState: false,
      projectDataValid: true,
      redirect: false
    };
  }

  handleTitleChange(changeEvent) {
    this.setState({
      mane: changeEvent.target.value,
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
      description: changeEvent.target.value
    });
  }

  handleMembersChange(changeEvent) {
    this.setState({
      members: changeEvent.target.value.split('|')
    });
  }

  handleProjectColumnsChange(changeEvent) {
    this.setState({
      projectColumns: changeEvent.target.value.split('|')
    });
  }

  handleLabesChange(changeEvent) {
    this.setState({
      labes: changeEvent.target.value.split('|')
    });
  }

  handleProjectSpecificationChange(changeEvent) {
    this.setState({
      specification: changeEvent.target.value
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
        logo: snapshot.downloadURL
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
          name: this.state.name,
          description: this.state.description,
          members: this.state.members,
          boardColumns: this.state.projectColumns,
          logo: this.state.logo,
          specification: this.state.specification,
          startDate: this.state.startDate,
          projectMaster: this.state.user.email,
          tasks: [],
          labels: this.state.labes,
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
    return !(isEmpty(this.state.name) &&
      isEmpty(this.state.description) &&
      isEmpty(this.state.logo) &&
      isEmpty(this.state.members) &&
      isEmpty(this.state.startDate) &&
      isEmpty(this.state.specification));
  }

  render() {
    return (
      <div>
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
                  id="description"
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
                    onBlur={event => this.handleMembersChange(event)}
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
                    onBlur={event => this.handleLabesChange(event)}
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
                    onBlur={event =>
                      this.handleProjectSpecificationChange(event)}
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
        <Footer />
      </div>
    );
  }
}

export default CreateProject;
