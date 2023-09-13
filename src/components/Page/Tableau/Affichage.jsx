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

import { NumberToLetter } from 'convertir-nombre-lettre';
export default function Affichage(props) {
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

    const [niveau, setniveau] = useState('0');
    const [selectniveau, setselectniveau] = useState(null);

    const [parcours_, setparcours_] = useState('0');
    const [selectparcours_, setselectparcours_] = useState(null);


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
    const [data, setdata] = useState([{
        semestre: "Semestre 0",
        seme_id: "",
        details: [
            {
                mati_id: "",
                mat_libelle: "",
                semestre: "",
                nom_prof: "",
                vheure: "",
                credit: "",
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
            }],
        nombreM: 2,
        total: {
            tvheure: "0",
            tcredit: "0",
            tbase_et: "0",
            ttotal_et: "0",
            ttotal_ed: "0",
            ttotal_ep: "0"
        }
    }]);
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
    }, []);
    
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
                    setselectanne(result.data)
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
        console.log(rm_id,mention_nom,niveau,grad_id,anne_univ);
        await axios.get(props.url + `getTitreTableau/${parcours_}/${rm_id}/${mention_nom}/${niveau}/${grad_id}/${anne_univ}`, {
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
                //    console.log(result.data)
                    diviserNbGroupe(result.data.nbreClasse.count,result.data.group_tamby.diviser_td,result.data.group_tamby.diviser_tp,result);
                    //Affiche Somme Et Ed, Ep
                    loadAfficheTableauSommeEtEdEp();
                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
                setchargementDD(false);
            })
    }
    const loadAfficheTableau = async () => {
        // console.log({
        //     ann:anne_univ,
        //     mention:decrypt().data.mention,
        //     niveau:niveau
        // })
        setchargementDD(true);
        await axios.get(props.url + `getTableauAffiche/${parcours_}/${anne_univ}/${decrypt().data.mention}/${niveau}/${decrypt().data.rm_id}`, {
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
                    setdata(result.data);
                    console.log(result.data)

                    //Affiche titre tableau d'affichage
                    loadTitreTableau(decrypt().data.rm_id, decrypt().data.mention, niveau, decrypt().data.grad_id, anne_univ);

                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
                setchargementDD(false);
            })
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
                    console.log(result.data);
                    setchargementDD(false);
                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
                setchargementDD(false);

            })
    }

    useEffect(() => {
        anne_univDt()
    }, [props.url]);


    // Manao Lettre anle heure
    function manisyLettre(nb) {
        let intNb=parseInt(nb);
        let ren = NumberToLetter(intNb);
        
       return ren.charAt(0).toUpperCase() + ren.slice(1);
    }
    //Calcul ED
    function calculEd(et,ed,ep) {
        let etn=parseInt(et);
        let epn=parseInt(ep);
        let edn=parseInt(ed);
       
        let convet=(etn*5)/3;
        let convep=epn/2;

        let total=convet+convep +edn;
        
       return total.toFixed(0);
    }

    function getResult(num, denom) {
        const result = num / denom;
        if (result % 1 !== 0) {
            return Math.ceil(result);
        }
        return result;
    }

    function diviserNbGroupe(nbreEtud, div_td, div_tp,resultat) {
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
                    <h4 htmlFor="username2" className="m-1">Niveau  :</h4>
                    <Dropdown value={niveau} options={selectniveau} onChange={onTypesChangeNiveau} name="etat" />
                </div>
                <div className="lgcol-8 md:col-5  md:flex-column   sm:col-3 sm:flex-column field my-0 flex lg:flex-row flex-column">
                    <h4 htmlFor="username2" className="m-1">Parcours  :</h4>
                    <Dropdown value={parcours_} options={selectparcours_} onChange={onTypesChangeParcours_} name="etat" />
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
                    <div className='grid h-full ' id='imprimable'  >
                        <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-coluln flex-column " style={{ alignItems: 'center' }}>
                            <div className='flex flex-column '>
                                <center>
                                    <h3 className='m-1'>UNIVERSITE DE FIANARANTSOA <br /> EMIT</h3>
                                </center>
                                <h4 className='m-1'>MENTION : {titreAff.nom_mention}</h4>
                                <h4 className='m-1'>Parcours : {titreAff.parcours}</h4>
                                <h4 className='m-1'>Classe : {titreAff.abbre_niveau}</h4>
                                <h4 className='m-1'>Nombre d'étudiants : {titreAff.nbreClasse}</h4>
                            </div>
                            <label style={{ borderBottom: '1px solid black', height: '10px', width: '100%' }} ></label>
                        </div>
                        <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ alignItems: 'center' }}>
                            <h4>LISTE DES DISCIPLINES ENSEIGNEES</h4>
                        </div>
                        <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ alignItems: 'center' }}>
                            <div className='flex flex-column'>
                                <label htmlFor="">Année Universitaire : {anne_univ}</label>
                                <div className='flex flex-column ml-5' style={{ width: '100%' }}>
                                    <label style={{ fontSize: '1.1em', border: '1px solid grey' }} className='p-1 pr-5' >Nombre de Groupe de TD : {titreAff.groupe_td}</label>
                                    <label style={{ fontSize: '1.1em', border: '1px solid grey' }} className='p-1 pr-5' >Nombre de Groupe de TP : {titreAff.groupe_tp}</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 flex-column " style={{ alignItems: 'center' }}>

                            <table style={{ borderCollapse: 'collapse', width: '100%', height: '101.625px' }} border="1">

                                {data.map((obj, index) => (
                                    <tbody>
                                        <tr style={{ height: '19.5833px' }}>
                                            <td style={{ height: '82.0416px', fontWeight: '600', textTransform: 'uppercase' }} rowspan={'40'}>
                                                {/* {obj.semestre}  */}
                                                SEMESTRE
                                                </td>
                                            <td style={{ height: '40.0208px', textAlign: 'center' }} rowspan="2">ELEMENTS CONSTITUTIFS(EC)</td>
                                            <td style={{ height: '19.5833px' }}>&nbsp;</td>
                                            <td style={{ height: '19.5833px', textAlign: 'center' }} colspan="4">ET</td>
                                            <td style={{ height: '19.5833px', textAlign: 'center' }} colspan="3">ED</td>
                                            <td style={{ height: '19.5833px', textAlign: 'center' }} colspan="3">EP</td>
                                            <td style={{ height: '19.5833px', borderTop: '1px solid white', borderRight: '1px solid white' }}>&nbsp;</td>
                                        </tr>
                                        <tr style={{ height: '20.4375px' }}>
                                            <td style={{ height: '20.4375px' }}>Cr&eacute;dits</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>VH</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>BASE</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>GROUP</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>TOTAL</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>BASE</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>GROUP</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>TOTAL</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>BASE</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>GROUP</td>
                                            <td style={{ height: '20.4375px', textAlign: 'center' }}>TOTAL</td>
                                            <td style={{ height: '20.4375px', textAlign: 'left' }}>&nbsp;</td>
                                        </tr>
                                        {obj.details.map((detail, index) => (

                                            <tr style={{ height: '22.4375px' }}>
                                                <td style={{ height: '22.4375px' }}>{detail.mat_libelle}</td>
                                                <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.credit}</td>
                                                <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.vheure}</td>

                                                <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.base_et}</td>
                                                <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.group_et}</td>
                                                <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.total_et}</td>

                                                <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.base_ed}</td>
                                                <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.group_ed}</td>
                                                <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.total_ed}</td>
                                                {detail.base_ep == '0' ?
                                                    <>
                                                        <td style={{ height: '22.4375px', textAlign: 'center' }}></td>
                                                        <td style={{ height: '22.4375px', textAlign: 'center' }}></td>
                                                        <td style={{ height: '22.4375px', textAlign: 'center' }}></td>
                                                        <td style={{ height: '22.4375px', textAlign: 'left' }}>{detail.nom_prof}</td>
                                                    </>
                                                    :
                                                    <>
                                                        <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.base_ep}</td>
                                                        <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.group_ep}</td>
                                                        <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.total_ep}</td>
                                                        <td style={{ height: '22.4375px', textAlign: 'left' }}>{detail.nom_prof}</td>
                                                    </>
                                                }
                                            </tr>

                                        ))}




                                        <tr style={{ height: '19.5833px' }}>
                                            <td style={{ height: '19.5833px', textAlign: 'center' }} colspan="0">TOTAL</td>
                                            <td style={{ height: '19.5833px', textAlign: 'center' }}><strong>{obj.total.tcredit}</strong></td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}><strong>{obj.total.tvheure}</strong></td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}><strong>{obj.total.tbase_et}</strong></td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}>&nbsp;</td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}><strong>{obj.total.ttotal_et}</strong></td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}>&nbsp;</td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}>&nbsp;</td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}><strong>{obj.total.ttotal_ed}</strong></td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}>&nbsp;</td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}>&nbsp;</td>
                                            <td style={{ textAlign: 'center', height: '19.5833px' }}><strong>{obj.total.ttotal_ep}</strong></td>
                                            <td style={{ height: '19.5833px', borderBottom: '1px solid white', borderRight: '1px solid white' }}>&nbsp;</td>
                                        </tr>

                                    </tbody>
                                ))}
                                <tr>
                                    <td style={{ textAlign: 'center', borderBottom: '1px solid white', borderLeft: '1px solid white' }} colspan="6"></td>
                                    <td style={{ textAlign: 'center' }}><strong>{totalT.ttotal_et}</strong></td>
                                    <td style={{ textAlign: 'center', borderBottom: '1px solid white' }} colspan="2">&nbsp;</td>
                                    <td style={{ textAlign: 'center' }}><strong>{totalT.ttotal_ed}</strong></td>
                                    <td style={{ textAlign: 'center', borderBottom: '1px solid white' }} colspan="2">&nbsp;</td>
                                    <td style={{ textAlign: 'center' }}><strong>{totalT.ttotal_ep}</strong></td>
                                    <td style={{ borderBottom: '1px solid white', borderRight: '1px solid white' }} >&nbsp;</td>
                                </tr>

                            </table>
                        </div>
                        <div className='col-12  flex flex-column'>
                            <div className='col-12 pl-5 flex flex-column'>
                                <label style={{ fontSize: '1.1em' }} >{manisyLettre(totalT.ttotal_et)+' heures'}  ({totalT.ttotal_et + 'h'}) en enseignement théorique</label>
                                <label style={{ fontSize: '1.1em' }}>{manisyLettre(totalT.ttotal_ed)+' heures'}  ({totalT.ttotal_ed + 'h'}) en enseignement dirigé</label>
                                <label style={{ fontSize: '1.1em' }}>{manisyLettre(totalT.ttotal_ep)+' heures'}  ({totalT.ttotal_ep + 'h'}) en enseignement pratique</label>
                                <label style={{ fontSize: '1.1em', paddingLeft: '120px', fontWeight: '700' }}>{manisyLettre(calculEd(totalT.ttotal_et,totalT.ttotal_ed,totalT.ttotal_ep))+' heures'} ({calculEd(totalT.ttotal_et,totalT.ttotal_ed,totalT.ttotal_ep) + 'h'}) en enseignement théorique</label>
                                <center style={{ fontSize: '1.1em' }}>Fait a Fianarantsoa le,</center>
                            </div>
                            <div className='flex pl-5 flex-row justify-content-between'>
                                <label style={{ fontSize: '1.1em', fontWeight: '700' }}>Le Chef de Mention</label>
                                <label style={{ fontSize: '1.1em', paddingRight: '100px', fontWeight: '700' }}>Le Directeur</label>

                            </div>

                        </div>
                    </div>
                </BlockUI>
            </div>
        </div >
    )
}
