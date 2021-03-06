import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import InputGroup from "../common/InputGroup";
import {createProfile } from '../../actions/profileActions'


class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: "",
      company: "",
      website: "",
      location: "",
      status: "",
      skills: "",
      github: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      errors: {},
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errors: nextProps.errors })
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("submit");
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }


  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if(displaySocialInputs) {
        socialInputs = (
            <div>
                <InputGroup
                    placeholder='Twitter Profile URL'
                    name='twitter'
                    icon='fab fa-twitter'
                    values={this.state.twitter}
                    onChange={this.onChange}
                    error={errors.twitter}
                />
                <InputGroup
                    placeholder='Facebook Profile URL'
                    name='facebook'
                    icon='fab fa-facebook'
                    values={this.state.facebook}
                    onChange={this.onChange}
                    error={errors.facebook}
                />
                <InputGroup
                    placeholder='Twitter Profile URL'
                    name='twitter'
                    icon='fab fa-twitter'
                    values={this.state.twitter}
                    onChange={this.onChange}
                    error={errors.twitter}
                />
                <InputGroup
                    placeholder='Linkedin Profile URL'
                    name='linkedin'
                    icon='fab fa-linkedin'
                    values={this.state.linkedin}
                    onChange={this.onChange}
                    error={errors.linkedin}
                />
                <InputGroup
                    placeholder='Youtube Channel URL'
                    name='Youtube'
                    icon='fab fa-youtube'
                    values={this.state.youtube}
                    onChange={this.onChange}
                    error={errors.youtube}
                />
                <InputGroup
                    placeholder='Instagram Page URL'
                    name='instagram'
                    icon='fab fa-instagram'
                    values={this.state.instagram}
                    onChange={this.onChange}
                    error={errors.instagram}
                />
            </div>
        )
    }

    // Select options for status
    const options = [
      { label: "* Select Professional Status", value: 0 },
      { label: "Developer", value: "Developer" },
      { label: "Junior Developer", value: "Junior Developer" },
      { label: "Senior Developer", value: "Senior Developer" },
      { label: "Manager", value: "Manager" },
      { label: "Intern", value: "Intern" },
      { label: "Instructor", value: "Intructor" },
      { label: "Team Leader", value: "Team Leader" },
      { label: "SQA", value: "SQA" },
      { label: "Technical Director", value: "Technical Director" },
      { label: "Other", value: "Other" },
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">
                Input some information to make your profile
              </p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Profile Handle"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="A unique handle for your profile URL. Your Full name, Company name etc(Cann't be changed later)."
                />
                <SelectListGroup
                  placeholder="Status"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                  options={options}
                  error={errors.status}
                  info="Position of your career."
                />
                <TextFieldGroup
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                  info="Your company name."
                />
                <TextFieldGroup
                  placeholder="Website"
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  info="Your own website or a company one."
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="City or city and area."
                />
                <TextFieldGroup
                  placeholder="* Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info="Please use comma separated values (eg. HTML, CSS, JavaScript)."
                />
                <TextFieldGroup
                  placeholder="Github"
                  name="github"
                  value={this.state.github}
                  onChange={this.onChange}
                  error={errors.github}
                  info="Your github username or your recent repos with your username."
                />
                <TextAreaFieldGroup
                  placeholder="Short Bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Tell us little about you."
                />
                <div className="mb-3">
                  <button
                    className="btn btn-light"
                    onClick={() => {
                      this.setState((prevState) => ({
                        displaySocialInputs: !prevState.displaySocialInputs,
                      }));
                    }}
                  >
                    Add Social Network Links
                  </button>
                  <span className='text-muted'> (Optional)</span>
                </div>
                {socialInputs}
                <input className='btn btn-info btn-block mt-4' type='submit' value='Submit' />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
});

export default connect(mapStateToProps, { createProfile })(CreateProfile);
