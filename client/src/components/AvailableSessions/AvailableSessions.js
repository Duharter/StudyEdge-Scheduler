import React,{Component} from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DetailedSessionView from '../DetailedSessionView/DetailedSessionView';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DateTime } from "luxon";
import jwt_decode from 'jwt-decode';

const dateCleaner = (date) => {
    var dateString = (date.getMonth() + 1).toString() + "/";
    dateString += (date.getDate()).toString() + "/";
    dateString += (date.getFullYear().toString());
    return dateString;
}
class AvailableSessions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetailedSession: false,
            showRes: false,
            user: this.props.user,
            redirectbool: false,
            userExist: false,
            setOpen: false
        };
        this.displayDetailedSession = this.displayDetailedSession.bind(this); //Shows Detailed Session component
        this.disableDetailedSession = this.disableDetailedSession.bind(this); //Disables Detailed Session component
        this.handleClickClose = this.handleClickClose.bind(this); //Shows/closes for overbook session notification

    }
    
    //Shows Detailed Session component 
    displayDetailedSession = (session) => () => {
        //Prevents students from overbooking a session
        if(session.slots > session.students.length){
            this.setState({
                showDetailedSession: true,
                sessionId: session
            });
        }
        //Allows for admin to click on overbooked session even when students are prevented
        //Checks if admin web token is saved to local storage (is admin logged in?)
        try {
            //JSON Web Token (Jwt)
            var token = localStorage.getItem('jwtToken');
            var decoded = jwt_decode(token);
            if (decoded.username === "admin") {
                this.setState({
                    showDetailedSession: true,
                    sessionId: session
                });
            }
        } catch (error) { //While checking for web token, if the token doesn't exist, then react will throw problem
            this.setState({
                checkOnce: false,
            });
        }
        //Makes sure that students cannot overbook a session by checking if student's UFL is already in session or not
        session.students.map(element => {
            if(element[0] === this.state.user){
                this.setState({
                    userExist: true,
                    showDetailedSession: false,
                    setOpen: true,
                   
                });
            }
        });  
    }

    //Disables Detailed Session component
    disableDetailedSession = () => {
        this.setState({
            showDetailedSession: false
        });
    }

    //Shows/closes for overbook session notification
    handleClickClose = () => {
        if(this.state.userExist){
        this.setState({
            setOpen: false,
        });
    }
    }

    render(){
        //Filters for calendar date and course drop down menu
        const tempReservations = this.props.sessions
        .filter(reservation=>{
            var temp = "\"" + reservation.date + "\""
            var dateStr = JSON.parse(temp);  
            var date = new Date(dateStr);
            var date1 = dateCleaner(date)
            var date2 = dateCleaner(this.props.date)
            return date1 === date2 && date >= new Date() && (reservation.class === this.props.class || this.props.class === "")
        })

        //Creates formatting for all filtered sessions in Available Session component
        const myReservations = tempReservations.map((session,index) =>
            <Grid container
            direction="column"
            alignItems="center"
            justify = "center"
            spacing={5}
            style={{
            margin: 0,
            width: '100%',
            }}
            key = {index}>

           <Grid item
           style = {{width: '100%',height:"100%"}}>
            {/* Creates buttons for each session */}
                <Button variant="outlined" color="primary" onClick = {this.displayDetailedSession(session)} style={{maxHeight: 600, width: 425, maxWidth: 400}}>
                    <Grid item>
                        <Grid item>
                            <Grid>{session.class}</Grid>
                            <Grid>{session.title}</Grid>
                            <Grid>Location: {session.location}</Grid>
                            <Grid>Study Expert: {session.tutor}</Grid>
                            <Grid>{DateTime.fromISO(session.date).toFormat('ff')}</Grid>
                        </Grid>
                        <Grid container
                        justify = "flex-end"
                        style={{width: 375}}>
                            <Grid>Available Slots: {session.slots-session.students.length}/{session.slots}</Grid>
                        </Grid>
                    </Grid>
                </Button>
            </Grid>
            </Grid>
        )
        //Initial "Select a Date" message when first visiting page
        if(this.props.first){
            return(
                <Grid style = {{width: 425}}>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify = "center"
                        spacing={4}>
                        <Grid item>
                            <Typography variant="h4" className = "center">
                                Select a Date
                            </Typography>
                        </Grid>
                    </Grid> 
                </Grid>
            );
        }
        //Shows all filtered sessions
        else if(tempReservations.length > 0){
            return (
                <Grid
                style={{height:"100%"}}>
                {this.state.showDetailedSession ?
                <DetailedSessionView /* shows Detailed Session component */
                    session={this.state.sessionId} 
                    disableDetailedSession={this.disableDetailedSession}
                    user = {this.state.user}
                />
                 :
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify = "center"
                    spacing={2}
                    style={{height:"100%"}}
                    >
                    <Grid item>
                        <Typography variant="h4">
                            Available Sessions
                        </Typography>
                    </Grid>
                    <Grid item
                    style={{maxHeight: 615, overflow: 'auto'}}
                    > 
                    {/* Message to students that says that a student is already booked for session */}
                    <Dialog
                        open={this.state.setOpen}
                        onClose={this.handleClickClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"You have already reserved a slot for this session."}</DialogTitle>
                        <DialogActions>
                            <Button onClick={this.handleClickClose} color="primary">Ok</Button>
                        </DialogActions>
                    </Dialog>
                        {myReservations}
                    </Grid>
                </Grid> }
            </Grid>
            );
        }
        
        else{
            //Tells students that no sessions are available on a given date
            return(
                <Grid>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify = "center"
                        spacing={4}>
                        <Grid item>
                            <Typography variant="h4" className = "center">
                                No Sessions Available
                            </Typography>
                        </Grid>
                    </Grid> 
                </Grid>
            );
        }
    }
}

export default AvailableSessions;