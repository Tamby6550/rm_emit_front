import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import InsertionProff from './Proffesseur/InsertionProff'
import ModificationProff from './Proffesseur/ModificationProff'
import Recherche from './Proffesseur/Recherche'
import axios from 'axios';
import { Toast } from 'primereact/toast';


export default function Proffesseur(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listProff, setlistProff] = useState([{ nom_prof: '', cat_prof: ''}]);
    const [infoMention, setinfoMention] = useState({ id_mention: '', nom_mention: '', libmention: '', parcours: '', libparcours: ''});
    const onVideInfo = () => {
        setinfoMention({ id_mention: '', nom_mention: '', libmention: '', parcours: '', libparcours: ''});
    }
    const [totalenrg, settotalenrg] = useState(null)

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };
    const stylebtnVoir = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#0c7a0f', border: '1px solid #0c7a0f'
    };

    /**Style css */

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }


    //Get List client
    const loadData = async () => {
        try {     
            await axios.get(props.url + `getProff`, {
                headers: {
                    'Content-Type': 'text/html',
                    'X-API-KEY':'tamby'
                }
            })
                .then(
                    (result) => {
                        onVideInfo();
                        setrefreshData(0);
                        setlistProff(result.data);
                        setCharge(false);
                    }
                );
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setCharge(true);
        // setlistProff([{ stat: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 500)
    }, [refreshData]);

    const header = (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0 flex  py-2'>
                <InsertionProff url={props.url} setrefreshData={setrefreshData} />
                <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} setlistProff={setlistProff} setrefreshData={setrefreshData} url={props.url}  />
            </div>
             <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
               
        </div>
    )

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-around align-items-center m-0 '>
                    <ModificationProff data={data} url={props.url} setrefreshData={setrefreshData}   />
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-2 ' style={stylebtnDetele} tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
                        onClick={() => {
                            const accept = () => {
                                axios.delete(props.url + `supprimerProff/${data.id_prof}`, {
                                    headers: {
                                        "Content-Type": "application/json; charset=utf-8",
                                        "X-API-KEY":"tamby"
                                    },
                                }) 
                                    .then(res => {
                                        notificationAction(res.data.etat, res.data.status, res.data.message);
                                       if (res.data.etat=='info') {
                                           setrefreshData(1)
                                       }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        notificationAction(err.data.etat, 'Suppression', err.data.message);
                                    })
                            }
                            const reject = () => {
                                return null;
                            }
                            confirmDialog({
                                message: 'Voulez vous supprimer Parcours : ' + data.nom_prof,
                                header: 'Suppression  ',
                                icon: 'pi pi-exclamation-circle',
                                acceptClassName: 'p-button-danger',
                                acceptLabel: 'Ok',
                                rejectLabel: 'Annuler',
                                accept,
                                reject
                            });
                        }} />
                        <Button icon={PrimeIcons.EYE} className='p-buttom-sm p-2  ml-3' style={stylebtnVoir} tooltip='Voir' tooltipOptions={{ position: 'top' }} />
            </div>
        )
    }
    const bodyMention = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                   <label htmlFor="">{data.nom_mention+'('+data.abbrmention+')'}</label>
                </div>
            </div>
        )
    }
    const bodyParcours = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                   <label htmlFor="">{data.nom_parcours+'('+data.abbrparcours+')'}</label>
                </div>
            </div>
        )
    }

    return (
        <>
            <Toast ref={toastTR} position="top-right" />
            <ConfirmDialog />

            <center>
            {/* <DataTable header={header} value={listClasse} autoLayout={true}  loading={charge} className='bg-white' emptyMessage={'Aucun resultat trouvé'}> */}

                <DataTable header={header} value={listProff}      loading={charge}  emptyMessage={'Aucun resultat trouvé'}>
                    <Column field='nom_prof' header="Nom"  >  </Column>
                    <Column body='cat_prof' header="Catégorie"  ></Column>
                    <Column header="action" body={bodyBoutton} align={'left'}   style={{width:'90px'}}></Column>
                </DataTable>
            </center>
        </>
    )
}
