import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import { Fieldset } from 'primereact/fieldset';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import useAuth from '../../Login/useAuth';
import CryptoJS from 'crypto-js';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Insertion from './Insertion';
import moment from 'moment/moment';
export default function AjoutEngagement(props) {

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

    const [listEngag, setlistEngag] = useState([{
        nom_enga: "",
        nbre_etu: "",
        valeur: "",
        date_engamnt: ""
    }])
    const [chargeDnn, setchargeDnn] = useState(false);


    const [chek, setchek] = useState(true);
    const [chek1, setchek1] = useState(true);
    const [chek2, setchek2] = useState(true);
    const [verfChamp, setverfChamp] = useState({ vheure: false });
    const [charge, setcharge] = useState(false);


    //Affichage notification Toast primereact (del :3s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }


    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(72 96 112)', border: '1px solid rgb(72 96 112)'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };


    /* Modal */
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic2': setDisplayBasic2,
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Fermer" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }
    const renderHeader = (name) => {
        return (
            <div>
                <h4 className='mb-1'>Liste engagements </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    const loadData = async () => {
        setcharge(true);
        try {
            await axios.get(props.url + `getEngagement/${props.prof_id}/${decrypt().data.grad_id}/${decrypt().data.mention}`, {
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
                        setlistEngag(result.data);
                        setcharge(false);
                        console.log(result)

                    }
                );
        } catch (error) {
            console.log(error)
            if (error.message == "Network Error") {
                props.urlip()
            }
        }
    }


    const header = (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            <div className='my-0 ml-2 py-2 flex'>
                <Insertion url={props.url} prof_id={props.prof_id} loadData={loadData} />
            </div>
            <>
                <label >Liste Engagements</label>
                <h2 className='m-1'> <u>{props.nom}</u> </h2>
            </>
        </div>
    )
    const dateEng = (data) => (
        <div className='flex flex-row justify-content-between align-items-center m-0 '>
            {
                data.date_engamnt1 == null || data.date_engamnt1 == '0' ? '' :
                    data.date_engamnt2 == null || data.date_engamnt2 == '0' ?
                       moment(data.date_engamnt1).format('DD/MM/YYYY') :
                        moment(data.date_engamnt1).format('DD/MM/YYYY') + ' jusqu\'au ' + moment(data.date_engamnt2).format('DD/MM/YYYY')
            }
        </div>
    )

    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
                        onClick={() => {

                            const accept = () => {
                                axios.delete(props.url + `deleteEngagement`, {
                                   
                                    headers: {
                                        'Content-Type': 'text/html',
                                        'X-API-KEY': 'tamby',
                                        'Authorization': decrypt().token
                                    },
                                    data:{
                                        id_enga: props.prof_id + '' + decrypt().data.grad_id + '' + data.nom_enga
                                    }
                                })
                                    .then(res => {
                                        notificationAction('info', 'Suppression reuissie !', 'Enregistrement bien supprimer !');
                                        loadData();
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
                                message: 'Voulez vous supprimer l\'enregistrement : ' + data.nom_enga,
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
    return (
        <div>
            <Toast ref={toastTR} position="top-right" />

            <Button icon={PrimeIcons.PLUS} className='p-buttom-sm p-1 ' label='' style={stylebtnRec} tooltip='Ajout engagement' tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    onClick('displayBasic2');
                    setTimeout(() => {
                        loadData();
                    }, 200);
                }}
            />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-7 md:col-9 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <BlockUI blocked={chargeDnn} template={<ProgressSpinner />}>
                        <div className="flex flex-column justify-content-center">
                            <DataTable header={header} value={listEngag} loading={charge} responsiveLayout="scroll" scrollable scrollHeight="500px" rows={10} rowsPerPageOptions={[10, 20, 50]} paginator className='bg-white' emptyMessage={'Aucun resultat trouvé'}>
                                <Column field='nom_enga' header="Nom"></Column>
                                <Column field={'nbre_etu'} header="Nombre d'étudiant ou groupes"></Column>
                                <Column field={'valeur'} header="ED"></Column>
                                <Column body={dateEng} header="Date"></Column>
                                <Column field='annee_univ' header="Anne universitaire"></Column>
                                <Column header="" body={bodyBoutton} align={'left'}></Column>

                            </DataTable>
                        </div>
                    </BlockUI>
                </Dialog>
            </div>
        </div>
    )
}
