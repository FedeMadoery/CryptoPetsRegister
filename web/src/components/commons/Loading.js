import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {CircularProgress} from '../material-ui';

class Loading extends Component {
    state = {
        completed: 0,
    };

    componentDidMount() {
        this.timer = setInterval(this.progress, 20);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    progress = () => {
        const {completed} = this.state;
        this.setState({completed: completed >= 100 ? 0 : completed + 1});
    };

    render() {
        const {classes} = this.props;
        return (
                <CircularProgress
                    className={classes.progress}
                    variant="determinate"
                    value={this.state.completed}
                    color="secondary"
                />
        );
    }
}

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

export default withStyles(styles)(Loading);