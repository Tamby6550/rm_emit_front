import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import InsertionParcours from './Mention/InsertionParcours'
import InsertionMention from './Mention/InsertionMention'
import ModificationParcours from './Mention/ModificationParcours'
import Recherche from './Mention/Recherche'
import axios from 'axios';
import { Toast } from 'primereact/toast';


export default function Mention(props) {

    //Chargement de données
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);
    const [listMention, setlistMention] = useState([{ nom_mention: '', abbrmention: '', nom_parcours: '', abbrparcours: ''}]);
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

    /**Style css */

    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }


    //Get List client
    const loadData = async () => {
        await axios.get(props.url + `getMentionParcours`)
            .then(
                (result) => {
                    onVideInfo();
                    setrefreshData(0);
                    setlistMention(result.data);
                    setCharge(false);
                }
            );
    }

    useEffect(() => {
        setCharge(true);
        // setlistMention([{ stat: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 500)
    }, [refreshData]);

    const header = (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0 flex  py-2'>
                <InsertionMention url={props.url}  />
                <InsertionParcours url={props.url} setrefreshData={setrefreshData} />
                <Recherche icon={PrimeIcons.SEARCH} setCharge={setCharge} setlistMention={setlistMention} setrefreshData={setrefreshData} url={props.url} infoMention={infoMention} setinfoMention={setinfoMention} />
            </div>
            {infoMention.id_mention != "" || infoMention.nom != "" ? <Button icon={PrimeIcons.REFRESH} className='p-buttom-sm p-1 p-button-warning ' tooltip='actualiser' tooltipOptions={{ position: 'top' }} onClick={() => setrefreshData(1)} />
                :
                <>
                    <label >Liste des Clients (nb : 10)</label>
                    <label className='ml-5 mt-1'>Total enregistrement : {totalenrg - 1}  </label>
                </>
            }
        </div>
    )

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <ModificationParcours data={data} url={props.url} setrefreshData={setrefreshData} nomMention={data.nom_mention+'('+data.abbrmention+')'}  />
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
                        onClick={() => {

                            const accept = () => {
                                axios.delete(props.url + `supprimerParcours/${data.id_parcours}`)
                                    .then(res => {
                                        notificationAction('info', 'Suppression reuissie !', 'Enregistrement bien supprimer !');
                                        setrefreshData(1)
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        notificationAction('error', 'Suppression non reuissie !', 'Enregirement non supprimer !');
                                    })
                            }
                            const reject = () => {
                                return null;
                            }

                            confirmDialog({
                                message: 'Voulez vous supprimer Parcours : ' + data.abbrparcours,
                                header: 'Suppression  ',
                                icon: 'pi pi-exclamation-circle',
                                acceptClassName: 'p-button-danger',
                                acceptLabel: 'Ok',
                                rejectLabel: 'Annuler',
                                accept,
                                reject
                            });
                        }} />
                </div>
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

            <div className="flex flex-column justify-content-center">
                <DataTable header={header} value={listMention} responsiveLayout="scroll" scrollable scrollHeight="500px"   loading={charge} className='bg-white' emptyMessage={'Aucun resultat trouvé'}>
                    <Column body={bodyParcours} header="Parcours"></Column>
                    <Column body={bodyMention} header="Mention"></Column>
                    <Column header="action" body={bodyBoutton} align={'left'}></Column>
                </DataTable>
            </div>
        </>
    )
}
