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

class CreateTask extends Component {
  constructor(props) {
    super();
    this.state = {
      user: props.user,
      name: '',
      taskNameSlug: '',
      description: '',
      assigner: '',
      reviewer: '',
      image: '',
      externalLink: '',
      type: 'story',
      label: '',
      highPriorityTask: true,
      taskDataValid: true,
      redirect: false,
      availableTaskTypes: ['story', 'bug', 'impovement', 'maintenance'],
      projectUrl: get(props.project, 'projectNameSlug'),
      project: props.project,
      oldTaskState: props.task || {},
      oldTaskExists: !isNil(props.task),
      taskDeleted: false,
      commentText: ''
    };

    if (!isEmpty(props.task)) {
      merge(this.state, props.task);
    }
  }

  handleTitleChange(changeEvent) {
    this.setState({
      name: changeEvent.target.value,
      taskNameSlug: this.createTitleSlug(changeEvent.target.value)
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

  handleTaskExternalRelatedUrlChange(changeEvent) {
    this.setState({
      externalLink: changeEvent.target.value
    });
  }

  handlePriorityChange() {
    this.setState({
      highPriorityTask: !this.state.highPriorityTask
    });
  }

  handleTaskTypeChange(change) {
    this.setState({
      type: change.target.value
    });
  }

  handleTaskLabelChange(change) {
    this.setState({
      label: change.target.value
    });
  }

  handleImageUpload(changeEvent) {
    if (isEmpty(this.state.taskNameSlug)) {
      return;
    }
    this.storrageRef = storage.ref(`/${this.state.taskNameSlug}/task-images`);
    const file = changeEvent.target.files[0];
    const uploadTask = this.storrageRef
      .child(file.name)
      .put(file, { contentType: file.type });
    uploadTask.then(snapshot => {
      console.log(snapshot.downloadURL);
      this.setState({
        image: snapshot.downloadURL
      });
      this.setState({
        fileUploadState: true
      });
    });
  }

  getOldValue(fieldName) {
    return get(this.state.oldTaskState, `${fieldName}`) || '';
  }

  updateFieldValue(event, field) {
    this.state.oldTaskState[field] = event.target.value;
    this.setState({
      oldTaskState: this.state.oldTaskState
    });
  }

  createtask() {
    if (this.istaskDataValid()) {
      const date = new Date().toDateString();
      const timestamp = Date.now();

      const taskDBReference = isNil(this.state.oldTaskState)
        ? `${this.state.projectUrl}/tasks/${this.state.taskNameSlug}-${timestamp}`
        : `${this.state.projectUrl}/tasks/${this.state.taskNameSlug}`;

      this.taskRef = database.ref(taskDBReference);

      this.taskRef.set({
        name: this.state.name,
        description: this.state.description,
        image: this.state.image || '',
        externalLink: this.state.externalLink || '',
        creationDate: this.state.creationDate || date,
        createdBy: this.state.createdBy || this.state.user.email,
        columnIndex: this.state.columnIndex || 0,
        type: this.state.type,
        label: this.state.label,
        highPriorityTask: this.state.highPriorityTask,
        taskNameSlug: this.state.taskNameSlug ||
          `${this.state.taskNameSlug}-${timestamp}`,
        comments: this.state.oldTaskState.comments || [],
        assigner: this.state.assigner,
        reviewer: this.state.reviewer
      });
    } else {
      this.setState({
        taskDataValid: false
      });
      this.setStateAfterTimeout({ taskDataValid: true }, 2300);
    }
  }

  istaskDataValid() {
    return !(isEmpty(this.state.name) && isEmpty(this.state.description));
  }

  deleteTask() {
    database
      .ref(`${this.state.projectUrl}/tasks/${this.state.taskNameSlug}`)
      .set(null);
  }

  commentTask() {
    console.log(this.state.commentText);
    if (!isEmpty(this.state.commentText)) {
      const id = Date.now();
      database
        .ref(
          `${this.state.projectUrl}/tasks/${this.state.taskNameSlug}/comments/${id}`
        )
        .set({
          id: id,
          user: this.state.user.displayName,
          comment: this.state.commentText,
          date: new Date().toDateString()
        });
    }
  }

  handleCommentTextChange(event) {
    console.log(event.target.value);
    this.setState({
      commentText: event.target.value
    });
  }

  setStateAfterTimeout(stateChange, timeoutTime) {
    setTimeout(() => this.setState(stateChange), timeoutTime);
  }

  render() {
    return (
      <div>
        <main role="main" className="container-fluid">
          {this.state.redirect || !this.state.user || !this.state.projectUrl
            ? <Redirect
                to={`/projects/${this.state.projectUrl ? this.state.projectUrl : ''}`}
              />
            : <div />}
          <div id="content">
            <div className="form create-project create-task col-md-8">
              {!this.state.taskDataValid
                ? <Alert
                    type="warning"
                    message="Please check if all task data has been entered."
                  />
                : <div />}
              {this.state.taskDeleted
                ? <Alert type="info" message="Successfully deleted task." />
                : <div />}
              <h1 className="text-center">
                {!this.state.oldTaskExists
                  ? 'CREATE NEW TASK'
                  : this.getOldValue('name')}
              </h1>
              {this.state.createdBy
                ? <small className="text-muted">
                    created by
                    {' '}
                    {`${this.state.createdBy}`}
                    {' '}
                    at
                    {' '}
                    {`${this.state.creationDate}`}
                    <hr />
                  </small>
                : <hr />}

              {get(this.state.oldTaskState, 'name')
                ? <div />
                : <FormField
                    fieldName={'title'}
                    type={'Task'}
                    fieldType={'text'}
                    value={this.getOldValue('title')}
                    handleChange={this.handleTitleChange.bind(this)}
                    updateFieldValue={this.updateFieldValue.bind(this)}
                  />}

              {get(this.state.oldTaskState, 'assigner')
                ? <FormReadonlyField
                    fieldName={'assigner'}
                    value={this.getOldValue('assigner')}
                    type={'Task'}
                    fieldType={'text'}
                  />
                : <div />}

              {get(this.state.oldTaskState, 'reviewer')
                ? <FormReadonlyField
                    fieldName={'reviewer'}
                    value={this.getOldValue('reviewer')}
                    type={'Task'}
                    fieldType={'text'}
                  />
                : <div />}

              <FormTextAreaField
                fieldName={'description'}
                value={this.getOldValue('description')}
                type={'Task'}
                handleChange={this.handleDescriptionChange.bind(this)}
                updateFieldValue={this.updateFieldValue.bind(this)}
              />

              <div className="form-row">
                <FormField
                  fieldName={'externalLink'}
                  value={this.getOldValue('externalLink')}
                  type={'Task'}
                  fieldType={'text'}
                  handleChange={this.handleTaskExternalRelatedUrlChange.bind(
                    this
                  )}
                  updateFieldValue={this.updateFieldValue.bind(this)}
                />
              </div>
              <label className="form-check-label col-md-12">
                Select task type and  label
              </label>
              <div className="custom-file col-md-6">
                <FormSelect
                  handleSelectChange={this.handleTaskTypeChange.bind(this)}
                  options={this.state.availableTaskTypes}
                  selected={this.state.type}
                  type={'Task'}
                  selectName={'Type'}
                />
              </div>
              <div className="custom-file col-md-6">
                <FormSelect
                  handleSelectChange={this.handleTaskLabelChange.bind(this)}
                  options={get(this.state.project, 'labels')}
                  selected={this.state.label}
                  type={'Task'}
                  selectName={'Label'}
                />
              </div>
              <br />
              <br />
              <div className="custom-file col-md-12">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="high"
                    checked={this.state.highPriorityTask}
                    onChange={() => this.handlePriorityChange()}
                  />
                  <label className="form-check-label">
                    {' '}Mark If This Is High Priority Task
                  </label>
                </div>
              </div>
              <br />
              <FormFileInput
                handleImageUpload={this.handleImageUpload.bind(this)}
                fileUploadState={this.state.fileUploadState}
              />
              {get(this.state, 'image')
                ? <img src={this.state.image} className="img img-responsive" />
                : <div />}
              <br />
              {map(this.state.comments, comment => (
                <TaskSingleComment comment={comment} key={comment.id} />
              ))}
              <br />
              {this.state.oldTaskExists
                ? <TaskAddComment
                    handleChange={this.handleCommentTextChange.bind(this)}
                    submitComment={this.commentTask.bind(this)}
                  />
                : <div />}
              {this.state.oldTaskExists
                ? <button
                    className="btn btn-danger btn-lg"
                    onClick={() => this.deleteTask()}
                  >
                    Delete Task
                  </button>
                : <div />}
              <button
                className={`btn ${this.state.oldTaskExists ? 'btn-dark btn-lg' : 'btn-success btn-block'}`}
                onClick={() => this.createtask()}
              >
                {this.state.oldTaskExists ? 'Save Changes' : 'Create Task'}
              </button>

            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

export default CreateTask;
