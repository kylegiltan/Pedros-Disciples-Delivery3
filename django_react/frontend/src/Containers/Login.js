import React, { Component } from 'react'
import Container from '@material-ui/core/Container'
// import pages
import FirstPage from '../Components/Login/1stPage'
import StudentLogin from '../Components/Login/StudentLogin'
import ProfessorLogin from '../Components/Login/ProfessorLogin'

// Import Custom Components
import SnackBar from '../Components/Login/SnackBar'

// import router redirect

import { withRouter, Redirect } from 'react-router-dom'


// *----------------DUMMY DATA ------------------*
const professorCredentials = {
    username: 'professor@bc.edu',
    pass: '12345678'
}

const studentCredentials = {
    username: 'student@bc.edu',
    pass: '12345678'
}


class Login extends Component {

    // *------------ INITIALIZE STATE ----------------*
    state = {
        typeSelected: null,
        step: 0,

        professorEmail: null,
        professorPassword: null,

        studentEmail: null,
        studentPassword: null,

        wrongCredentials: false,

        professorRedirect: false,
        studentRedirect: false,

        data: [],
        loaded: false,
        placeholder: "Loading"



    }


    // *-----------HANDLE SELECT TYPE ------*

    onClickTypeHandler = e => {
        if (e === 'Student') {
            this.setState({
                typeSelected: 'Student'
            })
        }
        if (e === 'Professor') {
            this.setState({
                typeSelected: 'Professor'
            })
        }
    }


    componentDidMount() {
        fetch("api/login")
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                this.setState(() => {
                    return {
                        data,
                        loaded: true
                    };
                });
                console.log(state)
            })
            .catch()
    }

    // *------------- NEXT -------------*
    onClickNext = e => {
        if (this.state.step === 0) {
            this.setState({
                step: 1
            })
        }
        if (this.state.step === 1) {
            this.setState({
                step: 0,
                typeSelected: null,
                studentEmail: null,
                studentPassword: null,
                professorEmail: null,
                professorPassword: null

            })
        }
    }


    // *------------ HANDLE CHANGE TEXT ----------------*
    textHandler = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }


    // *------------- LOGIN -----------------*
    loginHandler = async e => {
        e.preventDefault()
        e.stopPropagation();
        console.log("HELLO")
        let foundPerson = this.state.data.find(person => {
            console.log(person.username, this.state.studentEmail.toLowerCase())
            return this.state.studentEmail.toLowerCase() == person.username
        })
        console.log("2")
        console.log(foundPerson);
        if (foundPerson === undefined) {
            this.setState({
                wrongCredentials: true
            })
        }
        else {
            if (this.state.typeSelected === 'Student') {
                // *----------- CHANGE WITH DJANGO SERVER ---------------*
                if (foundPerson.password !== this.state.studentPassword || foundPerson.isStudent !== true) {
                    this.setState({
                        wrongCredentials: true
                    })
                }
                else {
                    console.log("SUCCESS!")
                    // *--------- ADD TOKEN ----------------*
                    // localStorage.setItem('token',login.data.token)
                    localStorage.setItem('userType', 'Student')
                    this.setState({
                        studentRedirect: true
                    })
                }

            }

            if (this.state.typeSelected === 'Professor') {
                console.log("HELLO6")
                // *----------- CHANGE WITH DJANGO SERVER ---------------*
                if (professorCredentials.username !== this.state.professorEmail.toLowerCase() || professorCredentials.pass !== this.state.professorPassword) {
                    this.setState({
                        wrongCredentials: true
                    })
                }
                else {
                    localStorage.setItem('userType', 'Professor')
                    this.setState({
                        professorRedirect: true
                    })

                }

            }
        }

    }



    //  *------------ CLOSE NOTIFICATION ----------------*
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            wrongCredentials: false
        })
    };



    render() {
        // pageContent
        let pageContent = (
            <FirstPage
                clickTypeHandler={this.onClickTypeHandler}
                selected={this.state.typeSelected}
                nextHandler={this.onClickNext}
            />

        )

        // Change to Student Login 
        if (this.state.step === 1 && this.state.typeSelected === 'Student') {
            pageContent = (
                <StudentLogin
                    handleBack={this.onClickNext}
                    textHandler={this.textHandler}
                    loginHandler={this.loginHandler}
                    pass={this.state.studentPassword}
                    email={this.state.studentEmail}
                />
            )
        }

        // Change to Professor Login 
        if (this.state.step === 1 && this.state.typeSelected === 'Professor') {
            pageContent = (
                <ProfessorLogin
                    handleBack={this.onClickNext}
                    textHandler={this.textHandler}
                    loginHandler={this.loginHandler}
                    pass={this.state.professorPassword}
                    email={this.state.professorEmail}

                />
            )
        }


        return (
            <Container style={{ height: '100%' }}>
                {pageContent}



                <SnackBar
                    message='Wrong Credentials'
                    open={this.state.wrongCredentials}
                    handleClose={this.handleClose}

                />


                {this.state.professorRedirect ? <Redirect to='/professorHome/' /> : null}
                {this.state.studentRedirect ? <Redirect to='/studentHome/' /> : null}

            </Container>
        )
    }
}


export default withRouter(Login)