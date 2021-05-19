import React, {useEffect, useState} from "react"
import {
    AppBar,
    Box,
    Button,
    Container,
    GridList,
    GridListTile, GridListTileBar,
    makeStyles,
    TextField,
    Toolbar,

} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

import {useForm} from "react-hook-form";
import axios from "axios";

import {useLocation, useHistory} from "react-router-dom";
import LikeButton from "../like-button/like-button";

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
        marginBottom: theme.spacing(1),

    },
    gridList: {
        transform: 'translateZ(0)',
    },
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
        color: 'white',
    },
}));

const Main = () => {
    const classes = useStyles();
    const {register, handleSubmit} = useForm();
    const [images, setImages] = useState([]);
    const url = `${process.env.REACT_APP_UNSPLASH_URL}/oauth/authorize?client_id=${process.env.REACT_APP_ACCESS_KEY}&redirect_uri=http://localhost:3000/callback&response_type=code&scope=public+write_likes+read_user+write_user+write_photos+read_photos`;

    let location = useLocation();
    const history = useHistory();
    const code = location.search.substring(6);

    const unsplashToken = `Bearer ${localStorage.getItem("token")}`;
    const unsplashClientId = `Client-ID ${process.env.REACT_APP_ACCESS_KEY}`;

    const login = (code) => {
        axios({
            method: "post",
            url: `${process.env.REACT_APP_UNSPLASH_URL}/oauth/token?client_id=${process.env.REACT_APP_ACCESS_KEY}&client_secret=${process.env.REACT_APP_SECRER_KEY}&code=${code}&redirect_uri=http://localhost:3000/callback&grant_type=authorization_code`,

        })
            .then((res) => {
                localStorage.setItem("token", res.data.access_token)
                history.push("/")

            })
            .catch((error) => {
                console.log(error)
            })
    }
    useEffect(() => {
        if (code) {
            login(code)
        }
    }, [code])

    const search = (query) => {
        axios({
            method: "get",
            url: `${process.env.REACT_APP_API_UNSPLASH_URL}/search/photos?page=1&query=${query}`,
            headers: {
                Authorization: localStorage.getItem("token") ? unsplashToken : unsplashClientId
            },

        })
            .then((res) => {
                setImages(res.data.results)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const onSubmit = data => {
        search(data.search);
    }


    const handleLogout = () => {
        localStorage.removeItem("token")
        history.push("/")
    }


    return (
        <Box>
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
                <Box display="flex" alignItems="center" justifyContent="center">
                    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                        <TextField className={classes.textField} {...register("search")}
                                   variant="outlined" placeholder="Search" width="50%"/>
                        <Button variant="contained" type="submit"><SearchIcon/>Search</Button>
                    </form>
                </Box>
                <GridList cellHeight={200} spacing={2} cols={3} className={classes.gridList}>
                    {images.map((image, key) =>
                        <GridListTile key={key}>
                            <img src={image.urls.small} alt={image.id}/>
                            <GridListTileBar
                                titlePosition="top"
                                actionIcon={
                                    localStorage.getItem("token") ? <LikeButton image={image} unsplashToken={unsplashToken}/>
                                        : ""

                                }
                                actionPosition="left"
                                className={classes.titleBar}
                            />
                        </GridListTile>
                    )}
                </GridList>
            </Container>
        </Box>
    )
}

export default Main;