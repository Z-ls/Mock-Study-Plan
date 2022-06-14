import { logIn, logOut, getUserInfo } from '../../API';

export async function handleLogin(credentials, setHasLoggedIn, setUser) {
	try {
		const user = await logIn(credentials);
		setUser(() => user);
		setHasLoggedIn(() => true);
	} catch (err) {
		throw err;
	}
}

export const handleLogout = async (setHasLoggedIn, setUser) => {
	await logOut();
	setUser(() => null);
	setHasLoggedIn(() => false);
};

export const checkAuth = async (setUser, setHasLoggedIn) => {
	const user = await getUserInfo();
	setUser(() => user);
	setHasLoggedIn(() => true);
};
