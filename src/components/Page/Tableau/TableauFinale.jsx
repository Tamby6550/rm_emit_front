import React, { useState, useEffect, useRef } from 'react'
import ReactToPrint from 'react-to-print'
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import axios from 'axios';
import useAuth from '../../Login/useAuth';
import CryptoJS from 'crypto-js';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext'
import { NumberToLetter } from 'convertir-nombre-lettre';
import ListeProf from './TableauA/ListeProf';
import TableauB from './TableauB';

export default function TableauFinale(props) {
    const { logout, isAuthenticated, secret } = useAuth();

    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        return { data, token };
    }

    const [prof, setprof] = useState({ idprof: '', nomprof: '' });

    const [anne_univ, setanne_univ] = useState('0000-0000');
    const [selectanne, setselectanne] = useState(null);


    const [chargementDD, setchargementDD] = useState(false);

    const [data, setdata] = useState([
        {
            prof_id: "",
            nom_prof: "",
            prof_grade: "",
            attribution: "",
            ttotal_et: "",
            ttotal_ed: "",
            ttotal_ep: "",
            encadrement: "",
            soutenance: "",
            voyages: ""
        }]
    );
    const onTypesChange = (e) => {
        setanne_univ(e.value);
    }

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }


    const anne_univDt = async () => {
        await axios.get(props.url + `getAnneUniv`, {
            headers: {
                'Content-Type': 'text/html',
                'X-API-KEY': 'tamby',
                'Authorization': decrypt().token
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
                    setselectanne(result.data);
                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
            })
    }


    const loadAfficheTableau = () => {
        setchargementDD(true);
        setTimeout(async () => {
            await axios.get(props.url + `getTableauAfficheTableauFinale/${decrypt().data.rm_id}/${anne_univ}/${decrypt().data.mention}/${prof.idprof}/${decrypt().data.grad_id}`, {
                headers: {
                    'Content-Type': 'text/html',
                    'X-API-KEY': 'tamby',
                    'Authorization': decrypt().token
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
                        if (result.data != '') {
                            setdata(result.data);
                            console.log(result.data)
                        }
                        setchargementDD(false);
                    }
                ).catch((e) => {
                    // console.log(e.message)
                    if (e.message == "Network Error") {
                        props.urlip()
                    }
                    setchargementDD(false);
                })
        }, 800)
    }


    useEffect(() => {
        anne_univDt();
    }, [props.url]);



    function getTotalED(et, ed, ep, enc, sout, voya) {
        let parseEt = parseFloat(et);
        let parseEd = parseFloat(ed);
        let parseEp = parseFloat(ep);

        let parseenc = 0;
        let parsesout = 0;
        let parsevoya = 0;
        if (enc === null) {
            parseenc = parseFloat("0");
        } else {
            parseenc = parseFloat(enc);
        }

        if (sout === null) {
            parsesout = parseFloat("0");
        } else {
            parsesout = parseFloat(sout);
        }

        if (voya === null) {
            parsevoya = parseFloat("0");
        } else {
            parsevoya = parseFloat(voya);
        }



        let etConv = (parseEt * 5) / 3;
        let epConv = parseEp / 2;

        let result = etConv + epConv + parseEd + parseenc+parsesout+parsevoya ;
        return result;
    }


    return (
        <div className='content'>
            <Toast ref={toastTR} position="top-right" />
            <div className='flex lg:flex-row lg:col-6 md:col-7 md:flex-row sm:flex-row flex-column'>
                <div className="lgcol-8 md:col-5   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
                    <h4 htmlFor="username2" className="m-1">Anne univ :</h4>
                    <Dropdown value={anne_univ} options={selectanne} onChange={onTypesChange} name="etat" />
                </div>
                <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
                    <Button icon={PrimeIcons.LIST} className='p-button-sm p-button-success ml-3 ' label={'Afficher'}
                        onClick={() => {
                            loadAfficheTableau();
                        }}
                    />
                </div>
            </div>
            <hr />
            <center className=' mb-2'>
                <ReactToPrint trigger={() =>
                    <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-3 ' label={'Imprimer'} />
                } content={() => document.getElementById("imprimable")} />
            </center>
            <div className='col-12' style={{ border: '1px solid grey' }}>

                <BlockUI blocked={chargementDD} template={<ProgressSpinner />}>
                    <div className='grid h-full ' id='imprimable'  >
                        <div className="lg:col-12 md:col-12  md:flex-column   sm:col-12 col-12 sm:flex-column field my-0 flex lg:flex-coluln flex-column " style={{ alignItems: 'center' }}>
                            <div className='flex flex-column '>
                                <center>
                                    <label className='m-1' style={{ fontSize: '1.1em' }} >
                                        Annee Universitaire : {anne_univ} <br />
                                        Etat de paiement des heures complementaires <br />
                                        Mention  {decrypt().data.grad_nom + ' ' + decrypt().data.mention}
                                    </label>
                                </center>
                            </div>
                        </div>

                        <div className="col-12 flex-column " style={{ alignItems: 'center' }}>
                            <table style={{ borderCollapse: 'collapse', width: '99.0727%', height: '56.3751px' }} border="1">
                                <tbody>
                                    <tr style={{ height: '17.1875px' }}>
                                        <td style={{ height: '17.1875px' }}><strong>Nom et Pr&eacute;noms</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>Heures en ET</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>Heures en ED</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>Heures en EP</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>Encadrement</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>Soutenance</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>Voyage d'etudes</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>Total en ED</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>TAUX</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>Montant</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>IRSA(10%)</strong></td>
                                        <td style={{ height: '17.1875px' }}><strong>Net a payer(Ar)</strong></td>
                                    </tr>
                                    {data.map((dt, index) => (
                                        <tr style={{ height: '19.5938px' }} key={index} >
                                            <td style={{ height: '19.5938px' }}>{dt.nom_prof}</td>
                                            <td style={{ height: '19.5938px' }}>{parseFloat(dt.ttotal_et).toFixed(2)}</td>
                                            <td style={{ height: '19.5938px' }}>{parseFloat(dt.ttotal_ed).toFixed(2)}</td>
                                            <td style={{ height: '19.5938px' }}>{parseFloat(dt.ttotal_ep).toFixed(2)}</td>
                                            <td style={{ height: '19.5938px' }}>{dt.encadrement === null ? '0.00' : parseFloat(dt.encadrement).toFixed(2)}</td>
                                            <td style={{ height: '19.5938px' }}>{dt.soutenance === null ? '0.00' : parseFloat(dt.soutenance).toFixed(2)}</td>
                                            <td style={{ height: '19.5938px' }}>{dt.voyages === null ? '0.00' : parseFloat(dt.voyages).toFixed(2)}</td>
                                            <td style={{ height: '19.5938px' }}>{getTotalED(dt.ttotal_et, dt.ttotal_ed, dt.ttotal_ep,dt.encadrement,dt.soutenance,dt.voyages).toFixed(2)}</td>
                                            <td style={{ height: '19.5938px' }}>1200.00</td>
                                            <td style={{ height: '19.5938px' }}>null</td>
                                            <td style={{ height: '19.5938px' }}>null</td>
                                            <td style={{ height: '19.5938px' }}>null</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>

                </BlockUI>
            </div>
        </div >
    )
}
