import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSignUp = () => {
    // Your sign up logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handleSettingsButtonClick = () => {
    setIsSettingsModalOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Sign Up</h2>
        <form>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>
        </form>
      </div>
    <div>
    <button className="settings-button" onClick={handleSettingsButtonClick}>
        Open Settings
      </button>
    </div>
      

      {isSettingsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-content__close">
              <span className="close" onClick={handleCloseSettingsModal}>
                &times;
              </span>
            </div>
            <h2>Password Requirements</h2>
            <section className="modal-content__checkboxes">
              <div className="checkbox-group">
                <input type="checkbox" id="uppercase" />
                <label htmlFor="uppercase">At least 1 uppercase</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="lowercase" />
                <label htmlFor="lowercase">At least 1 lowercase</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="figure" />
                <label htmlFor="figure">At least 1 figure</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="special-character" />
                <label htmlFor="special-character">
                  At least 1 special character - !@#$%^&*()
                </label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="min-length" />
                <label htmlFor="min-length">At least 8 characters long</label>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
