import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile } from '../../actions/profileActions';
import  Spinner  from '../common/Spinner';

class Dashboard extends Component {

    componentDidMount() {
        this.props.getCurrentProfile();
    }

    render() {

        const { user } = this.props.auth;
        const { profile, loading } = this.props.profile;

        let dashBoardContent;

        if(profile === null || loading) {
            dashBoardContent = <Spinner />;
        }else {
            // Check if logged in user has profile data
            if(Object.keys(profile).length > 0) {
                dashBoardContent = <h4>Display Profile</h4> 
            }else { 
                // User loggeed in have no profile
                dashBoardContent = (
                    <div>
                        <p className='lead text-muted'>Welcome { user.name }</p>
                        <p>You have not set up your profile yet</p>
                        <Link to='/create-profile' className='btn btn-lg btn-info'>Create Profile</Link>
                    </div>
                )
            }
        }

        return (
            <div className="dashboard">
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h1 className='display-4'>Dashboard</h1>
                            { dashBoardContent }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
  });

export default connect(mapStateToProps, { getCurrentProfile }) (Dashboard);