import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


import { BareUserList } from '../UserLists';
import UserRow from '../ProfilePage/UserRow';
import './suggestions.css';

const Suggestions = () => {
    const myself = useSelector((state) => state.session.user);

    return (
        <div className="mini-profile-and-suggestions">
            <UserRow user={myself} myId={myself.id} notFollowedYet={false} imageSize="50px"/>
            <div className='suggestions-for-you-title'>
                <span>Suggestions for you</span>
                <Link to='/users'>See all</Link>
            </div>
            <div className="suggestions_container">
                <BareUserList includeMyself={false}/>
            </div>
        </div>
    )
}

export default Suggestions;
