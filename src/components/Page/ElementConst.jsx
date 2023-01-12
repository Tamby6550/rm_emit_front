import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
/*Importer modal */
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import axios from 'axios'
import useAuth from '../Login/useAuth';
import CryptoJS from 'crypto-js';
import AjoutDetails from './ElementConst/AjoutDetails';
export default function ElementConst(props) {

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
  const [refreshData, setrefreshData] = useState(0);
  const [charge, setCharge] = useState(false);
  const [listMatiere, setlistMatiere] = useState([{ matiere: '', unite_ens: '', semestre: '', abbr_niveau: '' }]);
  const [verfCompteRendu, setverfCompteRendu] = useState(false);
  //Get List Examen

  const onVideMatiere = () => {
    setlistMatiere([{ matiere: '', unite_ens: '', semestre: '', abbr_niveau: '' }])
  }
  const loadData = async (token, rm_id, mention_nom, grad_id, prof_id) => {
    await axios.get(props.url + `getMatiereRm/${rm_id}/${mention_nom}/${grad_id}`, {
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
          initFilters1();
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
  useEffect(async () => {
    chargementData()
}, [refreshData]);

  

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



  const bodyBoutton = (data) => {
    return (
      <div className='flex flex-row justify-content-between align-items-center m-0 '>
        <div className='my-0  py-2'>
          < AjoutDetails  />

        </div>
      </div>
    )
  }
  const bodyStatus = (data) => {
    return (
      <div className='flex flex-row justify-content-between align-items-center m-0 '>
        <div className='my-0  py-2'>
          <Tag className="mr-2 " severity={"success"} >Ok</Tag>
          <Tag className="mr-2 " severity={"warning"} >Non</Tag>
          <Tag className="mr-2 " severity={"info"} >En cours</Tag>
        </div>
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
        <DataTable header={header1} globalFilterFields={['matiere','unite_ens', 'seme_code', 'abbr_niveau']}  scrollHeight={"500px"} scrollable filters={filters1} rows={10} rowsPerPageOptions={[10, 20, 50]} paginator value={listMatiere}  loading={charge} responsiveLayout="scroll" className='bg-white' emptyMessage={"Aucun resultat !"} style={{ fontSize: '1.1em' }} >
          <Column field='matiere' header={'Matiere'} style={{ fontWeight: '600' }}></Column>
          <Column field={'unite_ens'} header={'Unité d\'enseign'} style={{ fontWeight: '600' }}></Column>
          <Column field={'seme_code'} header="Semetre" style={{ fontWeight: '600' }}></Column>
          <Column field='abbr_niveau' header="Niveau"></Column>
          <Column header="Action" body={bodyBoutton} align={'left'}></Column>
          <Column header="Status" body={bodyStatus} > </Column>

        </DataTable>
      </center>
    </>
  )
}
