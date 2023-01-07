import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';

import { InputTextarea } from 'primereact/inputtextarea';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
export default function Insertion(props) {

    //Declaration useSatate
    const [verfChamp, setverfChamp] = useState({  id_mention: false, nom_mention: false, libmention: false, parcours: false, libparcours: false});
    const [charge, setcharge] = useState({ chajoute: false });
    const [infoMention, setinfoMention] = useState({ id_mention: '', nom_mention: '', libmention: '', parcours: '', libparcours: '' });
    const onVideInfo = () => {
        setinfoMention({ id_mention: '', nom_mention: '', libmention: '', parcours: '', libparcours: '' });
    }

    const onInfoMention = (e) => {
        setinfoMention({ ...infoMention, [e.target.name]: e.target.value })
    }

    //Affichage notification Toast primereact (del :7s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
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
                <h4 className='mb-1'>Nouveau Client </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */



    const onSub = async () => { //Ajout de donnees vers Laravel
        setverfChamp({ code_client: false, nom: false })
        setcharge({ chajoute: true });
        await axios.post(props.url + 'insertClient', infoMention)
            .then(res => {
                notificationAction(res.data.etat, 'Enregistrement', res.data.message);//message avy @back
                setcharge({ chajoute: false });
                setTimeout(() => {
                    props.setrefreshData(1);
                    onVideInfo()
                    onHide('displayBasic2');
                }, 900)
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setcharge({ chajoute: false });
            });
    }
    return (
        <div>


            <Button icon={PrimeIcons.PLUS_CIRCLE} tooltip='Nouveau' tooltipOptions={{ position: 'top' }} label='Nouveau Parcours' className=' mr-2 p-button-primary' onClick={() => onClick('displayBasic2')} />
            <div className='grid w-full '>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="col-8 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom Mention</label>
                                    <InputText id="username2" value={infoMention.nom_mention} aria-describedby="username2-help" name='nom_mention' className={verfChamp.nom_mention ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { onInfoMention(e) }} />
                                    {verfChamp.nom_mention ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="col-4 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Abbreviation Mention</label>
                                    <InputText id="username2" value={infoMention.libmention} aria-describedby="username2-help" name='libmention' className={verfChamp.libmention ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { onInfoMention(e) }} />
                                    {verfChamp.libmention ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                            </div>
                            <div className='grid px-4'>
                                <div className="col-8 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom Parcours</label>
                                    <InputText id="username2" value={infoMention.parcours} aria-describedby="username2-help" name='parcours' className={verfChamp.parcours ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { onInfoMention(e) }} />
                                    {verfChamp.parcours ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="col-4 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Abbreviation Parcours</label>
                                    <InputText id="username2" value={infoMention.libparcours} aria-describedby="username2-help" name='libparcours' className={verfChamp.libparcours ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { onInfoMention(e) }} />
                                    {verfChamp.libparcours ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                            </div>
                          

                        </form>
                        <div className='flex mt-3 mr-4 justify-content-end'>
                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={() => {
                                infoMention.code_client != "" ?
                                    infoMention.nom != "" ?
                                        onSub()
                                        :
                                        setverfChamp({ code_client: false, nom: true })
                                    :
                                    setverfChamp({ code_client: true, nom: false })
                            }} />
                        </div>
                    </div>
                </Dialog>
            </div>
            <Toast ref={toastTR} position="top-right" />
        </div>
    )
}
