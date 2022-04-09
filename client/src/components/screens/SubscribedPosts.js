import React,{useState, useEffect, useContext} from "react";
import {userContext} from '../../App'
import {useHistory, Link} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import {withRouter} from "react-router-dom";
import { Box } from "@mui/material";

const SubPosts = (props) => {
    const history = useHistory();
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(userContext);
    const [comment,setComment] = useState("");
    useEffect(() => {
        fetch("/getsubpost", {
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")     
            }       
        }).then(res => res.json())
        .then(result => {
            setData(result.posts);
        })
    })

    const likePost = (id) => {
        fetch('/like', {
            method : 'put',
            headers: {
                "Content-Type" : 'application/json',
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId : id
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData = newData;
        }).catch(err => console.log(err))
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method : 'put',
            headers: {
                "Content-Type" : 'application/json',
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId : id
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
        }).catch(err => console.log(err))
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                "Content-Type" : 'application/json',
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => console.log(err))
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            const newData = data.filter(item => {
                return item._id !== result._id
             })
             setData(newData)
             history.go("/")
        }).catch(err => console.log(err))
    }

    const navigateTo = (record)=>{
        if(record.postedBy._id !== state._id) props.history.push(`/profile/${record.postedBy._id}`);
        else props.history.push('/profile');
      }

    return(
        <div className="home">
            {
                data.map(item => {
                    let comments = [...item.comments]
                    comments.reverse();
                    return (
                    <div className="card home-card">
                        <div className="cardtitle" style={{padding:"10px"}}>
                            <Box style={{display:"flex",alignItems:"center" , gap:"15px"}}>
                                <Avatar src={item.postedBy.profilepic} alt={item.postedBy.name}/>
                                <Typography style={{cursor:"pointer",fontSize:"14px",fontWeight:"600"}} onClick={()=>navigateTo(item)}>
                                    {item.postedBy.name}
                                </Typography>
                            </Box>
                            {item.postedBy._id == state._id && (
                            <i
                                className="material-icons"
                                style={{ float: "right", cursor: "pointer" }}
                                onClick={() => {
                                    deletePost(item._id);
                                }}
                            >
                                delete
                            </i>
                            )}
                        </div>
                        <div className="card-image">
                            <img src={item.photo} alt=""/>
                        </div>
                        <div className="card-content">
                            {item.likes.includes(state._id) ? <i className="material-icons lke" onClick={() => unlikePost(item._id)} style={{cursor:"pointer", color: "red"}} >favorite</i> : <i className="material-icons lke" onClick={() => likePost(item._id)} style={{cursor:"pointer"}}>favorite_border</i>}
                            <h6>{item.likes.length} Likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {/* {
                                item.comments.map(record => {
                                    return(
                                        <h6 key={record._id}><span style={{fontWeight : '500'}}>{record.postedBy.name}</span> {record.text}</h6>
                                    )
                                })
                            } */}
                            <Typography style={{fontWeight:"500" , fontSize:"15px", marginTop: "10px"}}>Comments:</Typography>
                            {comments && comments.length > 0 && <div style={{maxHeight:"200px",overflowY:"auto",width:"100%",marginTop:"20px"}}>
                                    <List sx={{paddingLeft:"0px"}}>
                                        {comments.map((record) => {
                                        return (
                                            <ListItem  sx={{paddingLeft:"0px"}}>
                                                <ListItemAvatar>  
                                                    <Avatar alt={record.postedBy.name} src = {record.postedBy.profilepic} sx={{borderColor:"green"}}/>
                                                </ListItemAvatar>
                                                <ListItemText primary={<React.Fragment><Typography onClick={()=>navigateTo(record)} style={{fontWeight:"500",fontSize:"16px",cursor:"pointer"}}>{record.postedBy.name}</Typography></React.Fragment>} secondary={record.text} />
                                            </ListItem>
                                        );
                                        })}
                                    </List>
                            </div>}
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                makeComment(e.target[0].value, item._id);
                            }}> 
                            <input type="text" placeholder="Add a comment!" style={{margin: "10px"}} />
                            </form>
                        </div>
                     </div> 
                    )
                })
            }
                  
        </div>
    )
};

export default SubPosts;