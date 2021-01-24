import React from "react";
import axios from 'axios';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null
      }
   
  }

   onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

  onClickHandler = event => {
    const data = new FormData() 
    data.append('file', this.state.selectedFile)
    axios.post("http://localhost:3000/upload", data, { // receive two parameter endpoint url ,form data 
    })
    .then(res => { // then print response status
      console.log(res);
      document.getElementById("epp_file").innerHTML = res.data
    })
  }
  
  render() {
    return (
      <div class="container" style={{margin: 20}}>
      <label>
        Plik z ramzesa : 
        <input type="file" name="file" onChange={this.onChangeHandler}/>
      </label>
      <br/>
      <button type="button" class="btn btn-success btn-xs" onClick={this.onClickHandler}>Konwertuj na EPP</button> 

      <br/>
      <h1>Instrukcja</h1>
      <ol>
          <li>Koniecznie wyeksportuj sobie aktualne dane do EPP.</li>
          <li>Otwórz nowo powstały plik EPP.</li>
          <li>Usuń wszystko od 3 linijki (włącznie) w dół. Zostaw pierwsze 2 KONIECZNIE</li>
          <li>Przekonwertowany plik Excel na EPP wrzuć do do otwartegoo edytora pod wcześniej zostawionymi dwoma linijkami</li>
          <li>Zapisz nowo powstały plik EPP</li>
          <li>Zaimportuje plik EPP do Strukt GT</li>
        </ol>
        <hr/>
        <p id="epp_file" style={{fontSize: 11}}>
      </p>
      </div>
    )
  }
}