import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/my-form", "routes/my-form.tsx"),
	layout("routes/layouts/PageWithHeader.tsx", [
		route("dashboard", "routes/dashboard.tsx"),
	]),
	route("login", "routes/login/login.tsx", [
		index("routes/login/login-form.tsx"),
	]),
	route("login-sso", "routes/login/LoginSSO.tsx"),
	route("/auth/callback", "routes/auth/Callback.tsx"),
	route("/logout", "routes/auth/Logout.tsx"),
	route("/logout-confirm", "routes/auth/LogoutConfirm.tsx"),
] satisfies RouteConfig;
