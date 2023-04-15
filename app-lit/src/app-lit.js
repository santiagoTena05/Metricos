import { LitElement, html, css } from 'lit';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';

class AppLit extends LitElement {
  static get properties() {
    return {
      emial : {type: String},
      password : {type: String},
      username : {type: String},
      databaseName: { type: String },
      objectStoreName: { type: String },
    };
  }

  static styles = css`
    *{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      align-items: center;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 100vw;
      height: 100vh;
      gap: 60px;
    }
    
    #button {
      outline: 0;
      background-color: #434843;
      width: 100%;
      border: 0;
      color: #fff;
      padding: 15px;
      -webkit-transition: all 0.3 ease;
      transition: all 0.3 ease;
      cursor: pointer;
    }
    
    input {
      outline: 0;
      background-color: #f2f2f2;
      width: 100%;
      border: 0;
      margin: 0 0 15px;
      padding: 15px;
      box-sizing: border-box;
      font-size: 14px;
    }

    .formgroup {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
      background: #FFFFFF;
      max-width: 360px;
      padding: 45px;
      text-align: center;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }
  `;

  constructor() {
    super();
    this.email = '';
    this.password = '';
    this.username = '';
    this.databaseName = 'my-database';
    this.objectStoreName = 'answers';
  }

  connectedCallback() {
    super.connectedCallback();
    this.__openDatabase();
  }

  __openDatabase() {
    const request = indexedDB.open(this.databaseName);
    request.onerror = (event) => {
      console.error('Failed to open database', event);
    };
    request.onsuccess = (event) => {
      this.db = event.target.result;

      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyBXM3euqSs6_ybfRu5Q2KwzrOZ9QmJfkis",
        authDomain: "metricos-3b7aa.firebaseapp.com",
        databaseURL: "https://metricos-3b7aa-default-rtdb.firebaseio.com",
        projectId: "metricos-3b7aa",
        storageBucket: "metricos-3b7aa.appspot.com",
        messagingSenderId: "1091042589805",
        appId: "1:1091042589805:web:55c1bab417e954054a5364"
      };

      firebase.initializeApp(firebaseConfig);
      this.firebaseDb = firebase.database();
    };
  }  
        
  __uploadToFirebase() {

    const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
    objectStore.getAll().onsuccess = (event) => {
      const answers = event.target.result;
      const storageRef = firebase.storage().ref();
      answers.forEach((answer) => {

  render() {
    return html`
      <div class="container">
          <div class="formgroup">
            <div class="login">
              <h2>Login</h2>
              <br>
              <input id="username" type="text" placeholder="Username">
              <input id="password" type="password" placeholder="Password" class="form-control" name="password">
              <button onclick="login()" id="button">SIGN IN</button>
              <br><br><hr><br>
            </div>
            <div class="signup">
              <h2>Sign Up</h2>
              <br>
              <input id="email" type="email" placeholder="Email">
              <input id="password" type="password" placeholder="Password" class="form-control" name="password">
              <input id="username" type="text" placeholder="Username">
              <button onclick="register()" id="button">SIGN UP</button>
          </div>
      </div>
    `;

  }
}

customElements.define('app-lit', AppLit);