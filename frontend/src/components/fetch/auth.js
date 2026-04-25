import { userdata } from "./testdata";

// // api/auth.js
// export async function authRequest(type, data) {
//   const url =
//     type === "login"
//       ? "http://localhost:5000/api/auth/login"
//       : "http://localhost:5000/api/auth/register";

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Auth error");
//   }

//   return result;
// }

//login

export async function login(data) {
	console.log("Login data:", {
		email: data.email.value,
		password: data.password.value,
	});
  	for (let user of userdata) {
		if (user.email === data.email.value && user.password === data.password.value) {
		return user;
		}
  	}
  throw new Error("Invalid email or password");
}
