const redirect = (response) => {
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    })
}

const handleError = (props) => {

    document.querySelector("#error").style.visibility = "visible";
    document.querySelector("#error").style.display = "block";
    console.dir("test")
    return(
        <div>
            <div className="arrowUp"></div>
            <div className="errorMessage">
                <h3>{props}</h3>
            </div>
        </div>
    )
};
