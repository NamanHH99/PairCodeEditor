import React, { useEffect, useState, useRef } from "react";
import User from "../components/User";
import CodeArea from "../components/CodeArea";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import { Navigate, useLocation,useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const CodePage = () => {
    const socketRef = useRef(null);
    const location  = useLocation();
    const {roomId} = useParams();
    const reactNavigator = useNavigate();
    const [users,setUsers] = useState([]);
    const codeRef = useRef(null);
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                name: location.state?.name,
            });
            socketRef.current.on(ACTIONS.JOINED, ({users, name, socketId}) =>{
                if(name !== location.state?.name){
                    toast.success(`${name} joined the room`);
                    console.log(`${name} joined`);
                }
                setUsers(users);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code : codeRef.current,
                    socketId,
                });
            })
            socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,name}) => {
                toast.success(`${name} left!!`);
                setUsers((previous) => {
                    return previous.filter((user)=> user.socketId !==socketId);
                });
            });
        }
        init();
        return () => {
            socketRef.current.disconnect();  
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    }, []);
    async function roomIdCopy(){
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Copied!!");
        } catch (error) {
            toast.error("Error copying Room Id");
            console.error(error);
        }
    }
    function leaveRoom(){
        reactNavigator('/');
    }
    if(!location.state){
        return <Navigate to='/'/>
    }
    return (
        <div className="PairCodePage">
            <div className="sideBar">
                <div className="sideInnerBar">
                    <div className="logoCode">
                        <img className="logoCodeImg" src="/logoPair.png" alt="logo"/>
                    </div>
                    <h3>Users:</h3>
                    <div className="userList">
                        {
                            users.map((user) => (
                                <User key={user.socketId} name={user.name}/>
                            ))
                        }
                    </div>
                </div>
                
                <button className="btn copyRoomID" onClick={roomIdCopy}>Copy Room ID</button>
                <button className="btn LeaveBtn" onClick={leaveRoom}>Leave</button>
            </div>
            <div className="CodeBar">
                <CodeArea socketRef={socketRef} roomId = {roomId} onCodeChange={(code) => {codeRef.current = code;}}/>
            </div>
        </div>

    )
}
export default CodePage;