import {
  XYPlot,
  VerticalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis
} from "react-vis";
import $ from "jquery";

let colors = ["#ED9B40", "#7B9EA8", "#BA3B46"];

let premium = false;

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      console.dir(xhr);
      handleError(messageObj.error);
    }
  });
};

const handleError = message => {
  alert("Error: " + message);
};

const handleSubmit = e => {
  e.preventDefault();

  if ($("#exerciseText").val() == "" || $("#minutes").val() == "") {
    handleError("All fields required");
    return false;
  }

  document.querySelector("#overlayFormExercise").style.visibility = "hidden";
  document.querySelector("#overlayFormExercise").style.display = "none";

  document.querySelector("#overlayFormPassword").style.visibility = "hidden";
  document.querySelector("#overlayFormPassword").style.display = "none";

  document.querySelector("#vis").style.display = "block";

  sendAjax(
    "POST",
    $("#exerciseForm").attr("action"),
    $("#exerciseForm").serialize(),
    function() {
      loadDomosFromServer();
    }
  );

  return false;
};

const handlePass = e => {
  sendAjax(
    "POST",
    $("#passForm").attr("action"),
    $("#passForm").serialize(),
    function() {
      loadDomosFromServer();
    }
  );
};

const ExerciseForm = props => {
  document.querySelector("#add").onclick = () => {
    document.querySelector("#overlayFormExercise").style.visibility = "visible";
    document.querySelector("#overlayFormExercise").style.display = "block";
  };

  return (
    <form
      id="exerciseForm"
      onSubmit={handleSubmit}
      name="exerciseForm"
      action="/maker"
      method="POST"
      className="exerciseForm"
    >
      <label htmlFor="name">Exercise: </label>
      <input
        id="exerciseText"
        type="text"
        name="name"
        placeholder="Exercise Type ie. Run"
      />
      <label htmlFor="minutes">Time Worked Out: </label>
      <input id="minutes" type="text" name="minutes" placeholder="In minutes" />
      <label htmlFor="day">Date: </label>
      <input id="day" type="date" name="day" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDataSubmit" type="submit" value="Add Exercise" />
    </form>
  );
};

const PassForm = props => {
  document.querySelector("#changePass").onclick = () => {
    document.querySelector("#overlayFormPassword").style.visibility = "visible";
    document.querySelector("#overlayFormPassword").style.display = "block";
  };

  return (
    <form
      id="passForm"
      onSubmit={handlePass}
      name="passForm"
      action="/changePass"
      method="POST"
      className="passForm"
    >
      <label htmlFor="newPass">New Password: </label>
      <input
        id="newPass"
        type="password"
        name="newPass"
        placeholder="Password"
      />
      <label htmlFor="newPass2">Retype New Password: </label>
      <input
        id="newPass2"
        type="password"
        name="newPass2"
        placeholder="Retype Password"
      />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDataSubmit" type="submit" value="Confirm Change" />
    </form>
  );
};

const DataList = function(props) {
  if (props.data.length === 0) {
    return (
      <div className="dataList">
        <h3 className="empty">
          Click{" "}
          <a id="addFake" href="#">
            Add Exercise
          </a>{" "}
          to add exercise data!
        </h3>
      </div>
    );
  }

  const domoNodes = props.data.map(function(data) {
    document.querySelector("#vis").style.display = "block";

    return (
      <div
        key={data._id}
        className="dataObj"
        style={{ backgroundColor: colors[Math.floor(Math.random() * 3)] }}
      >
        <h3 className="activity"> {data.name} </h3>
        <h3 className="timeof"> {data.minutes} minutes</h3>
        <h3 className="date"> {data.date.substring(0, 10)} </h3>
      </div>
    );
  });

  return <div className="dataList">{domoNodes}</div>;
};

const Graph = props => {
  let data = props.data.map(obj => {
    var newObj = {};
    newObj.x = obj.date.substring(5, 10);
    newObj.y = obj.minutes;
    return newObj;
  });

  // create new array to sort data
  let sortedData = [];
  for (let i = 0; i < data.length; i++) {
    sortedData.push(Object.values(data[i]));
    for (let j = sortedData.length - 1; j >= 0; j--) {
      let curmonth = parseInt(sortedData[j][0].substring(0, 2));

      for (let k = 0; k <= j; k++) {
        let prevmonth;
        j - k >= 0
          ? (prevmonth = parseInt(sortedData[j - k][0].substring(0, 2)))
          : null;

        if (curmonth < prevmonth) {
          let temp = sortedData[j - k];
          sortedData[j - k] = sortedData[j];
          sortedData[j] = temp;
        }

        if (curmonth === prevmonth) {
          for (let m = 0; m <= j; m++) {
            let curday = parseInt(sortedData[j][0].substring(3));
            let prevday;
            j - m >= 0
              ? (prevday = parseInt(sortedData[j - m][0].substring(3)))
              : null;
            if (curday < prevday) {
              let temp = sortedData[j - m];
              sortedData[j - m] = sortedData[j];
              sortedData[j] = temp;
            }
          }
        }
      }
    }
  }
  console.dir(sortedData);
  for (let n = 0; n < data.length; n++) {
    data[n].x = sortedData[n][0];
    data[n].y = sortedData[n][1];
  }

  return (
    <div className="graph">
      <h1>Number of Minutes Exercised per Day</h1>
      <XYPlot height={400} width={500} xType={"ordinal"}>
        <VerticalBarSeries data={data} />
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis tickLabelAngle={270} />
        <YAxis />
      </XYPlot>
    </div>
  );
};

const Premium = props => {
  let data = props.data.map(obj => {
    var newObj = {};
    newObj.x = obj.date.substring(5, 7);
    newObj.y = 1;
    return newObj;
  });

  let countedArray = [];
  for (let i = 1; i < data.length; i++) {
    // push first element
    if (i === 1) countedArray.push(data[i]);

    // check if days are equal
    if (data[i].x === data[i - 1].x) {
      for (let j = 0; j < countedArray.length; j++) {
        if (countedArray[j].x === data[i].x) {
          countedArray[j].y++;
        } else {
          countedArray.push(data[i]);
        }
      }
    }
  }

  console.dir(countedArray);

  return (
    <div>
      <Graph data={props.data} />
      <div className="graph">
        <h1>Days Exercised per Month</h1>
        <XYPlot height={400} width={500} xType={"ordinal"}>
          <VerticalBarSeries data={data} />
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
        </XYPlot>
      </div>
    </div>
  );
};

class DataVis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      premium: this.props.premium
    };

    this.activatePremium = this.activatePremium.bind(this);
  }

  activatePremium() {
    this.setState(state => ({
      premium: !state.premium
    }));
  }

  render() {
    return (
      <div>
        {this.state.premium ? (
          <Premium data={this.props.data} />
        ) : (
          <Graph data={this.props.data} />
        )}
      </div>
    );
  }
}

const loadDomosFromServer = () => {
  sendAjax("GET", "/getDomos", null, data => {
    ReactDOM.render(
      <DataVis data={data.domos} premium={premium} />,
      document.querySelector("#vis")
    );

    ReactDOM.render(
      <DataList data={data.domos} />,
      document.querySelector("#data")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <ExerciseForm csrf={csrf} />,
    document.querySelector("#overlayFormExercise")
  );

  ReactDOM.render(
    <PassForm csrf={csrf} />,
    document.querySelector("#overlayFormPassword")
  );

  ReactDOM.render(<DataList data={[]} />, document.querySelector("#data"));

  let dataVisComponent = ReactDOM.render(
    <DataVis data={[]} premium={premium} />,
    document.querySelector("#vis")
  );

  document.querySelector("#premium").onclick = () => {
    dataVisComponent.activatePremium();
    premium = !premium;
    console.dir(premium);
  };

  loadDomosFromServer();
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
