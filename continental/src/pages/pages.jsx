import { useState } from "react";
import { USERS } from "../data/users";

export default function Login({
  onLogin
}) {
  const [password, setPassword] =
    useState("");

  const handleLogin = () => {

    const user = Object.entries(
      USERS
    ).find(
      ([, pass]) => pass === password
    );

    if (!user) {
      alert("Неверный пароль");
      return;
    }

    localStorage.setItem(
      "continentalUser",
      user[0]
    );

    onLogin(user[0]);
  };

  return (
    <div className="login-screen">

      <div className="login-card">

        <h1>
          Салун Континенталь
        </h1>

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={handleLogin}
        >
          Войти
        </button>

      </div>

    </div>
  );
}