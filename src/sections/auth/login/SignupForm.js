import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Grid, FormControl, InputLabel, Select, MenuItem, Alert, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { fDate } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';



export default function SignupForm() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)
    const [showField, setField] = useState("")
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const toggleCategory = (event) => {
        if (event.target.value === "patient") {
            setField("patient")
        } else {
            setField("other")
        }
    }
    const onSubmit = data => {
        const givenDate = new Date(data?.dob);
        const presentDate = new Date()
        if (givenDate > presentDate) {
            setDbError(true)
            return
        }
        if (showField === "patient") {
            data.dob = fDate(data.dob)
        }
        setDbError(false)
        console.log(data)
        navigate('/DME-supplier/dashboard', { replace: true });
        reset()
    };


    return (
        <>
            {errors && console.log(errors)}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    container
                    rowSpacing={2}
                    columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                    <Grid item xs={6}>
                        <TextField
                            {...register("Fname", { required: "Field is required" })}
                            name="Fname"
                            label="First Name"
                            error={errors.Fname && true}
                            type="text"
                            fullWidth
                            variant="outlined"
                            helpertext={errors.Fname?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            {...register("Lname", { required: "Field is required" })}
                            name="Lname"
                            label="Last Name"
                            error={errors.Lname && true}
                            type="text"
                            fullWidth
                            variant="outlined"
                            helpertext={errors.Lname?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            {...register("email", { required: "Field is required" })}
                            name="email"
                            label="Email address"
                            error={errors.email && true}
                            type="email"
                            fullWidth
                            variant="outlined"
                            helpertext={errors.email?.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            {...register("city", { required: "Field is required" })}
                            error={errors.city && true}

                            label="City*"
                            fullWidth
                            variant="outlined"
                            helpertext={errors.city?.message}

                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            {...register("state", { required: "Field is required" })}
                            error={errors.state && true}

                            label="State*"
                            fullWidth
                            variant="outlined"
                            helpertext={errors.state?.message}

                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            {...register("zipNumber", {
                                required: "Field is required",
                                minLength: { value: 3, message: "Phone number should be at last 3 characters" },
                            })}

                            error={errors.zipNumber && true}
                            label="Zip Number*"
                            type={"number"}
                            fullWidth
                            variant="outlined"
                            helpertext={errors?.zipNumber?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
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
                            helpertext={errors?.phoneNumber?.message}

                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...register("address", { required: "Field is required" })}

                            label="Address"
                            error={errors.address && true}
                            fullWidth
                            multiline
                            helpertext={errors.address?.message}
                            rows={4}
                            variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Sign up as*</InputLabel>
                            <Select
                                {...register("userCategory", { required: "Field is required" })}
                                variant="outlined"
                                size="small"
                                error={errors.userCategory && true}
                                helpertext={errors.userCategory?.message}
                                defaultValue=""
                                onChange={toggleCategory}

                            >
                                <MenuItem value={"patient"}>Patient</MenuItem>
                                <MenuItem value={"dmeSupplier"}>DME Supplier</MenuItem>
                                <MenuItem value={"doctor"}>Doctor</MenuItem>
                                <MenuItem value={"therapist"}>Therapist</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>


                    {showField === "other" &&
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    {...register("npiNumber", {
                                        required: "Field is required",
                                        minLength: { value: 10, message: "NPI number should be at last 10 characters" },
                                    })}

                                    error={errors.npiNumber && true}
                                    label="NPI Number*"
                                    type={"number"}
                                    fullWidth
                                    variant="outlined"
                                    helpertext={errors.npiNumber?.message}

                                />
                                {errors?.npiNumber?.type === "minLength" && <Alert sx={{ py: 0 }} severity="error">
                                    NPI number must be at least 10 characters long </Alert>}
                            </Grid>
                            <Grid item xs={6} style={{ display: `${showField === "patient" ? "none" : "block"}` }}>
                                <TextField
                                    {...register("companyName")}
                                    error={errors.companyName && true}
                                    label="Company Name"
                                    fullWidth
                                    variant="outlined"
                                    helpertext={errors.companyName?.message}

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
                                        helpertext={errors.gender?.message}
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
                                    helpertext={errors.dob?.message}
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
                                    helpertext={errors.weight?.message}

                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    {...register("primaryInsurance", { required: "Field is required" })}
                                    error={errors.primaryInsurance && true}

                                    label="Primary Insurance*"
                                    fullWidth
                                    variant="outlined"
                                    helpertext={errors.primaryInsurance?.message}

                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    {...register("secondaryInsurance", { required: "Field is required" })}
                                    error={errors.secondaryInsurance && true}

                                    label="Secondary Insurance*"
                                    fullWidth
                                    variant="outlined"
                                    helpertext={errors.secondaryInsurance?.message}

                                />
                            </Grid>

                        </>
                    }
                    <Grid item xs={6}>
                        <TextField
                            {...register("password", { required: "Field is required" })}
                            error={errors.password && true}
                            helpertext={errors.password?.message}
                            label="Password"
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
                            helpertext={errors.confirmPassword?.message}
                            name="confirmPassword"
                            label="Confirm Password"
                            type={'password'}
                        />
                    </Grid>
                </Grid>



                <Button fullWidth size="large" type="submit" variant="contained" sx={{ my: 4 }}>
                    Signup
                </Button>
            </form>
        </>
    );
}
