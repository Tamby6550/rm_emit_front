import { PrimeIcons } from 'primereact/api'
import { Card } from 'primereact/card'
import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import useAuth from '../Login/useAuth';
import CryptoJS from 'crypto-js';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Chart } from 'primereact/chart';



export default function Accueil(props) {
    const location = useLocation();

    const [charge, setCharge] = useState(false);


    const [anne_univ, setanne_univ] = useState('0000-0000');
    const [selectanne, setselectanne] = useState(null);


    const [niveau, setniveau] = useState('0');
    const [selectniveau, setselectniveau] = useState(null);

    const [dtChart, setdtChart] = useState(['0', '0', '0']);

    const [filtre, setfiltre] = useState('o')
    /*Chart Graphique */
    const [chartData, schartData] = useState({
        labels: ['Pas encore', 'En cours', 'Terminé'],
        datasets: [
            {
                data: dtChart,
                backgroundColor: [
                    "#FFA726",
                    "#42A5F5",
                    "#66BB6A",
                ],
                hoverBackgroundColor: [
                    "#FFB74D",
                    "#64B5F6",
                    "#81C784",
                ]
            }
        ]
    });

    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    });
    const choixGrphe = [
        { label: 'Cours', value: 'c' },
        { label: 'Examen', value: 'e' },
    ]

    const [lmention, setlmention] = useState('0');
    const [selectlmention, setselectlmention] = useState(null);

    const [lgrade, setlgrade] = useState('0');
    const [selectlgrade, setselectlgrade] = useState(null);
    const onTypesChangeMention = (e) => {
        setlmention(e.value);
    }
    const onTypesChangeGrade = (e) => {
        setlgrade(e.value);
    }

    /*Chart Graphique */
    const onTypesChange = (e) => {
        setanne_univ(e.value);
    }
    const onTypesChangeNiveau = (e) => {
        setniveau(e.value);
    }
    const onTypesChangeFiltre = (e) => {
        setfiltre(e.value);
    }
    const { logout, isAuthenticated, secret } = useAuth();

    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        return { data, token };
    }

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }


    const loadData = async (token, rm_id, mention_nom, grad_id, anne_univ, niveau) => {
        await axios.get(props.url + `getChartRm/${rm_id}/${mention_nom}/${grad_id}/${anne_univ}/${niveau}/${filtre}`, {
            headers: {
                'Content-Type': 'text/html',
                'X-API-KEY': 'tamby',
                'Authorization': token
            }
        })
            .then(
                (result) => {
                    if (result.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            logout();
                        }, 3000)
                    }
                    setselectanne(result.data.anne_univ)
                    setselectniveau(result.data.niveau)
                    setselectlgrade(result.data.grade)
                    setselectlmention(result.data.mention)
                    setdtChart(result.data.etat);
                    console.log(result.data)
                    if (niveau == '0') {
                        schartData({
                            labels: ['Pas encore démarré', 'En cours', 'Terminé(avec SR et SN)'],
                            datasets: [
                                {
                                    data: result.data.etat,
                                    backgroundColor: [
                                        "#FFA726",
                                        "#42A5F5",
                                        "#66BB6A",
                                    ],
                                    hoverBackgroundColor: [
                                        "#FFB74D",
                                        "#64B5F6",
                                        "#81C784",
                                    ]
                                }
                            ]
                        })
                    } else {
                        if (filtre == 'e') {
                            schartData({
                                labels: ['Examen SN', 'Examen SR'],
                                datasets: [
                                    {
                                        data: result.data.etat,

                                        hoverBackgroundColor: [
                                            "#66BB6A",
                                            "#055023",
                                            "#81C784",
                                        ],
                                        backgroundColor: [
                                            "#0DAE45",
                                            "#055023",
                                            "#66BB6A",
                                        ]
                                    }
                                ]
                            })
                        } else {
                            schartData({
                                labels: ['Pas encore démarré', 'En cours', 'Terminé(avec SR et SN)'],
                                datasets: [
                                    {
                                        data: result.data.etat,
                                        backgroundColor: [
                                            "#FFA726",
                                            "#42A5F5",
                                            "#66BB6A",
                                        ],
                                        hoverBackgroundColor: [
                                            "#FFB74D",
                                            "#64B5F6",
                                            "#81C784",
                                        ]
                                    }
                                ]
                            })
                        }
                    }
                    setCharge(false);
                }
            )
            .catch((e) => {
                if (e.message == "Network Error") {
                    props.urlip()
                }
            })
    }

    const chargementData = () => {
        const virus = localStorage.getItem('virus');
        //Verifiena raha mbola ao le virus
        if (virus) {
            decrypt();
            setCharge(true);
            setTimeout(() => {
                loadData(decrypt().token, decrypt().data.rm_id, decrypt().data.mention, decrypt().data.grad_id, anne_univ, niveau);
            }, 800)
        }
        else {
            logout();
        }
    }
    //Neny admin
    const chargementDataAdm = () => {
        const virus = localStorage.getItem('virus');
        //Verifiena raha mbola ao le virus
        if (virus) {
            decrypt();
            setCharge(true);
            setTimeout(() => {
                loadData(decrypt().token, 'admin', lmention, lgrade, anne_univ, niveau);
            }, 800)
        }
        else {
            logout();
        }
    }
    useEffect(() => {
        chargementData()
    }, [props.url])
    
    useEffect(() => {
        if (decrypt().data.mention == 'Admin') {
            if (anne_univ == '0000-0000' || lgrade == '0' || lmention == '0') {

                return false;
            } else {
                chargementDataAdm()
            }
        } else {
            if (anne_univ == '0000-0000' ) {

                return false;
            } else {
                chargementData()
            }
        }
    }, [anne_univ, lmention, lgrade, niveau, filtre, props.url])

    return (
        <div className='grid h-full'>
            <Toast ref={toastTR} position="top-right" />
            <div className='col-12 pt-0'>
                <h3 className='text-center m-0 text-surface-500'>Bienvenue dans l'App pour les RM_EMIT <span className={PrimeIcons.CLOUD}></span></h3>
            </div>
            <div className="lg:col-12 md:col-12 sm:col-12 col-12">
                <div className="card flex flex-column justify-content-center w-full">
                    <center>
                        <div className="lgcol-12 md:col-12  md:flex-column   sm:col-3 sm:flex-column field  flex lg:flex-row flex-column " style={{ backgroundColor: '#ebebeb' }}>


                            {decrypt().data.mention == 'Admin' ?
                                <div className='grid col-12 flex flex-row ' >

                                    <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ alignItems: 'center', justifyContent: 'space-around' }}>
                                        <div>
                                            <h4 htmlFor="username2" className="m-1">Anne univ :</h4>
                                            <Dropdown value={anne_univ} options={selectanne} onChange={onTypesChange} name="etat" />
                                        </div>
                                        <div className='flex flex-column '>
                                            <h4 htmlFor="username2" className="m-1">Mention  :</h4>
                                            <Dropdown value={lmention} options={selectlmention} onChange={onTypesChangeMention} name="etat" />
                                        </div>
                                    </div>
                                    <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column" style={{ alignItems: 'center', justifyContent: 'space-around' }}>
                                        <div className='flex flex-column '>
                                            <h4 htmlFor="username2" className="m-1">Grade  :</h4>
                                            <Dropdown value={lgrade} options={selectlgrade} onChange={onTypesChangeGrade} name="etat" />
                                        </div>
                                        <div>
                                            <h4 htmlFor="username2" className="m-1 ml-1">Niveau  :</h4>
                                            <Dropdown value={niveau} options={selectniveau} onChange={onTypesChangeNiveau} name="etat" />
                                        </div>

                                    </div>
                                    <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <h4 htmlFor="username2" className="m-1 ml-1">Filtrer par  :</h4>
                                        <Dropdown value={filtre} options={choixGrphe} onChange={onTypesChangeFiltre} name="etat" />
                                    </div>
                                </div>
                                :
                                <div className='grid col-12 flex flex-row ' >
                                    <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ alignItems: 'center', justifyContent: 'center' }}>

                                        <h4 htmlFor="username2" className="m-1">Anne univ :</h4>
                                        <Dropdown value={anne_univ} options={selectanne} onChange={onTypesChange} name="etat" />
                                    </div>
                                    <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <h4 htmlFor="username2" className="m-1 ml-1">Niveau  :</h4>
                                        <Dropdown value={niveau} options={selectniveau} onChange={onTypesChangeNiveau} name="etat" />
                                    </div>
                                    <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <h4 htmlFor="username2" className="m-1 ml-1">Filtrer par  :</h4>
                                        <Dropdown value={filtre} options={choixGrphe} onChange={onTypesChangeFiltre} name="etat" />
                                    </div>

                                </div>
                            }



                        </div>
                        {charge ? <h1>Chargement...</h1> :
                            dtChart[0] == 0 && dtChart[1] == 0 && dtChart[2] == 0 ? <h1>Aucun résultat</h1> : null}
                        <Chart type="pie" data={chartData} options={lightOptions} style={{ position: 'relative', width: '40%' }} />
                    </center>
                </div>
            </div >
        </div >
    )
}
