import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import CryptoJS from 'crypto-js';
import useAuth from '../../../Login/useAuth';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

export default function ListeProf(props) {

    const decrypt = () => {
        const virus = localStorage.getItem("virus");
        const token = localStorage.getItem("token");
        const decryptedData = CryptoJS.AES.decrypt(virus, secret);
        const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(dataString);
        return { data, token };
    }

    const { logout, isAuthenticated, secret } = useAuth();

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [listProff, setlistProff] = useState([{ prof_id: '', nom_prof: '', prof_contact: '', prof_adresse: '' }]);


    const loadData = async (token,rm_id,mention_nom,grad_id) => {
        try {
            await axios.get(props.url + `getProff/${rm_id}/${mention_nom}/${grad_id}`, {
                headers: {
                    'Content-Type': 'text/html',
                    'X-API-KEY': 'tamby',
                    'Authorization':token
                }
            })
                .then(
                    (result) => {                        
                        setlistProff(result.data);
                        setCharge(false);
                        initFilters1();
                    }
                );
        } catch (error) {
            console.log(error)
        }
    }

    const chargementData=() => {
        const virus = localStorage.getItem('virus');
        //Verifiena raha mbola ao le virus
        if (virus) {
             decrypt();
            setCharge(true);
            setTimeout(() => {
                loadData(decrypt().token,decrypt().data.rm_id,decrypt().data.mention,decrypt().data.grad_id);
            }, 500)
        } else {
            logout();
        }
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
        return null
    }
    /** Fin modal */

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

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-around align-items-center  mr-5'>
            <Button icon={PrimeIcons.CHECK} className='p-buttom-sm p-1  p-button-info ' tooltip='Choisir' tooltipOptions={{ position: 'top' }} 
            onClick={() => { 
                console.log(data.prof_id)
                props.setprof({idprof:data.prof_id,nomprof:data.nom_prof});
                onHide('displayBasic2');
             }} />
            </div>
        )
    }
    return (
        <>
            <Button icon={PrimeIcons.SEARCH} className='p-buttom-sm p-1  p-button-secondary ' tooltip='Choisir enseignant' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2');chargementData(); }} />
            <Dialog header={renderHeader('displayBasic2')} className="lg:col-4 md:col-5 sm:col-10 col-11 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <center>
                    <BlockUI blocked={charge} template={<ProgressSpinner />}>

                        <DataTable value={listProff} header={header1} globalFilterFields={['nom_prof', 'prof_contact', 'prof_adresse']} filters={filters1} rows={10} rowsPerPageOptions={[10, 20, 50]} paginator autoLayout loading={charge} emptyMessage={'Aucun resultat trouvé'}>
                            <Column field='nom_prof' header="Nom"  >  </Column>
                            <Column field='prof_contact' header="Contact"  ></Column>
                            <Column field='prof_adresse' header="Adresse"  ></Column>
                            <Column header="action" body={bodyBoutton} align={'left'} style={{ width: '90px' }}></Column>
                        </DataTable>
                    </BlockUI>
                </center>
            </Dialog>

        </>
    )
}
