import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { database, storage } from '../app-logic-components/Firebase';
import { isEmpty, get, map, merge, isNil } from 'lodash';
import Alert from '../helpers/Alert';
import FormReadonlyField from '../helpers/form-field-helpers/FormReadonlyField';
import FormField from '../helpers/form-field-helpers/FormField';
import FormFileInput from '../helpers/form-field-helpers/FormFileInput';
import FormTextAreaField from '../helpers/form-field-helpers/FormTextAreaField';

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
      projectUrl: get(props.project, 'projectNameSlug'),
      project: props.project,
      oldTaskState: props.task || {},
      hasOldTaskTitle: isNil(props.task)
    };

    if (!isEmpty(props.task)) {
      merge(this.state, props.task)
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
    })
  }

  handleTaskTypeChange(change) {
    this.setState({
      type: change.target.value
    })
  }

  handleTaskLabelChange(change) {
    this.setState({
      label: change.target.value
    })
  }

  handleImageUpload(changeEvent) {
    if (isEmpty(this.state.taskNameSlug) || isEmpty(changeEvent.target.files[0])) {
      return;
    }
    this.storrageRef = storage.ref(
      `/${this.state.taskNameSlug}/task-images`
    );
    const file = changeEvent.target.files[0];
    const uploadTask = this.storrageRef
      .child(file.name)
      .put(file, { contentType: file.type });
    uploadTask.then(snapshot => {
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
    this.state.oldTaskState[`${field}`] = event.target.value;

    this.setState({
      oldTaskState: this.state.oldTaskState
    })
  }

  createtask() {
    if (this.istaskDataValid()) {
      const date = new Date().toDateString();
      const timestamp = Date.now();

      this.taskRef = database.ref(`${this.state.projectUrl}/tasks/${this.state.taskNameSlug}-${timestamp}`);
      this.taskRef
        .set({
          name: this.state.name,
          description: this.state.description,
          image: this.state.image || '',
          externalLink: this.state.externalLink || '',
          creationDate: date,
          createdBy: this.state.user.email,
          childTasks: [],
          columnIndex: 0,
          type: this.state.type,
          label: this.state.label,
          highPriorityTask: this.state.highPriorityTask,
          taskNameSlug: `${this.state.taskNameSlug}-${timestamp}`
        })

        this.setState({ redirect: true });
    } else {
      this.setState({
        taskDataValid: false
      });
      setTimeout(
        () =>
          this.setState({
            taskDataValid: true
          }),
        2300
      );
    }
  }

  istaskDataValid() {
    return !(isEmpty(this.state.name) && isEmpty(this.state.description))
  }

  render() {
    return (
      <main role="main" className="container-fluid">
        {this.state.redirect || !this.state.user || !this.state.projectUrl
          ? <Redirect to={`/projects/${this.state.projectUrl ? this.state.projectUrl : ''}`}/>
          : <div />}
        <div id="content">
          <div className="form create-project create-task col-md-8">
            {!this.state.taskDataValid
              ? <Alert
                  type="warning"
                  message="Please check if all task data has been entered."
                />
              : <div />}
            <h1 className="text-center">{this.state.hasOldTaskTitle ? 'CREATE NEW TASK' : this.getOldValue('name')}</h1>

            {
              get(this.state.oldTaskState, 'name') ?
                <div /> :
                <FormField
                  fieldName={'title'}
                  type={'Task'}
                  fieldType={'text'}
                  value={this.getOldValue('title')}
                  handleChange={this.handleTitleChange.bind(this)}
                  updateFieldValue={this.updateFieldValue.bind(this, event, 'title')}
                />
            }

            {
              get(this.state.oldTaskState, 'assigner') ?
                <FormReadonlyField
                  fieldName={'assigner'}
                  value={this.getOldValue('assigner')}
                  type={'Task'}
                  fieldType={'text'}
                /> :
                <div />
            }

            {
              get(this.state.oldTaskState, 'reviewer') ?
                <FormReadonlyField
                  fieldName={'reviewer'}
                  value={this.getOldValue('reviewer')}
                  type={'Task'}
                  fieldType={'text'}
                /> :
                <div />
            }

            <FormTextAreaField
              fieldName={'description'}
              value={this.getOldValue('description')}
              type={'Task'}
              handleChange={this.handleDescriptionChange.bind(this)}
              updateFieldValue={this.updateFieldValue.bind(this, event, 'description')}
            />

            <div className="form-row">
              <FormField
                fieldName={'externalLink'}
                value={this.getOldValue('externalLink')}
                type={'Task'}
                fieldType={'text'}
                handleChange={this.handleTaskExternalRelatedUrlChange.bind(this)}
                updateFieldValue={this.updateFieldValue.bind(this, event, 'externalLink')}
              />
            </div>
            <div className="custom-file col-md-6">
              <select className="form-control" onChange={change => this.handleTaskTypeChange(change)}>
                <option value="story">Story</option>
                <option value="improvement">Improvement</option>
                <option value="bug">Bug</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="custom-file col-md-6">
              <select className="form-control" onChange={change => this.handleTaskLabelChange(change)}>
                <option value="">Choose Task Label</option>
                {
                  map(
                    get(this.state.project, 'labels'),
                    label => <option value={labes}>label</option>
                  )
                }
              </select>
            </div>
            <br />
            <br />
            <div className="custom-file col-md-12">
               <div className="form-check form-check-inline">
                  <input className="form-check-input"
                    type="checkbox"
                    value="high"
                    checked={this.getOldValue('highPriorityTask')}
                    onChange={() => this.handlePriorityChange()} />
                  <label className="form-check-label"> Mark If This Is High Priority Task</label>
                </div>
            </div>
            <br />
            <FormFileInput handleImageUpload={this.handleImageUpload.bind(this)} fileUploadState={this.state.fileUploadState} />
            {
              get(this.state.oldTaskState, 'image') ?
                <img src={this.oldTaskState.image} className="img img-responsive" /> :
                <div />
            }
            <br />
            <button
              className="btn btn-success btn-block"
              onClick={() => this.createtask()}
            >
              Create Task
            </button>
          </div>
        </div>
      </main>
    );
  }
}

export default CreateTask;
