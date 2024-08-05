"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApiUsers } from '../redux/slice';

const Home = () => {
  const dispatch = useDispatch();
  const { userAPIData, isLoading, error } = useSelector((state) => state.user || {});

  console.log("User API Data:", userAPIData);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  useEffect(() => {
    console.log("Dispatching fetchApiUsers");
    dispatch(fetchApiUsers());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Data</h1>
      {userAPIData ? (
        <div>
          <h2>{userAPIData.name}</h2>
          <p>Email: {userAPIData.email}</p>
          <p>Phone: {userAPIData.phoneNumber}</p>
          <p>Role: {userAPIData.role}</p>
          {/* <img src={userAPIData.image_url} alt={userAPIData.name} /> */}
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default Home;
