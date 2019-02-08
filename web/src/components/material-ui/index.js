/*
    File to export all the Material-UI Components in one file.

    Reason: its much more conformable for me at lest
 */


export {default as AppBar} from '@material-ui/core/AppBar';
export {default as Toolbar} from '@material-ui/core/Toolbar';
export {default as InputBase} from '@material-ui/core/InputBase';
export {default as Badge} from '@material-ui/core/Badge';
export {default as Typography} from '@material-ui/core/Typography'
export {default as Drawer} from '@material-ui/core/Drawer';
export {default as Divider} from '@material-ui/core/Divider';
export {default as CircularProgress} from '@material-ui/core/CircularProgress';
export {default as Paper} from '@material-ui/core/Paper';

export {default as Menu }from '@material-ui/core/Menu';
export {default as MenuItem }from '@material-ui/core/MenuItem';

export {default as List} from '@material-ui/core/List';
export {default as ListItem} from '@material-ui/core/ListItem';
export {default as ListItemIcon } from '@material-ui/core/ListItemIcon';
export {default as ListItemText } from '@material-ui/core/ListItemText';
export {default as TextField} from '@material-ui/core/TextField';

export {default as Button} from '@material-ui/core/Button';
export {default as IconButton} from '@material-ui/core/IconButton';


/** ----------------------------- Effects Export -----------------------**/

export { fade } from '@material-ui/core/styles/colorManipulator';

/** ---------------------------- Icons Export --------------------------**/
export {
    Menu as MenuIcon,
    Search as SearchIcon,
    Mail as MailIcon,
    Notifications as NotificationsIcon,
    AccountCircle,
    More as MoreIcon,
    AccountBalanceWallet as WalletIcon,
    Money as MoneyIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Inbox as InboxIcon,
} from '@material-ui/icons'