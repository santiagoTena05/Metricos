import { LitElement, html, css } from 'lit';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

class AppLit extends LitElement {
  static get properties() {
    return {
      email : {type: String},
      password : {type: String},
      username : {type: String},
      databaseName: { type: String },
      objectStoreName: { type: String },
      notes: { type: Array },
      isAuthenticated: { type: Boolean }
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
      padding: 60px;
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

    #notes {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      gap: 60px;
      margin: 0 0 15px;
    }
  `;

  constructor() {
    super();
    this.email = '';
    this.password = '';
    this.username = '';
    this.databaseName = 'my-database';
    this.objectStoreName = 'answers';
    this.notes = [];
    this.isAuthenticated = false; // initial value is false
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
      
  async register() {
    try {
      const response = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
      const user = response.user;
      await user.updateProfile({
        displayName: this.username
      });

      let data = { email: this.email, password: this.password, username: this.username };

      console.log(data);

      this.firebaseDb.ref('users/' + user.uid).push(data);

      const databaseRef = firebase.database().ref('answers');
      databaseRef.push(data);

      this.__uploadToFirebase();

    } catch (error) {
      console.error(error);
    }
  }

  async logout() {
    firebase.auth().signOut();
    this.isAuthenticated = false;
    this.requestUpdate();
  }

  async login() {
    try {
      const response = await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
      console.log(response.user);
      this.isAuthenticated = true;
      this.requestUpdate();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }
  
  async addNote() {
    const input = this.shadowRoot.querySelector('#note');
    const note = input.value.trim();
    if (note !== '') {
      this.notes = [...this.notes, note];
      input.value = '';
      this.__updateNotesInFirebase();
    }
  }
  
  async deleteNote(index) {
    this.notes = this.notes.filter((note, i) => i !== index);
    this.__updateNotesInFirebase();
  }
  
  __updateNotesInFirebase() {
    const userId = firebase.auth().currentUser.uid;
    const notesRef = firebase.database().ref(`users/${userId}/notes`);
    notesRef.set(this.notes);
  }

  __uploadToFirebase() {
    const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
    objectStore.getAll().onsuccess = (event) => {
      const answers = event.target.result;
      const firebaseDb = firebase.database();
      const userId = firebase.auth().currentUser.uid;
      const answersRef = firebaseDb.ref(`users/${userId}/answers`);
      answers.forEach((answer) => {
        answersRef.push(answer);
      });
      objectStore.clear();
    };
  }


  loginAdnSignupTemplate() {
    return html`
      <div class="container">
          <div class="formgroup">
            <div class="login">
              <h2>Login</h2>
              <br>
              <input id="email" type="email" placeholder="Email" @input=${(event) => this.email = event.target.value}>
              <input id="password" type="password" placeholder="Password" class="form-control" name="password" @input=${(event) => this.password = event.target.value}>
                <button @click=${this.login} id="button">SIGN IN</button>
              <br><br><hr><br>
            </div>
            <div class="signup">
              <h2>Sign Up</h2>
              <br>
              <input id="email" type="email" placeholder="Email" @input=${(event) => this.email = event.target.value}>
              <input id="password" type="password" placeholder="Password" class="form-control" name="password" @input=${(event) => this.password = event.target.value}>
              <input id="username" type="text" placeholder="Username" class="form-control" name="username" @input=${(event) => this.username = event.target.value}>
              <button @click=${this.register} id="button">SIGN UP</button>
            </div>
          </div>
      </div>
    `;
  }

  notesTemplate() {
    return html`
      <div class="container" id="notes">
        <h2>Notes</h2>
        <div class="formgroup">
          <input type="text" id="note" placeholder="Note" />
          <button id="button" @click=${this.addNote}>Add Note</button>
        </div>
        <div class="notes" id="notes">
          ${this.notes.map((note, index) => html`
            <div class="note">
              <span>${note}</span>
              <button @click=${() => this.deleteNote(index)}>Delete</button>
            </div>
          `)}
        </div>
      </div>
    `;
  }
  


  render() {
    return html`

      ${this.isAuthenticated ? this.notesTemplate() : this.loginAdnSignupTemplate()}
    `;

  }
}

customElements.define('app-lit', AppLit);