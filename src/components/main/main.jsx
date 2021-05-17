import React from "react"
import {Box, Button, Input, makeStyles, TextField} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: '75%',
    },
}));

const Main = () => {
    const classes = useStyles();

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" flexDirection="column">
            <TextField           className={classes.textField}
                                 variant="outlined" placeholder="Search" width="50%"/>
            <Button variant="contained">Search</Button>
        </Box>
    )
}

export default Main;