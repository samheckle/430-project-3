const handleLogin = (e) => {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '') {
        ReactDOM.render(handleError("Username and password required"), document.querySelector("#error"));
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        ReactDOM.render(handleError("All fields required"), document.querySelector("#error"));
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        ReactDOM.render(handleError("passwords do not match"), document.querySelector("#error"));
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    return false;
}

const LoginWindow = (props) => {
    return (
        <nav>
            <form id="loginForm" name="loginForm" onSubmit={handleLogin} action="/login" method="POST" className="mainForm">
                <input id="user" type="text" name="username" placeholder="username" />
                <input id="pass" type="password" name="pass" placeholder="password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Sign in" />
                <a id="signupButton" href="#" onClick={props.signUp}>Sign up</a>
            </form>
        </nav>
    );
};

const SignupForm = (props) => {
    return (
        <nav>
            <form id="signupForm" name="signupForm" onSubmit={handleSignup} action="/signup" method="POST" className="mainForm">
                <input id="user" type="text" name="username" placeholder="username" />
                <input id="pass" type="password" name="pass" placeholder="password" />
                <input id="pass2" type="password" name="pass2" placeholder="retype password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Sign Up" />
                <a id="loginButton" href="#" onClick={props.login}>Return to Login</a>
            </form>
        </nav>
    );
};

class Main extends React.Component {
    render() {
        return (
            <div id="main">
                <div className="homeContent" id="one">
                    <img src="./assets/img/workout1.jpg"></img>
                    <p>Join our userbase to track your own fitness data!</p>
                </div>
                <div className="homeContent" id="two">

                    <img src="./assets/img/workout2.jpg"></img>
                    <p>Conviently displays data!</p>

                </div>
                <div className="homeContent" id="three">
                    <img src="./assets/img/workout3.jpg"></img>
                    <p>Sign up today!</p>

                </div>
            </div>
        );
    }
}

class LoginPage extends React.Component {
    constructor(props) {
        super();
        this.state = {
            signUpClick: false,
            loginClick: true
        };

        this.signUp = this.signUp.bind(this);
        this.login = this.login.bind(this);
    }

    signUp() {
        document.querySelector("#error").style.visibility = "hidden";
        document.querySelector("#error").style.display = "none";
        this.setState(state => ({
            signUpClick: true,
            loginClick: false
        }));
    }

    login() {
        document.querySelector("#error").style.visibility = "hidden";
        document.querySelector("#error").style.display = "none";
        this.setState(state => ({
            signUpClick: false,
            loginClick: true
        }));
    }

    render() {
        return (
            <div>
                {this.state.loginClick ? <LoginWindow csrf={this.props.csrf} signUp={this.signUp}></LoginWindow> : null}
                {this.state.signUpClick ? <SignupForm csrf={this.props.csrf} login={this.login}></SignupForm> : null}
                <Main></Main>
                <div id="error"></div>
            </div>
        )
    }
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        ReactDOM.render(
            <LoginPage csrf={result.csrfToken}></LoginPage>,
            document.querySelector("body")
        );
    });
};

$(document).ready(function () {
    getToken();
});