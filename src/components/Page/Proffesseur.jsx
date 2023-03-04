import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

import axios from 'axios';
import { Toast } from 'primereact/toast';
import useAuth from '../Login/useAuth'
import CryptoJS from 'crypto-js';
import Voir from './Proffesseur/Voir'
import AjoutEngagement from './Proffesseur/AjoutEngagement'
export default function Proffesseur(props) {

    const { logout, isAuthenticated, secret } = useAuth();



    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listProff, setlistProff] = useState([{ prof_id: '', nom_prof: '', prof_contact: '', prof_adresse: '' }]);
    const [infoProff, setinfoProff] = useState({ prof_id: '', nom_prof: '', prof_contact: '', prof_adresse: '' });
    const onVideInfo = () => {
        setinfoProff({ id_mention: '', nom_mention: '', libmention: '', parcours: '', libparcours: '' });
    }
    const [totalenrg, settotalenrg] = useState(null)

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };
    const stylebtnVoir = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(80 137 191)', border: '1px solid rgb(80 137 191)'
    };

    /**Style css */

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }

    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        return { data, token };
    }



    //Get List client
    const loadData = async (token, rm_id, mention_nom, grad_id) => {
        try {
            await axios.get(props.url + `getProff/${rm_id}/${mention_nom}/${grad_id}`, {
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
                        onVideInfo();
                        setrefreshData(0);
                        setlistProff(result.data);
                        setCharge(false);
                        initFilters1();
                    }
                );
        } catch (error) {
            if (error.message == "Network Error") {
                props.urlip()
            }
            console.log(error)
        }
    }

    useEffect(async () => {
        const virus = localStorage.getItem('virus');
        //Verifiena raha mbola ao le virus
        if (virus) {
            decrypt();
            setCharge(true);
            setTimeout(() => {
                console.log(decrypt())
                loadData(decrypt().token, decrypt().data.rm_id, decrypt().data.mention, decrypt().data.grad_id);
            }, 500)
        } else {
            logout();
        }
    }, [refreshData,props.url]);


    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between '>
                <Voir prof_id={data.prof_id} url={props.url} nom={data.nom_prof} contact={data.prof_contact} />
                <AjoutEngagement prof_id={data.prof_id} url={props.url} nom={data.nom_prof} />
            </div>
        )
    }

    //Global filters

    const [filters1, setFilters1] = useState(null);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1['global'].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    }
    const initFilters1 = () => {
        setFilters1({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue1('');
    }
    const clearFilter1 = () => {
        initFilters1();
    }
    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <h3 className='m-3'>Liste Professeurs</h3>
                <span className="p-input-icon-left global-tamby">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Recherche global..." />
                </span>
            </div>
        )
    }
    const header1 = renderHeader1();

    //Global filters

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />

            <center>

                <DataTable value={listProff} header={header1} globalFilterFields={['nom_prof', 'prof_contact', 'prof_adresse']} filters={filters1} rows={10} rowsPerPageOptions={[10, 20, 50]} paginator autoLayout loading={charge} emptyMessage={'Aucun resultat trouvé'}>
                    <Column field='nom_prof' header="Nom"  >  </Column>
                    <Column field='prof_contact' header="Contact"  ></Column>
                    <Column field='prof_adresse' header="Adresse"  ></Column>
                    <Column header="action" body={bodyBoutton} align={'left'} style={{ width: '90px' }}></Column>
                </DataTable>
            </center>
        </>
    )
}
