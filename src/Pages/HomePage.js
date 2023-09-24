import React, { useState } from "react";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const HomePage = () => {
    const Navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [name, setName] = useState('');
    const createNewID = (event) => {
        const room_id  = v4();
        setRoomId(room_id);
    }
    const joinRoom = () => {
        if(!roomId || !name){
            toast.error("Enter both Room Id and Name!!")
            return ;
        }
        Navigate(`/room/${roomId}`,{
            state:{
                name, 
            },
        });

    }
    const EnterPress = (event) => {
        if(event.code === 'Enter'){
            joinRoom();
        }
    }
    return (
        <div className="HomePageElem">
            <div className="HomePageRoomForm">
                <img className="logoHome" src="/logoPair.png" alt="logo"/>
                <h4 className="roomIDLable">Enter Room ID</h4>
                <div className="inputDiv">
                    <input type="text" onKeyUp={EnterPress} className="inputBox" placeholder="ROOM ID" onChange={(event)=>{setRoomId(event.target.value)}} value={roomId}/>
                    <input type="text" onKeyUp={EnterPress} className="inputBox" placeholder="NAME" onChange={(event)=>{setName(event.target.value)}} value={name}/>
                    <div className="HomeBtn">
                        <button onClick={createNewID} className="btn NewRoomBtn">New Room</button>
                        <button onClick={joinRoom} className="btn JoinBtn">Join Room</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HomePage;