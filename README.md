# Crypto-React-Init

A boilerplate for project that need interact with cain-network 

Libaries used in 'Web': React, React Router, Material-UI, Web3, Redux, Redux-Thunk, Axios

## Setup

1. Clone the repo

2. Move into the web directory `cd crypto-react-init/web`

3. Install dependencies `yarn install`

## Directory Layout

Get familiar with the folder structure

```
|-- /contracts/                                         # Holds all compiled and static contracts files
	|-- /scripts/					# Store the scrip to compile here
	|-- /public/					# Store all compiled files here
	|-- /solidity-contracts/                        # Store all the contracts writed in solidity
|-- /web/						# Application source code
	|-- /components/			        # React components
	    |-- /auth/
	    |-- /commons/
	    |-- /material-ui/                           # A js file that export all Material-UI elemtns of the librery in one file
    |-- /services/                                      # Holds a js file that containt the services functions
|-- /utilities/					        # Any constant variable used throughout the app and my own Web3Utilities.js
|-- /redux/                                             # Redux Reducers + Redux Actions + Store Configuration
        |-- /actions/
        |-- /reducers/
        |-- /store/ 
```

# Web section

## Development

React+Redux front-end development files are by React (Webpack/Babel are preconfigured)(hot-reloaded automatically on every save).

To start, in the web directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Production	

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


# Smart-Contract section

## Compile smart-contracts

... working on this ...