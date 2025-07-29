import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Alert, CircularProgress, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string | null;
}

const Profile: React.FC = () => {
  const { user: authUser, token, login, logout } = useAuth(); 
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(authUser); 
  const [firstName, setFirstName] = useState(authUser?.firstName || '');
  const [lastName, setLastName] = useState(authUser?.lastName || '');
  const [username, setUsername] = useState(authUser?.username || '');
  const [email, setEmail] = useState(authUser?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState<string | null>(null);
  const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(null);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState<string | null>(null);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState<string | null>(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); 

 
  const getInitials = (firstName: string | undefined, lastName: string | undefined): string => {
    if (!firstName && !lastName) return '';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };


  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      try {
        const response = await axios.get<User>(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setProfileUpdateError('Failed to load profile data.');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUserData();
  }, [token]);

  
  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileUpdateError(null);
    setProfileUpdateSuccess(null);
    setIsUpdatingProfile(true);

    try {
      const response = await axios.patch<any>(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
        firstName,
        lastName,
        username,
        email,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileUpdateSuccess(response.data.message);
      setCurrentUser(response.data.user); 
      login(token!, response.data.user); 
    } catch (err: any) {
      console.error('Profile update error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setProfileUpdateError(err.response.data.message);
      } else {
        setProfileUpdateError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordUpdateError(null);
    setPasswordUpdateSuccess(null);
    setIsUpdatingPassword(true);

    if (newPassword !== confirmNewPassword) {
      setPasswordUpdateError('New password and confirm new password do not match.');
      setIsUpdatingPassword(false);
      return;
    }
    if (newPassword.length < 6) { 
      setPasswordUpdateError('New password must be at least 6 characters long.');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const response = await axios.patch<any>(`${import.meta.env.VITE_API_BASE_URL}/api/auth/password`, {
        currentPassword,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordUpdateSuccess(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error('Password update error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setPasswordUpdateError(err.response.data.message);
      } else {
        setPasswordUpdateError('Failed to update password. Please try again.');
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };


  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file); 

    setAvatarUploadError(null);
    setAvatarUploadSuccess(null);
    setIsUploadingAvatar(true);

    try {
      const response = await axios.patch<any>(`${import.meta.env.VITE_API_BASE_URL}/api/user/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${token}`,
        },
      });
      setAvatarUploadSuccess(response.data.message);
      setCurrentUser(response.data.user); 
      login(token!, response.data.user); 
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setAvatarUploadError(err.response.data.message);
      } else {
        setAvatarUploadError('Failed to upload avatar. Please try again.');
      }
    } finally {
      setIsUploadingAvatar(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        User Profile
      </Typography>

      
      <Paper elevation={3} sx={{ p: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Profile Picture
        </Typography>
        <Avatar
          src={currentUser?.avatar ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${currentUser.avatar}` : undefined}
          alt={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User Avatar'}
          sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.light', fontSize: '3rem' }}
        >
          {getInitials(currentUser?.firstName, currentUser?.lastName)}
        </Avatar>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="avatar-upload"
          type="file"
          onChange={handleAvatarChange}
          ref={fileInputRef}
          disabled={isUploadingAvatar}
        />
        <label htmlFor="avatar-upload">
          <Button variant="outlined" component="span" disabled={isUploadingAvatar}>
            {isUploadingAvatar ? 'Uploading...' : 'Upload New Avatar'}
          </Button>
        </label>
        {avatarUploadError && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{avatarUploadError}</Alert>}
        {avatarUploadSuccess && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{avatarUploadSuccess}</Alert>}
      </Paper>


      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Personal Details
        </Typography>
        <Box component="form" onSubmit={handleProfileUpdate} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isUpdatingProfile}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isUpdatingProfile}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isUpdatingProfile}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isUpdatingProfile}
          />
          {profileUpdateError && <Alert severity="error" sx={{ mt: 2 }}>{profileUpdateError}</Alert>}
          {profileUpdateSuccess && <Alert severity="success" sx={{ mt: 2 }}>{profileUpdateSuccess}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
          </Button>
        </Box>
      </Paper>

  
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Change Password
        </Typography>
        <Box component="form" onSubmit={handlePasswordUpdate} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isUpdatingPassword}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isUpdatingPassword}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            disabled={isUpdatingPassword}
          />
          {passwordUpdateError && <Alert severity="error" sx={{ mt: 2 }}>{passwordUpdateError}</Alert>}
          {passwordUpdateSuccess && <Alert severity="success" sx={{ mt: 2 }}>{passwordUpdateSuccess}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isUpdatingPassword}
          >
            {isUpdatingPassword ? 'Updating...' : 'Change Password'}
          </Button>
        </Box>
      </Paper>

      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;