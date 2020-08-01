import React, { useState, useEffect, useContext, Fragment } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { POST_BLOG, ASK_ROUTE } from '../../../constants/routesNomenclature';
import { authContext } from '../../../context/AuthContext';
import BlogCard from '../../layout/BlogCard';
import { getBlogsByUserId } from '../../../requests/blog';
import { getQuesByUser } from '../../../requests/ques';
import { BarLoader } from 'react-spinners';
import { condition } from '../../../utils/theme';
import getUserFromLocalStorage from '../../../utils/getUserFromLocalStorage';
import QuesCard from '../QAs/QuesCard';

const post0 = `Oh? Looks like you have not started blogging yet! It's better late than never, you know. So... What are you waiting for? Let's get started.`;
const post1 =
  'Congratulations! Looks like you have swung into action. You have successfully posted a blog out there. Keep going!';
const post2 =
  "Hey! You are doing well. It seems you've learnt to blog afterall. And yes, it'll get more exciting when you keep sharing your stories and keep posting.";
const post3 =
  "Niiiiccceeee! You're finally getting a kick out of it, aren't you? You have more than 2 blogs now. Go on blogging...go on exploring!";
const post4 =
  "Woah Woah Woah! Look at how much you've grown! You've finally crossed the 4-blogs-benchmark. Your contribution is going to be really helpful. To you, and others.";

const initialStuff = {
  showBlogs: true,
  showQAs: false,
};

const Dashboard = () => {
  const { userAuth } = useContext(authContext);

  const [blogs, setBlogs] = useState([]);

  const [qa, setQAs] = useState([]);

  const [showLoader, setShowLoader] = useState(true);

  const history = useHistory();

  const userName = getUserFromLocalStorage().user.firstName;

  const [userStuff, setStuff] = useState({ ...initialStuff });

  useEffect(() => {
    (async function () {
      const res = await getBlogsByUserId(userAuth.user._id);
      const quesArr = await getQuesByUser(userAuth.user._id);
      console.log(quesArr.data);
      if (res.data.length === 0) {
        console.log('No Blogs By this user');
      } else if (quesArr.data && res.data) {
        setBlogs(res.data);
        setQAs(quesArr.data);
      }
      setShowLoader(false);
    })();
  }, []);

  const n = blogs.length;
  const msg =
    n === 0
      ? post0
      : n === 1
      ? post1
      : n === 2
      ? post2
      : n <= 3
      ? post3
      : post4;

  const showBlogs = () => {
    setStuff({ ...initialStuff });
  };
  const showQA = () => {
    setStuff({ showBlogs: false, showQAs: true });
  };

  return (
    <Fragment>
      <BarLoader
        loading={showLoader}
        color={`${condition ? '#fff' : '#b02'}`}
        width={'100%'}
      />

      {!showLoader && (
        <div
          className='m-0 pt-0 pb-4'
          style={{
            background: condition && 'bg-darker',
          }}
        >
          <img
            // src='https://i.redd.it/qwd83nc4xxf41.jpg'
            // src='https://images.unsplash.com/photo-1506143925201-0252c51780b0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            src='https://images.unsplash.com/photo-1520698857293-5d763dde010f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            className='bg-still'
            alt=''
          />
          <div className='container'>
            <div className='text-center shadows-in-light font19 bg-white p-3'>
              {'D . A . S . H . B . O . A . R . D .'}
            </div>
            <div
              className={`border rounded  p-5 my-5 ${
                condition ? 'bg-ondark' : 'bg-white'
              }`}
            >
              <h1 className='display-4'>
                <strong>Hello, {userName} </strong>
              </h1>
              <p className='lead'> {msg} </p>

              <hr className='my-4' />

              <NavLink to={POST_BLOG} className='btn btn-primary mx-2'>
                Write a Blog
              </NavLink>

              <NavLink
                to={ASK_ROUTE}
                className='btn btn-primary btn-raised mx-2'
              >
                Ask Something
              </NavLink>
            </div>

            <button
              className={` btn  
              ${
                condition ? 'bg-darker' : 'bg-white'
              } border font12 p-2 mx-0 rounded`}
              onClick={showBlogs}
              disabled={userStuff.showBlogs}
            >
              Your Blogs
            </button>

            <button
              className={` btn ${
                condition ? 'bg-darker' : 'bg-white'
              } border font12 p-2 mx-0 rounded`}
              onClick={showQA}
              disabled={userStuff.showQAs}
            >
              Your Questions
            </button>

            <div
              className='row container border pb-3'
              style={{ background: condition ? 'bg-ondark' : '#fbfcfc' }}
            >
              {userStuff.showBlogs &&
                blogs.map((blog, index) => (
                  <div
                    key={`blog-${index}`}
                    onClick={() => history.push(`/blogs/${blog._id}`)}
                    className='col-md-4 col-md-offset-3'
                  >
                    <BlogCard blog={blog} name={''} />
                  </div>
                ))}
              {userStuff.showQAs &&
                qa.map((ques, i) => (
                  <div className='w-100 p-3' key={i}>
                    <QuesCard ques={ques} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Dashboard;
