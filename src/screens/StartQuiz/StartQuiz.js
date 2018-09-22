import React, { Component } from 'react';
import Header from '../../components/Header/Header'
// import lightBlue from '@material-ui/core/colors/lightBlue';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class QuizList extends Component {
  constructor() {
    super()

    this.state = {

      radioVal: null,

      sec: 10,
      min: 0,

      correct: 0,
      scored: false,

    }
    this.handleChange = this.handleChange.bind(this);
    this.quizTimer = this.quizTimer.bind(this);
    // this.timer()
  }

  handleChange(e) {
    this.setState({
      radioVal: e.target.value
    });
  }

  async updating() {
    const { started, qstnNo, onPress } = this.props;
    const { correct, radioVal } = this.state;

    // var radio = document.querySelector("input[name='option']:checked");

    if (radioVal == null) {
      alert('Selection Required');
    }

    else {
      if ((qstnNo === started.qArr.length - 1) && (started.qArr[qstnNo].answer.match(radioVal))) {

        await this.setState({
          correct: correct + 1,
          min: 0,
          sec: 0
        })

      }
      else
        if ((qstnNo === started.qArr.length - 1) && !(started.qArr[qstnNo].answer.match(radioVal))) {

          await this.setState({
            min: 0,
            sec: 0
          })

        }
        else
          if (!(qstnNo === started.qArr.length - 1) && (started.qArr[qstnNo].answer.match(radioVal))) {

            await this.setState({
              correct: correct + 1,
            })

            onPress(qstnNo);
          }
          else {
            onPress(qstnNo);
          }
    }
  }

  async scoreCal() {
    const { started } = this.props;
    const { correct } = this.state;

    await this.setState({
      scored: ((correct) * (100 / started.qArr.length)).toFixed(2),
      date: new Date(),
    })

    this.saveScore();
    // localStorage.setItem("score", JSON.stringify(score))
  }

  saveScore() {
    const { started } = this.props;
    const { scored, date } = this.state;

    started.score = scored;
    started.attemptDate = date.toLocaleDateString();
    started.attemptTime = date.toLocaleTimeString();

  }

  quizTimer() {
    const { sec, min } = this.state;

    if ((sec === 0) && (min === 0)) {

      clearInterval(this.time);

      this.scoreCal();

    }

    else
      if ((sec <= 0) && !(min === 0)) {

        this.setState({
          sec: 59,
          min: min - 1,
        })
      }

      else {
        this.setState({
          sec: sec - 1,
        })
      }

  }

  timer() {
    this.time = setInterval(this.quizTimer, 1000);
  }

  render() {
    const { started, qstnNo, back, quizName, subQuizName, logout } = this.props;
    const { correct, scored, min, sec } = this.state;
    return (
      <div style={{ margin: '80px 3% 3% 3%' }}>


        {scored !== false ?

          <div>
            <Header logout={logout} />

            <h1>{quizName}</h1>
            <h2>{subQuizName}</h2>
            <p>Total Questions: {started.qArr.length}</p>
            <p>Correct: {correct}</p>
            <p>Percentage: {scored} %</p>
            <button onClick={() => back()}>Back</button>
          </div>
          :
          <div>
            <Header />
            <h4>{min}:{sec}</h4>

            <div className='qstnDiv'>

              <h3>{qstnNo + 1}) {started.qArr[qstnNo].question}</h3>

              <FormControl component="fieldset" >
                {/* <FormLabel component="legend">Gender</FormLabel> */}
                <RadioGroup
                  // aria-label="Gender"
                  // name="gender1"
                  // className={classes.group}
                  value={this.state.radioVal}
                  onChange={this.handleChange}
                >
 
                  <FormControlLabel value="1" name="option" control={<Radio />} label={started.qArr[qstnNo].option1} />
                  <FormControlLabel value="2" name="option" control={<Radio />} label={started.qArr[qstnNo].option2} />
                  <FormControlLabel value="3" name="option" control={<Radio />} label={started.qArr[qstnNo].option3} />
                  <FormControlLabel value="4" name="option" control={<Radio />} label={started.qArr[qstnNo].option4} />

                </RadioGroup>
              </FormControl> 

              <button onClick={this.updating.bind(this)}>Next</button>

            </div>
          </div>

        }

      </div>
    )
  }

}

export default QuizList;

//CHILD --> PARENT STATE UPDATE
//=============================

//1) Create a function in Parent that
//will update the State.

//2) Pass the function in the Child's
//Component's Props

//3) Call that function from Child Props.
