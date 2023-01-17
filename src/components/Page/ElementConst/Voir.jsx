import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import useAuth from '../../Login/useAuth';
import CryptoJS from 'crypto-js';
import moment from 'moment/moment';

export default function Voir(props) {

    const { logout, isAuthenticated, secret } = useAuth();

    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        return { data, token };
    }


    //Declaration useSatate
    //Chargement de données
    const [chargeV, setchargeV] = useState({ chupdate: false })
    const [charge, setCharge] = useState(false);
    const [listMatiere, setlistMatiere] = useState([{ matiere: '', unite_ens: '', semestre: '', abbr_niveau: '' }]);
    const [verfCompteRendu, setverfCompteRendu] = useState(false);
    //Get List Examen

    const onVideMatiere = () => {
        setlistMatiere([{ matiere: '', unite_ens: '', semestre: '', abbr_niveau: '' }])
    }
    const loadData = async (token, rm_id, mention_nom, grad_id, prof_id) => {
        await axios.get(props.url + `getMatiereProfRm/${rm_id}/${mention_nom}/${grad_id}/${prof_id}`, {
            headers: {
                'Content-Type': 'text/html',
                'X-API-KEY': 'tamby',
                'Authorization': token
            }
        })
            .then(
                (result) => {
                    setlistMatiere(result.data);
                    setCharge(false);
                }
            );
    }

    const chargementData = async () => {
        const virus = localStorage.getItem('virus');
        //Verifiena raha mbola ao le virus
        if (virus) {
            decrypt();
            setCharge(true);
            setTimeout(() => {
                loadData(decrypt().token, decrypt().data.rm_id, decrypt().data.mention, decrypt().data.grad_id, props.prof_id);
            }, 600)
        }
        else {
            logout();
        }
    }

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }
    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(40 187 96)', border: '1px solid rgb(40 187 96)'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };
    const stylebtnVoir = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(80 137 191)', border: '1px solid rgb(80 137 191)'
    };

    /**Style css */


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
        onVideMatiere();
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
                <h4 className='mb-1'>Matière</h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */






    return (
        <>
            <Toast ref={toastTR} position="top-right" />

            <Button icon={PrimeIcons.INFO_CIRCLE} className='p-buttom-sm p-0 ml-4 ' style={stylebtnVoir} tooltip='Voir' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2');  }} />
            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-7 md:col-9 col-11 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}  >
                <div className="p-1  style-modal-tamby">
                    <div className="col-12 field my-1 flex flex-column">
                        <h3 className='m-1' htmlFor="">Etat :
                            <u >
                                {props.etat == null || props.etat == '0' ? <i style={{ color: '#212529', borderRadius: '8px', backgroundColor: '#FBC02D', fontSize: '0.8em', padding: '0.21rem 0.1rem' }}> Pas encore démarré</i> : props.etat == '1' ? <i style={{ color: '#248dbf' }}> En cours</i> : <i style={{ color: '#0fa31a' }}> Terminé</i>}
                            </u>
                        </h3>
                        <h3 className='m-1' htmlFor="">Date debut du cours: <label style={{ fontWeight: 'bold', fontSize: '1.4rem' }}> {props.etat == null || props.etat == '0' ? '_' :  moment(props.date_debut).format('DD/MM/YYYY')} </label></h3>
                        <h3 className='m-1' htmlFor="">Date fin : <label style={{ fontWeight: 'bold', fontSize: '1.4rem' }}> {props.etat == null || props.etat == '0' ? '_' : props.etat == '2' ?   moment(props.date_fin).format('DD/MM/YYYY') :'_'} </label></h3>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
