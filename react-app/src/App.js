import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar/index";
import Feed, { AllPosts } from "./components/Feed/index";
import Suggestions from "./components/Suggestions/index";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UserLists";
import ProfilePage from "./components/ProfilePage";
import NewPostTab from "./components/NewPostTab";
import HashtagPage from "./components/HashtagPage";
import ExplorePage from "./components/ExplorePage";
import { restoreUser } from "./store/session";
import Footer from "./components/footer/Footer";
import MessagePage from "./components/MessagePage";
import SinglePostPage from "./components/SinglePostPage";
import { StoryTopBox, StoriesFullPage } from "./components/Story";
import { Bands } from './components/AAAMainComponents/Bands';
import { DarkModeButton } from './components/utils';


function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    (async () => {
      await dispatch(restoreUser());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <DarkModeButton />
      {/* <Footer /> */}
      <NavBar />
      {/* {user &&
          <NewPostTab />
        } */}
      <Switch>
        <Route path={["/", '/login']} exact={true}>
          <Bands />
          {/* <div className="main_body">
              <div className="body_container">
                <div className="stories-and-bands-div">
                  <StoryTopBox />
                  <Feed user={user} />
                  <Band />
                </div>
                <Suggestions />
                <div></div>
              </div>
            </div> */}
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/allposts'>
          <AllPosts />
        </ProtectedRoute>
        <Route path="/users" exact={true}>
          <UsersList />
        </Route>
        <ProtectedRoute path="/messages/:userId(\d*)" >
          <MessagePage />
        </ProtectedRoute>
        <ProtectedRoute path="/explore" exact={true}>
          <ExplorePage />
        </ProtectedRoute>
        <ProtectedRoute path="/p/:id" exact={true}>
          <SinglePostPage />
        </ProtectedRoute>
        <ProtectedRoute path="/explore/tags/:hashtag">
          <HashtagPage />
        </ProtectedRoute>
        <ProtectedRoute exact path="/users/:username">
          <ProfilePage tagged={false} />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:username/create">
          <ProfilePage create={true} />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:username/tagged">
          <ProfilePage tagged={true} />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:username/liked">
          <ProfilePage liked={true} />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:username/saved">
          <ProfilePage saved={true} />
        </ProtectedRoute>
        <ProtectedRoute path="/stories/:username">
          <StoriesFullPage />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
