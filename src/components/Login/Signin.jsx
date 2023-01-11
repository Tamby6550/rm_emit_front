import React, { useState, useEffect, useRef } from 'react'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import UserLogin from './Image/userLogin.jpg';
import logo from './Image/logo.svg';
import logoV from './Image/logoV.svg';
import Titre from './Image/Titre.jpg';
import fond from './Image/fond.jpeg';
import './Css/Login.css';
import { Avatar } from 'primereact/avatar';
import axios from "axios";
import './Css/FormeDemo.css';


export default function Signin() {

    const [infoLogin, setinfoLogin] = useState({ rm_nom: '', mention: '', grad_id: '', motpasse: '' })

    const onChargeDonne = (e) => {
        setinfoLogin({ ...infoLogin, [e.target.name]: [e.target.value] })
    }
    const styleBody = {
        'backgroundImage': `url('./fond.jpeg')`,
        'height': '103vh',
        'marginTop': '-23px',
        'backgroundSize': 'cover',
        'backgroundRepeat': 'no-repeat',
        fontSize: '1em'
    }
    const stylebtnEnr = {
        fontSize: '0.9rem', fontFamily: 'Arial', padding: ' 0.4375rem 0.875rem', backgroundColor: '#264653', borderColor: 'white'
    };
    return (

        <div className="form-demo1" style={styleBody}>
            <h1>Login</h1>
        </div>
    );
}
