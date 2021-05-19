import React, {useState} from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import {IconButton, makeStyles} from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    icon: {
        color: 'white',
    },
}));

const LikeButton = ({unsplashToken, image}) => {
    const classes = useStyles();
    const [color, setColor] = useState(image.liked_by_user);

    const switchLike = (image) => {
        let method = "post";
        if (color) {
            console.log("delete")
            method = "delete"
        }

        axios({
            method: method,
            url: `${process.env.REACT_APP_API_UNSPLASH_URL}/photos/${image.id}/like`,
            headers: {
                Authorization: unsplashToken
            },

        })
            .then((res) => {
                setColor(res.data.photo.liked_by_user)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <IconButton onClick={() => switchLike(image)} aria-label={"fav-icon"} className={classes.icon}>
            <FavoriteIcon color={color ? "secondary" : ""}/>
        </IconButton>
    )
}

export default LikeButton;
