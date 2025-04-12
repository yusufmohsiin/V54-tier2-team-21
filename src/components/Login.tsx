import { Button, TextField, Box, Typography } from '@mui/material';
import { styles } from '../styles';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginComponentProps, LoginForm } from '../types';
import Container from '@mui/material/Container';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import InputAdornment from '@mui/material/InputAdornment';
import { zodResolver } from '@hookform/resolvers/zod';
import { inputLoginSchema } from '../assets/inputFormSchema';
import { setCookie } from '../utils/utils';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ page, handleLogin }) => {
    const [loginError, setLoginError] = useState<string>('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({ resolver: zodResolver(inputLoginSchema) });

    const onSubmit: SubmitHandler<LoginForm> = (data) => handleLoginClick(data);

    const navigate = useNavigate();

    async function handleLoginClick(loginData: LoginForm) {
        try {
            const result = await fetch(
                `https://v54-tier2-team-21-be.onrender.com/api/users/${page === 'signup' ? 'register' : 'login'}/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: loginData.email,
                        password: loginData.password,
                    }),
                }
            );

            const data = await result.json();

            if (data.errors) {
                if (data.errors.non_field_errors) {
                    throw new Error(data.errors.non_field_errors);
                } else {
                    throw new Error('There has been an issue');
                }
            }

            setCookie('token', data.access_token, 1);
            setCookie('refresh', data.refresh_token, 1);

            handleLogin();

            navigate('/');
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                setLoginError(error.message);
            } else {
                setLoginError('An unknown error occurred');
            }
        }
    }

    return (
        <>
            <Typography
                variant="h2"
                sx={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    marginTop: '2em',
                }}
            >
                {page === 'signup' ? 'Sign up' : 'Login'}
            </Typography>
            <Box
                component="section"
                sx={{
                    ...styles.loginContainer,
                    paddingBottom: '3em',
                    margin: '3em 1.25em',
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Container
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '10px',
                            minHeight: '400px',
                        }}
                    >
                        <TextField
                            id="email"
                            variant="outlined"
                            {...register('email')}
                            sx={{ ...styles.textField, mb: 0 }}
                            slotProps={{
                                input: {
                                    placeholder: 'Email',
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon
                                                sx={{
                                                    color: '#C4BFBF',
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            error={!!errors['email']}
                        />
                        {errors['email'] && (
                            <Typography
                                color="error"
                                variant="caption"
                                sx={{ ml: 1, textAlign: 'left' }}
                            >
                                {errors['email']?.message}
                            </Typography>
                        )}
                        <TextField
                            id="password"
                            variant="outlined"
                            type="password"
                            {...register('password')}
                            sx={{ ...styles.textField, mt: 1, mb: 0 }}
                            slotProps={{
                                input: {
                                    placeholder:
                                        page === 'signup'
                                            ? 'Create Password'
                                            : 'Enter Password',
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon
                                                sx={{
                                                    color: '#C4BFBF',
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            error={!!errors['email']}
                        />
                        {errors['password'] && (
                            <Typography
                                color="error"
                                variant="caption"
                                sx={{ ml: 1, textAlign: 'left' }}
                            >
                                {errors['password']?.message}
                            </Typography>
                        )}
                        {loginError && (
                            <Typography
                                color="error"
                                variant="caption"
                                sx={{
                                    ml: 1,
                                    textAlign: 'left',
                                    fontSize: '.9rem',
                                }}
                            >
                                {loginError}
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                ...styles.primaryButton,
                                width: '100%',
                                borderRadius: '4px',
                            }}
                        >
                            Continue
                        </Button>
                    </Container>
                </form>
                <Typography>
                    {page === 'signup'
                        ? `Already have an account?`
                        : `Don't have an account?`}
                </Typography>
                <Link to={page === 'signup' ? '/login' : '/register'}>
                    {page === 'signup' ? 'Login' : 'Sign up'}
                </Link>
            </Box>
        </>
    );
};

export default Login;
