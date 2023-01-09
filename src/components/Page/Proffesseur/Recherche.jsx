import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function Recherche(props) {

    //Affichage notification Toast primereact (del :7s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }
    //Declaration useSatate
    const [verfChamp, setverfChamp] = useState({ nom_prof: false, cat_prof: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const [infoProff, setinfoProff] = useState({ nom_prof: '', cat_prof: '' });


    const onVideInfo = () => {
        setinfoProff({ nom_prof: '', cat_prof: '' });
    }

    const oninfoProff = (e) => {
        setinfoProff({ ...infoProff, [e.target.name]: e.target.value })
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
                <h4 className='mb-1'>Nouveau Proffesseur </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */



    //Ajout de donnees vers Laravel
    const onSub = async () => {
        setverfChamp({ nom_prof: false, cat_prof: false })
        setcharge({ chajoute: true });
        await axios.post(props.url + 'rechercheProf', infoProff, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-API-KEY":"tamby"
            },
        }) 
            .then(res => {
                //message avy @back
                props.setlistProff(res.data);
                setcharge({ chajoute: false });
                onHide('displayBasic2');
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setcharge({ chajoute: false });
            });
    }
    return (
        <div>
            <Button icon={PrimeIcons.SEARCH} className='p-buttom-sm p-button-secondary' tooltip='Recherche' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); }} />
            <div className='grid w-full '>
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
                        <div className='flex mt-3 mr-4 justify-content-center'>
                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-secondary ' label={charge.chajoute ? 'Recherche...' : 'Recherche'} onClick={() => {
                                onSub()
                            }} />
                        </div>
                    </div>
                </Dialog>
            </div>
            <Toast ref={toastTR} position="top-right" />
        </div>
    )
}
