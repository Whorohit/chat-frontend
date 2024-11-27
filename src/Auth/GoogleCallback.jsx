import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Extract token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Store token in localStorage (or any secure storage mechanism)
            localStorage.setItem('token', token);
            console.log("Heeee");

            // Redirect to the desired page
            setTimeout(() => {
                navigate('/');
            }, 2000);// Replace with your desired route
        } else {
            navigate('/login'); // Redirect back to login if token is missing
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default GoogleCallback;
