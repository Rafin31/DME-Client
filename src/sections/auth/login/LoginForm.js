import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @mui
import axios from 'axios';
import { toast } from 'react-toastify';
import { Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { userContext } from '../../../Context/AuthContext';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {

  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const { signIn } = useContext(userContext)


  const onSubmit = async data => {
    setLoading(true)

    await axios.post('/api/v1/users/login', data)
      .then(res => {

        signIn(res)

        toast.success("Login Successfully", {
          toastId: 'success2',
        })

        setLoading(false)
        reset()
      })
      .catch(error => {
        toast.error(error.response?.data?.message, {
          toastId: 'error2',
        })
        setLoading(false)
        // reset()
      })
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>

          <TextField
            {...register("email", { required: "Field is required" })}
            name="email"
            label="Email"
            error={errors.email && true}
            type="email"
            fullWidth
            variant="outlined"
            helperText={errors.email?.message} />


          <TextField
            {...register("password", { required: "Field is required" })}
            name="password"
            label="Password"
            error={errors.password && true}
            fullWidth
            variant="outlined"
            helperText={errors.password?.message}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <Link to={'forget-password-request'} variant="subtitle2" style={{ cursor: "pointer", color: "black", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </Stack>

          <LoadingButton loading={loading} fullWidth size="large" type="submit" variant="contained">
            Login
          </LoadingButton>
        </Stack>

      </form>



    </>
  );
}
