import React, { useState, useEffect, useRef } from 'react'
import ReactToPrint from 'react-to-print'
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import useAuth from '../../Login/useAuth';
import { decrypt } from '../ConfigGlobal/Configuration';

export default function Tableau1(props) {
    const { logout } = useAuth();

    const [chargementDD, setchargementDD] = useState(false);
    const [anne_univ, setanne_univ] = useState('0000-0000');
    const [selectanne, setselectanne] = useState(null);

    const [parcours_, setparcours_] = useState('0');
    const [selectparcours_, setselectparcours_] = useState(null);

    const [datasemtab1, setdatasemtab1] = useState([
        {
            nomclasse: 'L1',
            details: [
                {
                    nomsemestre: 'S1',
                    et: '115',
                    ed: '152',
                    ep: '241',
                },
                {
                    nomsemestre: 'S2',
                    et: '205',
                    ed: '153',
                    ep: '214',
                },

            ]
        },
        {
            nomclasse: 'L2',
            details: [
                {
                    nomsemestre: 'S1',
                    et: '115',
                    ed: '152',
                    ep: '241',
                },
                {
                    nomsemestre: 'S2',
                    et: '205',
                    ed: '153',
                    ep: '214',
                },

            ]
        },
        {
            nomclasse: 'L3',
            details: [
                {
                    nomsemestre: 'S1',
                    et: '115',
                    ed: '152',
                    ep: '241',
                },
                {
                    nomsemestre: 'S2',
                    et: '205',
                    ed: '153',
                    ep: '214',
                },

            ]
        },
    ])

    const [datatravauxtab2, setdatatravauxtab2] = useState(
        [
            {
                nomclasse: 'L1',
                details:
                    [
                        {
                            travail: 'Voyage d\'etude',
                            et: '0',
                            ed: '1420',
                            ep: '0',
                        },
                        {
                            travail: 'ENCADREMENT',
                            et: '0',
                            ed: '1420',
                            ep: '0',
                        },
                        {
                            travail: 'SOUTENNANCE',
                            et: '0',
                            ed: '1420',
                            ep: '0',
                        },
                    ]
            },
            {
                nomclasse: 'L2',
                details:
                    [
                        {
                            travail: 'ENCADREMENT',
                            et: '0',
                            ed: '1420',
                            ep: '0',
                        },
                        {
                            travail: 'SOUTENNANCE',
                            et: '0',
                            ed: '1420',
                            ep: '0',
                        },
                    ]
            },
            // {
            //     nomclasse: 'L2',
            //     details:
            //         [
            //             {
            //                 travail: 'Voyage d\'etude',
            //                 et: '0',
            //                 ed: '1420',
            //                 ep: '0',
            //             },
            //             {
            //                 travail: 'ENCADREMENT',
            //                 et: '0',
            //                 ed: '1420',
            //                 ep: '0',
            //             },
            //             {
            //                 travail: 'SOUTENNANCE',
            //                 et: '0',
            //                 ed: '1420',
            //                 ep: '0',
            //             },
            //             {
            //                 travail: 'Voyage d\'etude',
            //                 et: '0',
            //                 ed: '1420',
            //                 ep: '0',
            //             },

            //         ]
            // },
        ]
    )
    const onTypesChange = (e) => {
        setanne_univ(e.value);
    }

    const onTypesChangeParcours_ = (e) => {
        setparcours_(e.value);
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
                        notificationAction('warn', 'Votre token est expiré !', 'Délais de token 4 heures !')
                        setTimeout(() => {
                            logout();
                        }, 3000)
                    }
                    setselectanne(result.data);
                    setselectparcours_(decrypt().data.parcours_);
                }
            ).catch((e) => {
                if (e.message == "Network Error") {
                    props.urlip()
                }
            })
    }
    const getTableau1 = async ()=>{
        setchargementDD(true)
        await axios.get(props.url + `gettableau1/${anne_univ}/${decrypt().data.mention}/${parcours_}`, {
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
                    setdatasemtab1(result.data);
                    setTimeout(() => {
                        getTableau2();
                    }, 800)
                   
                }
            ).catch((e) => {
                if (e.message == "Network Error") {
                    props.urlip()
                }
            })
    }
    const getTableau2 = async ()=>{
        await axios.get(props.url + `gettableau2/${anne_univ}/${decrypt().data.mention}/${parcours_}`, {
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
                    setdatatravauxtab2(result.data);
                    setchargementDD(false)
                   
                }
            ).catch((e) => {
                if (e.message == "Network Error") {
                    props.urlip()
                }
            })
    }

    useEffect(() => {
        anne_univDt()
    }, [props.url]);

    



    return (
        <div className='content'>
            <Toast ref={toastTR} position="top-right" />
            <div className='flex lg:flex-row lg:col-6 md:col-7 md:flex-row sm:flex-row flex-column align-items-end'>
                <div className="lgcol-4 md:col-4   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-column flex-column ">
                    <h4 htmlFor="username2" className="m-1">Anne univ :</h4>
                    <Dropdown value={anne_univ} options={selectanne} onChange={onTypesChange} name="etat" />
                </div>
                <div className="lgcol-4 md:col-4   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-column flex-column">
                    <h4 htmlFor="username2" className="m-1">Parcours  :</h4>
                    <Dropdown value={parcours_} options={selectparcours_} onChange={onTypesChangeParcours_} name="etat" />
                </div>
                <div className="lgcol-4 md:col-4   md:flex-column  sm:col-3 sm:flex-column field my-0 flex lg:flex-column flex-column">
                    <Button icon={PrimeIcons.EYE} className='p-button-sm p-button-success' label={'Afficher'}
                        onClick={() => {
                            getTableau1();
                        }}
                    />
                </div>
            </div>

            <hr />
            <center className='mb-2'>
                <ReactToPrint trigger={() =>
                    <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-3 ' label={'Imprimer'} />
                } content={() => document.getElementById("imprimable")} />
            </center>
            <div className='col-12' style={{ border: '1px solid grey' }}>
                <BlockUI blocked={chargementDD} template={<ProgressSpinner />}>
                    <div className='grid h-full ' id='imprimable'  >

                        <table title='Tableau A' className='pt-5' style={{ borderCollapse: 'collapse', width: '79.3148%', height: '156.75px', marginLeft: 'auto', marginRight: 'auto' }} border={1}><colgroup><col style={{ width: '14.8783%' }} /><col style={{ width: '12.9847%' }} /><col style={{ width: '13.0748%' }} /><col style={{ width: '18.936%' }} /><col style={{ width: '14.9684%' }} /><col style={{ width: '12.7142%' }} /><col style={{ width: '12.4436%' }} /></colgroup>
                            <h3>TABLEAU A</h3>
                            <tbody>
                                <tr style={{ height: '19.5938px' }}>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}>&nbsp;</td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>MENTION</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>NIVEAU</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>SEMESTRE</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>ET</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>ED</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>EP</strong></td>
                                </tr>
                                <tr >
                                    <td style={{ height: '117.563px', textAlign: 'center' }} rowSpan={datasemtab1.length + 8}>TABLEAU A { } </td>
                                    <td style={{ height: '117.563px', textAlign: 'center' }} rowSpan={datasemtab1.length + 8}>RPM</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                </tr>

                                {datasemtab1.map((elm, i) => (
                                    <>
                                        <tr >
                                            <td style={{ height: '39.1876px', textAlign: 'center' }} rowSpan={elm.details.length + 1}>{elm.nomclasse}</td>

                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                        </tr>
                                        {elm.details.map((details, i) => (
                                            <tr style={{ height: '19.5938px' }} key={i}>
                                                <td style={{ height: '19.5938px', textAlign: 'center' }} >{details.nomsemestre}</td>
                                                <td style={{ height: '19.5938px', textAlign: 'right' }}>{details.et}</td>
                                                <td style={{ height: '19.5938px', textAlign: 'right' }}>{details.ed}</td>
                                                <td style={{ height: '19.5938px', textAlign: 'right' }}>{details.ep}</td>
                                            </tr>
                                        ))}
                                    </>
                                ))}
                                <tr style={{ height: '19.5938px' }}>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }} colSpan={2}><strong>TOTAL TABLEAU A</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'right' }}><strong>982</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'right' }}><strong>11096</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'right' }}><strong>6224</strong></td>
                                </tr>
                            </tbody>
                        </table>

                        <table title='Tableau B' style={{ marginTop:'38px',borderCollapse: 'collapse', width: '79.1732%', height: '185.969px', marginLeft: 'auto', marginRight: 'auto' }} border={1}><colgroup><col style={{ width: '14.9041%' }} /><col style={{ width: '12.981%' }} /><col style={{ width: '13.0771%' }} /><col style={{ width: '18.9426%' }} /><col style={{ width: '15.0002%' }} /><col style={{ width: '12.6925%' }} /><col style={{ width: '12.404%' }} /></colgroup>
                                <h3 >TABLEAU B</h3>
                            <tbody>
                                <tr style={{ height: '19.5938px' }}>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}>&nbsp;</td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>MENTION</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>NIVEAU</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>TRAVAUX</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>ET</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>ED</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }}><strong>EP</strong></td>
                                </tr>
                                <tr >
                                    <td style={{ height: '146.782px', textAlign: 'center' }} rowSpan={14}>TABLEAU B</td>
                                    <td style={{ height: '146.782px', textAlign: 'center' }} rowSpan={14}>RPM</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                    <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>

                                </tr>

                                {datatravauxtab2.map((elm, i) => (
                                    <>
                                        <tr style={{ height: '0px' }} >
                                            <td style={{ height: '39.1876px', textAlign: 'center' }} rowSpan={elm.details.length + 1}>{elm.nomclasse}</td>
                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                            <td style={{ height: '1px', textAlign: 'center', display: 'none' }}>&nbsp;</td>
                                        </tr>
                                        {elm.details.map((elm1, id) => (
                                            <tr style={{ height: '19.5938px' }} key={id}  >
                                                <td style={{ height: '19.5938px', textAlign: 'center' }}>{elm1.travail}</td>
                                                <td style={{ height: '19.5938px', textAlign: 'right' }}>{elm1.et === 0 ? '' : elm1.et}</td>
                                                <td style={{ height: '19.5938px', textAlign: 'right' }}>{elm1.ed === 0 ? '' : elm1.ed}</td>
                                                <td style={{ height: '19.5938px', textAlign: 'right' }}>{elm1.ep === 0 ? '' : elm1.ep}</td>
                                            </tr>
                                        ))}

                                    </>
                                ))}
                                <tr style={{ height: '19.5938px' }}>
                                    <td style={{ height: '19.5938px', textAlign: 'center' }} colSpan={2}><strong>TOTAL TABLEAU B</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'right' }}>&nbsp;</td>
                                    <td style={{ height: '19.5938px', textAlign: 'right' }}><strong>4968</strong></td>
                                    <td style={{ height: '19.5938px', textAlign: 'right' }}>&nbsp;</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </BlockUI>
            </div>
        </div >
    )
}
