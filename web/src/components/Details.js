import {Component} from "react";
import {withStyles} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import React from "react";

import {callTransaction} from "../redux/actions";
import {callMethod} from "../utilities/web3Utilities";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography} from "./material-ui";
import axios from 'axios';
import {UNSPLASH_API_KEY} from "../utilities/constants";

class Details extends Component {
    state = {
        pets: [],
        imgs: []
    };

    componentDidMount() {
        const {contract, account} = this.props;
        callMethod(contract, "getPetsLength", account, []).then((petsLength) => {
            this.requestAllPets(petsLength);

            axios.get('https://api.unsplash.com/photos/random/?client_id=' + UNSPLASH_API_KEY
                    + '&collections=' + 3330452
                    +'&count=' + petsLength)
                .then(data => {
                    this.setState({ imgs: data.data });
                })
                .catch(err => {
                    console.log('Error happened during fetching!', err);
                });

        });
    }

    requestAllPets(petsLength) {
        const {account, contract} = this.props;
        for (let i = 0; i < petsLength; i++) {
            callMethod(contract, "pets", account, [i]).then(
                (result) => {
                    this.setState((state) => {
                            return {pets: [...state.pets, result]}
                        }
                    )
                }
            );
        }
    }

    renderPets() {
        const {pets, imgs} = this.state;
        const {classes} = this.props;

        /**
         * Pets prop mapp
         0 -result.name,1 - result.color, 2 - result.breed.breedType, 3- result.breed.subType,
         4 - result.sex, 5 - result.dna, 6 - result.fatherId, 7 - result.motherId
         */

        if (pets.length > 0 && imgs.length > 0) {
            return pets.map((pet, index) => {
                const urlFromDna = imgs[index].urls.full;
                return (
                    <Card className={classes.card} key={pet}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image={urlFromDna}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {pet[0]}
                                </Typography>
                                <Typography component="p">
                                    {
                                        'This is a ' + pet[1] + ' colored pet of type ' + pet[2] + ' and a subType of ' + pet[3]
                                        + '. DNA: ' + pet[5] + ' - SEX: ' + (pet[4] ? 'Macho' : 'Hembra')
                                        + ' - FatherId: ' + pet[6] + ' - MotherId: ' + pet[7]
                                    }
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary">
                                Share
                            </Button>
                            <Button size="small" color="primary">
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>)
            })
        } else {
            return null
        }
    }

    render() {
        return (
            <>
                <h1>Details</h1>
                {this.renderPets()}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {...state.web3}
};

const mapDispatchToProps = {
    callTransaction,
};

const styles = (theme) => ({
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
});

export default withStyles(styles)(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(Details))
);