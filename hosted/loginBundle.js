"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var handleLogin = function handleLogin(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty.");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    return false;
};

var handleSignup = function handleSignup(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    return false;
};

var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "nav",
        null,
        React.createElement(
            "form",
            { id: "loginForm", name: "loginForm", onSubmit: handleLogin, action: "/login", method: "POST", className: "mainForm" },
            React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
            React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" }),
            React.createElement(
                "a",
                { id: "signupButton", href: "#", onClick: props.signUp },
                "Sign up"
            )
        )
    );
};

var SignupForm = function SignupForm(props) {
    return React.createElement(
        "nav",
        null,
        React.createElement(
            "form",
            { id: "signupForm", name: "signupForm", onSubmit: handleSignup, action: "/signup", method: "POST", className: "mainForm" },
            React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
            React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
            React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" }),
            React.createElement(
                "a",
                { id: "loginButton", href: "#", onClick: props.login },
                "Return to Login"
            )
        )
    );
};

var Main = function (_React$Component) {
    _inherits(Main, _React$Component);

    function Main() {
        _classCallCheck(this, Main);

        return _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).apply(this, arguments));
    }

    _createClass(Main, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "main" },
                React.createElement(
                    "div",
                    { className: "homeContent", id: "one" },
                    React.createElement("img", { src: "./assets/img/workout1.jpg" }),
                    React.createElement(
                        "p",
                        null,
                        "Join our userbase to track your own fitness data!"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "homeContent", id: "two" },
                    React.createElement("img", { src: "./assets/img/workout2.jpg" }),
                    React.createElement(
                        "p",
                        null,
                        "Conviently displays data!"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "homeContent", id: "three" },
                    React.createElement("img", { src: "./assets/img/workout3.jpg" }),
                    React.createElement(
                        "p",
                        null,
                        "Sign up today!"
                    )
                )
            );
        }
    }]);

    return Main;
}(React.Component);

var LoginPage = function (_React$Component2) {
    _inherits(LoginPage, _React$Component2);

    function LoginPage(props) {
        _classCallCheck(this, LoginPage);

        var _this2 = _possibleConstructorReturn(this, (LoginPage.__proto__ || Object.getPrototypeOf(LoginPage)).call(this));

        _this2.state = {
            signUpClick: false,
            loginClick: true
        };

        _this2.signUp = _this2.signUp.bind(_this2);
        _this2.login = _this2.login.bind(_this2);
        return _this2;
    }

    _createClass(LoginPage, [{
        key: "signUp",
        value: function signUp() {
            this.setState(function (state) {
                return {
                    signUpClick: true,
                    loginClick: false
                };
            });
        }
    }, {
        key: "login",
        value: function login() {
            this.setState(function (state) {
                return {
                    signUpClick: false,
                    loginClick: true
                };
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                this.state.loginClick ? React.createElement(LoginWindow, { csrf: this.props.csrf, signUp: this.signUp }) : null,
                this.state.signUpClick ? React.createElement(SignupForm, { csrf: this.props.csrf, login: this.login }) : null,
                React.createElement(Main, null)
            );
        }
    }]);

    return LoginPage;
}(React.Component);

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        ReactDOM.render(React.createElement(LoginPage, { csrf: result.csrfToken }), document.querySelector("body"));
    });
};

$(document).ready(function () {
    getToken();
});
var redirect = function redirect(response) {
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

var handleError = function handleError(message) {
    alert("Error: " + message);
};