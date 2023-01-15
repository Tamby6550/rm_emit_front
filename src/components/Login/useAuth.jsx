import { useState, useEffect,useRef } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const useAuth = () => {


    const secret= "tamby6550";
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { pathname } = useLocation()
    const navigate = useNavigate();
    const [chargement, setchargement] = useState(false)
    const [notif, setnotif] = useState({etat:'',situation : '',message:''})
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            //Rehefa mbola conncté nefa te hiverina @/login ,tonga de dirigeny 
            if (pathname=='/login') {
                navigate('/');
            }else{
                navigate(pathname);
            }
        } else {
            setIsAuthenticated(false);
            navigate('/login');
        }

    }, [navigate]);

    const login = async (info, url) => {
        setchargement(true)
        try {
            await axios.post(url + 'getLogin', info,
                {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "X-API-KEY": "tamby"
                    },
                }
            ).then(res => {
                setnotif(res.data)
                if (res.data.etat == 'success') {
                    localStorage.setItem('token', res.data.token);
                    setIsAuthenticated(true);
                    const dts=res.data.info;
                    const infoRm=JSON.stringify(res.data.info);
                    const infocrypte=CryptoJS.AES.encrypt(infoRm,secret);
                    
                    localStorage.setItem('virus', infocrypte.toString());

                    setTimeout(() => {
                        navigate('/', { state: { dts } });
                       
                    }, 500)
                }
                setnotif({etat:'',situation : '',message:''});
                setchargement(false)
            })
                .catch(err => {
                    console.log(err);
                });
            return 'ind';
        } catch (err) {
            console.error(err);
        }
    };
    const inscriptionlogin = async (info, url) => {
        setchargement(true)
        try {
            await axios.post(url + 'ajoutRmAssocier', info,
                {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "X-API-KEY": "tamby"
                    },
                }
            ).then(res => {
                setnotif(res.data)
                setchargement(false)
            })
                .catch(err => {
                    console.log(err);
                });
            return 'ind';
        } catch (err) {
            setnotif({etat:'error',situation : 'Connexion',message:'Vérifier votre connexion !'});
            console.error(err);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('virus');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return { isAuthenticated, login,notif,chargement, logout,secret,inscriptionlogin };
};

export default useAuth;