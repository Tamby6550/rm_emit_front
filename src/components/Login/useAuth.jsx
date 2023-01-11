import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/login');
        }
    }, [navigate]);

    const login = async (rm_nom, mention, grad_id, motpasse) => {
        try {
            await axios.post(props.url + 'getLogin',
                {
                    "rm_nom": rm_nom,
                    "mention": mention,
                    "grad_id": grad_id,
                    "motpasse": motpasse
                },
                {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "X-API-KEY": "tamby"
                    },
                }
            ).then(res => {

                if (res.data.etat=='success') {
                    localStorage.setItem('token', res.data.token);
                    setIsAuthenticated(true);
                    navigate('/home', { state: { userData } });
                } else {
                    throw new Error();
                }
            })
                .catch(err => {
                    console.log(err);
                    //message avy @back
                    notificationAction('error', 'Erreur', err.data.message);
                    setchajout(false);
                });
        } catch (err) {
            console.error(err);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return { isAuthenticated, login, logout };
};

export default useAuth;