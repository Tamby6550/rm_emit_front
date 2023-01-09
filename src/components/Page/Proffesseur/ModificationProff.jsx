import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function ModificationProff(props) {

    //Affichage notification Toast primereact (del :7s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }
    //Declaration useSatate
    const [verfChamp, setverfChamp] = useState({ nom_prof: false, cat_prof: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const [infoProff, setinfoProff] = useState({ nom_prof: '', cat_prof: '' });
    const [identique, setidentique] = useState(false)


    const onVideInfo = () => {
        setinfoProff({ nom_prof: '', cat_prof: '' });
    }

    const oninfoProff = (e) => {
        setinfoProff({ ...infoProff, [e.target.name]: e.target.value })
    }
    const chargerData = (data) => {
        setinfoProff({ id_prof: data.id_prof, nom_prof: data.nom_prof, cat_prof: data.cat_prof })
    }

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
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
                <h4 className='mb-1'>Nouveau Proffesseur </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */



    //Ajout de donnees vers Laravel
    const onSub = async () => {
        if (infoProff.nom_prof == props.data.nom_prof && infoProff.cat_prof == props.data.cat_prof) {
            setverfChamp({ nom_prof: false, cat_prof: false })
            setidentique(true)
        } else {
            setidentique(false)
            setverfChamp({ nom_prof: false, cat_prof: false })
            setcharge({ chajoute: true });
            await axios.put(props.url + 'updateProff', infoProff, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "X-API-KEY":"tamby"
                },
            }) 
                .then(res => {
                    notificationAction(res.data.etat, 'Modification', res.data.message);//message avy @back
                    setcharge({ chajoute: false });
                    setTimeout(() => {
                        props.setrefreshData(1);
                        onVideInfo()
                        onHide('displayBasic2');
                    }, 900)
                })
                .catch(err => {
                    console.log(err);
                    //message avy @back
                    notificationAction('error', 'Erreur', err.data.message);
                    setcharge({ chajoute: false });
                });
        }
    }
    return (
        <>
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-2 mr-2 ' style={stylebtnRec} tooltip='Modifier' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargerData(props.data) }} />            <div className='grid w-full '>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-4 md:col-5 col-8 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="col-8 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom et Prenom</label>
                                    <InputText id="username2" value={infoProff.nom_prof} aria-describedby="username2-help" name='nom_prof' className={verfChamp.nom_prof ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { oninfoProff(e) }} />
                                    {verfChamp.nom_prof ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="col-4 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Catégorie </label>
                                    <InputText id="username2" value={infoProff.cat_prof} aria-describedby="username2-help" name='cat_prof' className={verfChamp.cat_prof ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { oninfoProff(e) }} />
                                    {verfChamp.cat_prof ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                            </div>
                        </form>
                        {identique ? <center><small id="username2-help" className="p-info block justify-content-center" style={{ fontWeight: 'bold' }}>Aucun changement ! </small></center> : null}

                        <div className='flex mt-3 mr-4 justify-content-center'>
                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={() => {
                                infoProff.nom_prof != "" ?
                                    infoProff.cat_prof != "" ?
                                        onSub()
                                        :
                                        setverfChamp({ nom_prof: false, cat_prof: true })
                                    :
                                    setverfChamp({ nom_prof: true, cat_prof: false })

                            }} />
                        </div>
                    </div>
                </Dialog>
            </div>
            <Toast ref={toastTR} position="top-right" />
        </>
    )
}
