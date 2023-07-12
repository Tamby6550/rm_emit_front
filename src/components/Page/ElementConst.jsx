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
import Voir from './ElementConst/Voir';
import moment from 'moment/moment';
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

  const [infomt, setinfomt] = useState({ rm_id: '', mention: '' });

  const [niveau, setniveau] = useState('0');
  const [selectniveau, setselectniveau] = useState(null);

  const [lmention, setlmention] = useState('0');
  const [selectlmention, setselectlmention] = useState(null);

  const [lgrade, setlgrade] = useState('0');
  const [selectlgrade, setselectlgrade] = useState(null);


  const [parcours_, setparcours_] = useState('0');
  const [selectparcours_, setselectparcours_] = useState(null);

  const [etat, setetat] = useState('5');

  const [nbreClasse, setnbreClasse] = useState(0);
  //Get List Examen
  const onTypesChange = (e) => {
    setanne_univ(e.value);
  }
  const onTypesChangeNiveau = (e) => {
    setniveau(e.value);
  }
  const onTypesChangeMention = (e) => {
    setlmention(e.value);
  }
  const onTypesChangeGrade = (e) => {
    setlgrade(e.value);
  }
  const onTypesChangeEtat = (e) => {
    setetat(e.value);
  }
  const onTypesChangeParcours_ = (e) => {
    setparcours_(e.value);
}
useEffect(() => {
    setselectparcours_(decrypt().data.parcours_)
}, []);

  const onVideMatiere = () => {
    setlistMatiere([{ matiere: '', unite_ens: '', semestre: '', abbr_niveau: '' }])
  }
  const toastTR = useRef(null);
  /*Notification Toast */
  const notificationAction = (etat, titre, message) => {
    toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
  }
  const choixEtat = [
    { label: 'Tous', value: '5' },
    { label: 'Pas encore démarré', value: '0' },
    { label: 'En cours', value: '1' },
    { label: 'Cours Terminés', value: '2' },
    { label: 'Examen SN terminé', value: '3' },
    { label: 'Examen SR terminé', value: '4' }
  ];



  const loadData = async (token, rm_id, mention_nom, grad_id, anne_univ, niveau, etat) => {
    await axios.get(props.url + `getMatiereRm/${parcours_}/${rm_id}/${mention_nom}/${grad_id}/${anne_univ}/${niveau}/${etat}`, {
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
          setlistMatiere(result.data.matiere);
          setselectanne(result.data.anne_univ)
          setselectniveau(result.data.niveau);
          setselectlgrade(result.data.grade)
          setselectlmention(result.data.mention);
          setnbreClasse(result.data.nbre_classe)
          setCharge(false);
          setrefreshData(0);
          initFilters1();
        }
      ).catch((e) => {
        // console.log(e.message)
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
        loadData(decrypt().token, decrypt().data.rm_id, decrypt().data.mention, decrypt().data.grad_id, anne_univ, niveau, etat);
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
        loadData(decrypt().token, 'admin', lmention, lgrade, anne_univ, niveau, etat);
      }, 800)
    }
    else {
      logout();
    }
  }
  useEffect(() => {
    chargementData()
  }, [props.url]);

  useEffect(async () => {
    if (decrypt().data.mention == 'Admin') {
      if (anne_univ == '0000-0000' || lgrade == '0' || lmention == '0') {
        return false;
      } else {
        chargementDataAdm()
      }
    } else {
      if (niveau == '0' || anne_univ == '0000-0000' && parcours_==='0') {
        return false
      } else {
        chargementData()
      }

    }
  }, [refreshData, anne_univ, niveau, etat, lmention, lgrade,parcours_]);




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
    // console.log(data)
    return (
      <div className='flex flex-row justify-content-between align-items-center m-0 '>
        <div className='my-0  py-2 flex'>
          <AjoutDetails nbreClasse={nbreClasse} parcours_={parcours_} grad_id={decrypt().data.grad_id} data={data} anne_univ={anne_univ} mention={decrypt().data.mention} token={decrypt().token} logout={logout} url={props.url} setrefreshData={setrefreshData} />
          <ModifierEtat etat={data.etat_mat} anne_univ={anne_univ} nom_mat={data.matiere} mat_id={data.mati_id} url={props.url} setrefreshData={setrefreshData} />
        </div>
      </div>
    )
  }

  const bodyDateDeb = (data) => {
    return (
      <label style={{ fontWeight: '600' }}>
        {data.etat_mat == null || data.etat_mat == '0' ?
          '_' :
          moment(data.dat_deb_etat).format('DD/MM/YYYY')}
      </label>
    )
  }
  const bodyDateFin = (data) => {
    return (
      <label style={{ fontWeight: '600' }}>
        {
          data.etat_mat == null || data.etat_mat == '0' ?
            '_' :
            data.etat_mat == '2' || data.etat_mat == '3' || data.etat_mat == '4' ? moment(data.date_fin_etat).format('DD/MM/YYYY')
              :
              '_'
        }
      </label>
    )
  }

  const bodyDateSN = (data) => {
    return (
      <label style={{ fontWeight: '600' }}>
        {
          data.etat_mat == null || data.etat_mat == '0' ?
            '_' :
            data.etat_mat == '3' || data.etat_mat == '4' ? moment(data.date_session_n).format('DD/MM/YYYY')
              :
              '_'
        }
      </label>
    )
  }
  const bodyDateSR = (data) => {
    return (
      <label style={{ fontWeight: '600' }}>
        {
          data.etat_mat == null || data.etat_mat == '0' ?
            '_' :
            data.etat_mat == '4' ? moment(data.date_session_r).format('DD/MM/YYYY')
              :
              '_'
        }
      </label>
    )
  }

  const bodyStatus = (data) => {
    // console.log(data)
    return (
      <div className='flex flex-row justify-content-between align-items-center m-0 '>
        <div className='my-0  py-2'>
          {
            data.etat_mat == null || data.etat_mat == '0' ?
              <Tag className="mr-2 " severity={"success"} style={{ backgroundColor: '#F23030' }} >Pas encore </Tag>
              :
              data.etat_mat == '1' ?
                < Tag className="mr-2 " severity={"success"} style={{ backgroundColor: '#F28705' }}  >En cours</ Tag>
                :
                data.etat_mat == '2' ?
                  <Tag className="mr-2 " severity={"success"} style={{ backgroundColor: '#33CC33' }} >Terminé cours</Tag>
                  :
                  data.etat_mat == '3' ?
                    <Tag className="mr-2 " severity={"success"} style={{ backgroundColor: '#009900' }} >Terminé SN</Tag>
                    :
                    data.etat_mat == '4' ?
                      <Tag className="mr-2 " severity={"success"} style={{ backgroundColor: '#669900' }} >Terminé SR</Tag>
                      :
                      <Tag className="mr-2 " severity={"success"} style={{ backgroundColor: '#FF6B1A' }}>Pas encore </Tag>
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
        <div className="lgcol-4 md:col-4   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-column flex-column">
            <h4 htmlFor="username2" className="m-1">Anne univ :</h4>
            <Dropdown value={anne_univ} options={selectanne} onChange={onTypesChange} name="etat" />
          </div>
          {decrypt().data.mention == 'Admin' ?
            <>
              <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
                <h4 htmlFor="username2" className="m-1">Mention  :</h4>
                <Dropdown value={lmention} options={selectlmention} onChange={onTypesChangeMention} name="etat" />
              </div>
              <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
                <h4 htmlFor="username2" className="m-1">Grade  :</h4>
                <Dropdown value={lgrade} options={selectlgrade} onChange={onTypesChangeGrade} name="etat" />
              </div>
            </>
            : null
          }
          <div className="lgcol-4 md:col-4   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-column flex-column">
            <h4 htmlFor="username2" className="m-1">Niveau  :</h4>
            <Dropdown value={niveau} options={selectniveau} onChange={onTypesChangeNiveau} name="etat" />
          </div>
          <div className="lgcol-4 md:col-4   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-column flex-column">
            <h4 htmlFor="username2" className="m-1">Parcours  :</h4>
            <Dropdown value={parcours_} options={selectparcours_} onChange={onTypesChangeParcours_} name="etat" />
          </div>
          <div className="lgcol-4 md:col-4   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-column flex-column">
            <h4 htmlFor="username2" className="m-1">Afficher :</h4>
            <Dropdown value={etat} options={choixEtat} onChange={onTypesChangeEtat} name="etat" />
          </div>
          {decrypt().data.mention == 'Admin' ? null :
            <div className="lgcol-4 md:col-4   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-column flex-column">
              <h4 htmlFor="username2" className="m-1">Recherche :</h4>
              <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Recherche global..." />
            </div>
          }
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
        {/* <ScrollPanel style={{ height: '750px',width:'100%' }}> */}
        <DataTable value={listMatiere} loading={charge} header={header1} showGridlines={false} globalFilterFields={['matiere', 'unite_ens', 'seme_code', 'abbr_niveau']} filters={filters1} rows={10} rowsPerPageOptions={[10, 20, 50]} paginator emptyMessage={'Aucun resultat trouvé'}>
          <Column header="Action" body={bodyBoutton} align={'center'}></Column>
          <Column field={'ue_code'} header={'Unité d\'enseign'} style={{ fontWeight: '600' }}></Column>
          <Column field='matiere' header={'Matiere'} style={{ fontWeight: '600' }}></Column>
          <Column field={'seme_code'} header="Semetre" style={{ fontWeight: '600' }}></Column>
          <Column field='abbr_niveau' header="Niveau"></Column>
          <Column header={'Date début'} body={bodyDateDeb} style={{ fontWeight: '600' }}></Column>
          <Column header={'Date fin'} body={bodyDateFin} style={{ fontWeight: '600' }}></Column>
          <Column header={'Date SN'} body={bodyDateSN} style={{ fontWeight: '600' }}></Column>
          <Column header={'Date SR'} body={bodyDateSR} style={{ fontWeight: '600' }}></Column>
          <Column header="Etat" body={bodyStatus} > </Column>
        </DataTable>
        {/* </ScrollPanel> */}
      </center>
    </>
  )
}
