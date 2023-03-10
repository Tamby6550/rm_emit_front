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
import moment from 'moment/moment';

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
  const [data, setdata] = useState({
    total: {
      parc_libelle: "",
      ttotal_et: "",
      ttotal_ed: "",
      ttotal_ep: "",
      total_enga: "",
      total_ed_enga: "",
      heuredeclare: ""
    },
    detail: [
      {
        id_enga: "",
        nom_enga: "",
        nbre_etu: "",
        valeur: "",
        grad_id: "",
        date_engamnt1: "",
        date_engamnt2: "",
        prof_id: "",
        annee_univ: ""
      }
    ]
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
            notificationAction('warn', 'Votre token est expir?? !', 'D??lais de token 4 heures !')
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

  // const loadTitreTableau = async (rm_id, mention_nom, niveau, grad_id, anne_univ) => {
  //   await axios.get(props.url + `getTitreTableau/${rm_id}/${mention_nom}/${niveau}/${grad_id}/${anne_univ}`, {
  //     headers: {
  //       'Content-Type': 'text/html',
  //       'X-API-KEY': 'tamby',
  //       'Authorization': decrypt().token
  //     }
  //   })
  //     .then(
  //       (result) => {
  //         if (result.data.message == 'Token Time Expire.') {
  //           notificationAction('warn', 'Votre token est expir?? !', 'D??lais de token 4 heures !')
  //           setTimeout(() => {
  //             logout();
  //           }, 3000)
  //         }
  //         settitreAff({
  //           nbreClasse: result.data.nbreClasse.count,
  //           nom_mention: result.data.info.nom_mention,
  //           abbre_niveau: result.data.info.abbr_niveau,
  //           parcours: result.data.info.parc_libelle,
  //           groupe_td: result.data.group_tamby.td,
  //           groupe_tp: result.data.group_tamby.tp
  //         });
  //         //Affiche Somme Et Ed, Ep
  //         loadAfficheTableauSommeEtEdEp();
  //       }
  //     ).catch((e) => {
  //       // console.log(e.message)
  //       if (e.message == "Network Error") {
  //         props.urlip()
  //       }
  //     })
  // }
  const loadAfficheTableau = () => {
    setchargementDD(true);
    setTimeout(async () => {
      await axios.get(props.url + `getTableauAfficheTableauB/${anne_univ}/${decrypt().data.mention}/${prof.idprof}/${decrypt().data.grad_id}`, {
        headers: {
          'Content-Type': 'text/html',
          'X-API-KEY': 'tamby',
          'Authorization': decrypt().token
        }
      })
        .then(
          (result) => {
            if (result.data.message == 'Token Time Expire.') {
              notificationAction('warn', 'Votre token est expir?? !', 'D??lais de token 4 heures !')
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
                  N?? matricule
                </label>
                <div className='flex flex-column ml-5' >
                  <label style={{ fontSize: '1.1em', border: '1px solid grey' }} className='pl-3 pr-3' >Vacataire</label>
                </div>
              </div>
            </div>
            <div className="col-12 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ justifyContent: 'center', textAlign: 'center' }} >
              <label className='m-1' style={{ fontSize: '1em' }} >
                FICHE INDIVIDUELLE DE DECLARATION DES ENSEIGNEMENTS<br />
                Voyage d'??tudes ; stages ; mini-projet ; m??moire et Th??ses ou obligations <br />
                Ann??e Univesitaire : {anne_univ} <br />
                Mention :  {data.total.parc_libelle}
              </label>
            </div>
            <div className="col-12 sm:flex-column field my-0 flex lg:flex-row flex-column " >
              <label className='pl-5' style={{ fontSize: '1.1em' }} >
                NOM : {prof.nomprof} <br />
                Pr??nom : <br />
                Grade : Assistant
              </label>
            </div>

            <div className="col-12 flex flex-row justify-content-between">
              <div className='col-8 '>
                <table style={{ borderCollapse: 'collapse', width: '90.6961%', height: '330.254px' }} border="1">
                  <tbody>
                    <tr style={{ height: '19.5898px' }}>
                      <td style={{ height: '78.3398px', textAlign: 'left' }} rowspan="3">P&eacute;riode</td>
                      <td style={{ height: '19.5898px' }}>Objet</td>
                      <td style={{ height: '19.5898px' }}>Fili&egrave;re</td>
                      <td style={{ height: '78.3398px' }} rowspan="3">Nombre d'&eacute;tudiant ou groupes</td>
                      <td style={{ height: '58.75px' }} colspan="2" rowspan="2">Heure effectu&eacute;es</td>
                    </tr>
                    <tr style={{ height: '39.1602px' }}>
                      <td style={{ height: '39.1602px' }}>Nom de l'&eacute;tudiant et&nbsp;</td>
                      <td style={{ height: '39.1602px' }}>Ann&eacute;e d'&eacute;tude</td>
                    </tr>
                    <tr style={{ height: '19.5898px' }}>
                      <td style={{ height: '19.5898px' }} colspan="2">&nbsp;</td>
                      <td style={{ height: '19.5898px' }}>ED</td>
                      <td style={{ height: '19.5898px' }}>EP</td>
                    </tr>
                    <tr style={{ height: '19.5898px' }}>
                      <td style={{ height: '19.5898px' }}>&nbsp;</td>
                      <td style={{ height: '19.5898px' }}>&nbsp;</td>
                      <td style={{ height: '19.5898px' }}>&nbsp;</td>
                      <td style={{ height: '19.5898px' }}>&nbsp;</td>
                      <td style={{ height: '19.5898px' }}>&nbsp;</td>
                      <td style={{ height: '19.5898px' }}>&nbsp;</td>
                    </tr>


                    {data.detail.map((detail, index) => (
                      <tr style={{ height: '39.1602px' }} key={index}>
                        <td style={{ height: '39.1602px' }}>
                          {
                            detail.date_engamnt1 == null || detail.date_engamnt1 == '0' ? '' :
                              detail.date_engamnt2 == null || detail.date_engamnt2 == '0' ?
                                moment(detail.date_engamnt1).format('DD/MM/YYYY') :
                                <>
                              Du  <strong>{moment(detail.date_engamnt1).format('DD/MM/YYYY')}</strong>  au <strong>{moment(detail.date_engamnt2).format('DD/MM/YYYY')}</strong> 
                                </>
                          }
                        </td>
                        <td style={{ height: '39.1602px', textAlign: 'center' }}>{detail.nom_enga}</td>
                        <td style={{ height: '39.1602px' }}>&nbsp;</td>
                        <td style={{ height: '39.1602px', textAlign: 'center' }}>{detail.nbre_etu}</td>
                        <td style={{ height: '39.1602px', textAlign: 'center' }}>{detail.valeur}</td>
                        <td style={{ height: '39.1602px' }}>&nbsp;</td>
                      </tr>
                    ))}

                    <tr style={{ height: '19.5898px' }}>
                      <td style={{ height: '29.5898px' }} colspan="2" rowspan="2">&nbsp;</td>
                      <td style={{ height: '19.5898px' }} colspan="2">Total</td>
                      <td style={{ height: '19.5898px', textAlign: 'center' }}>{data.total.total_enga}</td>
                      <td style={{ height: '19.5898px' }}>&nbsp;</td>
                    </tr>
                    <tr style={{ height: '10px' }}>
                      <td style={{ height: '10px' }} colspan="2">Heures &agrave; declarer</td>
                      <td style={{ height: '10px' }}>&nbsp;</td>
                      <td style={{ height: '10px' }}>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='col-4 '>
                <table style={{ borderCollapse: 'collapse', width: '58.6961%', height: '330.254px' }} border="1">
                  <tbody>
                    <tr style={{ height: '0.5px' }}>
                      <td style={{ height: '38.3906px', textAlign: 'center' }} colspan="4" rowspan="2">RECAPITULATIF</td>
                    </tr>
                    <tr style={{ height: '37.8906px' }}></tr>
                    <tr style={{ height: '30.5469px' }}>
                      <td style={{ height: '30.5469px', textAlign: 'center' }} colspan="4">A compl&eacute;ter par l'administration</td>
                    </tr>
                    <tr style={{ height: '19.5938px' }}>
                      <td style={{ height: '19.5938px', textAlign: 'center' }} colspan="4">&nbsp;</td>
                    </tr>
                    <tr style={{ height: '26.4844px' }}>
                      <td style={{ height: '26.4844px', textAlign: 'center' }}>Selon</td>
                      <td style={{ height: '57.9688px', textAlign: 'right' }} rowspan="2">{data.total.ttotal_et}</td>
                      <td style={{ height: '57.9688px', textAlign: 'right' }} rowspan="2">{data.total.ttotal_ed}</td>
                      <td style={{ height: '57.9688px', textAlign: 'right' }} rowspan="2">{data.total.ttotal_ep}</td>
                    </tr>
                    <tr style={{ height: '31.4844px' }}>
                      <td style={{ height: '31.4844px', textAlign: 'center' }}>Tableau A</td>
                    </tr>
                    <tr style={{ height: '21.1719px' }}>
                      <td style={{ height: '21.1719px', textAlign: 'center' }}>Selon&nbsp;</td>
                      <td style={{ height: '42.6563px' }} rowspan="2">&nbsp;</td>
                      <td style={{ height: '42.6563px', textAlign: 'right' }} rowspan="2">{data.total.total_enga}</td>
                      <td style={{ height: '42.6563px' }} rowspan="2">&nbsp;</td>
                    </tr>
                    <tr style={{ height: '21.4844px' }}>
                      <td style={{ textAlign: 'center', height: '21.4844px' }}>Tableau B</td>
                    </tr>
                    <tr style={{ height: '19.5938px' }}>
                      <td style={{ height: '19.5938px', textAlign: 'center' }}>TOTAL</td>
                      <td style={{ height: '19.5938px', textAlign: 'right' }}>{data.total.ttotal_et}</td>
                      <td style={{ height: '19.5938px', textAlign: 'right' }}>{data.total.total_ed_enga}</td>
                      <td style={{ height: '19.5938px', textAlign: 'right' }}>{data.total.ttotal_ep}</td>
                    </tr>
                    <tr style={{ height: '19.5938px' }}>
                      <td style={{ height: '19.5938px', textAlign: 'left' }}>OBLIGATION</td>
                      <td style={{ height: '19.5938px' }}>&nbsp;</td>
                      <td style={{ height: '19.5938px' }}>&nbsp;</td>
                      <td style={{ height: '19.5938px' }}>&nbsp;</td>
                    </tr>
                    <tr style={{ height: '27.5469px' }}>
                      <td style={{ height: '27.5469px' }}>Heures de</td>
                      <td style={{ height: '27.5469px', textAlign: 'right' }}>30</td>
                      <td style={{ height: '27.5469px', textAlign: 'right' }}>{data.total.total_ed_enga}</td>
                      <td style={{ height: '27.5469px', textAlign: 'right' }}>60</td>
                    </tr>
                    <tr style={{ height: '29.5469px' }}>
                      <td style={{ textAlign: 'center', height: '29.5469px' }} colspan="4">254 heures en ED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            <div className='col-12  flex flex-column'>
              <div className='col-12 pl-5 flex flex-column'>
                <label style={{ fontSize: '1.1em' }}>
                  Arr??t?? la pr??sente de d??claration ?? : {manisyLettre(data.total.heuredeclare)} heures ({data.total.heuredeclare + 'h'}) d'enseignement effectu??es dont : {manisyLettre(data.total.ttotal_et)} heures ({data.total.ttotal_et + 'h'}) d'ET
                  ,{manisyLettre(data.total.total_ed_enga)}
                  <br /> heures ({data.total.total_ed_enga + 'h'})
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
      </div >
    </div >
  )
}
