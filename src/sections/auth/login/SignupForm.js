import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { IconButton, InputAdornment, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Alert, Box, CircularProgress, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { fDate } from '../../../utils/formatTime';

import Iconify from '../../../components/iconify';
import { useJwt } from 'react-jwt';





export default function SignupForm() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)
    const [showField, setField] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);


    const queryParams = new URLSearchParams(window.location.search)
    const invitationToken = queryParams.get("invitationToken")
    const { decodedToken } = useJwt(invitationToken)

    const createUser = async (data) => {
        setLoading(true)
        await axios.post('/api/v1/users', data)
            .then(res => {
                reset()
                setLoading(false)
                toast.success("Successfully Signed Up!", {
                    toastId: 'success1',
                });
                navigate('/', { replace: true });
            })
            .catch(error => {
                setLoading(false)
                toast.error(error.response.data.message, {
                    toastId: 'error1',
                });
            });
        setLoading(false)
    }


    const toggleCategory = (event) => {
        if (event.target.value === "patient-63861b794e45673948bb7c9f") {
            setField("patient")
        } else {
            setField("other")
        }
    }

    const onSubmit = async data => {
        const givenDate = new Date(data?.dob);
        let finalData;
        const presentDate = new Date()
        if (givenDate > presentDate) {
            setDbError(true)
            return
        }
        if (showField === "patient") {
            data.dob = fDate(data.dob)
        }
        if (data.password !== data.confirmPassword) {
            setError("Password did not matched!")
            return
        }

        setDbError(false)
        const { userCategory, ...rest } = data

        if (invitationToken && decodedToken.invitationFor === "DME-Staff") {
            finalData = {
                ...rest,
                fullName: data.firstName + " " + data.lastName,
                status: "63861954b3b3ded1ee267309",
                userCategory: "638f7714a7f2be8abe01d2d2", //staff
                inviteToken: invitationToken
            }
        } else if (invitationToken && decodedToken.invitationFor === "va-prosthetics") {

            finalData = {
                ...rest,
                fullName: data.firstName + " " + data.lastName,
                status: "63861954b3b3ded1ee267309",
                country: "USA",
                userCategory: "63caa0428ceb169589e611ca", //va-prosthetics
                inviteToken: invitationToken
            }

        } else {
            finalData = {
                ...rest,
                fullName: data.firstName + " " + data.lastName,
                status: "63861954b3b3ded1ee267309",
                country: "USA",
                userCategory: data.userCategory.split('-')[1]
            }
        }


        createUser(finalData)
    };


    if (invitationToken) {
        if (!decodedToken) {
            return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    container
                    rowSpacing={2}
                    columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                    <Grid item xs={6}>
                        <TextField
                            {...register("firstName", { required: "Field is required" })}
                            name="firstName"
                            label="First Name"
                            error={errors.firstName && true}
                            type="text"
                            fullWidth
                            variant="outlined"
                            helperText={errors.Fname?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            {...register("lastName", { required: "Field is required" })}
                            name="lastName"
                            label="Last Name"
                            error={errors.lastName && true}
                            type="text"
                            fullWidth
                            variant="outlined"
                            helperText={errors.Lname?.message}
                        />
                    </Grid>
                    {
                        !invitationToken ?
                            <Grid item xs={6}>
                                <TextField
                                    {...register("email", { required: "Field is required" })}
                                    name="email"
                                    label="Email address"
                                    error={errors.email && true}
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.email?.message}
                                />
                            </Grid>

                            :
                            <Grid item xs={6}>
                                <TextField
                                    {...register("email", {
                                        required: "Field is required",
                                        value: decodedToken?.invitedEmail
                                    })}
                                    name="email"
                                    label="Email address"
                                    error={errors.email && true}
                                    type="email"
                                    fullWidth
                                    disabled
                                    variant="outlined"
                                    helperText={errors.email?.message}
                                />
                            </Grid>
                    }
                    {
                        (!invitationToken || (decodedToken?.invitationFor !== "va-prosthetics" && decodedToken?.invitationFor !== "DME-Staff")) &&
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    {...register("city", { required: "Field is required" })}
                                    error={errors.city && true}

                                    label="City*"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.city?.message}

                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    {...register("state", { required: "Field is required" })}
                                    error={errors.state && true}

                                    label="State*"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.state?.message}

                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    {...register("zip", {
                                        required: "Field is required",
                                        minLength: { value: 3, message: "Phone number should be at last 3 characters" },
                                    })}

                                    error={errors.zipNumber && true}
                                    label="Zip code*"
                                    type={"number"}
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors?.zip?.message}
                                />
                            </Grid>
                        </>
                    }
                    {
                        (!invitationToken || (decodedToken?.invitationFor !== "va-prosthetics" && decodedToken?.invitationFor !== "DME-Staff")) &&
                        <Grid item xs={(!invitationToken || (decodedToken?.invitationFor !== "va-prosthetics" && decodedToken?.invitationFor === "DME-Staff")) ? 12 : 6}>
                            <TextField
                                {...register("phoneNumber", {
                                    required: "Field is required",
                                    minLength: { value: 6, message: "Phone number should be at last 6 characters" },
                                })}

                                error={errors.phoneNumber && true}
                                label="Phone Number*"
                                type={"tel"}
                                fullWidth
                                variant="outlined"
                                helperText={errors?.phoneNumber?.message}

                            />
                        </Grid>
                    }
                    {
                        (!invitationToken || (decodedToken?.invitationFor !== "va-prosthetics" && decodedToken?.invitationFor !== "DME-Staff")) &&
                        <Grid item xs={12}>
                            <TextField
                                {...register("address", { required: "Field is required" })}

                                label="Address"
                                error={errors.address && true}
                                fullWidth
                                multiline
                                helperText={errors.address?.message}
                                rows={4}
                                variant="outlined" />
                        </Grid>
                    }
                    {
                        !invitationToken ?
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Sign up as*</InputLabel>
                                    <Select
                                        {...register("userCategory", { required: "Field is required" })}
                                        variant="outlined"
                                        size="small"
                                        error={errors.userCategory && true}
                                        helperText={errors.userCategory?.message}
                                        defaultValue=""
                                        onChange={toggleCategory}

                                    >
                                        <MenuItem value={"patient-63861b794e45673948bb7c9f"}>Patient</MenuItem>
                                        <MenuItem value={"dme-63861b354e45673948bb7c9d"}>DME Supplier</MenuItem>
                                        <MenuItem value={"doctor-638f775ea7f2be8abe01d2d4"}>Doctor</MenuItem>
                                        <MenuItem value={"therapist-638f770aa7f2be8abe01d2d0"}>Therapist</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            :
                            invitationToken && decodedToken.invitationFor === "DME-Staff" ?
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("userCategory", { required: "Field is required", value: "DME-Staff" })}

                                        label="Sign up as"
                                        error={errors.userCategory && true}
                                        fullWidth
                                        multiline
                                        defaultValue={"DME-Staff"}
                                        disabled
                                        helperText={errors.userCategory?.message}
                                        variant="outlined" />
                                </Grid>
                                :
                                invitationToken && decodedToken.invitationFor === "va-prosthetics" &&
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("userCategory", { required: "Field is required", value: "VA Prosthetics Staff" })}

                                        label="Sign up as"
                                        error={errors.userCategory && true}
                                        fullWidth
                                        multiline
                                        defaultValue={"VA Prosthetic Staff"}
                                        disabled
                                        helperText={errors.userCategory?.message}
                                        variant="outlined" />
                                </Grid>
                    }


                    {(
                        (showField !== "patient" || showField === "other") &&
                        (!invitationToken || (invitationToken && decodedToken?.invitationFor !== "va-prosthetics" && decodedToken?.invitationFor !== "DME-Staff"))) &&
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    {...register("npiNumber", {
                                        required: "Field is required",
                                        minLength: { value: 10, message: "NPI number must be 10 characters long" },
                                    })}

                                    error={errors.npiNumber && true}
                                    label="NPI Number*"
                                    type={"number"}
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.npiNumber?.message}

                                />
                            </Grid>
                            <Grid item xs={6} style={{ display: `${showField === "patient" ? "none" : "block"}` }}>
                                <TextField
                                    {...register("companyName")}
                                    error={errors.companyName && true}
                                    label="Company Name"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.companyName?.message}

                                />
                            </Grid>
                        </>
                    }
                    {
                        showField === "patient" &&
                        <>

                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Gender*</InputLabel>
                                    <Select
                                        variant="outlined"
                                        size="small"
                                        error={errors.gender && true}
                                        helperText={errors.gender?.message}
                                        rows={2}
                                        defaultValue=""
                                        {...register("gender", { required: "Field is required" })}
                                    >
                                        <MenuItem value={"male"}>Male</MenuItem>
                                        <MenuItem value={"female"}>Female</MenuItem>
                                        <MenuItem value={"other"}>Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    {...register("dob", { required: "Field is required" })}
                                    error={errors.dob && true}
                                    label="Date of Birth*"
                                    onFocus={(e) => { (e.target.type = "date") }}
                                    onBlur={(e) => { (e.target.type = "text") }}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.dob?.message}
                                />
                                {dbError && <Alert sx={{ py: 0 }} severity="error">Date can not be future!</Alert>}
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    {...register("weight", { required: "Field is required" })}
                                    error={errors.weight && true}
                                    type={'number'}
                                    label="Weight (lbs)*"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.weight?.message}

                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    {...register("primaryInsurance", {
                                        required: "Field is required", minLength: {
                                            value: 10,
                                            message: "Must be longer than 10 characters!"
                                        }
                                    })}
                                    error={errors.primaryInsurance && true}
                                    type={'number'}
                                    label="Primary Insurance*"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.primaryInsurance?.message}

                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    {...register("secondaryInsurance", {
                                        required: "Field is required", minLength: {
                                            value: 10,
                                            message: "Must be longer than 10 characters!"
                                        }
                                    })}
                                    error={errors.secondaryInsurance && true}
                                    type={'number'}
                                    label="Secondary Insurance*"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.secondaryInsurance?.message}

                                />
                            </Grid>

                        </>
                    }
                    <Grid item xs={6}>
                        <TextField
                            {...register("password", { required: "Field is required" })}
                            error={errors.password && true}
                            helperText={errors.password?.message}
                            label="Password*"
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
                    </Grid>
                    <Grid item xs={6} >
                        <TextField
                            {...register("confirmPassword", { required: "Field is required" })}
                            error={errors.confirmPassword && true}
                            helperText={errors.confirmPassword?.message}
                            name="confirmPassword"
                            label="Confirm Password*"
                            type={'password'}
                        />
                    </Grid>
                </Grid>

                {
                    error && <Alert sx={{ mt: 5 }} severity="error">{error}</Alert>
                }

                <LoadingButton loading={loading} fullWidth size="large" type="submit" variant="contained" sx={{ my: 4 }}>
                    Signup
                </LoadingButton>
            </form>
        </>
    );
}
