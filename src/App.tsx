import { useState, useEffect, useRef } from "react";
import "./App.css";
import { useForm } from "react-hook-form";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] =
    useState<boolean>(false);
  const [areSettingsEntered, setAreSettingsEntered] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
  } = useForm();
  const [settings, setSettings] = useState({
    uppercase: false,
    lowercase: false,
    figure: false,
    specialCharacter: false,
    minLength: false,
  });

  /**
   * Retrieve settings from local storage
   * Check if any setting is checked,
   * If no settings are checked, open the settings modal
   */
  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("settings") ?? "{}");
    setSettings(storedSettings);
    const isAnySettingChecked = Object.values(storedSettings).some(
      (value) => value
    );
    setAreSettingsEntered(isAnySettingChecked);
    if (!isAnySettingChecked) {
      setIsSettingsModalOpen(true);
    }
  }, []);

  /**
   * Update areSettingsEntered state when settings change
   */
  useEffect(() => {
    const isAnySettingChecked = Object.values(settings).some((value) => value);
    setAreSettingsEntered(isAnySettingChecked);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
    localStorage.setItem(
      "settings",
      JSON.stringify({
        ...settings,
        [name]: checked,
      })
    );
  };

  /**
   * Save each requirement on their unique variables
   * Check for each complexity requirement
   * @param password The character the user enters on the password field
   * @returns
   */
  const calculatePasswordStrength = (password: string): string => {
    let strength = "Easy";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const hasFigure = /\d/.test(password);
    if (hasUpperCase && hasLowerCase && hasSpecialChar) {
      strength = "Medium";
    }
    if (
      password.length >= 10 &&
      hasUpperCase &&
      hasLowerCase &&
      hasSpecialChar &&
      hasFigure
    ) {
      strength = "Hard";
    }
    return strength;
  };

  /**
   * Validate password based on selected settings
   * @param data
   */
  const onSubmit = (data: any) => {
    const { password } = data;
    let errors: any = [];

    if (settings.uppercase && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }

    if (settings.lowercase && !/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }

    if (settings.figure && !/\d/.test(password)) {
      errors.push("Password must contain at least one digit.");
    }

    if (settings.specialCharacter && !/[@$!%*?&]/.test(password)) {
      errors.push(
        "Password must contain at least one special character - @$!%*?&"
      );
    }

    if (settings.minLength && password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (errors.length > 0) {
      console.log("Form validation errors:", errors);
      return;
    }
    console.log("Form submitted successfully!");
  };

  /**
   * This enables real time update as a user types email address
   * @param e
   */
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setValue("email", e.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  /**
   * Opens the settings modal once the "open settings" button is clicked
   */
  const handleSettingsButtonClick = () => {
    setIsSettingsModalOpen(true);
  };

  /**
   * Close the settings modal once the "close" icon is clicked
   */
  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="container">
      <div className="cta-wrapper">
        <button onClick={handleSettingsButtonClick}>Open Settings</button>
      </div>
      <div className="card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              onChange={handleChangeEmail}
              disabled={!areSettingsEntered}
            />
            {touchedFields.email &&
              errors.email &&
              typeof errors.email.message === "string" && (
                <span className="error-text">{errors.email.message}</span>
              )}{" "}
          </div>

          <div className="top-spacing">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              {...register("password")}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!areSettingsEntered}
            />
            <div
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </div>
          </div>
          {errors.password && <span>Password is required</span>}
          <div>
            {touchedFields.password &&
              settings.uppercase &&
              !/[A-Z]/.test(password) && (
                <div className="error-text">
                  Password must contain at least one uppercase letter.
                </div>
              )}
            {touchedFields.password &&
              settings.lowercase &&
              !/[a-z]/.test(password) && (
                <div className="error-text">
                  Password must contain at least one lowercase letter.
                </div>
              )}
            {touchedFields.password &&
              settings.figure &&
              !/\d/.test(password) && (
                <div className="error-text">
                  Password must contain at least one digit.
                </div>
              )}
            {touchedFields.password &&
              settings.specialCharacter &&
              !/[@$!%*?&]/.test(password) && (
                <div className="error-text">
                  Password must contain at least one special character - @$!%*?&
                </div>
              )}
            {touchedFields.password &&
              settings.minLength &&
              password.length < 8 && (
                <div className="error-text">
                  Password must be at least 8 characters long.
                </div>
              )}
          </div>
          {password && (
            <div style={{ marginTop: "0.5rem" }}>
              <b>Password Strength:</b> {calculatePasswordStrength(password)}
            </div>
          )}
          <div className="top-spacing">
            <button
              disabled={
                Object.keys(errors).length > 0 ||
                !email ||
                !password ||
                !areSettingsEntered
              }
              style={{
                cursor:
                  Object.keys(errors).length > 0 ||
                  !email ||
                  !password ||
                  !areSettingsEntered
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>

      {isSettingsModalOpen && (
        <div className="modal" ref={modalRef}>
          <div className="modal-content">
            <div className="modal-content__close">
              <span className="close" onClick={handleCloseSettingsModal}>
                &times;
              </span>
            </div>
            <h2>Password Requirements</h2>
            <section className="modal-content__checkboxes">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="uppercase"
                  name="uppercase"
                  checked={settings.uppercase}
                  onChange={handleChange}
                />
                <label htmlFor="uppercase">At least one uppercase</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="lowercase"
                  name="lowercase"
                  checked={settings.lowercase}
                  onChange={handleChange}
                />
                <label htmlFor="lowercase">At least one lowercase</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="figure"
                  name="figure"
                  checked={settings.figure}
                  onChange={handleChange}
                />
                <label htmlFor="figure">At least one figure</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="special-character"
                  name="specialCharacter"
                  checked={settings.specialCharacter}
                  onChange={handleChange}
                />
                <label htmlFor="special-character">
                  At least one special character - !@#$%^&*()
                </label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="min-length"
                  name="minLength"
                  checked={settings.minLength}
                  onChange={handleChange}
                />
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
