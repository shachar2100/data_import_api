import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Tab,
    Tabs,
} from '@mui/material';
import { api } from '../services/api';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export const Login: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (tabValue === 0) {
                // Login
                await api.login({ user_name: username, password });
                localStorage.setItem('username', username);
                navigate('/dashboard');
            } else {
                // Create account
                await api.createUser({ user_name: username, password });
                localStorage.setItem('username', username);
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ width: '100%', p: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        centered
                        sx={{ mb: 2 }}
                    >
                        <Tab label="Login" />
                        <Tab label="Create Account" />
                    </Tabs>

                    <TabPanel value={tabValue} index={0}>
                        <Typography component="h1" variant="h5" align="center" gutterBottom>
                            Login
                        </Typography>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Typography component="h1" variant="h5" align="center" gutterBottom>
                            Create Account
                        </Typography>
                    </TabPanel>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" align="center" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {tabValue === 0 ? 'Login' : 'Create Account'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}; 