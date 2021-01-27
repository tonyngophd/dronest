import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";


import { BareUserList } from '../UserLists';
import UserRow from '../ProfilePage/UserRow';
import './suggestions.css';

const Suggestions = () => {
    const myself = useSelector((state) => state.session.user);

    return (
        <div className="mini-profile-and-suggestions">
            <UserRow user={myself} myId={myself.id} notFollowedYet={false} imageSize="50px"/>
            <span className="suggestions-for-you-title">Suggestions for you</span>
            <div className="suggestions_container">
                <BareUserList />
            </div>
        </div>
    )
}

export default Suggestions;
