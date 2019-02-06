import {Component} from 'react';
import React from "react";
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";

import {
    Drawer, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText,
    ChevronLeftIcon, ChevronRightIcon, InboxIcon, MailIcon
} from "../material-ui";
import {DRAWER_WIDTH} from "../../utilities/constants";


class SideBar extends Component {

    render() {
        const {classes, theme, handleDrawerClose, open} = this.props;
        return (
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        )
    }
}


const mapStateToProps = (state) => {
    return {...state}
};

const drawerWidth = DRAWER_WIDTH;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
});


export default withStyles(styles, { withTheme: true })(
    connect(mapStateToProps, {})(SideBar)
);