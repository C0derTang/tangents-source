import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut } from 'firebase/auth';
import { useEffect } from 'react';

const Auth = ({ setUser }) => {
    const signIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
        } catch (err) {
            console.error(err);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            alert('Logged out!');
            setUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [setUser]);

    return (
        <div className="flex space-x-4">
            <button onClick={signIn} className="bg-blue-500 text-white px-4 py-2 rounded">Sign In With Google</button>
            <button onClick={logOut} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
    );
};

export default Auth;