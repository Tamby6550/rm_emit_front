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
import axios from 'axios'


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

    const [charge, setCharge] = useState(false);
    const [etat, setetat] = useState({ etat: null, mati_id: '', anne_univ: '0000-0000', nom_mat: '' });
    const [selectetat, setselectetat] = useState(null);

    const onChargeData = (etats, mati_ids, anne_univs, nom_mats) => {
        setetat({ etat: etats, mati_id: mati_ids, anne_univ: anne_univs, nom_mat: nom_mats });
    }
    const onVide = () => {
        setetat({ etat: '0', mati_id: '', anne_univ: '0000-0000', nom_mat: '' });
    }


    const onTypesChange = (e) => {
        setselectetat(e.value);
        setetat({ ...etat, etat: (e.target.value) });
    }
    const choixEtat = [
        { label: 'Pas encore démarré', value: '0' },
        { label: 'En cours', value: '1' },
        { label: 'Terminé', value: '2' },
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

                <h5> <u style={{fontWeight:'700',fontSize:'1.1em'}} >Etat de matière :</u> {props.nom_mat}  :
                  <label style={{textEmphasis:'GrayText'}}>
                    {props.etat == null || props.etat == '0' ? <i style={{ color: '#212529', borderRadius: '8px', backgroundColor: '#FBC02D', fontSize: '0.8em', padding: '0.21rem 0.1rem' }}> Pas encore démarré</i> : props.etat == '1' ? <i style={{ color: '#248dbf' }}> En cours...</i> : <i style={{ color: '#0fa31a' }}> Terminé</i>}
                    </label>  
                </h5>
            </div>
        );
    }
    /** Fin modal */

    //Modifier de donnees vers Laravel
    const onModif = async (token) => {
        try {
            await axios.put(props.url + 'updateEtatMatiere', etat, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "X-API-KEY": "tamby",
                    'Authorization': token
                },
            })
                .then(res => {
                    //message avy @back
                    notificationAction(res.data.etat, res.data.situation, res.data.message);
                    setCharge(false);
                    onVide();
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
                            <div className="col-12  field my-0  flex flex-column">
                                <h4 htmlFor="username2" className="m-1">Changement etat  :</h4>
                                <Dropdown value={selectetat} options={choixEtat} onChange={onTypesChange} name="etat" placeholder={props.etat == null || props.etat == '0' ? 'Pas encore démarré' : props.etat == '1' ? 'En cours' : 'Terminé'} />
                            </div>
                        </div>
                        <div className='flex mt-3 mr-4 justify-content-center '>
                            <Button icon={PrimeIcons.CHECK} className='p-button-sm p-button-info ' label={charge ? 'Enregistrement...' : 'Sauvegarder'}
                                onClick={() => {
                                    if (etat != null) {
                                        const virus = localStorage.getItem('virus');
                                        //Verifiena raha mbola ao le virus
                                        if (virus) {
                                            decrypt();
                                            setCharge(true);
                                            setTimeout(() => {
                                                onModif(decrypt().token)
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
