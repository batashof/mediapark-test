import React, {useEffect, useState} from "react"
import {
    AppBar,
    Box,
    Button,
    Container,
    Grid,
    GridList,
    GridListTile,
    IconButton, Link,
    makeStyles,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import {useForm} from "react-hook-form";
import axios from "axios";

import {useLocation, useHistory} from "react-router-dom";

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
    const [token, setToken] = useState([]);

    let location = useLocation();
    const history = useHistory();
    const code = location.search.substring(6);
    useEffect(()=>{
        if (code) {
            axios({
                method: "post",
                url: `${process.env.REACT_APP_UNSPLASH_URL}/oauth/token?client_id=${process.env.REACT_APP_ACCESS_KEY}&client_secret=${process.env.REACT_APP_SECRER_KEY}&code=${code}&redirect_uri=http://localhost:3000/callback&grant_type=authorization_code`,

            })
                .then((res) => {
                    localStorage.setItem("token", res.data.access_token)
                    history.push("/")
                    setToken(res.data.access_token)

                    console.log(res.data.access_token)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [code])
    console.log(location.search.substring(6))
    const onSubmit = data => {
        const unsplashToken = `Bearer ${localStorage.getItem("token")}`;
        const unsplashClientId = `Client-ID ${process.env.REACT_APP_ACCESS_KEY}`;
        axios({
            method: "get",
            url: `${process.env.REACT_APP_API_UNSPLASH_URL}/search/photos?page=1&query=${data.search}`,
            headers: {
                Authorization: localStorage.getItem("token") ? unsplashToken : unsplashClientId
            },

        })
            .then((res)=> {
                setImages(res.data.results)

                console.log(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // <a href={`${process.env.REACT_APP_UNSPLASH_URL}/oauth/authorize?client_id=${process.env.REACT_APP_ACCESS_KEY}&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code&scope=public`} color="inherit">Login</a>

    const handleLogin = () => {
        axios({
            method: "get",
            url: `${process.env.REACT_APP_UNSPLASH_URL}/oauth/authorize?client_id=${process.env.REACT_APP_ACCESS_KEY}&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code&scope=public`,
        })
            .then((res)=> {

                console.log(res)
            })
            .catch((error) => {
                console.log(error)
            })
        // axios({
        //     method: "post",
        //     url: `${process.env.REACT_APP_UNSPLASH_URL}/oauth/token?client_id=${process.env.REACT_APP_ACCESS_KEY}&client_secret=${process.env.REACT_APP_SECRER_KEY}&grant_type="code"`,
        //
        //
        // })
        //     .then((res)=> {
        //
        //         console.log(res.data)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        history.push("/")
    }

    const url = `${process.env.REACT_APP_UNSPLASH_URL}/oauth/authorize?client_id=${process.env.REACT_APP_ACCESS_KEY}&redirect_uri=http://localhost:3000/callback&response_type=code&scope=public`;

    return (
        <box display="flex" alignItems="center" height="100%" flexDirection="column">
            <AppBar position="static">
                <Toolbar>
                    {localStorage.getItem("token") ?
                        <Button onClick={handleLogout}>Log out</Button>
                        :
                        <a href={url}>Login</a>
                    }

                </Toolbar>
            </AppBar>
        <Container>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <TextField className={classes.textField} {...register("search")}
                           variant="outlined" placeholder="Search" width="50%"/>
                <Button variant="contained" type="submit">Search</Button>
            </form>
            <GridList>
                {images.map((image, key)=>
                    <GridListTile key={key}>
                        <img src={image.urls.small}/>

                    </GridListTile>
                )}


            </GridList>

        </Container>
        </box>
    )
}

export default Main;