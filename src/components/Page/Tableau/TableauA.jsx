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
import TableauB from './TableauB';

export default function TableauA(props) {
  const { logout, isAuthenticated, secret } = useAuth();

  const decrypt = () => {
    const virus = localStorage.getItem("virus");
    const token = localStorage.getItem("token");
    const decryptedData = CryptoJS.AES.decrypt(virus, secret);
    const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(dataString);
    return { data, token };
  }

  const [affficheB, setaffficheB] = useState(false);
  const [changeTableau, setchangeTableau] = useState('A');
  const [prof, setprof] = useState({ idprof: '', nomprof: '' });

  const [anne_univ, setanne_univ] = useState('0000-0000');
  const [selectanne, setselectanne] = useState(null);

  const [niveau, setniveau] = useState('0');
  const [selectniveau, setselectniveau] = useState(null);

  const [parcours_, setparcours_] = useState('0');
  const [selectparcours_, setselectparcours_] = useState(null);

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
      prof_type: "",
      prof_titre: "",
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
        total_ep: "",
        nbgroup: {
          count: "0"
        }
      }
    ],
    group_tamby: {
      id_groupe: "",
      anne_univ: "",
      grade: "",
      mention: "",
      diviser_td: "",
      diviser_tp: ""
    }
  }
  );
  const onTypesChange = (e) => {
    setanne_univ(e.value);
  }
  const onTypesChangeNiveau = (e) => {
    setniveau(e.value);
  }
  const onTypesChangeParcours_ = (e) => {
    setparcours_(e.value);
  }


  useEffect(() => {
    setselectparcours_(decrypt().data.parcours_)
    if (data.total.heuredeclare != '') {

      setdata({
        total: {
          parc_libelle: "",
          prof_type: "",
          prof_titre: "",
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
            total_ep: "",
            nbgroup: {
              count: "0"
            }
          }
        ],
        group_tamby: {
          id_groupe: "",
          anne_univ: "",
          grade: "",
          mention: "",
          diviser_td: "",
          diviser_tp: ""
        }
      })
    }
  }, [prof])

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
      await axios.get(props.url + `getTableauAfficheTableauA/${parcours_}/${decrypt().data.rm_id}/${anne_univ}/${decrypt().data.mention}/${prof.idprof}/${decrypt().data.grad_id}`, {
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
              console.log(result.data)
              setaffficheB(true);
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

    await axios.get(props.url + `getTableauAfficheSommeEtEdEpParcours/${parcours_}/${anne_univ}/${decrypt().data.mention}/${niveau}/${decrypt().data.rm_id}`, {
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

  function getResult(num, denom) {
    const result = num / denom;
    if (result % 1 !== 0) {
      return Math.ceil(result);
    }
    return result;
  }

  function diviserNbGroupe(nbreEtud, div_td, div_tp, resultat) {
    settitreAff({
      nbreClasse: resultat.data.nbreClasse.count,
      nom_mention: resultat.data.info.nom_mention,
      abbre_niveau: resultat.data.info.abbr_niveau,
      parcours: resultat.data.info.parc_libelle,
      groupe_td: getResult(nbreEtud, div_td), groupe_tp: getResult(nbreEtud, div_tp)
    });
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
          <h4 htmlFor="username2" className="m-1">Parcours  :</h4>
          <Dropdown value={parcours_} options={selectparcours_} onChange={onTypesChangeParcours_} name="etat" />
        </div>

        <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
          <div className='m-1 flex flex-row align-items-center '>
            <InputText id="username2" style={{ height: '25px' }} aria-describedby="username2-help" name='code_cli' value={prof.nomprof} readOnly />
            <ListeProf url={props.url} setprof={setprof} />
          </div>
        </div>
        <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
          <Button icon={PrimeIcons.EYE} className='p-button-sm p-button-success ml-3 ' label={'Tableau A'}
            onClick={() => {
              setchangeTableau('A');
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
        {affficheB ?
          <Button icon={PrimeIcons.EYE} className='p-button-sm p-button-success ml-3 p-1' label={'Tableau B'}
            onClick={() => {
              setchangeTableau('B')
            }}
          />
          :
          null
        }
      </center>
      <div className='col-12' style={{ border: '1px solid grey' }}>

        <BlockUI blocked={chargementDD} template={<ProgressSpinner />}>
          {changeTableau === 'A' ?

            <div className='grid h-full ' id='imprimable'  >
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
                    <label style={{ fontSize: '1.1em', border: '1px solid grey' }} className='pl-3 pr-3' >{data.total.prof_type}</label>
                  </div>
                </div>
              </div>
              <div className="col-12 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ justifyContent: 'center', textAlign: 'center' }} >
                <label className='m-1' style={{ fontSize: '1.1em' }} >
                  FICHE INDIVIDUELLE DE DECLARATION DES ENSEIGNEMENTS<br />
                  Voyage d'études ; stages ; mini-projet ; mémoire et Thèses ou obligations <br />
                  Année Univesitaire : {anne_univ} <br />
                  Mention :  {data.total.parc_libelle}
                </label>
              </div>
              <div className="col-12 sm:flex-column field my-0 flex lg:flex-row flex-column " >
                <label className='m-1 pl-5' style={{ fontSize: '1.1em' }} >
                  NOM : {prof.nomprof} <br />
                  Grade : 
                  {
                  data.total.prof_titre==='Monsieur'?' Mr':
                  data.total.prof_titre==='Madame'?' Mme':
                  data.total.prof_titre==='Professeur'?' Pr':
                  data.total.prof_titre==='Docteur'?' Dr':null
                  }
                </label>
              </div>
              <div className="col-12 flex-column " style={{ alignItems: 'center' }}>
                <table style={{ borderCollapse: 'collapse', width: '85.4857%', height: '130.653px' }} border="1">

                  <tbody>
                    <tr style={{ height: '19.5833px' }}>
                      <td style={{ height: '19.5833px' }}>P&eacute;riode</td>
                      <td style={{ height: '19.5833px' }}>Fili&egrave;re</td>
                      <td style={{ height: '39.1666px', textAlign: 'center' }} rowspan="2">Mati&egrave;res</td>
                      <td style={{ height: '19.5833px' }}>Type</td>
                      <td style={{ height: '19.5833px' }}>Horaire</td>
                      <td style={{ height: '19.5833px' }}>Volume</td>
                      <td style={{ height: '19.5833px' }} colspan="3">Nombre Groupes</td>
                      <td style={{ height: '19.5833px' }} colspan="3">Heures effectu&eacute;s</td>
                    </tr>
                    <tr style={{ height: '19.5833px' }}>
                      <td style={{ height: '19.5833px' }}>s&eacute;ances</td>
                      <td style={{ height: '19.5833px' }}>Niveau</td>
                      <td style={{ height: '19.5833px' }}>(ET, ED , EP)</td>
                      <td style={{ height: '19.5833px' }}>(jour/heure)</td>
                      <td style={{ height: '19.5833px' }}>en HA</td>
                      <td style={{ height: '19.5833px' }}>ET <label style={{ visibility: 'hidden' }}>(1)</label></td>
                      <td style={{ height: '19.5833px' }}>ED</td>
                      <td style={{ height: '19.5833px' }}>EP</td>
                      <td style={{ height: '19.5833px' }}>ET</td>
                      <td style={{ height: '19.5833px' }}>ED</td>
                      <td style={{ height: '19.5833px' }}>EP</td>
                    </tr>
                    {data.detail.map((detail, index) => (
                      <tr key={index} style={{ height: '22.1528px' }}>
                        <td style={{ height: '22.1528px' }}>&nbsp;</td>
                        <td style={{ height: '22.1528px' }}>{detail.abbr_niveau}</td>
                        <td style={{ height: '22.1528px' }}>{detail.mat_libelle}</td>
                        <td style={{ height: '22.1528px' }}>ET,&nbsp; ED({getResult(detail.nbgroup.count, data.group_tamby.diviser_td)}),&nbsp; EP({getResult(detail.nbgroup.count, data.group_tamby.diviser_tp)})</td>
                        <td style={{ height: '22.1528px' }}>&nbsp;</td>
                        <td style={{ height: '22.1528px', textAlign: 'right' }}>{detail.vheure}</td>
                        <td style={{ height: '22.1528px', textAlign: 'right' }}>{detail.base_et}</td>
                        <td style={{ height: '22.1528px', textAlign: 'right' }}>{detail.base_ed}</td>
                        <td style={{ height: '22.1528px', textAlign: 'right' }}>{detail.base_ep}</td>
                        <td style={{ height: '22.1528px', textAlign: 'right' }}>{detail.total_et}</td>
                        <td style={{ height: '22.1528px', textAlign: 'right' }}>{detail.total_ed}</td>
                        <td style={{ height: '22.1528px', textAlign: 'right' }}>{detail.total_ep}</td>
                      </tr>
                    ))}

                    <tr style={{ height: '19.5833px' }}>
                      <td style={{ height: '49.75px', borderLeft: '1px solid white', borderBottom: '1px solid white' }} colspan="4" rowspan="2">&nbsp;</td>
                      <td style={{ height: '19.5833px' }}>Total</td>
                      <td style={{ height: '19.5833px', textAlign: 'right' }}><strong>{data.total.tvheure}</strong></td>
                      <td style={{ height: '19.5833px', textAlign: 'right' }}><strong>{data.total.tbase_et}</strong></td>
                      <td style={{ height: '19.5833px', textAlign: 'right' }}><strong>{data.total.tbase_ed}</strong></td>
                      <td style={{ height: '19.5833px', textAlign: 'right' }}><strong>{data.total.tbase_ep}</strong></td>
                      <td style={{ height: '19.5833px', textAlign: 'right' }}><strong>{data.total.ttotal_et}</strong></td>
                      <td style={{ height: '19.5833px', textAlign: 'right' }}><strong>{data.total.ttotal_ed}</strong></td>
                      <td style={{ height: '19.5833px', textAlign: 'right' }}><strong>{data.total.ttotal_ep}</strong></td>
                    </tr>

                    <tr style={{ height: '20px' }}>
                      <td style={{ height: '20px' }}>Heures &agrave; declarer</td>
                      <td style={{ height: '20px', textAlign: 'right' }}><strong>{data.total.heuredeclare}</strong></td>
                      <td style={{ height: '20px' }}>&nbsp;</td>
                      <td style={{ height: '20px' }}>&nbsp;</td>
                      <td style={{ height: '20px' }}>&nbsp;</td>
                      <td style={{ height: '20px', textAlign: 'right' }}><strong>{data.total.ttotal_et}</strong></td>
                      <td style={{ height: '20px', textAlign: 'right' }}><strong>{data.total.ttotal_ed}</strong></td>
                      <td style={{ height: '20px', textAlign: 'right' }}><strong>{data.total.ttotal_ep}</strong></td>
                    </tr>

                  </tbody>
                </table>
              </div>
              <div className='col-12  flex flex-column'>
                <div className='col-12 pl-5 flex flex-column'>
                  <label style={{ fontSize: '1.1em' }}>
                    Arrêté la présente déclaration à : {manisyLettre(data.total.heuredeclare)} heures ({data.total.heuredeclare + 'h'}) d'enseignement effectuées dont : {manisyLettre(data.total.ttotal_et)} heures ({data.total.ttotal_et + 'h'}) d'ET
                    ,{manisyLettre(data.total.ttotal_ed)}
                    <br /> heures ({data.total.ttotal_ed + 'h'})
                    d'ED et {manisyLettre(data.total.ttotal_ep)} heures ({data.total.ttotal_ep + 'h'}) d'EP.
                  </label>
                </div>
                <div className='col-12 pl-5 flex flex-column'>
                  <center style={{ fontSize: '1.1em' }}>Fait a Fianarantsoa le,</center>
                </div>
                <div className='flex pl-5 flex-row justify-content-between'>
                  <label style={{ fontSize: '1.1em' }}>Le Responsable de Mention</label>
                </div>
              </div>
            </div>
            : <><TableauB setchargementDD={setchargementDD} parcours_={parcours_} anne_univ={anne_univ} prof={prof} changeTableau={changeTableau} url={props.url} /> </>
          }
        </BlockUI>
      </div>
    </div >
  )
}
