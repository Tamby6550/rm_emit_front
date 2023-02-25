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

    const [chargementDD, setchargementDD] = useState(false);
    const [titreAff, settitreAff] = useState({
        nbreClasse:'',
        groupe_td:'',
        groupe_tp:'',
        nom_mention:'',
        parcours:'',
        abbre_niveau:'',
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
        nombreM:2,
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

    const loadTitreTableau = async (rm_id, mention_nom, niveau,grad_id,anne_univ) => {
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
                        nbreClasse:result.data.nbreClasse.count,
                        nom_mention:result.data.info.nom_mention,
                        abbre_niveau:result.data.info.abbr_niveau,
                        parcours:result.data.info.parc_libelle,
                        groupe_td:result.data.group_tamby.td,
                        groupe_tp:result.data.group_tamby.tp
                    });
                    setchargementDD(false);
                }
            ).catch((e) => {
                // console.log(e.message)
                if (e.message == "Network Error") {
                    props.urlip()
                }
            })
    }
    const loadAfficheTableau = async () => {
        // console.log({
        //     ann:anne_univ,
        //     mention:decrypt().data.mention,
        //     niveau:niveau
        // })
        setchargementDD(true);
        await axios.get(props.url + `getTableauAffiche/${anne_univ}/${decrypt().data.mention}/${niveau}/${decrypt().data.rm_id}`, {
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
                    loadTitreTableau(decrypt().data.rm_id,decrypt().data.mention,niveau,decrypt().data.grad_id,anne_univ);
                    
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
                    <Button icon={PrimeIcons.LIST} className='p-button-sm p-button-success ml-3 ' label={'Afficher'}
                        onClick={() => {
                            loadAfficheTableau();
                        }}
                    />
                </div>
            </div>
            <hr />
            <center>
                <ReactToPrint trigger={() =>
                    <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-3 ' label={'Imprimer'} />
                } content={() => document.getElementById("imprimable")} />
            </center>
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
                            <label htmlFor="">Année Universitaire : 2017-2018</label>
                            <div className='flex flex-column ml-5' style={{ width: '100%' }}>
                                <label style={{ fontSize: '1.1em', border: '1px solid grey' }} className='p-1 pr-5' >Nombre de Groupe de TD : {titreAff.groupe_td}</label>
                                <label style={{ fontSize: '1.1em', border: '1px solid grey' }} className='p-1 pr-5' >Nombre de Groupe de TP : {titreAff.groupe_tp}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 flex-column " style={{ alignItems: 'center' }}>
                        <label className='pl-5' >(S5 et S6) : Parcours Communication Multimedia</label>
                        <table style={{ borderCollapse: 'collapse', width: '100%', height: '101.625px' }} border="1">
                            {/* <colgroup><col style="width: 10.0245%;"><col style="width: 18.5506%;"><col style="width: 3.46209%;"><col style="width: 3.51376%;"><col style="width: 3.6171%;"><col style="width: 4.23718%;"><col style="width: 4.23718%;"><col style="width: 3.92714%;"><col style="width: 3.97881%;"><col style="width: 3.8238%;"><col style="width: 3.8238%;"><col style="width: 4.44387%;"><col style="width: 4.49554%;"><col style="width: 27.8517%;"></colgroup> */}
                            {data.map((obj, index) => (
                                <tbody>
                                    <tr style={{ height: '19.5833px' }}>
                                        <td style={{ height: '82.0416px' }} rowspan={'18'}>{obj.semestre} </td>
                                        <td style={{ height: '40.0208px', textAlign: 'center' }} rowspan="2">ELEMENTS CONSTITUTIFS(EC)</td>
                                        <td style={{ height: '19.5833px' }}>&nbsp;</td>
                                        <td style={{ height: '19.5833px', textAlign: 'center' }} colspan="4">ET</td>
                                        <td style={{ height: '19.5833px', textAlign: 'center' }} colspan="3">ED</td>
                                        <td style={{ height: '19.5833px', textAlign: 'center' }} colspan="3">EP</td>
                                        <td style={{ height: '19.5833px' }}>&nbsp;</td>
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

                                            <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.base_ep}</td>
                                            <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.group_ep}</td>
                                            <td style={{ height: '22.4375px', textAlign: 'center' }}>{detail.total_ep}</td>
                                            <td style={{ height: '22.4375px', textAlign: 'left' }}>{detail.nom_prof}</td>
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
                                        <td style={{ height: '19.5833px' }}>&nbsp;</td>
                                    </tr>
                                </tbody>
                            ))}

                        </table>
                    </div>
                </div>
            </BlockUI>
        </div >
    )
}
