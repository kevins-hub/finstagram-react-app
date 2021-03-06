import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import PfUpload from './PfUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
  },
}));



function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  const [pfPic, setPfPic] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);

        if(authUser.displayName) {
          //don't update username

        } else {
          return authUser.updateProfile({
              displayName: username,
          });
        }
      } else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

 // useEffect -> Runs a piece of code based on a specific condition

  useEffect(() => {
    // where the code runs
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post is added this code fires...
      setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        
        })));
    })
  }, []); // if blank inside square brackets, runs just once when page loads, if posts inside, runs everytime posts change

  const signUp = (event) => {
      event.preventDefault();

      auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
          
        
        })
      })
      .catch((error) => alert(error.message))

  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      
      {/* I want to have....*/}

      {/*Caption input */}

      {/*File picker */}

      {/*Post button*/}
      



      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <div className="app__header">
                  <img
                    className="app__headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                  />

                  
                </div>
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange = {(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange = {(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder="password"
                type="text"
                value={password}
                onChange = {(e) => setPassword(e.target.value)}
              />


              
              
              <Button type="submit" onClick={signUp}>Sign Up</Button> {/* Pass in pf url to signup */}


            </form>
          </div>
        }
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <div className="app__header">
                  <img
                    className="app__headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                  />
                </div>
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange = {(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder="password"
                type="text"
                value={password}
                onChange = {(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>Sign In</Button>
    
            </form>
          </div>
        }
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <div className="app__logoutContainer">
            {!user.photoURL ? (
              <PfUpload user={user}/>
            ): (
                <img className="app__pfthumbnail" src={user.photoURL}/>
            )}
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>

    
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className = "app__posts">
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} username={post.username} user={user} caption={post.caption} imageUrl={post.imageUrl} pfUrl={post.pfUrl}/>
          ))
        }
      </div>



{/* HEADER */}


    {/* ? tells it to not freak out if not defined */}
    {user?.displayName ? (
      <ImageUpload user={user}/>

    ): (
      <h3>Sorry you need to log in to upload.</h3>
    )}

{/* POSTS */}
{/* POSTS */}

    </div>
  );
}

export default App;
