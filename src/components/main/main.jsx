import React, {useState} from "react"
import {Box, Button, Grid, makeStyles, TextField} from "@material-ui/core";
import {useForm} from "react-hook-form";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(5),

        width: '100%',
    },
    form: {
        width: '75%',

    }
}));

const Main = () => {
    const classes = useStyles();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [images, setImages] = useState([]);
    const onSubmit = data => {
        axios({
            method: "get",
            url: `${process.env.REACT_APP_UNSPLASH_URL}/search/photos?page=1&query=${data.search}`,
            headers: {
                Authorization: `Client-ID ${process.env.REACT_APP_ACCESS_KEY}`
            },

        })
            .then((res)=> {
                setImages(res.data.results)

                console.log(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(process.env.REACT_APP_UNSPLASH_URL)
    }

    return (
        <Box display="flex" alignItems="center" height="100%" flexDirection="column">
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <TextField className={classes.textField} {...register("search")}
                           variant="outlined" placeholder="Search" width="50%"/>
                <Button variant="contained" type="submit">Search</Button>
            </form>
            <Grid container>
                {images.map((image, key)=>
                    <Grid key={key}>
                        <img src={image.urls.small}/>

                    </Grid>
                )}


            </Grid>
        </Box>
    )
}

export default Main;