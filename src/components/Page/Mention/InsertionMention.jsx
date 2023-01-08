import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputTextarea } from 'primereact/inputtextarea';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function InsertionMention(props) {

    //Declaration useSatate
    const [charge, setCharge] = useState(false);
    const [refreshData, setrefreshData] = useState(0);

    const [chajout, setchajout] = useState(false)
    const [verfChamp, setverfChamp] = useState({ id_mention: false, nom_mention: false, libmention: false, parcours: false, libparcours: false });
    const [listMention, setlistMention] = useState({ nom_mention: '', libmention: '' });
    const [infoMention, setinfoMention] = useState({ nom_mention: '', libmention: '', action: 'ajout' });
    const onVideInfo = () => {
        setinfoMention({ nom_mention: '', libmention: '', action: 'ajout' });
    }


    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#555A6F', border: '1px solid #555A6F'
    };
    const stylebtnDetele = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(195 46 46 / 85%)', border: '1px solid #d32f2fa1'
    };

    /**Style css */

    const onInfoMention = (e) => {
        setinfoMention({ ...infoMention, [e.target.name]: e.target.value })
    }

    //Affichage notification Toast primereact (del :7s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 30000 });
    }



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
        setverfChamp({ code_client: false, nom: false });
        onVideInfo();
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
                <h4 className='mb-1'>Nouveau Mention </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    //DataTable
    const header = (
        <div className='flex flex-row justify-content-center align-items-center m-0 '>
            <div className='my-0 flex  py-2 '>
                <center><h3 className='m-2'>Liste Mentions</h3></center>
            </div>
        </div>
    )


    //Get List mention
    const loadData = async () => {
        setCharge(true);
        await axios.get(props.url + `getMention`)
            .then(
                (result) => {
                    onVideInfo();
                    setrefreshData(0);
                    setlistMention(result.data);
                    setCharge(false);
                }
            );
    }

    const chargeData = async () => {
        setCharge(true);
        setlistMention([{ stat: 'Chargement de données...' }])
        setTimeout(() => {
            loadData();
        }, 500)
    }

    //Ajout de donnees vers Laravel
    const onSub = async () => {
        setverfChamp({ libmention: false, nom_mention: false })
        setchajout(true);
        await axios.post(props.url + 'ajoutMention', infoMention)
            .then(res => {
                //message avy @back
                notificationAction(res.data.etat, 'Enregistrement', res.data.message);
                setchajout(false);
                setTimeout(() => {
                    chargeData()
                    onVideInfo()
                }, 900)
            })
            .catch(err => {
                console.log(err);
                //message avy @back
                notificationAction('error', 'Erreur', err.data.message);
                setchajout(false);
            });
    }

    //Modifier de donnees vers Laravel
    const onModif = async () => {
        setchajout(true);
        await axios.put(props.url + 'updateMention', infoMention)
            .then(res => {
                //message avy @back
                notificationAction(res.data.etat, 'Modification', res.data.message);
                setchajout(false);
                setTimeout(() => {
                    chargeData()
                    onVideInfo()
                }, 900)
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setchajout(false);
            });
    }


    const bodyBoutton = (data) => {
        return (
            <div className='flex flex-row justify-content-between align-items-center m-0 '>
                <div className='my-0  py-2'>
                    <Button icon={PrimeIcons.PENCIL} className='p-button-sm p-1 mr-2' style={stylebtnRec} tooltip='Modifier' onClick={() => { setinfoMention({ id_mention:data.id_mention,libmention: data.libmention, nom_mention: data.nom_mention, action: 'modif' }) }} />
                    <Button icon={PrimeIcons.TIMES} className='p-buttom-sm p-1 ' style={stylebtnDetele} tooltip='Supprimer' tooltipOptions={{ position: 'top' }}
                        onClick={() => {

                            const accept = () => {
                                axios.delete(props.url + `supprimerMention/${data.id_mention}`)
                                    .then(res => {
                                        notificationAction('info', 'Suppression reuissie !', 'Enregistrement bien supprimer !');
                                        chargeData();
                                    })
                                    .catch(err => {
                                        notificationAction('error', 'Suppression non reuissie !', 'Enregirement non supprimer !');
                                        console.log(err);
                                    })
                            }
                            const reject = () => {
                                return null;
                            }

                            confirmDialog({
                                message: 'Voulez vous supprimer Mention : ' + data.libmention,
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


            <Button icon={PrimeIcons.PLUS_CIRCLE} tooltip='Nouveau' tooltipOptions={{ position: 'top' }} label='Nouveau Mention' className=' mr-2 p-button-secondary' onClick={() => { onClick('displayBasic2'); chargeData() }} />
            <div className='grid w-full '>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-6 md:col-8 col-11 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <Toast ref={toastTR} position="top-right" />
                    <div className="p-1 style-modal-tamby" >
                        <div className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="col-6 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom </label>
                                    <InputText id="username2" value={infoMention.nom_mention} aria-describedby="username2-help" name='nom_mention' className={verfChamp.nom_mention ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { onInfoMention(e) }} />
                                    {verfChamp.nom_mention ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="col-3 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Abbreviation </label>
                                    <InputText id="username2" value={infoMention.libmention} aria-describedby="username2-help" name='libmention' className={verfChamp.libmention ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { onInfoMention(e) }} />
                                    {verfChamp.libmention ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="col-3 field my-1 flex flex-column">
                                    <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary mt-5' label={infoMention.action == 'ajout' ? chajout ? 'Enregistrement...' : 'Enregistrer' : chajout ? 'Modification...' : 'Modifier'} onClick={() => {
                                        infoMention.nom_mention != "" ?
                                            infoMention.action == 'ajout' ?
                                                onSub()
                                                :
                                                onModif()
                                            :
                                            setverfChamp({ nom_mention: true, libmention: false })
                                    }} />
                                </div>
                            </div>
                        </div>
                        <DataTable header={header} value={listMention} responsiveLayout="scroll" scrollable scrollHeight="500px" loading={charge} className='bg-white' emptyMessage={'Aucun resultat trouvé'}>
                            <Column field='nom_mention' header="Mention"></Column>
                            <Column field='libmention' header="Abbreviation"></Column>
                            <Column header="action" body={bodyBoutton} align={'left'}></Column>
                        </DataTable>

                    </div>
                </Dialog>
            </div>
        </div>
    )
}
