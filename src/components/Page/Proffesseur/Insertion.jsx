import React, { useState, useEffect, useRef } from 'react'
import useAuth from '../../Login/useAuth';
import CryptoJS from 'crypto-js';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog';
import * as Components from '../../Login/Components';
import moment from 'moment/moment';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Fieldset } from 'primereact/fieldset';


export default function Insertion(props) {
    const { logout, isAuthenticated, secret } = useAuth();

    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        return { data, token };
    }

    const [anne_univ, setanne_univ] = useState('0000-0000');
    const [selectanne, setselectanne] = useState(null);

    const [chek2, setchek2] = useState(true);
    const listengage = [
        { value: 'Encadrement L2', label: 'Encadrement L2' },
        { value: 'Soutenance L2', label: 'Soutenance L2' },
        { value: 'Encadrement L3', label: 'Encadrement L3' },
        { value: 'Soutenance L3', label: 'Soutenance L3' },
        { value: 'Voyages d\'Etudes', label: 'Voyages d\'Etudes' },
    ];
    const listengage1 = [
        { value: 'Encadrement M1', label: 'Encadrement M1' },
        { value: 'Encadrement M2', label: 'Encadrement M2' },
        { value: 'Soutenance M2', label: 'Soutenance M2' },
        { value: 'Soutenance M1', label: 'Soutenance M1' },
        { value: 'Voyages d\'Etudes', label: 'Voyages d\'Etudes' },
    ];

    const [chargeDnn, setchargeDnn] = useState(false);
    //Declaration useSatate
    //Declaration useSatate
    const [infoEngagement, setinfoEngagement] = useState({
        prof_id: '',
        nom_enga: '0',
        nbre_etu: '0',
        valeur: '0',
        date_engamnt1: '0',
        date_engamnt2: '0',
        annee_univ: '0',
        grad_id: '0'
    });
    const onVideInfo = () => {
        setanne_univ('0000-0000');
        setinfoEngagement({
            prof_id: '',
            nom_enga: '0',
            nbre_etu: '0',
            valeur: '0',
            date_engamnt1: '0',
            date_engamnt2: '0',
            annee_univ: '0',
            grad_id: '0'
        });
    }

    const onTypesChange = (e) => {
        setinfoEngagement({ ...infoEngagement, annee_univ: e.value });
        setanne_univ(e.value);
    }
    const onTypesChangeNomEng = (e) => {
        setinfoEngagement({ ...infoEngagement, nom_enga: e.value });
    }

    const onInfoEngagement = (e) => {
        setinfoEngagement({ ...infoEngagement, [e.target.name]: (e.target.value) })
    }
    //Affichage notification Toast primereact (del :3s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }
    const changeNomEngag = (e) => {
        let heure = e.target.value;
        if (infoEngagement.nom_enga === 'Encadrement L2' || infoEngagement.nom_enga === 'Encadrement L3' || infoEngagement.nom_enga === 'Encadrement M2' || infoEngagement.nom_enga === 'Encadrement M1') {

            heure = heure * 25;
        } else if (infoEngagement.nom_enga === 'Soutenance L2' || infoEngagement.nom_enga === 'Soutenance L3' || infoEngagement.nom_enga === 'Soutenance M2' || infoEngagement.nom_enga === 'Soutenance M1') {
            heure = heure * 4;
        }
        else {
            heure = heure * 25;
        }
        setinfoEngagement({ ...infoEngagement, nbre_etu: e.target.value, valeur: heure })
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
        onVideInfo();

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
            <div>
                <h4 className='mb-1'>Ajout engagement </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(72 96 112)', border: '1px solid rgb(72 96 112)'
    };

    const onSub = async () => { //Ajout de donnees vers Laravel
        setchargeDnn(true);
        try {
            await axios.post(props.url + 'ajoutEngagement', infoEngagement, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "X-API-KEY": "tamby",
                    'Authorization': decrypt().token
                },
            })
                .then(res => {
                    if (res.data.message == 'Token Time Expire.') {
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            props.logout();
                        }, 3000)
                    }
                    //message avy @back
                    notificationAction(res.data.etat, res.data.situation, res.data.message);
                    setchargeDnn(false);
                    setTimeout(() => {
                        onHide('displayBasic2');
                        props.loadData();
                    }, 500);
                })
                .catch(err => {
                    notificationAction('error', 'Erreur', err.data.message);//message avy @back
                    console.log(err);
                    setchargeDnn(false);
                });
        } catch (error) {
            notificationAction('error', 'Erreur', error.message);//message avy @back
        }
    }

    //Anne universitaire
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

    useEffect(() => {
        setinfoEngagement({ ...infoEngagement, nbre_etu: 0, valeur: 0 })
      }, [infoEngagement.nom_enga])

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PLUS} className='p-buttom-sm p-1 ' label='Nouveau' style={stylebtnRec} tooltip='Ajout engagement' tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    onClick('displayBasic2');
                    setinfoEngagement({ ...infoEngagement, prof_id: props.prof_id, grad_id: decrypt().data.grad_id })
                    setTimeout(() => {
                        anne_univDt();
                    }, 200);
                }}
            />
            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-9 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1 style-modal-tamby" style={{ fontSize: '0.9em' }} >

                    <form className='flex flex-column justify-content-center'>
                        <div className='grid px-4 flex justify-content-center'>
                            <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                <h4 htmlFor="username2" className="m-1">Anne univ* :</h4>
                                <Dropdown value={anne_univ} options={selectanne} onChange={onTypesChange} name="etat" />
                            </div>
                            <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                <h4 htmlFor="username2" className="m-1">Nom engagement* :</h4>
                                <Dropdown value={infoEngagement.nom_enga} options={decrypt().data.grad_id == '1' ? listengage : listengage1} onChange={onTypesChangeNomEng} name="etat" />
                            </div>
                            <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                <h4 htmlFor="username2" className="m-1 mb-3">Nbre étudiants ou groupes* :</h4>
                                <InputNumber value={infoEngagement.nbre_etu} onValueChange={changeNomEngag} name="nbre_etu" />
                            </div>
                            <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                <h4 htmlFor="username2" className="m-1 mb-3">Heures* :</h4>
                                <InputNumber value={infoEngagement.valeur} onValueChange={onInfoEngagement} name="valeur" readOnly/>
                            </div>

                            <div className='grid flex flex-row mt-3' style={{ border: '1px solid #f3f1f1' }}>
                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <h4 htmlFor="username2" className="m-1">Date <small style={{ color: '#AAAAAA' }}>(facultatif)</small>   :</h4>
                                    <Components.Input type='date' placeholder='Nom utilisateur' name='date_engamnt' value={infoEngagement.date_engamnt1} onChange={(e) => { setinfoEngagement({ ...infoEngagement, date_engamnt1: e.target.value }) }} />
                                </div>
                                <div className="lg:col-6 col-12 field my-0 flex flex-column">
                                    <h4 htmlFor="username2" className="m-1">Jusqu'à <small style={{ color: '#AAAAAA' }}>(facultatif)</small>  :</h4>
                                    <Components.Input type='date' placeholder='Nom utilisateur' name='date_engamnt' value={infoEngagement.date_engamnt2} onChange={(e) => { setinfoEngagement({ ...infoEngagement, date_engamnt2: e.target.value }) }} />
                                </div>
                            </div>
                        </div>
                    </form>
                    <center>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={chargeDnn ? 'Enregistrement...' : 'Enregistrer'}
                            onClick={() => { onSub() }} />
                    </center>
                </div>
            </Dialog>
        </>
    )
}
