import React from "react";
import Avatar from "react-avatar";
const User = ({name}) => {
    return (
        <div className="user">
            <Avatar name={name} size={50} round="14px"/>
            <span className="Name">{name}</span>
        </div>
    )
}
export default User;