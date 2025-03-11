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
        route("/customers", "routes/customers/layout.tsx", [
            index("routes/customers/index.tsx"),
            route("/customers/edit/:id", "routes/customers/edit.tsx"),
            route("/customers/delete", "routes/customers/delete.tsx"),
            route("/customers/new", "routes/customers/new.tsx"),
        ]),
        route("profile", "routes/profile/profile.tsx"),
	]),
	route("login", "routes/login/login.tsx", [
		index("routes/login/login-form.tsx"),
	]),
	route("login-sso", "routes/login/LoginSSO.tsx"),
	route("/auth/callback", "routes/auth/Callback.tsx"),
	route("/logout", "routes/auth/Logout.tsx"),
	route("/logout-confirm", "routes/auth/LogoutConfirm.tsx"),
] satisfies RouteConfig;
