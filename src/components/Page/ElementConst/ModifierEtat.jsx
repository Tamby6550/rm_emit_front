import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { Dialog } from 'primereact/dialog';
import useAuth from '../../Login/useAuth'
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import moment from 'moment/moment'
import * as Components from '../../Login/Components';

export default function ModifierEtat(props) {

    const { logout, isAuthenticated, secret } = useAuth();
    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        return { data, token };
    }

    const [verfChamp, setverfChamp] = useState(false)
    const [charge, setCharge] = useState(false);
    const [etat, setetat] = useState({ etat: null, mati_id: '', anne_univ: '0000-0000', nom_mat: '', datedt: '0', valueview: '', valuedt: '0' });
    const [selectetat, setselectetat] = useState(null);

    const onChargeData = (etats, mati_ids, anne_univs, nom_mats, db, dfin, dsn, dsr) => {
        setetat({ ...etat, etat: etats, mati_id: mati_ids, anne_univ: anne_univs, nom_mat: nom_mats });
    }
    const onVide = () => {
        setetat({ etat: '0', mati_id: '', anne_univ: '0000-0000', nom_mat: '', datedt: '0', valuedt: '0' });
    }


    const onTypesChange = (e) => {
        setselectetat(e.target.value);
        if (e.target.value == '0') {
            setetat({ ...etat, [e.target.name]: (e.target.value), datedt: '0' });
        }
        if (e.target.value == '1') {
            setetat({ ...etat, [e.target.name]: (e.target.value), datedt: 'dt_encours' });
        }
        if (e.target.value == '2') {
            setetat({ ...etat, [e.target.name]: (e.target.value), datedt: 'dt_termine' });
        }
        if (e.target.value == '3') {
            setetat({ ...etat, [e.target.name]: (e.target.value), datedt: 'dt_sn' });
        }
        if (e.target.value == '4') {
            setetat({ ...etat, [e.target.name]: (e.target.value), datedt: 'dt_sr' });
        }
    }
    const choixEtat = [
        { label: 'Pas encore démarré', value: '0' },
        { label: 'Démarré', value: '1' },
        { label: 'Terminé cours', value: '2' },
        { label: 'Terminé examen SN', value: '3' },
        { label: 'Terminé examen SR', value: '4' },
    ]
    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    const stylebtnCheck = {
        fontSize: '1rem', padding: ' 0.8rem 0.5rem', backgroundColor: 'rgb(12 163 62)', border: '1px solid rgb(12 163 62)'
    };

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }


    /* Modal */
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic2': setDisplayBasic2,
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        onVide();
    }

    const renderFooter = (name) => {
        return (
            <div>

                <Button label="Fermer" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }

    const renderHeader = (name) => {
        return (
            <div className='grid px-4'>

                <h5> <u style={{ fontWeight: '700', fontSize: '1.1em' }} >Etat de matière :</u> {props.nom_mat}  :
                    <label style={{ textEmphasis: 'GrayText' }}>
                        {props.etat == null || props.etat == '0' ?
                            <i style={{ color: '#212529', borderRadius: '8px', backgroundColor: '#FBC02D', fontSize: '0.8em', padding: '0.21rem 0.1rem' }}> Pas encore démarré</i>
                            :
                            props.etat == '1' ?
                                <i style={{ color: '#248dbf' }}> En cours...</i>
                                :
                                props.etat == '2' ?
                                    <i style={{ color: '#0fa31a' }}> Terminé cours</i>
                                    :
                                    props.etat == '3' ?
                                        <i style={{ color: '#0fa31a' }}> Terminé SN</i>
                                        :
                                        props.etat == '4' ?
                                            <i style={{ color: '#0fa31a' }}> Terminé SR</i>
                                            :
                                            <i style={{ color: '#212529', borderRadius: '8px', backgroundColor: '#FBC02D', fontSize: '0.8em', padding: '0.21rem 0.1rem' }}> Pas encore démarré</i>
                        }
                    </label>
                </h5>
            </div>
        );
    }
    /** Fin modal */

    //Modifier de donnees vers Laravel
    const onModif = async (token) => {
        // console.log(etat)
        setCharge(true);
        try {
            await axios.put(props.url + 'updateEtatMatiere', etat, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "X-API-KEY": "tamby",
                    'Authorization': token
                },
            })
                .then(res => {
                    if (res.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            logout();
                        }, 3000)
                    }
                    //message avy @back
                    notificationAction(res.data.etat, res.data.situation, res.data.message);
                    setCharge(false);
                    setTimeout(() => {
                        onHide('displayBasic2');
                        props.setrefreshData(1);
                    }, 500)
                })
                .catch(err => {
                    notificationAction('error', 'Erreur', err.data.message);//message avy @back
                    console.log(err);
                    setCharge(false);
                });
        } catch (error) {
            notificationAction('error', 'Erreur', error.message);//message avy @back
        }

}

return (
    <>
        <Toast ref={toastTR} position="top-center" />
        <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1 ml-4' style={stylebtnCheck} tooltip="Modifier l'etat" tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); onChargeData(props.etat, props.mat_id, props.anne_univ, props.nom_mat) }} />

        <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-4 md:col-6 col-8 p-0" onHide={() => onHide('displayBasic2')}>
            <div className="p-1  style-modal-tamby">
                <div className="flex flex-column justify-content-center">
                    <div className='grid px-3'>
                        <div className={etat.datedt == '0' ? "lg:col-12 md:col-12 sm:col-12 col-12  field my-0  flex flex-column" : " lg:col-6 md:col-12 sm:col-12 col-12  field my-0  flex flex-column"}>
                            <h4 htmlFor="username2" className="m-1">Changement etat  :</h4>
                            <Components.Select name='etat' onChange={(e) => { onTypesChange(e) }}   >
                                <Components.Option value={''}  >{''}</Components.Option>
                                {choixEtat.map((etat, index) => (
                                    <Components.Option value={etat.value} key={index} >{etat.label}</Components.Option>
                                ))}
                            </Components.Select>
                        </div>
                        <div className="lg:col-6 md:col-12 sm:col-12 col-12  field my-0  flex flex-column">
                            {etat.datedt == '0' ?
                                null
                                :
                                <>
                                    <h4 htmlFor="username2" className="m-1 ">
                                        Date {etat.datedt == 'dt_encours' ? 'debut du cours' :
                                            etat.datedt == 'dt_termine' ? 'fin du cours' :
                                                etat.datedt == 'dt_sn' ? 'session normale' :
                                                    etat.datedt == 'dt_sr' ? 'session rattrapage' :
                                                        ''
                                        } :
                                    </h4>
                                    <Components.Input type='date' className={verfChamp ? "fform-invalid" : ''} placeholder='Nom utilisateur' name='valuedt' onChange={(e) => { setetat({ ...etat, valueview: e.target.value, valuedt: moment(e.target.value).format('DD/MM/YYYY') }) }} />

                                    {/* <Calendar dateFormat='dd/mm/yy' value={etat.valueview} onChange={(e) => { setetat({ ...etat, valueview: e.target.value, valuedt: moment(e.target.value).format('DD/MM/YYYY') }) }} placeholder='dd/mm/yyyy' /> */}
                                </>
                            }
                        </div>
                    </div>
                    <div className='flex mt-3 mr-4 justify-content-center '>
                        {etat.valuedt}
                        <Button icon={PrimeIcons.CHECK} className='p-button-sm p-button-info ' label={charge ? 'Enregistrement...' : 'Sauvegarder'}
                            onClick={() => {
                                if (etat != null) {

                                    const virus = localStorage.getItem('virus');
                                    //Verifiena raha mbola ao le virus
                                    if (virus) {
                                        decrypt();

                                        setTimeout(() => {
                                            if (etat.etat == '0') {
                                                setverfChamp(false);
                                                onModif(decrypt().token)
                                            }
                                            else {
                                                if (etat.valuedt == '0') {
                                                    setverfChamp(true)
                                                }
                                                else {
                                                    onModif(decrypt().token)
                                                }
                                            }
                                        }, 600)
                                    }
                                    else {

                                        logout();
                                    }
                                }
                                else {
                                    alert('Etat null')
                                }
                            }} />
                    </div>
                </div>
            </div>
        </Dialog>
    </>
)
}
