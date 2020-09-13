import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from 'firebase';

function Post({postId, username, user, caption, imageUrl}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };  
    }, [postId]);
    
    const postComment = (event) => {

        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        setComment('');
    }
    

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt="kevohunch0"
                    src="https://scontent-lax3-2.cdninstagram.com/v/t51.2885-19/s150x150/117558415_234345587773076_8698463286147491038_n.jpg?_nc_ht=scontent-lax3-2.cdninstagram.com&_nc_ohc=Gtw__mli7QIAX9ZUQzA&oh=e541dadd1ea1e645b723babeeefa7b5e&oe=5F795D1F"
                    //src="https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-1/cp0/c0.0.60.60a/p60x60/10361500_10152628242842050_7122082405354141012_n.jpg?_nc_cat=109&_nc_sid=7206a8&_nc_ohc=5xUXOj2s3UIAX-zOISY&_nc_ht=scontent-lax3-1.xx&oh=107e4c6b07a9cba71e5aa0b57fe328e1&oe=5F769716"
                />
                <h3>{username}</h3>
            </div>
            {/* header -> avatar -> username */}

            <img className="post__image" src={imageUrl} alt=""/>
            {/*image*/}

            <h4 className="post__text"><strong>{username}</strong>: {caption}</h4>
            {/* username + caption */}

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>

                ))}
            </div>

            {user && (
                <form className="post__commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value= {comment}
                    onChange={(e) => setComment(e.target.value)}    
                />
                <button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                >
                    Post
                </button>
                </form>

            )}

          


        </div>
    )
}

export default Post
