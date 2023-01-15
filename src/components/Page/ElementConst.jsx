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
import AjoutDetails from './ElementConst/AjoutDetails'
import ModifierEtat from './ElementConst/ModifierEtat';
import { Dropdown } from 'primereact/dropdown';


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
  const [listMatiere, setlistMatiere] = useState([{ matiere: '', etat_mat: '', unite_ens: '', semestre: '', abbr_niveau: '' }]);
  const [verfCompteRendu, setverfCompteRendu] = useState(false);
  const [anne_univ, setanne_univ] = useState('0000-0000');
  const [selectanne, setselectanne] = useState(null);

  const [niveau, setniveau] = useState('0');
  const [selectniveau, setselectniveau] = useState(null);

  const [etat, setetat] = useState('5');


  //Get List Examen
  const onTypesChange = (e) => {
    setanne_univ(e.value);
  }
  const onTypesChangeNiveau = (e) => {
    setniveau(e.value);
  }
  const onTypesChangeEtat = (e) => {
    setetat(e.value);
  }

  const onVideMatiere = () => {
    setlistMatiere([{ matiere: '', unite_ens: '', semestre: '', abbr_niveau: '' }])
  }

  const choixEtat = [
    { label: 'Tous', value: '5' },
    { label: 'Pas encore démarré', value: '0' },
    { label: 'En cours', value: '1' },
    { label: 'Terminé', value: '2' },
  ]

  const loadData = async (token, rm_id, mention_nom, grad_id, anne_univ, niveau,etat) => {
    await axios.get(props.url + `getMatiereRm/${rm_id}/${mention_nom}/${grad_id}/${anne_univ}/${niveau}/${etat}`, {
      headers: {
        'Content-Type': 'text/html',
        'X-API-KEY': 'tamby',
        'Authorization': token
      }
    })
      .then(
        (result) => {
          setlistMatiere(result.data.matiere);
          setselectanne(result.data.anne_univ)
          setselectniveau(result.data.niveau)
          setCharge(false);
          setrefreshData(0);
          initFilters1();
        }
      );
  }

  const chargementData = () => {
    const virus = localStorage.getItem('virus');
    //Verifiena raha mbola ao le virus
    if (virus) {
      decrypt();
      setCharge(true);
      setTimeout(() => {
        loadData(decrypt().token, decrypt().data.rm_id, decrypt().data.mention, decrypt().data.grad_id, anne_univ, niveau,etat);
      }, 800)
    }
    else {
      logout();
    }
  }
  useEffect(() => {
    chargementData()
  }, [])
  
  useEffect(async () => {
    if (niveau=='0' || anne_univ=='0000-0000') {
      return false
    }else{
      chargementData()
    }
  }, [refreshData, anne_univ, niveau,etat]);



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
        <div className='my-0  py-2 flex'>
          <AjoutDetails />
          <ModifierEtat etat={data.etat_mat} anne_univ={anne_univ} nom_mat={data.matiere} mat_id={data.mati_id} url={props.url} setrefreshData={setrefreshData} />
        </div>
      </div>
    )
  }
  const bodyStatus = (data) => {
    return (
      <div className='flex flex-row justify-content-between align-items-center m-0 '>
        <div className='my-0  py-2'>
          {
            data.etat_mat == null || data.etat_mat == '0' ?
              <Tag className="mr-2 " severity={"warning"} >Pas encore</Tag>
              :
              data.etat_mat == '1' ?
                < Tag className="mr-2 " severity={"info"} >En cours</ Tag>
                :
                <Tag className="mr-2 " severity={"success"} >Terminé</Tag>
          }
          
           {
            ////Raha label
            // data.etat_mat == null || data.etat_mat == '0' ?
            //   <label className="mr-2 " style={{color:'#A9811F',fontWeight:'700'}} >Pas encore</label>
            //   :
            //   data.etat_mat == '1' ?
            //     <label className="mr-2 " style={{color:'#0288D1',fontWeight:'700'}} >En cours</ label>
            //     :
            //     <label className="mr-2 " style={{color:'#22C55E',fontWeight:'700'}} >Terminé</label>
          }
        </div>
      </div >
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

      <div className="flex justify-content-between lg:flex-row md:flex-column sm:flex-column flex-column">
        <div className='flex lg:flex-row lg:col-6 md:col-7 md:flex-row sm:flex-row flex-column'>
        <div className="lgcol-8 md:col-5   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
            <h4 htmlFor="username2" className="m-1">Anne univ :</h4>
            <Dropdown value={anne_univ} options={selectanne} onChange={onTypesChange}  name="etat" />
          </div>
          <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
            <h4 htmlFor="username2" className="m-1">Niveau  :</h4>
            <Dropdown value={niveau} options={selectniveau} onChange={onTypesChangeNiveau}  name="etat" />
          </div>
         
          <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
            <h4 htmlFor="username2" className="m-1">Afficher :</h4>
            <Dropdown value={etat} options={choixEtat} onChange={onTypesChangeEtat}  name="etat" />
          </div>
          <div className="lgcol-8 md:col-5  justify-content-center md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
            <h4 htmlFor="username2" className="m-1">Recherche :</h4>
            <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Recherche global..." />
          </div>
        </div>
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
        <DataTable value={listMatiere} loading={charge} header={header1} globalFilterFields={['matiere', 'unite_ens', 'seme_code', 'abbr_niveau']} filters={filters1} rows={10} rowsPerPageOptions={[10, 20, 50]} paginator emptyMessage={'Aucun resultat trouvé'}>
          <Column header="Action" body={bodyBoutton} align={'left'}></Column>
          <Column field={'ue_code'} header={'Unité d\'enseign'} style={{ fontWeight: '600' }}></Column>
          {/* <Column field={'mati_id'} header={'id_matiere'} style={{ fontWeight: '600' }}></Column> */}
          <Column field='matiere' header={'Matiere'} style={{ fontWeight: '600' }}></Column>
          <Column field={'seme_code'} header="Semetre" style={{ fontWeight: '600' }}></Column>
          <Column field='abbr_niveau' header="Niveau"></Column>
          <Column header="Etat" body={bodyStatus} > </Column>

        </DataTable>
      </center>
    </>
  )
}
