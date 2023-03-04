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


export default function TableauB(props) {
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

  const [niveau, setniveau] = useState('0');
  const [selectniveau, setselectniveau] = useState(null);

  const [parcours_libell, setparcours_libell] = useState('')
  const [chargementDD, setchargementDD] = useState(false);
  const [titreAff, settitreAff] = useState({
    nbreClasse: '',
    groupe_td: '',
    groupe_tp: '',
    nom_mention: '',
    parcours: '',
    abbre_niveau: '',
  });
  const [totalT, settotalT] = useState({
    ttotal_et: "",
    ttotal_ed: "",
    ttotal_ep: ""
  })
  const [data, setdata] = useState({
    total: {
      parc_libelle: "",
      tvheure: "",
      tbase_et: "",
      tbase_ed: "",
      tbase_ep: "",
      ttotal_et: "",
      ttotal_ed: "",
      ttotal_ep: "",
      heuredeclare: ""
    },
    detail: [
      {
        niv_id: "",
        abbr_niveau: "",
        mati_id: "",
        mat_libelle: "",
        nom_prof: "",
        vheure: "",
        id_details: "",
        base_et: "",
        group_et: "",
        base_ed: "",
        group_ed: "",
        base_ep: "",
        group_ep: "",
        total_et: "",
        total_ed: "",
        total_ep: ""
      }
    ],
    group_tamby: {
      id_groupe: "",
      anne_univ: "",
      niveau: "",
      mention: "",
      td: "",
      tp: ""
    }
  });
  const onTypesChange = (e) => {
    setanne_univ(e.value);
  }
  const onTypesChangeNiveau = (e) => {
    setniveau(e.value);
  }

  const toastTR = useRef(null);
  /*Notification Toast */
  const notificationAction = (etat, titre, message) => {
    toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
  }


  const loadNiveau = async (rm_id, mention_nom, grad_id) => {
    await axios.get(props.url + `getNiveau/${rm_id}/${mention_nom}/${grad_id}`, {
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
          setselectniveau(result.data);
        }
      ).catch((e) => {
        // console.log(e.message)
        if (e.message == "Network Error") {
          props.urlip()
        }
      })
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
          loadNiveau(decrypt().data.rm_id, decrypt().data.mention, decrypt().data.grad_id);
        }
      ).catch((e) => {
        // console.log(e.message)
        if (e.message == "Network Error") {
          props.urlip()
        }
      })
  }

  const loadTitreTableau = async (rm_id, mention_nom, niveau, grad_id, anne_univ) => {
    await axios.get(props.url + `getTitreTableau/${rm_id}/${mention_nom}/${niveau}/${grad_id}/${anne_univ}`, {
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
          settitreAff({
            nbreClasse: result.data.nbreClasse.count,
            nom_mention: result.data.info.nom_mention,
            abbre_niveau: result.data.info.abbr_niveau,
            parcours: result.data.info.parc_libelle,
            groupe_td: result.data.group_tamby.td,
            groupe_tp: result.data.group_tamby.tp
          });
          //Affiche Somme Et Ed, Ep
          loadAfficheTableauSommeEtEdEp();
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
      await axios.get(props.url + `getTableauAfficheTableauA/${anne_univ}/${decrypt().data.mention}/${prof.idprof}/${niveau}`, {
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
            if (result.data.total.parc_libelle != '') {
              setdata(result.data);
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
  const loadAfficheTableauSommeEtEdEp = async () => {

    await axios.get(props.url + `getTableauAfficheSommeEtEdEp/${anne_univ}/${decrypt().data.mention}/${niveau}/${decrypt().data.rm_id}`, {
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
          settotalT(result.data);
          setchargementDD(false);
        }
      ).catch((e) => {
        // console.log(e.message)
        if (e.message == "Network Error") {
          props.urlip()
        }

      })
  }

  useEffect(() => {
    anne_univDt()
  }, [props.url]);


  // Manao Lettre anle heure
  function manisyLettre(nb) {
    let intNb = parseInt(nb);
    let ren = NumberToLetter(intNb);

    return ren;
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
          <h4 htmlFor="username2" className="m-1">Niveau  :</h4>
          <Dropdown value={niveau} options={selectniveau} onChange={onTypesChangeNiveau} name="etat" />
        </div>

        <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
          <div className='m-1 flex flex-row align-items-center '>
            <InputText id="username2" style={{ height: '25px' }} aria-describedby="username2-help" name='code_cli' value={prof.nomprof} readOnly />
            <ListeProf url={props.url} setprof={setprof} />
          </div>
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
          <div className='grid h-full imprim' id='imprimable'   >
            <div className="lg:col-6 md:col-6  md:flex-column   sm:col-6 col-6 sm:flex-column field my-0 flex lg:flex-coluln flex-column " style={{ alignItems: 'center' }}>
              <div className='flex flex-column '>
                <center>
                  <label className='m-1' style={{ fontSize: '1.1em' }} >
                    MINISTRE DE L'ENSEIGNEMENT SUPERIEUR ET DE LA <br />
                    RECHERCHE SCIENTIFIQUE <br />
                    UNIVERSITE DE FIANARANTSOA <br />
                    Etablissement : EMIT
                  </label>
                </center>
              </div>
            </div>

            <div className="lg:col-6 md:col-6  md:flex-column   sm:col-6 col-6 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ alignItems: 'center' }}>
              <div className='flex flex-row justify-content-between '>
                <label style={{ fontSize: '1.1em' }}>
                  Permanent <br />
                  N° matricule
                </label>
                <div className='flex flex-column ml-5' >
                  <label style={{ fontSize: '1.1em', border: '1px solid grey' }} className='pl-3 pr-3' >Vacataire</label>
                </div>
              </div>
            </div>
            <div className="col-12 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ justifyContent: 'center', textAlign: 'center' }} >
              <label className='m-1' style={{ fontSize: '1em' }} >
                FICHE INDIVIDUELLE DE DECLARATION DES ENSEIGNEMENTS<br />
                Voyage d'études ; stages ; mini-projet ; mémoire et Thèses ou obligations <br />
                Année Univesitaire : {anne_univ} <br />
                Mention :  {data.total.parc_libelle}
              </label>
            </div>
            <div className="col-12 sm:flex-column field my-0 flex lg:flex-row flex-column " >
              <label className='pl-5' style={{ fontSize: '1.1em' }} >
                NOM : {prof.nomprof} <br />
                Prénom : <br />
                Grade : Assistant
              </label>
            </div>

            <div className="col-12 flex flex-column ">
              <table style={{borderCollapse: 'collapse', width: '80%', height: '20px'}} border="1">
                <tbody>
                  <tr style={{height: '19.5833px'}}>
                    <td style={{height: '78.3333px', textAlign: 'left'}} rowspan="3">P&eacute;riode</td>
                    <td style={{height: '19.5833px'}}>Objet</td>
                    <td style={{height: '19.5833px'}}>Fili&egrave;re</td>
                    <td style={{height: '78.3333px'}} rowspan="3">Nombre d'&eacute;tudiant ou groupes</td>
                    <td style={{height: '58.75px'}} colspan="2" rowspan="2">Heure effectu&eacute;es</td>
                    <td style={{height: '339.896px',width:'5%',borderTop:'1px solid white',borderBottom:'1px solid white'}} rowspan="12">&nbsp;</td>
                    <td style={{height: '58.75px', textAlign: 'center'}} colspan="4" rowspan="2">RECAPITULATIF</td>
                  </tr>
                  <tr style={{height: '39.1667px'}}>
                    <td style={{height: '39.1667px'}}>Nom de l'&eacute;tudiant et&nbsp;</td>
                    <td style={{height: '39.1667px'}}>Ann&eacute;e d'&eacute;tude</td>
                  </tr>
                  <tr style={{height: '19.5833px'}}>
                    <td style={{height: '19.5833px'}} colspan="2">&nbsp;</td>
                    <td style={{height: '19.5833px'}}>ED</td>
                    <td style={{height: '19.5833px'}}>EP</td>
                    <td style={{height: '19.5833px', textAlign: 'center'}} colspan="4">A compl&eacute;ter par l'administration</td>
                  </tr>
                  {/* <tr style={{height: '1.5833px'}}>
                    <td style={{height: '1.5833px'}}>&nbsp;</td>
                    <td style={{height: '1.5833px'}}>&nbsp;</td>
                    <td style={{height: '1.5833px'}}>&nbsp;</td>
                    <td style={{height: '1.5833px'}}>&nbsp;</td>
                    <td style={{height: '1.5833px'}}>&nbsp;</td>
                    <td style={{height: '1.5833px'}}>&nbsp;</td>
                    <td style={{height: '1.5833px'}} colspan="4">&nbsp;</td>
                  </tr> */}
                  <tr style={{height: '47.5833px'}}>
                    <td style={{height: '47.5833px'}}>&nbsp;</td>
                    <td style={{height: '0.5833px', textAlign: 'left'}}>
                      <p style={{textAlign: 'center'}}>Encadrement L2</p>
                    </td>
                    <td style={{height: '47.5833px'}}>&nbsp;</td>
                    <td style={{height: '47.5833px', textAlign: 'center'}}>&nbsp;</td>
                    <td style={{height: '47.5833px', textAlign: 'center'}}>0</td>
                    <td style={{height: '47.5833px'}}>&nbsp;</td>
                    <td style={{height: '47.5833px'}}>Selon</td>
                    <td style={{height: '84.0625px', textAlign: 'right'}} rowspan="2">18</td>
                    <td style={{height: '84.0625px', textAlign: 'right'}} rowspan="2">64</td>
                    <td style={{height: '84.0625px', textAlign: 'right'}} rowspan="2">120</td>
                  </tr>
                  <tr style={{height: '36.4792px'}}>
                    <td style={{height: '36.4792px'}}>&nbsp;</td>
                    <td style={{height: '36.4792px', textAlign: 'center'}}>Soutenance L2</td>
                    <td style={{height: '36.4792px'}}>&nbsp;</td>
                    <td style={{height: '36.4792px', textAlign: 'center'}}>6</td>
                    <td style={{height: '36.4792px', textAlign: 'center'}}>24</td>
                    <td style={{height: '36.4792px'}}>&nbsp;</td>
                    <td style={{height: '36.4792px',width:'2%'}}>Tableau A</td>
                  </tr>
                  <tr style={{height: '37.5px'}}>
                    <td style={{height: '37.5px'}}>&nbsp;</td>
                    <td style={{height: '37.5px', textAlign: 'center'}}>Encadrement L3</td>
                    <td style={{height: '37.5px'}}>&nbsp;</td>
                    <td style={{height: '37.5px', textAlign: 'center'}}>&nbsp;</td>
                    <td style={{height: '37.5px', textAlign: 'center'}}>0</td>
                    <td style={{height: '37.5px'}}>&nbsp;</td>
                    <td style={{height: '37.5px'}}>Selon</td>
                    <td style={{height: '76.6667px', textAlign: 'right'}} rowspan="2">&nbsp;</td>
                    <td style={{height: '76.6667px', textAlign: 'right'}} rowspan="2">100</td>
                    <td style={{height: '76.6667px', textAlign: 'right'}} rowspan="2">&nbsp;</td>
                  </tr>
                  <tr style={{height: '39.1667px'}}>
                    <td style={{height: '39.1667px'}}>Du 02 au 05 Avril 2019</td>
                    <td style={{height: '39.1667px', textAlign: 'center'}}>Soutenance L3</td>
                    <td style={{height: '39.1667px'}}>&nbsp;</td>
                    <td style={{height: '39.1667px', textAlign: 'center'}}>19</td>
                    <td style={{height: '39.1667px', textAlign: 'center'}}>76</td>
                    <td style={{height: '39.1667px'}}>&nbsp;</td>
                    <td style={{height: '39.1667px'}}>Tableau B</td>
                  </tr>
                  <tr style={{height: '19.5833px'}}>
                    <td style={{height: '19.5833px'}}>&nbsp;</td>
                    <td style={{textAlign: 'left', height: '19.5833px'}}>&nbsp;</td>
                    <td style={{height: '19.5833px'}}>&nbsp;</td>
                    <td style={{height: '19.5833px'}}>&nbsp;</td>
                    <td style={{textAlign: 'center',height: '19.5833px'}}>&nbsp;</td>
                    <td style={{height: '19.5833px'}}>&nbsp;</td>
                    <td style={{height: '19.5833px'}}>TOTAL</td>
                    <td style={{height: '19.5833px', textAlign: 'right'}}>18</td>
                    <td style={{height: '19.5833px', textAlign: 'right'}}>164</td>
                    <td style={{height: '19.5833px', textAlign: 'right'}}>120</td>
                  </tr>
                  <tr style={{height: '22.5px'}}>
                    <td style={{height: '22.5px'}}>&nbsp;</td>
                    <td style={{height: '22.5px', textAlign: 'center'}}>Voyage d'Etudes</td>
                    <td style={{height: '22.5px'}}>&nbsp;</td>
                    <td style={{height: '22.5px'}}>&nbsp;</td>
                    <td style={{height: '22.5px', textAlign: 'center'}}>0</td>
                    <td style={{height: '22.5px'}}>&nbsp;</td>
                    <td style={{height: '22.5px'}}>OBLIGATION</td>
                    <td style={{height: '22.5px', textAlign: 'right'}} colspan="3">&nbsp;</td>
                  </tr>
                  <tr style={{height: '19.5833px'}}>
                    <td style={{height: '39.1666px'}} colspan="2" rowspan="2">&nbsp;</td>
                    <td style={{height: '19.5833px'}} colspan="2">Total</td>
                    <td style={{height: '19.5833px', textAlign: 'center'}}>100</td>
                    <td style={{height: '19.5833px'}}>&nbsp;</td>
                    <td style={{height: '19.5833px'}}>Heures&nbsp; de</td>
                    <td style={{height: '19.5833px', textAlign: 'right'}}>30</td>
                    <td style={{height: '19.5833px', textAlign: 'right'}}>164</td>
                    <td style={{height: '19.5833px', textAlign: 'right'}}>60</td>
                  </tr>
                  <tr style={{height: '19.5833px'}}>
                    <td style={{height: '19.5833px'}} colspan="2">Heures &agrave; declarer</td>
                    <td style={{height: '19.5833px'}}>&nbsp;</td>
                    <td style={{height: '19.5833px'}}>&nbsp;</td>
                    <td style={{height: '19.5833px', textAlign: 'center'}} colspan="4">254 heures en ED</td>
                  </tr>
                </tbody>
              </table>
            </div>


            <div className='col-12  flex flex-column'>
              <div className='col-12 pl-5 flex flex-column'>
                <label style={{ fontSize: '1.1em' }}>
                  Arrêté la présente de déclaration à : {manisyLettre(data.total.heuredeclare)} heures ({data.total.heuredeclare + 'h'}) d'enseignement effectuées dont : {manisyLettre(data.total.ttotal_et)} heures ({data.total.ttotal_et + 'h'}) d'ET
                  ,{manisyLettre(data.total.ttotal_ed)}
                  <br /> heures ({data.total.ttotal_ed + 'h'})
                  d'ED et {manisyLettre(data.total.ttotal_ep)} heures ({data.total.ttotal_ep + 'h'}) d'EP.
                </label>
              </div>
              <div className='col-12 pl-5 flex flex-row justify-content-evenly m-0 p-0'>
                <label style={{ fontSize: '1.1em' }}>Le Responsable de Mention</label>
                <label style={{ fontSize: '1.1em' }}>
                  Fait a Fianarantsoa le,.... <br />
                  Signature de l'enseignant
                  </label>
              </div>
              
            </div>
          </div>
        </BlockUI>
      </div>
    </div >
  )
}
